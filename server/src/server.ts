import fastify from 'fastify'
import cors from '@fastify/cors'
import { linkRoutes } from './routes/linkRoutes'

const app = fastify({
  logger: true
})

app.register(cors, {
  origin: [
    'http://localhost:5173',
    'https://desafio-1-pos-360-rocketseat-f36wv54qx-alansods-projects.vercel.app',
    /\.vercel\.app$/,
  ],
})

app.register(linkRoutes)

app.listen({
  port: 3333,
  host: '0.0.0.0',
})