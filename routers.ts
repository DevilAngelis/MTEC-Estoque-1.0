import { z } from "zod";
import { COOKIE_NAME } from "../shared/const.js";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import * as db from "./db";
import { generateReportData, generateCSV } from "./services/pdf";

export const appRouter = router({
  // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // ===== CATEGORIES =====
  categories: router({
    list: publicProcedure.query(() => db.getAllCategories()),

    create: publicProcedure
      .input(z.object({
        name: z.string().min(1, "Nome obrigatório").max(255),
        description: z.string().optional(),
      }))
      .mutation(({ input }) => db.createCategory(input)),

    delete: publicProcedure
      .input(z.object({ id: z.number() }))
      .mutation(({ input }) => db.deleteCategory(input.id)),
  }),

  // ===== MATERIALS =====
  materials: router({
    list: publicProcedure.query(() => db.getAllMaterials()),

    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(({ input }) => db.getMaterialById(input.id)),

    create: publicProcedure
      .input(z.object({
        name: z.string().min(1, "Nome obrigatório").max(255),
        description: z.string().optional(),
        categoryId: z.number(),
        quantity: z.number().default(0),
        unit: z.string().min(1, "Unidade obrigatória"),
        unitPrice: z.string().default("0.00"),
        minimumStock: z.number().default(0),
      }))
      .mutation(({ input }) => db.createMaterial(input)),

    update: publicProcedure
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
      .mutation(({ input }) => {
        const { id, ...data } = input;
        return db.updateMaterial(id, data);
      }),

    delete: publicProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        const movements = await db.getMovementsByMaterial(input.id);
        if (movements.length > 0) {
          throw new Error("Não é possível deletar um material com movimentações registradas");
        }
        return db.deleteMaterial(input.id);
      }),
  }),

  // ===== REPORTS =====
  reports: router({
    generatePDF: publicProcedure
      .input(z.object({
        startDate: z.date().optional(),
        endDate: z.date().optional(),
        materialId: z.number().optional(),
        type: z.enum(["entrada", "saida", "consolidado"]).optional(),
      }))
      .query(async ({ input }) => {
        const movements = await db.getAllMovements();
        const materials = await db.getAllMaterials();
        return generateReportData(movements, materials, input);
      }),

    exportCSV: publicProcedure
      .input(z.object({
        startDate: z.date().optional(),
        endDate: z.date().optional(),
        materialId: z.number().optional(),
        type: z.enum(["entrada", "saida", "consolidado"]).optional(),
      }))
      .query(async ({ input }) => {
        const movements = await db.getAllMovements();
        const materials = await db.getAllMaterials();
        const data = generateReportData(movements, materials, input);
        return { csv: generateCSV(data) };
      }),

    exportData: publicProcedure
      .query(async () => {
        const categories = await db.getAllCategories();
        const materials = await db.getAllMaterials();
        const movements = await db.getAllMovements();
        return {
          categories,
          materials,
          movements,
          exportedAt: new Date(),
        };
      }),
  }),

  // ===== MOVEMENTS =====
  movements: router({
    list: publicProcedure.query(() => db.getAllMovements()),

    getByDateRange: publicProcedure
      .input(z.object({
        startDate: z.date(),
        endDate: z.date(),
      }))
      .query(({ input }) => db.getMovementsByDateRange(input.startDate, input.endDate)),

    getByMaterial: publicProcedure
      .input(z.object({ materialId: z.number() }))
      .query(({ input }) => db.getMovementsByMaterial(input.materialId)),

    create: publicProcedure
      .input(z.object({
        materialId: z.number(),
        type: z.enum(["entrada", "saída"]),
        quantity: z.number().min(1, "Quantidade deve ser maior que 0"),
        reason: z.string().optional(),
        notes: z.string().optional(),
        movementDate: z.date().optional(),
      }))
      .mutation(async ({ input }) => {
        // Atualizar quantidade do material
        const material = await db.getMaterialById(input.materialId);
        if (!material) throw new Error("Material não encontrado");

        const newQuantity = input.type === "entrada"
          ? material.quantity + input.quantity
          : material.quantity - input.quantity;

        if (newQuantity < 0) {
          throw new Error("Quantidade insuficiente no estoque");
        }

        await db.updateMaterial(input.materialId, { quantity: newQuantity });
        return db.createMovement(input);
      }),

    delete: publicProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        const movement = await db.getMovementById(input.id);
        
        if (!movement) {
          throw new Error("Movimentação não encontrada");
        }

        const material = await db.getMaterialById(movement.materialId);
        if (!material) throw new Error("Material não encontrado");

        const reversedQuantity = movement.type === "entrada"
          ? material.quantity - movement.quantity
          : material.quantity + movement.quantity;

        await db.updateMaterial(movement.materialId, { quantity: reversedQuantity });
        return db.deleteMovement(input.id);
      }),
  }),
});

export type AppRouter = typeof appRouter;
