import { Request, Response } from 'express';
import { createCharacter, getWorldCharacters, deleteCharacter, updateCharacter } from '../services/character.service';


export const createCharacterController = async (req: Request, res: Response) => {
  try {
    const worldId = req.params.worldId as string;
    const character = await createCharacter(worldId, req.body); 
    res.status(201).json({ message: 'Personagem criado!', data: character });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const getWorldCharactersController = async (req: Request, res: Response) => {
  try {
    const worldId = req.params.worldId as string;
    const characters = await getWorldCharacters(worldId);
    res.status(200).json({ data: characters });
  } catch (error: any) {
    res.status(500).json({ error: 'Erro ao buscar personagens.' });
  }
};

export const deleteCharacterController = async (req: Request, res: Response) => {
  try {
    await deleteCharacter(req.params.id as string);
    res.status(200).json({ message: 'Personagem apagado!' });
  } catch (error: any) { res.status(400).json({ error: error.message }); }
};
export const updateCharacterController = async (req: Request, res: Response) => {
  try {
    const data = await updateCharacter(req.params.id as string, req.body);
    res.status(200).json({ message: 'Personagem atualizado!', data });
  } catch (error: any) { res.status(400).json({ error: error.message }); }
};

