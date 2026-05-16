import { Hono } from "hono"
import { cors } from "hono/cors"
import { eq } from "drizzle-orm"
import { db, posts } from "@workspace/db"
import { createPostSchema, updatePostSchema } from "./schemas"

export const app = new Hono()

app.use("*", cors())

app.get("/posts", async (c) => {
  const rows = await db.select().from(posts).all()
  return c.json(rows)
})

app.post("/posts", async (c) => {
  const body = await c.req.json()
  const parsed = createPostSchema.safeParse(body)
  if (!parsed.success) return c.json({ error: parsed.error.flatten() }, 400)
  const [row] = await db.insert(posts).values(parsed.data).returning()
  return c.json(row, 201)
})

app.get("/posts/:id", async (c) => {
  const id = Number(c.req.param("id"))
  const row = await db.select().from(posts).where(eq(posts.id, id)).get()
  if (!row) return c.json({ error: "not found" }, 404)
  return c.json(row)
})

app.put("/posts/:id", async (c) => {
  const id = Number(c.req.param("id"))
  const body = await c.req.json()
  const parsed = updatePostSchema.safeParse(body)
  if (!parsed.success) return c.json({ error: parsed.error.flatten() }, 400)
  const [row] = await db
    .update(posts)
    .set(parsed.data)
    .where(eq(posts.id, id))
    .returning()
  if (!row) return c.json({ error: "not found" }, 404)
  return c.json(row)
})

app.delete("/posts/:id", async (c) => {
  const id = Number(c.req.param("id"))
  const [row] = await db.delete(posts).where(eq(posts.id, id)).returning()
  if (!row) return c.json({ error: "not found" }, 404)
  return c.json({ ok: true })
})

export * from "./schemas"
