import { PrismaClient } from '@prisma/client';

// Definindo a URL do banco diretamente quando não houver variável de ambiente
const prismaClientSingleton = () => {
  return new PrismaClient({
    datasources: {
      db: {
        url: process.env.DATABASE_URL || 
             "postgresql://postgres:postgres@localhost:5432/brevly?schema=public"
      },
    },
  });
};

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;