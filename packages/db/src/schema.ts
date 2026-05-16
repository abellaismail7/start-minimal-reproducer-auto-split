import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core"

export const posts = sqliteTable("posts", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  content: text("content").notNull(),
})

export type Post = typeof posts.$inferSelect
export type NewPost = typeof posts.$inferInsert
