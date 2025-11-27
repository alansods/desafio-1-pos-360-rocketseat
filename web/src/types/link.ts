import { z } from 'zod'

export const createLinkSchema = z.object({
  code: z.string().min(3, "Code must be at least 3 characters"),
  url: z.string().url("Invalid URL"),
})

export type CreateLinkSchema = z.infer<typeof createLinkSchema>

export interface Link {
  id: string
  shortUrl: string
  url: string
  accessCount: number
  createdAt: string
}
