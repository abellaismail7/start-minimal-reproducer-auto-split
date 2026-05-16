import { useState } from "react"
import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { updatePostSchema } from "@workspace/server/schemas"
import { Button } from "@workspace/ui/components/button"
import { api } from "@/lib/api"

export const Route = createFileRoute("/posts/$id")({
  component: EditPostPage,
  loader: ({ params }) => api.get(Number(params.id)),
})

function EditPostPage() {
  const post = Route.useLoaderData()
  const navigate = useNavigate()
  const [title, setTitle] = useState(post.title)
  const [content, setContent] = useState(post.content)
  const [error, setError] = useState<string | null>(null)

  async function onSave(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    const parsed = updatePostSchema.safeParse({ title, content })
    if (!parsed.success) {
      setError(parsed.error.issues.map((i) => i.message).join(", "))
      return
    }
    await api.update(post.id, parsed.data)
    navigate({ to: "/posts" })
  }

  return (
    <main className="container mx-auto max-w-2xl p-6">
      <h1 className="mb-4 text-2xl font-medium">Edit Post #{post.id}</h1>
      <form onSubmit={onSave} className="flex flex-col gap-2">
        <input
          className="rounded border px-2 py-1"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          className="rounded border px-2 py-1"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        {error && <p className="text-sm text-red-500">{error}</p>}
        <div className="flex gap-2">
          <Button type="submit">Save</Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate({ to: "/posts" })}
          >
            Cancel
          </Button>
        </div>
      </form>
    </main>
  )
}
