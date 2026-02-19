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

// Lazily create the drizzle instance so local tooling can run without a DB.
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
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = "admin";
      updateSet.role = "admin";
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
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
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// ===== CATEGORIES =====
export async function getAllCategories(): Promise<Category[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(categories).orderBy(categories.name);
}

export async function createCategory(data: InsertCategory): Promise<number> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(categories).values(data);
  return (result as any).insertId;
}

export async function deleteCategory(id: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(categories).where(eq(categories.id, id));
}

// ===== MATERIALS =====
export async function getAllMaterials(): Promise<Material[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(materials).orderBy(materials.name);
}

export async function getMaterialById(id: number): Promise<Material | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(materials).where(eq(materials.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createMaterial(data: InsertMaterial): Promise<number> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(materials).values(data);
  return (result as any).insertId;
}

export async function updateMaterial(id: number, data: Partial<InsertMaterial>): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(materials).set(data).where(eq(materials.id, id));
}

export async function deleteMaterial(id: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(materials).where(eq(materials.id, id));
}

// ===== MOVEMENTS =====
export async function getAllMovements(): Promise<Movement[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(movements).orderBy(desc(movements.movementDate));
}

export async function getMovementsByDateRange(startDate: Date, endDate: Date): Promise<Movement[]> {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(movements)
    .where(and(gte(movements.movementDate, startDate), lte(movements.movementDate, endDate)))
    .orderBy(desc(movements.movementDate));
}

export async function getMovementsByMaterial(materialId: number): Promise<Movement[]> {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(movements)
    .where(eq(movements.materialId, materialId))
    .orderBy(desc(movements.movementDate));
}

export async function createMovement(data: InsertMovement): Promise<number> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(movements).values(data);
  return (result as any).insertId;
}

export async function getMovementById(id: number): Promise<Movement | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(movements).where(eq(movements.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function deleteMovement(id: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(movements).where(eq(movements.id, id));
}
