import { pgTable, text, timestamp, integer } from 'drizzle-orm/pg-core'
import { randomUUID } from 'node:crypto'

export const links = pgTable('links', {
  id: text('id').primaryKey().$defaultFn(() => randomUUID()),
  code: text('code').unique().notNull(),
  originalUrl: text('original_url').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  accessCount: integer('access_count').default(0),
})
