import Database from "better-sqlite3"
import { drizzle } from "drizzle-orm/better-sqlite3"
import { posts } from "./schema"

const sqlite = new Database(process.env.DB_FILE ?? ":memory:")

sqlite.exec(`
  CREATE TABLE IF NOT EXISTS posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    content TEXT NOT NULL
  );
`)

export const db = drizzle(sqlite, { schema: { posts } })
export * from "./schema"
