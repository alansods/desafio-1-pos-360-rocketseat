import { db } from '../db'
import { links } from '../db/schema'
import { desc } from 'drizzle-orm'
import { escapeCsvField } from '../utils/csvUtils'

export class ExportService {
  async generateCsvContent(): Promise<string> {
    const data = await db.select().from(links).orderBy(desc(links.createdAt))

    const headers = ['ID', 'Code', 'Original URL', 'Access Count', 'Created At']
    const rows = data.map(link => [
        escapeCsvField(link.id),
        escapeCsvField(link.code),
        escapeCsvField(link.originalUrl),
        escapeCsvField(link.accessCount),
        escapeCsvField(link.createdAt?.toISOString())
    ])

    const csvContent = [
        headers.join(','),
        ...rows.map(row => row.join(','))
    ].join('\n')

    const bom = '\uFEFF'
    return bom + csvContent
  }
}

export const exportService = new ExportService()