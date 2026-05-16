import { useState } from "react"
import { createFileRoute, Link, useRouter } from "@tanstack/react-router"
import { createPostSchema } from "@workspace/server/schemas"
import { Button } from "@workspace/ui/components/button"
import { api } from "@/lib/api"

export const Route = createFileRoute("/posts/")({
  component: PostsPage,
  loader: () => {
    console.log(createPostSchema)
    return api.list()
  },
})

function PostsPage() {
  const posts = Route.useLoaderData()
  const router = useRouter()
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [error, setError] = useState<string | null>(null)

  async function onCreate(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    const parsed = createPostSchema.safeParse({ title, content })
    if (!parsed.success) {
      setError(parsed.error.issues.map((i) => i.message).join(", "))
      return
    }
    await api.create(parsed.data)
    setTitle("")
    setContent("")
    router.invalidate()
  }

  async function onDelete(id: number) {
    await api.remove(id)
    router.invalidate()
  }

  return (
    <main className="container mx-auto max-w-2xl p-6">
      <h1 className="mb-4 text-2xl font-medium">Posts</h1>

      <form onSubmit={onCreate} className="mb-6 flex flex-col gap-2">
        <input
          className="rounded border px-2 py-1"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          className="rounded border px-2 py-1"
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        {error && <p className="text-sm text-red-500">{error}</p>}
        <Button type="submit" className="self-start">
          Create
        </Button>
      </form>

      <ul className="flex flex-col gap-2">
        {posts.map((p) => (
          <li
            key={p.id}
            className="flex items-center justify-between rounded border p-3"
          >
            <div>
              <div className="font-medium">{p.title}</div>
              <div className="text-sm text-gray-500">{p.content}</div>
            </div>
            <div className="flex gap-2">
              <Link
                to="/posts/$id"
                params={{ id: String(p.id) }}
                className="text-sm underline"
              >
                Edit
              </Link>
              <button
                onClick={() => onDelete(p.id)}
                className="text-sm text-red-500"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </main>
  )
}
