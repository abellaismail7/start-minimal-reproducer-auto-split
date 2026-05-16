import type {
  PostDTO,
  CreatePostDTO,
  UpdatePostDTO,
} from "@workspace/server/schemas"

const API_URL = "http://localhost:3002"

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { "content-type": "application/json" },
    ...init,
  })
  if (!res.ok) throw new Error(`request failed: ${res.status}`)
  return res.json() as Promise<T>
}

export const api = {
  list: () => request<PostDTO[]>("/posts"),
  get: (id: number) => request<PostDTO>(`/posts/${id}`),
  create: (data: CreatePostDTO) =>
    request<PostDTO>("/posts", { method: "POST", body: JSON.stringify(data) }),
  update: (id: number, data: UpdatePostDTO) =>
    request<PostDTO>(`/posts/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  remove: (id: number) =>
    request<{ ok: true }>(`/posts/${id}`, { method: "DELETE" }),
}
