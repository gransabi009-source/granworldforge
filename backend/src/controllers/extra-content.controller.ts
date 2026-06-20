// src/controllers/extra-content.controller.ts
import { Request, Response } from 'express';
import { 
  createKingdom, getWorldKingdoms, deleteKingdom, updateKingdom,
  createLocation, getWorldLocations, deleteLocation, updateLocation,
  createEvent, getWorldEvents, deleteEvent, updateEvent,
  createProfession, getWorldProfessions, deleteProfession, updateProfession,
  createConcept, getWorldConcepts, deleteConcept, updateConcept,
  createLoreEntry, getLoreEntries, deleteLoreEntry, updateLoreEntry
} from '../services/extra-content.service';

const getWorldId = (req: Request) => req.params.worldId as string;
const getId = (req: Request) => req.params.id as string; // <-- NOVO HELPER

// --- REINOS ---
export const createKingdomController = async (req: Request, res: Response) => {
  try {
    const data = await createKingdom(getWorldId(req), req.body);
    res.status(201).json({ message: 'Reino criado!', data });
  } catch (error: any) { res.status(400).json({ error: error.message }); }
};
export const getKingdomsController = async (req: Request, res: Response) => {
  try {
    const data = await getWorldKingdoms(getWorldId(req));
    res.status(200).json({ data });
  } catch (error: any) { res.status(500).json({ error: 'Erro ao buscar reinos.' }); }
};
export const deleteKingdomController = async (req: Request, res: Response) => {
  try {
    await deleteKingdom(getId(req)); // <-- CORRIGIDO
    res.status(200).json({ message: 'Reino apagado!' });
  } catch (error: any) { res.status(400).json({ error: error.message }); }
};
export const updateKingdomController = async (req: Request, res: Response) => {
  try {
    const data = await updateKingdom(getId(req), req.body); // <-- CORRIGIDO
    res.status(200).json({ message: 'Reino atualizado!', data });
  } catch (error: any) { res.status(400).json({ error: error.message }); }
};

// --- LOCAIS ---
export const createLocationController = async (req: Request, res: Response) => {
  try {
    const data = await createLocation(getWorldId(req), req.body);
    res.status(201).json({ message: 'Local criado!', data });
  } catch (error: any) { res.status(400).json({ error: error.message }); }
};
export const getLocationsController = async (req: Request, res: Response) => {
  try {
    const data = await getWorldLocations(getWorldId(req));
    res.status(200).json({ data });
  } catch (error: any) { res.status(500).json({ error: 'Erro ao buscar locais.' }); }
};
export const deleteLocationController = async (req: Request, res: Response) => {
  try {
    await deleteLocation(getId(req));
    res.status(200).json({ message: 'Local apagado!' });
  } catch (error: any) { res.status(400).json({ error: error.message }); }
};
export const updateLocationController = async (req: Request, res: Response) => {
  try {
    const data = await updateLocation(getId(req), req.body);
    res.status(200).json({ message: 'Local atualizado!', data });
  } catch (error: any) { res.status(400).json({ error: error.message }); }
};

// --- EVENTOS ---
export const createEventController = async (req: Request, res: Response) => {
  try {
    const data = await createEvent(getWorldId(req), req.body);
    res.status(201).json({ message: 'Evento criado!', data });
  } catch (error: any) { res.status(400).json({ error: error.message }); }
};
export const getEventsController = async (req: Request, res: Response) => {
  try {
    const data = await getWorldEvents(getWorldId(req));
    res.status(200).json({ data });
  } catch (error: any) { res.status(500).json({ error: 'Erro ao buscar eventos.' }); }
};
export const deleteEventController = async (req: Request, res: Response) => {
  try {
    await deleteEvent(getId(req));
    res.status(200).json({ message: 'Evento apagado!' });
  } catch (error: any) { res.status(400).json({ error: error.message }); }
};
export const updateEventController = async (req: Request, res: Response) => {
  try {
    const data = await updateEvent(getId(req), req.body);
    res.status(200).json({ message: 'Evento atualizado!', data });
  } catch (error: any) { res.status(400).json({ error: error.message }); }
};

// --- PROFISSÕES ---
export const createProfessionController = async (req: Request, res: Response) => {
  try {
    const data = await createProfession(getWorldId(req), req.body);
    res.status(201).json({ message: 'Profissão criada!', data });
  } catch (error: any) { res.status(400).json({ error: error.message }); }
};
export const getProfessionsController = async (req: Request, res: Response) => {
  try {
    const data = await getWorldProfessions(getWorldId(req));
    res.status(200).json({ data });
  } catch (error: any) { res.status(500).json({ error: 'Erro ao buscar profissões.' }); }
};
export const deleteProfessionController = async (req: Request, res: Response) => {
  try {
    await deleteProfession(getId(req));
    res.status(200).json({ message: 'Profissão apagada!' });
  } catch (error: any) { res.status(400).json({ error: error.message }); }
};
export const updateProfessionController = async (req: Request, res: Response) => {
  try {
    const data = await updateProfession(getId(req), req.body);
    res.status(200).json({ message: 'Profissão atualizada!', data });
  } catch (error: any) { res.status(400).json({ error: error.message }); }
};

// --- CONCEITOS ---
export const createConceptController = async (req: Request, res: Response) => {
  try {
    const data = await createConcept(getWorldId(req), req.body);
    res.status(201).json({ message: 'Conceito criado!', data });
  } catch (error: any) { res.status(400).json({ error: error.message }); }
};
export const getConceptsController = async (req: Request, res: Response) => {
  try {
    const data = await getWorldConcepts(getWorldId(req));
    res.status(200).json({ data });
  } catch (error: any) { res.status(500).json({ error: 'Erro ao buscar conceitos.' }); }
};
export const deleteConceptController = async (req: Request, res: Response) => {
  try {
    await deleteConcept(getId(req));
    res.status(200).json({ message: 'Conceito apagado!' });
  } catch (error: any) { res.status(400).json({ error: error.message }); }
};
export const updateConceptController = async (req: Request, res: Response) => {
  try {
    const data = await updateConcept(getId(req), req.body);
    res.status(200).json({ message: 'Conceito atualizado!', data });
  } catch (error: any) { res.status(400).json({ error: error.message }); }
};

// --- LORE ENTRIES ---
export const createLoreEntryController = async (req: Request, res: Response) => {
  try {
    const data = await createLoreEntry(getWorldId(req), req.body);
    res.status(201).json({ message: 'Entrada de Lore criada!', data });
  } catch (error: any) { res.status(400).json({ error: error.message }); }
};
export const getLoreEntriesController = async (req: Request, res: Response) => {
  try {
    const data = await getLoreEntries(getWorldId(req), req.query.category as string);
    res.status(200).json({ data });
  } catch (error: any) { res.status(500).json({ error: 'Erro ao buscar entries.' }); }
};
export const deleteLoreEntryController = async (req: Request, res: Response) => {
  try {
    await deleteLoreEntry(getId(req));
    res.status(200).json({ message: 'Lore apagada!' });
  } catch (error: any) { res.status(400).json({ error: error.message }); }
};
export const updateLoreEntryController = async (req: Request, res: Response) => {
  try {
    const data = await updateLoreEntry(getId(req), req.body);
    res.status(200).json({ message: 'Lore atualizada!', data });
  } catch (error: any) { res.status(400).json({ error: error.message }); }
};