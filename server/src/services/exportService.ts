import { db } from '../db'
import { links } from '../db/schema'
import { desc } from 'drizzle-orm'
import { escapeCsvField } from '../utils/csvUtils'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { randomUUID } from 'node:crypto'

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

  async uploadToStorage(content: string): Promise<string> {
    const r2 = new S3Client({
      region: 'auto',
      endpoint: `https://${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: process.env.CLOUDFLARE_ACCESS_KEY_ID!,
        secretAccessKey: process.env.CLOUDFLARE_SECRET_ACCESS_KEY!,
      },
    })

    const fileName = `${randomUUID()}.csv`

    await r2.send(new PutObjectCommand({
      Bucket: process.env.CLOUDFLARE_BUCKET,
      Key: fileName,
      Body: content,
      ContentType: 'text/csv',
    }))

    return `${process.env.CLOUDFLARE_PUBLIC_URL}/${fileName}`
  }
}

export const exportService = new ExportService()