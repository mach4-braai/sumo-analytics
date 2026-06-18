import { drizzle } from "drizzle-orm/postgres-js";
import postgres, { type Sql } from "postgres";
import * as schema from "./schema";

let db: ReturnType<typeof createClient> | null = null;
let sql: Sql | null = null;

function createClient() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL environment variable is required");
  }
  sql = postgres(connectionString, { max: 10, idle_timeout: 20 });
  return drizzle(sql, { schema });
}

export function getDb() {
  if (!db) {
    db = createClient();
  }
  return db;
}

export async function closeDb() {
  if (sql) {
    await sql.end();
    sql = null;
    db = null;
  }
}

export type Db = ReturnType<typeof getDb>;
