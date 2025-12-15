import { db } from '../db'
import { links } from '../db/schema'
import { eq, desc, sql, count } from 'drizzle-orm'
import { CreateLinkDTO } from '../schemas/linkSchema'

export interface PaginatedResult<T> {
  data: T[]
  pagination: {
    page: number
    pageSize: number
    total: number
    totalPages: number
  }
}

export class LinkService {
  async createLink(data: CreateLinkDTO) {
    const result = await db.insert(links).values({
      code: data.code,
      originalUrl: data.url,
    }).returning()

    return result[0]
  }

  async getAllLinks(page: number = 1, pageSize: number = 5): Promise<PaginatedResult<typeof links.$inferSelect>> {
    const offset = (page - 1) * pageSize

    const [totalResult, data] = await Promise.all([
      db.select({ count: count() }).from(links),
      db.select()
        .from(links)
        .orderBy(desc(links.createdAt))
        .limit(pageSize)
        .offset(offset)
    ])

    const total = totalResult[0]?.count ?? 0
    const totalPages = Math.ceil(total / pageSize)

    return {
      data,
      pagination: {
        page,
        pageSize,
        total,
        totalPages
      }
    }
  }

  async getLinkByShortUrl(code: string) {
    const result = await db.select().from(links).where(eq(links.code, code))
    return result[0] || null
  }

  async incrementAccessCount(id: string) {
    const result = await db.update(links)
      .set({ accessCount: sql`${links.accessCount} + 1` })
      .where(eq(links.id, id))
      .returning()
    return result[0];
  }

  async deleteLink(id: string) {
    await db.delete(links).where(eq(links.id, id))
  }
}

export const linkService = new LinkService()