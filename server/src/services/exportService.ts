import { db } from '../db'
import { links } from '../db/schema'
import { desc } from 'drizzle-orm'
import { escapeCsvField } from '../utils/csvUtils'
import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
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

    const fileName = `links_${randomUUID()}.csv`

    const putCommand = new PutObjectCommand({
      Bucket: process.env.CLOUDFLARE_BUCKET,
      Key: fileName,
      Body: content,
      ContentType: 'text/csv; charset=utf-8',
      ContentDisposition: `attachment; filename="${fileName}"`,
    })

    await r2.send(putCommand)

    // Gerar URL assinada para download válida por 1 hora
    const getCommand = new GetObjectCommand({
      Bucket: process.env.CLOUDFLARE_BUCKET,
      Key: fileName,
    })

    const signedUrl = await getSignedUrl(r2, getCommand, { expiresIn: 3600 })

    return signedUrl
  }
}

export const exportService = new ExportService()