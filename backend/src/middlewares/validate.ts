// src/middlewares/validate.ts
import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';

export const validate = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      // Tenta validar os dados do corpo da requisição
      schema.parse(req.body);
      next(); // Se for válido, avança para o controller
    } catch (error: unknown) { // <-- Adicionado ": unknown" para o TypeScript
      if (error instanceof ZodError) {
        // Se falhar, devolve um erro 400 com os detalhes (usando 'issues' que é o padrão do Zod)
        return res.status(400).json({ 
          error: 'Dados inválidos', 
          details: error.issues // <-- Mudado de 'errors' para 'issues'
        });
      }
      // Se for outro tipo de erro, passa para o tratador global de erros
      next(error);
    }
  };
};