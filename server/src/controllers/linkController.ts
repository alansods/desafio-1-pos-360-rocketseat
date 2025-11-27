import { FastifyRequest, FastifyReply } from 'fastify';
import { linkService } from '../services/linkService';
import { exportService } from '../services/exportService';
import { createLinkSchema, getLinkSchema, deleteLinkSchema } from '../schemas/linkSchema';

export class LinkController {
  async createLink(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { code, url } = createLinkSchema.parse(request.body)
      
      const link = await linkService.createLink({ code, url });
      
      return reply.code(201).send({
        id: link.id,
        url: link.originalUrl,
        shortUrl: link.code,
        createdAt: link.createdAt,
        accessCount: link.accessCount
      });
    } catch (error: any) {
      if (error.code === '23505') {
        return reply.status(409).send({ message: 'Duplicated code' })
      }
      return reply.code(500).send({ message: 'Internal error' });
    }
  }

  async getAllLinks(request: FastifyRequest, reply: FastifyReply) {
    try {
      const links = await linkService.getAllLinks();
      return reply.send(links.map(link => ({
        id: link.id,
        url: link.originalUrl,
        shortUrl: link.code,
        createdAt: link.createdAt,
        accessCount: link.accessCount
      })));
    } catch (error) {
      return reply.code(500).send({ message: 'Erro ao buscar links' });
    }
  }

  async redirectToOriginalUrl(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { code } = getLinkSchema.parse(request.params);
      const link = await linkService.getLinkByShortUrl(code);
      
      if (!link) {
        return reply.code(404).send({ message: 'Link not found' });
      }

      await linkService.incrementAccessCount(link.id, link.accessCount || 0);
      return reply.redirect(301, link.originalUrl);
    } catch (error) {
      return reply.code(500).send({ message: 'Erro ao redirecionar' });
    }
  }

  async deleteLink(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = deleteLinkSchema.parse(request.params);
      await linkService.deleteLink(id);
      return reply.code(204).send();
    } catch (error) {
      return reply.code(500).send({ message: 'Erro ao deletar link' });
    }
  }

  async exportLinksCSV(request: FastifyRequest, reply: FastifyReply) {
    try {
      const csvContent = await exportService.generateCsvContent();

      return reply
        .header('Content-Type', 'text/csv; charset=utf-8')
        .header('Content-Disposition', 'attachment; filename="links.csv"')
        .send(csvContent);
    } catch (error: any) {
      return reply.code(500).send({ message: error.message });
    }
  }
}

export const linkController = new LinkController();