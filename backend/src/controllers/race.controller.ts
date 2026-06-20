import { Request, Response } from 'express';
import { createRace, getWorldRaces, deleteRace, updateRace } from '../services/race.service';

export const createRaceController = async (req: Request, res: Response) => {
  try {
    const worldId = req.params.worldId as string; // O ID do mundo vem no URL
    const race = await createRace(worldId, req.body);
    res.status(201).json({ message: 'Raça criada!', data: race });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const getWorldRacesController = async (req: Request, res: Response) => {
  try {
    const worldId = req.params.worldId as string;
    const races = await getWorldRaces(worldId);
    res.status(200).json({ data: races });
  } catch (error: any) {
    res.status(500).json({ error: 'Erro ao buscar raças.' });
  }
};

export const deleteRaceController = async (req: Request, res: Response) => {
  try {
    await deleteRace(req.params.id as string);
    res.status(200).json({ message: 'Raça apagada!' });
  } catch (error: any) { res.status(400).json({ error: error.message }); }
};
export const updateRaceController = async (req: Request, res: Response) => {
  try {
    const data = await updateRace(req.params.id as string, req.body);
    res.status(200).json({ message: 'Raça atualizada!', data });
  } catch (error: any) { res.status(400).json({ error: error.message }); }
};