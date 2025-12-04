import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema'

export const client = postgres(process.env.DATABASE_URL || "postgresql://docker:docker@localhost:5432/shortlinks")
export const db = drizzle(client, { schema })
