import { FastifyInstance } from 'fastify';
import { linkController } from '../controllers/linkController';

export async function linkRoutes(fastify: FastifyInstance) {
  fastify.post('/links', linkController.createLink);
  fastify.get('/links', linkController.getAllLinks);
  fastify.get('/links/:shortUrl', linkController.getLinkByShortUrl);
  fastify.delete('/links/:id', linkController.deleteLink);
  fastify.get('/links/export/csv', linkController.exportLinksCSV);
  fastify.get('/:shortUrl', linkController.redirectToOriginalUrl);
}