import { z } from 'zod'

export const createLinkSchema = z.object({
  code: z.string()
    .min(3, "O código deve ter pelo menos 3 caracteres")
    .regex(/^[a-zA-Z0-9_-]+$/, "O código deve conter apenas letras, números, hífen ou underscore"),
  url: z.string().url("Informe uma URL válida"),
})

export const getLinkSchema = z.object({
  code: z.string(),
})

export const deleteLinkSchema = z.object({
  id: z.string().uuid(),
})

export type CreateLinkDTO = z.infer<typeof createLinkSchema>
