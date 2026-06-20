// src/controllers/world.controller.ts
import { Request, Response } from 'express';
import { createWorld, getUserWorlds } from '../services/world.service';
import { z } from 'zod';

const createWorldSchema = z.object({
  name: z.string().min(3, 'O nome deve ter pelo menos 3 caracteres').max(100),
  description: z.string().max(2000).optional(),
  genre: z.string().max(50).optional()
});

export const createWorldController = async (req: Request, res: Response) => {
  try {
    // O '!' diz ao TypeScript: "Confia em mim, o middleware de auth já garantiu que req.user existe"
    const userId = req.user!.userId; 
    
    const validatedData = createWorldSchema.parse(req.body);
    const world = await createWorld(userId, validatedData);
    
    return res.status(201).json({ message: 'Mundo criado com sucesso!', data: world });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ error: 'Dados inválidos', details: error.errors });
    }
    return res.status(400).json({ error: error.message });
  }
};

export const getUserWorldsController = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.userId;
    const worlds = await getUserWorlds(userId);
    
    return res.status(200).json({ data: worlds });
  } catch (error: any) {
    return res.status(500).json({ error: 'Erro ao buscar mundos.' });
  }
};