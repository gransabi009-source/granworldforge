// src/services/race.service.ts
import { prisma } from '../server';

export const createRace = async (worldId: string, data: { name: string, description?: string, traits?: any }) => {
  return await prisma.race.create({
    data: {
      worldId,
      name: data.name,
      description: data.description,
      traits: data.traits // Aceita JSON (ex: ["Visão Noturna", "+2 Força"])
    }
  });
};

export const getWorldRaces = async (worldId: string) => {
  return await prisma.race.findMany({
    where: { worldId },
    orderBy: { name: 'asc' }
  });
};

export const deleteRace = async (id: string) => {
  return await prisma.race.delete({ where: { id } });
};
export const updateRace = async (id: string, data: any) => {
  return await prisma.race.update({ where: { id }, data });
};

export const deleteCharacter = async (id: string) => {
  return await prisma.character.delete({ where: { id } });
};
export const updateCharacter = async (id: string, data: any) => {
  return await prisma.character.update({ where: { id }, data });
};