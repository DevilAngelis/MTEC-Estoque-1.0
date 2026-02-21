import { z } from "zod";
import { COOKIE_NAME } from "../shared/const.js";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { createLocalSession, hashPassword, verifyPassword } from "./_core/localAuth";
import * as db from "./db";
import { generateReportData, generateCSV } from "./services/pdf";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
    register: publicProcedure
      .input(z.object({
        email: z.string().email("Email inválido"),
        password: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
        name: z.string().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        const existing = await db.getUserByEmail(input.email);
        if (existing) {
          throw new Error("Email já cadastrado");
        }
        const passwordHash = await hashPassword(input.password);
        const userId = await db.createUser({
          email: input.email,
          passwordHash,
          name: input.name,
        });
        await createLocalSession(userId, input.email, ctx.res, ctx.req);
        const user = await db.getUserById(userId);
        return user!;
      }),
    login: publicProcedure
      .input(z.object({
        email: z.string().email("Email inválido"),
        password: z.string().min(1, "Senha obrigatória"),
      }))
      .mutation(async ({ input, ctx }) => {
        const user = await db.getUserByEmail(input.email);
        if (!user || !user.passwordHash) {
          throw new Error("Email ou senha incorretos");
        }
        const valid = await verifyPassword(input.password, user.passwordHash);
        if (!valid) {
          throw new Error("Email ou senha incorretos");
        }
        await createLocalSession(user.id, user.email!, ctx.res, ctx.req);
        return user;
      }),
  }),

  // ===== CATEGORIES (por usuário) =====
  categories: router({
    list: protectedProcedure.query(({ ctx }) => db.getAllCategories(ctx.user!.id)),
    create: protectedProcedure
      .input(z.object({
        name: z.string().min(1, "Nome obrigatório").max(255),
        description: z.string().optional(),
      }))
      .mutation(({ input, ctx }) =>
        db.createCategory({ ...input, userId: ctx.user!.id })
      ),
    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(({ input, ctx }) => db.deleteCategory(input.id, ctx.user!.id)),
  }),

  // ===== MATERIALS (por usuário) =====
  materials: router({
    list: protectedProcedure.query(({ ctx }) => db.getAllMaterials(ctx.user!.id)),
    getById: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(({ input, ctx }) => db.getMaterialById(input.id, ctx.user!.id)),
    create: protectedProcedure
      .input(z.object({
        name: z.string().min(1, "Nome obrigatório").max(255),
        description: z.string().optional(),
        categoryId: z.number().optional(),
        code: z.string().optional(),
        quantity: z.number().default(0),
        unit: z.string().min(1, "Unidade obrigatória"),
        unitPrice: z.string().default("0.00"),
        minimumStock: z.number().default(0),
      }))
      .mutation(({ input, ctx }) => {
        const userId = ctx.user!.id;
        const { categoryId, ...rest } = input;
        return db.createMaterial({
          ...rest,
          userId,
          categoryId: categoryId ?? undefined,
        } as any);
      }),
    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        name: z.string().optional(),
        description: z.string().optional(),
        categoryId: z.number().optional(),
        quantity: z.number().optional(),
        unit: z.string().optional(),
        unitPrice: z.string().optional(),
        minimumStock: z.number().optional(),
      }))
      .mutation(({ input, ctx }) => {
        const { id, ...data } = input;
        return db.updateMaterial(id, data, ctx.user!.id);
      }),
    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input, ctx }) => {
        const movements = await db.getMovementsByMaterial(input.id, ctx.user!.id);
        if (movements.length > 0) {
          throw new Error("Não é possível deletar um material com movimentações registradas");
        }
        return db.deleteMaterial(input.id, ctx.user!.id);
      }),
  }),

  // ===== REPORTS (por usuário) =====
  reports: router({
    generatePDF: protectedProcedure
      .input(z.object({
        startDate: z.date().optional(),
        endDate: z.date().optional(),
        materialId: z.number().optional(),
        type: z.enum(["entrada", "saida", "consolidado"]).optional(),
      }))
      .query(async ({ input, ctx }) => {
        const movements = await db.getAllMovements(ctx.user!.id);
        const materials = await db.getAllMaterials(ctx.user!.id);
        return generateReportData(movements, materials, input);
      }),
    exportCSV: protectedProcedure
      .input(z.object({
        startDate: z.date().optional(),
        endDate: z.date().optional(),
        materialId: z.number().optional(),
        type: z.enum(["entrada", "saida", "consolidado"]).optional(),
      }))
      .query(async ({ input, ctx }) => {
        const movements = await db.getAllMovements(ctx.user!.id);
        const materials = await db.getAllMaterials(ctx.user!.id);
        const data = generateReportData(movements, materials, input);
        return { csv: generateCSV(data) };
      }),
    exportData: protectedProcedure.query(async ({ ctx }) => {
      const categories = await db.getAllCategories(ctx.user!.id);
      const materials = await db.getAllMaterials(ctx.user!.id);
      const movements = await db.getAllMovements(ctx.user!.id);
      return {
        categories,
        materials,
        movements,
        exportedAt: new Date(),
      };
    }),
  }),

  // ===== MOVEMENTS (por usuário) =====
  movements: router({
    list: protectedProcedure.query(({ ctx }) => db.getAllMovements(ctx.user!.id)),
    getByDateRange: protectedProcedure
      .input(z.object({ startDate: z.date(), endDate: z.date() }))
      .query(({ input, ctx }) =>
        db.getMovementsByDateRange(input.startDate, input.endDate, ctx.user!.id)
      ),
    getByMaterial: protectedProcedure
      .input(z.object({ materialId: z.number() }))
      .query(({ input, ctx }) =>
        db.getMovementsByMaterial(input.materialId, ctx.user!.id)
      ),
    create: protectedProcedure
      .input(z.object({
        materialId: z.number(),
        type: z.enum(["entrada", "saída"]),
        quantity: z.number().min(1, "Quantidade deve ser maior que 0"),
        reason: z.string().optional(),
        notes: z.string().optional(),
        movementDate: z.date().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        const userId = ctx.user!.id;
        const material = await db.getMaterialById(input.materialId, userId);
        if (!material) throw new Error("Material não encontrado");

        const newQuantity =
          input.type === "entrada"
            ? material.quantity + input.quantity
            : material.quantity - input.quantity;

        if (newQuantity < 0) {
          throw new Error("Quantidade insuficiente no estoque");
        }

        await db.updateMaterial(input.materialId, { quantity: newQuantity }, userId);
        return db.createMovement({ ...input, userId });
      }),
    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input, ctx }) => {
        const userId = ctx.user!.id;
        const movement = await db.getMovementById(input.id, userId);
        if (!movement) throw new Error("Movimentação não encontrada");

        const material = await db.getMaterialById(movement.materialId, userId);
        if (!material) throw new Error("Material não encontrado");

        const reversedQuantity =
          movement.type === "entrada"
            ? material.quantity - movement.quantity
            : material.quantity + movement.quantity;

        await db.updateMaterial(movement.materialId, { quantity: reversedQuantity }, userId);
        return db.deleteMovement(input.id, userId);
      }),
  }),
});

export type AppRouter = typeof appRouter;
