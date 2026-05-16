import { z } from "zod"

export const postSchema = z.object({
  id: z.number().int(),
  title: z.string().min(1),
  content: z.string().min(1),
})

export const createPostSchema = postSchema.omit({ id: true })
export const updatePostSchema = createPostSchema.partial()

export type PostDTO = z.infer<typeof postSchema>
export type CreatePostDTO = z.infer<typeof createPostSchema>
export type UpdatePostDTO = z.infer<typeof updatePostSchema>
