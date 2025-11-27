import { db } from '../db'
import { links } from '../db/schema'
import { eq, desc, sql } from 'drizzle-orm'
import { CreateLinkDTO } from '../schemas/linkSchema'

export class LinkService {
  async createLink(data: CreateLinkDTO) {
    const result = await db.insert(links).values({
      code: data.code,
      originalUrl: data.url,
    }).returning()

    return result[0]
  }

  async getAllLinks() {
    return await db.select().from(links).orderBy(desc(links.createdAt))
  }

  async getLinkByShortUrl(code: string) {
    const result = await db.select().from(links).where(eq(links.code, code))
    return result[0] || null
  }

  async incrementAccessCount(id: string) {
    console.log(`[SERVICE] Incrementando accessCount para ID: ${id}`);
    const result = await db.update(links)
      .set({ accessCount: sql`${links.accessCount} + 1` })
      .where(eq(links.id, id))
      .returning()
    console.log(`[SERVICE] Resultado do update:`, result[0]);
    return result[0];
  }

  async deleteLink(id: string) {
    await db.delete(links).where(eq(links.id, id))
  }
}

export const linkService = new LinkService()