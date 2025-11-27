import fastify from 'fastify'
import cors from '@fastify/cors'
import { z } from 'zod'
import { db } from './db'
import { links } from './db/schema'
import { eq, desc } from 'drizzle-orm'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { randomUUID } from 'node:crypto'

const app = fastify()

app.register(cors, {
  origin: '*',
})

const s3 = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.CLOUDFLARE_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.CLOUDFLARE_SECRET_ACCESS_KEY || '',
  },
})

// Helper function to escape CSV fields
function escapeCsvField(field: string | number | null | undefined): string {
    const value = field?.toString() || ''
    // If field contains comma, quote, newline, or carriage return, wrap in quotes and escape existing quotes
    if (value.includes(',') || value.includes('"') || value.includes('\n') || value.includes('\r')) {
        return `"${value.replace(/"/g, '""')}"`
    }
    return value
}

// Export to CSV - MUST come before /:code route to avoid conflicts
app.get('/links/export/csv', async (request, reply) => {
    const data = await db.select().from(links).orderBy(desc(links.createdAt))

    // Create CSV rows with proper escaping
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

    // Add UTF-8 BOM for Excel compatibility
    const bom = '\uFEFF'

    return reply
        .header('Content-Type', 'text/csv; charset=utf-8')
        .header('Content-Disposition', 'attachment; filename="links.csv"')
        .send(bom + csvContent)
})

// Create a link
app.post('/links', async (request, reply) => {
  const createLinkSchema = z.object({
    code: z.string().min(3),
    url: z.string().url(),
  })

  const { code, url } = createLinkSchema.parse(request.body)

  try {
    const result = await db.insert(links).values({
      code,
      originalUrl: url,
    }).returning()

    const link = result[0]
    // Return in frontend expected format
    return reply.status(201).send({
      id: link.id,
      url: link.originalUrl,
      shortUrl: link.code,
      createdAt: link.createdAt,
      accessCount: link.accessCount
    })
  } catch (err: any) {
    if (err.code === '23505') {
      return reply.status(409).send({ message: 'Duplicated code' })
    }
    console.error(err)
    return reply.status(500).send({ message: 'Internal error' })
  }
})

// List links
app.get('/links', async () => {
  const result = await db.select().from(links).orderBy(desc(links.createdAt))
  // Map to frontend expected format
  return result.map(link => ({
    id: link.id,
    url: link.originalUrl,
    shortUrl: link.code,
    createdAt: link.createdAt,
    accessCount: link.accessCount
  }))
})

// Get original URL (Redirect)
app.get('/:code', async (request, reply) => {
  const getLinkSchema = z.object({
    code: z.string(),
  })

  const { code } = getLinkSchema.parse(request.params)

  const result = await db.select().from(links).where(eq(links.code, code))

  if (result.length === 0) {
    return reply.status(404).send({ message: 'Link not found' })
  }

  const link = result[0]

  // Increment access count asynchronously
  await db.update(links)
    .set({ accessCount: (link.accessCount || 0) + 1 })
    .where(eq(links.id, link.id))

  return reply.redirect(301, link.originalUrl)
})

// Delete a link
app.delete('/links/:id', async (request, reply) => {
  const deleteLinkSchema = z.object({
    id: z.string().uuid(),
  })

  const { id } = deleteLinkSchema.parse(request.params)

  await db.delete(links).where(eq(links.id, id))

  return reply.status(204).send()
})

// Increment access count (Explicit endpoint if needed, but redirect handles it)
// The requirements say "Deve ser possível incrementar a quantidade de acessos de um link"
// Usually this happens on redirect, but I'll add an endpoint just in case the frontend wants to track clicks without redirecting (e.g. via beacon)
// But for a shortener, the redirect is the main event. I'll stick to the redirect logic for now.

app.listen({
  port: 3333,
  host: '0.0.0.0',
}).then(() => {
  console.log('HTTP Server Running!')
})