import { z } from 'zod'

export const createLinkSchema = z.object({
  code: z.string().min(3, "O código deve ter pelo menos 3 caracteres"),
  url: z.string().url("Informe uma URL válida"),
})

export type CreateLinkSchema = z.infer<typeof createLinkSchema>

export interface Link {
  id: string
  shortUrl: string
  url: string
  accessCount: number
  createdAt: string
}
