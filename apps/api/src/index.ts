import { serve } from "@hono/node-server"
import { app } from "@workspace/server"

const port = Number(process.env.PORT ?? 3002)

serve({ fetch: app.fetch, port }, (info) => {
  console.log(`api listening on http://localhost:${info.port}`)
})
