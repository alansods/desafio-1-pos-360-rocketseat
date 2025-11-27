import fastify from 'fastify'
import cors from '@fastify/cors'
import { linkRoutes } from './routes/linkRoutes'

const app = fastify()

app.register(cors, {
  origin: '*',
})

app.register(linkRoutes)

app.listen({
  port: 3333,
  host: '0.0.0.0',
}).then(() => {
  console.log('HTTP Server Running!')
})