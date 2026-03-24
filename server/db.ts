import { eq, and } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, promises, InsertPromise, Promise as PromiseType, settings, InsertSettings, Settings } from "../drizzle/schema";
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

// ============ Promise Queries ============

export async function getTodayPromise(userId: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db
    .select()
    .from(promises)
    .where(eq(promises.userId, userId))
    .orderBy((p) => p.createdAt)
    .limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function createPromise(data: InsertPromise) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(promises).values(data);
  return (result as any).insertId;
}

export async function updatePromiseStatus(id: number, status: string, reflectionText?: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const updateData: any = { status };
  if (reflectionText !== undefined) {
    updateData.reflectionText = reflectionText;
  }

  await db.update(promises).set(updateData).where(eq(promises.id, id));
}

export async function getArchivedPromises(userId: number) {
  const db = await getDb();
  if (!db) return [];

  return db
    .select()
    .from(promises)
    .where(and(eq(promises.userId, userId), eq(promises.status, "archived")))
    .orderBy((p) => p.createdAt);
}

export async function deletePromise(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.delete(promises).where(eq(promises.id, id));
}

export async function deleteUncompletedPromisesByUserId(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db
    .delete(promises)
    .where(
      and(
        eq(promises.userId, userId),
      )
    );
}

// ============ Settings Queries ============

export async function getUserSettings(userId: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db
    .select()
    .from(settings)
    .where(eq(settings.userId, userId))
    .limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function createOrUpdateSettings(userId: number, data: Partial<InsertSettings>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const existing = await getUserSettings(userId);

  if (existing) {
    await db.update(settings).set(data).where(eq(settings.userId, userId));
  } else {
    await db.insert(settings).values({
      userId,
      ...data,
    });
  }
}
