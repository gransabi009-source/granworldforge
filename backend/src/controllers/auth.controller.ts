// src/controllers/auth.controller.ts
import { Request, Response } from 'express';
import { registerUser, loginUser } from '../services/auth.service';

export const registerController = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;
    const result = await registerUser(username, email, password);
    
    // Devolvemos o token num cookie httpOnly (mais seguro contra XSS) ou no body
    res.status(201).json({ 
      message: 'Utilizador criado com sucesso!', 
      data: result 
    });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const loginController = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const result = await loginUser(email, password);
    
    res.status(200).json({ 
      message: 'Login realizado com sucesso!', 
      data: result 
    });
  } catch (error: any) {
    res.status(401).json({ error: error.message });
  }
};