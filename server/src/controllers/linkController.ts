import { FastifyRequest, FastifyReply } from 'fastify';
import { linkService } from '../services/linkService';
import { CreateLinkDTO } from '../models/link';
import { getExportService } from '../services/exportService';

export class LinkController {
  async createLink(request: FastifyRequest<{ Body: CreateLinkDTO }>, reply: FastifyReply) {
    try {
      const link = await linkService.createLink(request.body);
      return reply.code(201).send(link);
    } catch (error: any) {
      return reply.code(400).send({ error: error.message });
    }
  }

  async getAllLinks(request: FastifyRequest, reply: FastifyReply) {
    try {
      const links = await linkService.getAllLinks();
      return reply.send(links);
    } catch (error) {
      return reply.code(500).send({ error: 'Erro ao buscar links' });
    }
  }

  async getLinkByShortUrl(request: FastifyRequest<{ Params: { shortUrl: string } }>, reply: FastifyReply) {
    try {
      const { shortUrl } = request.params;
      const link = await linkService.getLinkByShortUrl(shortUrl);
      if (!link) {
        return reply.code(404).send({ error: 'Link não encontrado' });
      }
      return reply.send(link);
    } catch (error) {
      return reply.code(500).send({ error: 'Erro ao buscar link' });
    }
  }

  async redirectToOriginalUrl(request: FastifyRequest<{ Params: { shortUrl: string } }>, reply: FastifyReply) {
    try {
      const { shortUrl } = request.params;
      const link = await linkService.getLinkByShortUrl(shortUrl);
      if (!link) {
        return reply.code(404).send({ error: 'Link não encontrado' });
      }
      await linkService.incrementAccessCount(shortUrl);
      return reply.redirect(link.url);
    } catch (error) {
      return reply.code(500).send({ error: 'Erro ao redirecionar' });
    }
  }

  async deleteLink(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    try {
      const { id } = request.params;
      await linkService.deleteLink(id);
      return reply.code(204).send();
    } catch (error) {
      return reply.code(404).send({ error: 'Link não encontrado' });
    }
  }

  async exportLinksCSV(request: FastifyRequest, reply: FastifyReply) {
    try {
      const exportService = getExportService();
      const csvUrl = await exportService.exportLinksToCSV();
      return reply.send({ csvUrl });
    } catch (error: any) {
      return reply.code(500).send({ error: error.message });
    }
  }
}

export const linkController = new LinkController();