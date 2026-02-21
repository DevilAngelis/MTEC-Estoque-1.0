import { eq, desc, and, gte, lte } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  InsertUser,
  users,
  categories,
  materials,
  movements,
  type Category,
  type InsertCategory,
  type Material,
  type InsertMaterial,
  type Movement,
  type InsertMovement,
} from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId ?? null,
      name: user.name ?? null,
      email: user.email ?? null,
      passwordHash: user.passwordHash ?? null,
      loginMethod: user.loginMethod ?? null,
      lastSignedIn: user.lastSignedIn ?? new Date(),
    };
    const updateSet: Record<string, unknown> = { ...values };

    if (user.openId && user.openId === ENV.ownerOpenId) {
      values.role = "admin";
      updateSet.role = "admin";
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getUserById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getUserByEmail(email: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.email, email)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createUser(data: {
  email: string;
  passwordHash: string;
  name?: string;
}): Promise<number> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(users).values({
    email: data.email,
    passwordHash: data.passwordHash,
    name: data.name ?? null,
    openId: null,
    loginMethod: "email",
  });
  return (result as any).insertId;
}

// ===== CATEGORIES (por userId) =====
export async function getAllCategories(userId: number): Promise<Category[]> {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(categories)
    .where(eq(categories.userId, userId))
    .orderBy(categories.name);
}

export async function createCategory(data: InsertCategory): Promise<number> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(categories).values(data);
  return (result as any).insertId;
}

export async function deleteCategory(id: number, userId: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(categories).where(and(eq(categories.id, id), eq(categories.userId, userId)));
}

// ===== MATERIALS (por userId) =====
export async function getAllMaterials(userId: number): Promise<Material[]> {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(materials)
    .where(eq(materials.userId, userId))
    .orderBy(materials.name);
}

export async function getMaterialById(id: number, userId?: number): Promise<Material | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  const conditions = userId
    ? and(eq(materials.id, id), eq(materials.userId, userId))
    : eq(materials.id, id);
  const result = await db.select().from(materials).where(conditions).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createMaterial(data: InsertMaterial): Promise<number> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(materials).values(data);
  return (result as any).insertId;
}

export async function updateMaterial(id: number, data: Partial<InsertMaterial>, userId?: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const conditions = userId
    ? and(eq(materials.id, id), eq(materials.userId, userId))
    : eq(materials.id, id);
  await db.update(materials).set(data).where(conditions);
}

export async function deleteMaterial(id: number, userId?: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const conditions = userId
    ? and(eq(materials.id, id), eq(materials.userId, userId))
    : eq(materials.id, id);
  await db.delete(materials).where(conditions);
}

// ===== MOVEMENTS (por userId) =====
export async function getAllMovements(userId: number): Promise<Movement[]> {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(movements)
    .where(eq(movements.userId, userId))
    .orderBy(desc(movements.movementDate));
}

export async function getMovementsByDateRange(
  startDate: Date,
  endDate: Date,
  userId: number
): Promise<Movement[]> {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(movements)
    .where(
      and(
        eq(movements.userId, userId),
        gte(movements.movementDate, startDate),
        lte(movements.movementDate, endDate)
      )
    )
    .orderBy(desc(movements.movementDate));
}

export async function getMovementsByMaterial(materialId: number, userId?: number): Promise<Movement[]> {
  const db = await getDb();
  if (!db) return [];
  const conditions = userId
    ? and(eq(movements.materialId, materialId), eq(movements.userId, userId))
    : eq(movements.materialId, materialId);
  return db
    .select()
    .from(movements)
    .where(conditions)
    .orderBy(desc(movements.movementDate));
}

export async function createMovement(data: InsertMovement): Promise<number> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(movements).values(data);
  return (result as any).insertId;
}

export async function getMovementById(id: number, userId?: number): Promise<Movement | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  const conditions = userId
    ? and(eq(movements.id, id), eq(movements.userId, userId))
    : eq(movements.id, id);
  const result = await db.select().from(movements).where(conditions).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function deleteMovement(id: number, userId?: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const conditions = userId
    ? and(eq(movements.id, id), eq(movements.userId, userId))
    : eq(movements.id, id);
  await db.delete(movements).where(conditions);
}
