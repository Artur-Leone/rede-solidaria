import { config } from './index.js';

let prisma = null;

/**
 * Retorna uma instância do Prisma Client se DATABASE_URL estiver configurada.
 * Caso contrário, retorna null permitindo que a aplicação use o repositório em memória.
 */
export async function getPrismaClient() {
  if (!config.databaseUrl) {
    return null;
  }

  if (!prisma) {
    try {
      const { PrismaClient } = await import('@prisma/client');
      prisma = new PrismaClient();
    } catch {
      console.warn('⚠️ Prisma Client não inicializado. Usando armazenamento em memória.');
      return null;
    }
  }

  return prisma;
}
