// src/services/extra-content.service.ts
import { prisma } from '../server';

// --- REINOS ---
export const createKingdom = async (worldId: string, data: any) => {
  return await prisma.kingdom.create({ data: { worldId, ...data } });
};
export const getWorldKingdoms = async (worldId: string) => {
  return await prisma.kingdom.findMany({ where: { worldId }, include: { rulerCharacter: true } });
};
export const deleteKingdom = async (id: string) => {
  return await prisma.kingdom.delete({ where: { id } });
};
export const updateKingdom = async (id: string, data: any) => {
  return await prisma.kingdom.update({ where: { id }, data });
};

// --- LOCAIS ---
export const createLocation = async (worldId: string, data: any) => {
  return await prisma.location.create({ data: { worldId, ...data } });
};
export const getWorldLocations = async (worldId: string) => {
  return await prisma.location.findMany({ where: { worldId }, orderBy: { name: 'asc' } });
};
export const deleteLocation = async (id: string) => {
  return await prisma.location.delete({ where: { id } });
};
export const updateLocation = async (id: string, data: any) => {
  return await prisma.location.update({ where: { id }, data });
};

// --- EVENTOS ---
export const createEvent = async (worldId: string, data: any) => {
  return await prisma.event.create({ data: { worldId, ...data } });
};
export const getWorldEvents = async (worldId: string) => {
  return await prisma.event.findMany({ 
    where: { worldId }, 
    include: { location: true, timeline: true },
    orderBy: [
      { year: 'asc' },
      { month: 'asc' },
      { day: 'asc' },
      { sortOrder: 'asc' }
    ]
  });
};
export const deleteEvent = async (id: string) => {
  return await prisma.event.delete({ where: { id } });
};
export const updateEvent = async (id: string, data: any) => {
  return await prisma.event.update({ where: { id }, data });
};

// --- PROFISSÕES ---
export const createProfession = async (worldId: string, data: any) => {
  return await prisma.profession.create({ data: { worldId, ...data } });
};
export const getWorldProfessions = async (worldId: string) => {
  return await prisma.profession.findMany({ where: { worldId }, orderBy: { name: 'asc' } });
};
export const deleteProfession = async (id: string) => {
  return await prisma.profession.delete({ where: { id } });
};
export const updateProfession = async (id: string, data: any) => {
  return await prisma.profession.update({ where: { id }, data });
};

// --- CONCEITOS ---
export const createConcept = async (worldId: string, data: any) => {
  return await prisma.concept.create({ data: { worldId, ...data } });
};
export const getWorldConcepts = async (worldId: string) => {
  return await prisma.concept.findMany({ where: { worldId }, orderBy: { name: 'asc' } });
};
export const deleteConcept = async (id: string) => {
  return await prisma.concept.delete({ where: { id } });
};
export const updateConcept = async (id: string, data: any) => {
  return await prisma.concept.update({ where: { id }, data });
};

// --- LORE ENTRIES ---
export const createLoreEntry = async (worldId: string, data: any) => {
  return await prisma.loreEntry.create({ data: { worldId, ...data } });
};
export const getLoreEntries = async (worldId: string, category?: string) => {
  return await prisma.loreEntry.findMany({ 
    where: { worldId, ...(category && { category }) },
    orderBy: { name: 'asc' }
  });
};
export const deleteLoreEntry = async (id: string) => {
  return await prisma.loreEntry.delete({ where: { id } });
};
export const updateLoreEntry = async (id: string, data: any) => {
  return await prisma.loreEntry.update({ where: { id }, data });
};