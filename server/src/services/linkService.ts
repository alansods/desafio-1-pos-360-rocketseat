import { Link, CreateLinkDTO } from '../models/link';
import { prisma } from './prisma';
import crypto from 'crypto';

export class LinkService {
  // Gerar URL curta aleatória se não for fornecida
  private generateShortUrl(): string {
    return crypto.randomBytes(3).toString('hex');
  }

  // Criar um novo link
  async createLink(data: CreateLinkDTO): Promise<Link> {
    const shortUrl = data.shortUrl || this.generateShortUrl();
    // Validação: shortUrl não pode ser uma URL completa ou conter pontos
    if (/^(https?:\/\/)/i.test(shortUrl) || shortUrl.includes('.')) {
      throw new Error('O identificador do link encurtado não pode ser uma URL ou conter pontos. Use apenas letras, números e traços.');
    }
    // Verificar se já existe
    const existingLink = await prisma.link.findUnique({
      where: { shortUrl }
    });
    
    if (existingLink) {
      throw new Error('Esta URL curta já está em uso');
    }
    
    return prisma.link.create({
      data: {
        url: data.url,
        shortUrl
      }
    });
  }

  // Obter todos os links
  async getAllLinks(): Promise<Link[]> {
    return prisma.link.findMany({
      orderBy: { createdAt: 'desc' }
    });
  }

  // Obter link pela URL curta
  async getLinkByShortUrl(shortUrl: string): Promise<Link | null> {
    return prisma.link.findUnique({
      where: { shortUrl }
    });
  }

  // Incrementar contador de acessos
  async incrementAccessCount(shortUrl: string): Promise<Link> {
    return prisma.link.update({
      where: { shortUrl },
      data: {
        accessCount: { increment: 1 }
      }
    });
  }

  // Deletar um link
  async deleteLink(id: string): Promise<void> {
    await prisma.link.delete({
      where: { id }
    });
  }
}

export const linkService = new LinkService();