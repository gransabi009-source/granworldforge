// src/services/world.service.ts
import { prisma } from '../server';

export const createWorld = async (userId: string, data: { name: string, description?: string, genre?: string }) => {
  // 💡 FUTURO (MONETIZAÇÃO): Descomenta isto para limitar mundos no plano FREE
  // const worldCount = await prisma.world.count({ where: { userId } });
  // if (worldCount >= 3) {
  //   throw new Error('Limite de mundos atingido. Atualize para o plano PRO.');
  // }

  const newWorld = await prisma.world.create({
    data: {
      userId, // Agora vem de forma segura do token, não do req.body
      name: data.name,
      description: data.description,
      genre: data.genre,
      isPublic: false // Por defeito, mundos são privados (funcionalidade PRO no futuro)
    }
  });

  return newWorld;
};

export const getUserWorlds = async (userId: string) => {
  // Devolve todos os mundos deste utilizador, ordenados do mais recente para o mais antigo
  const worlds = await prisma.world.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      name: true,
      genre: true,
      isPublic: true,
      createdAt: true
    }
  });

  return worlds;
};