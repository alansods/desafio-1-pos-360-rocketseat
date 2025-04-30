import fastify from 'fastify';
import cors from '@fastify/cors';

const app = fastify({ logger: true });

// Registrar plugins
app.register(cors, {
  origin: true, // Permitir qualquer origem (remover em produção)
});

app.get('/', async (request, reply) => {
  return { hello: 'world' };
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