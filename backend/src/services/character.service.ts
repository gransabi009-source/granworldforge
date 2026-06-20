// src/services/character.service.ts
import { prisma } from '../server';

export const createCharacter = async (worldId: string, data: {
  name: string,
  raceId?: string,
  description?: string,
  age?: string,
  alignment?: string
}) => {
  return await prisma.character.create({
    data: {
      worldId,
      name: data.name,
      raceId: data.raceId,
      description: data.description,
      age: data.age,
      alignment: data.alignment
    }
  });
};

export const getWorldCharacters = async (worldId: string) => {
  return await prisma.character.findMany({
    where: { worldId },
    include: { 
      race: true,        // <-- Adiciona isto
      profession: true   // <-- Adiciona isto
    },
    orderBy: { name: 'asc' }
  });
};

export const deleteCharacter = async (id: string) => {
  return await prisma.character.delete({ where: { id } });
};
export const updateCharacter = async (id: string, data: any) => {
  return await prisma.character.update({ where: { id }, data });
};