import { createObjectCsvWriter } from 'csv-writer';
import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import path from 'path';
import { Link } from '../models/link';
import { prisma } from './prisma';

class ExportService {
  private static instance: ExportService;
  private s3Client: S3Client | null = null;
  private readonly useR2: boolean;

  private constructor() {
    // Verificar configurações R2
    const hasRequiredConfig = !!(
      process.env.CLOUDFLARE_BUCKET && 
      process.env.CLOUDFLARE_ACCESS_KEY_ID && 
      process.env.CLOUDFLARE_SECRET_ACCESS_KEY &&
      process.env.CLOUDFLARE_ACCOUNT_ID
    );

    this.useR2 = hasRequiredConfig;

    console.log('📦 Inicializando ExportService:', {
      useR2: this.useR2,
      bucket: process.env.CLOUDFLARE_BUCKET,
      accountId: process.env.CLOUDFLARE_ACCOUNT_ID,
      hasAccessKey: !!process.env.CLOUDFLARE_ACCESS_KEY_ID,
      hasSecretKey: !!process.env.CLOUDFLARE_SECRET_ACCESS_KEY
    });

    if (this.useR2) {
      try {
        this.s3Client = new S3Client({
          region: 'auto',
          endpoint: `https://${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
          credentials: {
            accessKeyId: process.env.CLOUDFLARE_ACCESS_KEY_ID!,
            secretAccessKey: process.env.CLOUDFLARE_SECRET_ACCESS_KEY!
          }
        });
        console.log('✅ Cliente R2 inicializado com sucesso');
      } catch (error) {
        console.error('❌ Erro ao inicializar cliente R2:', error);
        this.useR2 = false; // Disable R2 if initialization fails
      }
    }
  }

  public static getInstance(): ExportService {
    if (!ExportService.instance) {
      ExportService.instance = new ExportService();
    }
    return ExportService.instance;
  }

  private async generateCsv(): Promise<{ filePath: string; fileName: string }> {
    console.log('📊 Gerando arquivo CSV...');
    const links = await prisma.link.findMany({
      orderBy: { createdAt: 'desc' }
    });

    console.log(`📝 Encontrados ${links.length} links para exportar`);

    const fileName = `links-${uuidv4()}.csv`;
    const filePath = path.join(process.cwd(), 'tmp', fileName);

    // Garantir que o diretório tmp existe
    const tmpDir = path.join(process.cwd(), 'tmp');
    if (!fs.existsSync(tmpDir)) {
      fs.mkdirSync(tmpDir, { recursive: true });
    }

    const csvWriter = createObjectCsvWriter({
      path: filePath,
      header: [
        { id: 'id', title: 'ID' },
        { id: 'url', title: 'URL Original' },
        { id: 'shortUrl', title: 'URL Encurtada' },
        { id: 'createdAt', title: 'Data de Criação' },
        { id: 'accessCount', title: 'Contagem de Acessos' }
      ]
    });

    await csvWriter.writeRecords(links.map(link => ({
      ...link,
      createdAt: link.createdAt.toISOString()
    })));

    console.log('✅ Arquivo CSV gerado:', filePath);
    return { filePath, fileName };
  }

  private saveLocally(filePath: string, fileName: string): string {
    console.log('💾 Salvando arquivo localmente...');
    const publicDir = path.join(process.cwd(), 'public', 'exports');
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }

    const publicPath = path.join(publicDir, fileName);
    fs.copyFileSync(filePath, publicPath);
    console.log('✅ Arquivo salvo localmente:', publicPath);

    return `/exports/${fileName}`;
  }

  private async uploadToR2(filePath: string, fileName: string): Promise<string> {
    if (!this.useR2 || !this.s3Client) {
      console.error('❌ R2 não está configurado corretamente');
      throw new Error('R2 não está configurado');
    }

    const r2Key = `exports/${fileName}`;
    const fileContent = fs.readFileSync(filePath);

    try {
      console.log('⬆️ Iniciando upload para R2:', {
        bucket: process.env.CLOUDFLARE_BUCKET,
        key: r2Key,
        contentType: 'text/csv',
        fileSize: fileContent.length,
        endpoint: `https://${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`
      });

      const uploadCommand = new PutObjectCommand({
        Bucket: process.env.CLOUDFLARE_BUCKET!,
        Key: r2Key,
        Body: fileContent,
        ContentType: 'text/csv'
      });

      const uploadResult = await this.s3Client.send(uploadCommand);
      console.log('✅ Upload concluído com sucesso:', uploadResult);

      // Gerar URL assinada válida por 7 dias
      console.log('🔑 Gerando URL assinada...');
      const getObjectCommand = new GetObjectCommand({
        Bucket: process.env.CLOUDFLARE_BUCKET!,
        Key: r2Key
      });

      const signedUrl = await getSignedUrl(this.s3Client, getObjectCommand, {
        expiresIn: 604800 // 7 dias em segundos
      });

      console.log('✅ URL assinada gerada:', signedUrl);
      return signedUrl;

    } catch (error: any) {
      console.error('❌ Erro durante o upload para R2:', {
        errorName: error.name,
        errorMessage: error.message,
        errorCode: error.$metadata?.httpStatusCode,
        errorRequestId: error.$metadata?.requestId,
        stack: error.stack
      });

      throw error; // Re-throw the error to be handled by the caller
    }
  }

  async exportLinksToCSV(): Promise<string> {
    console.log('🚀 Iniciando processo de exportação...');
    try {
      const { filePath, fileName } = await this.generateCsv();

      if (this.useR2) {
        try {
          const r2Url = await this.uploadToR2(filePath, fileName);
          console.log('✅ Arquivo exportado com sucesso para R2:', r2Url);

          // Limpar arquivo temporário
          fs.unlinkSync(filePath);
          return r2Url;
        } catch (error) {
          console.error('❌ Falha no upload para R2, usando armazenamento local como fallback:', error);
          // Continue para o fallback local
        }
      }

      // Fallback para armazenamento local
      console.log('📁 Usando armazenamento local...');
      const localUrl = this.saveLocally(filePath, fileName);
      console.log('✅ Arquivo salvo localmente:', localUrl);

      // Limpar arquivo temporário original
      fs.unlinkSync(filePath);

      return localUrl;
    } catch (error) {
      console.error('❌ Erro durante exportação:', error);
      throw error;
    }
  }

  async generateCsvContent(): Promise<string> {
    console.log('📊 Gerando conteúdo CSV...');
    const links = await prisma.link.findMany({
      orderBy: { createdAt: 'desc' }
    });

    console.log(`📝 Encontrados ${links.length} links para exportar`);

    // Criar CSV manualmente
    const headers = ['ID', 'URL Original', 'URL Encurtada', 'Data de Criação', 'Contagem de Acessos'];
    const rows = links.map(link => [
      link.id,
      link.url,
      link.shortUrl,
      link.createdAt.toISOString(),
      link.accessCount.toString()
    ]);

    // Função helper para escapar campos CSV
    const escapeCsvField = (field: string): string => {
      if (field.includes(',') || field.includes('"') || field.includes('\n')) {
        return `"${field.replace(/"/g, '""')}"`;
      }
      return field;
    };

    // Montar CSV
    const csvContent = [
      headers.map(escapeCsvField).join(','),
      ...rows.map(row => row.map(escapeCsvField).join(','))
    ].join('\n');

    console.log('✅ Conteúdo CSV gerado');
    return csvContent;
  }
}

// Export a function to get the instance instead of creating it immediately
export const getExportService = () => ExportService.getInstance();