import { z } from 'zod'

export const createLinkSchema = z.object({
  code: z.string().min(3),
  url: z.string().url(),
})

export const getLinkSchema = z.object({
  code: z.string(),
})

export const deleteLinkSchema = z.object({
  id: z.string().uuid(),
})

export type CreateLinkDTO = z.infer<typeof createLinkSchema>
