import { FastifyRequest, FastifyReply } from 'fastify';
import { linkService } from '../services/linkService';
import { exportService } from '../services/exportService';
import { createLinkSchema, getLinkSchema, deleteLinkSchema } from '../schemas/linkSchema';

// Cache em memória para prevenir incrementos duplicados muito rápidos
// Armazena timestamp do último incremento por link ID
const lastIncrementCache = new Map<string, number>();
const INCREMENT_COOLDOWN_MS = 1000; // 1 segundo de cooldown entre incrementos do mesmo link

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
      // Drizzle wraps the PostgreSQL error in a "cause" property
      if (error.cause?.code === '23505' || error.message?.includes('duplicate') || error.message?.includes('unique')) {
        return reply.status(409).send({ message: 'Duplicated code' })
      }
      console.error('[CREATE LINK] Erro:', error);
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

      // Verificar se já foi incrementado recentemente (proteção contra duplicatas)
      const now = Date.now();
      const lastIncrement = lastIncrementCache.get(link.id);
      
      if (lastIncrement && (now - lastIncrement) < INCREMENT_COOLDOWN_MS) {
        // Incremento muito recente, pular para evitar contagem duplicada
        // Mas ainda fazer o redirect
      } else {
        // Incrementar contador e atualizar cache
        await linkService.incrementAccessCount(link.id);
        lastIncrementCache.set(link.id, now);
        
        // Limpar cache antigo periodicamente (manter apenas últimos 5 minutos)
        if (lastIncrementCache.size > 1000) {
          const fiveMinutesAgo = now - 5 * 60 * 1000;
          for (const [id, timestamp] of lastIncrementCache.entries()) {
            if (timestamp < fiveMinutesAgo) {
              lastIncrementCache.delete(id);
            }
          }
        }
      }

      // Adicionar headers para evitar cache do redirect
      return reply
        .header('Cache-Control', 'no-cache, no-store, must-revalidate')
        .header('Pragma', 'no-cache')
        .header('Expires', '0')
        .redirect(302, link.originalUrl);
    } catch (error) {
      console.error(`[REDIRECT] Erro:`, error);
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

  async incrementLinkAccess(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = deleteLinkSchema.parse(request.params);
      const updatedLink = await linkService.incrementAccessCount(id);
      return reply.send({
        id: updatedLink.id,
        accessCount: updatedLink.accessCount
      });
    } catch (error) {
      console.error(`[INCREMENT] Erro:`, error);
      return reply.code(500).send({ message: 'Erro ao incrementar contador' });
    }
  }

  async exportLinksCSV(request: FastifyRequest, reply: FastifyReply) {
    try {
      const csvContent = await exportService.generateCsvContent();

      // Modo local: se não tem credenciais Cloudflare, retorna CSV diretamente
      if (!process.env.CLOUDFLARE_ACCOUNT_ID) {
        return reply
          .header('Content-Type', 'text/csv; charset=utf-8')
          .header('Content-Disposition', 'attachment; filename="links.csv"')
          .send(csvContent);
      }

      // Modo produção: faz upload para R2 e retorna URL
      const fileUrl = await exportService.uploadToStorage(csvContent);
      return reply.send({ url: fileUrl });
    } catch (error: any) {
      console.error('[EXPORT CSV] Erro:', error);
      return reply.code(500).send({ message: 'Erro ao exportar CSV' });
    }
  }
}

export const linkController = new LinkController();