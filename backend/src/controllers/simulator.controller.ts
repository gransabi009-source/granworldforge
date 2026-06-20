// src/controllers/simulator.controller.ts
import { Request, Response } from 'express';
import { simulateConflict } from '../services/simulator.service';

export const simulateConflictController = async (req: Request, res: Response) => {
  try {
    const worldId = req.params.worldId as string;
    const { factionA_Id, factionB_Id, scale, intensity } = req.body;

    if (!factionA_Id || !factionB_Id || !scale || !intensity) {
      return res.status(400).json({ error: "Dados incompletos para a simulação." });
    }

    const result = await simulateConflict(worldId, factionA_Id, factionB_Id, scale, intensity);
    
    res.status(201).json({ 
      message: result.message, 
      data: result 
    });
  } catch (error: any) {
    res.status(500).json({ error: "Erro ao executar a simulação.", details: error.message });
  }
};