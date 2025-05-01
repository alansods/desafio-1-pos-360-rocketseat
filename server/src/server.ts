import fastify from 'fastify';
import cors from '@fastify/cors';
import { linkRoutes } from './routes/linkRoutes';

const app = fastify({ logger: true });

// Registrar plugins
app.register(cors, {
  origin: true, // Permitir qualquer origem (em produção, você deve restringir isto)
});

// Registrar rotas
app.register(linkRoutes);

// Rota principal
app.get('/', async (request, reply) => {
  return { message: 'Brev.ly API - Encurtador de URLs' };
});

const start = async () => {
  try {
    await app.listen({ port: 3333, host: '0.0.0.0' });
    console.log('Server running at http://localhost:3333');
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();