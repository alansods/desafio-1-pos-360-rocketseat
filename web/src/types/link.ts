import { z } from 'zod'

export const createLinkSchema = z.object({
  code: z.string()
    .min(3, "O código deve ter pelo menos 3 caracteres")
    .regex(/^[a-zA-Z0-9_-]+$/, "O código deve conter apenas letras, números, hífen ou underscore"),
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

export interface Pagination {
  page: number
  pageSize: number
  total: number
  totalPages: number
}

export interface PaginatedLinksResponse {
  data: Link[]
  pagination: Pagination
}
