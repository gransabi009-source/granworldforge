// src/middlewares/auth.middleware.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Estendemos a interface Request do Express para incluir o 'user'
declare global {
  namespace Express {
    interface Request {
      user?: { userId: string };
    }
  }
}

const JWT_SECRET = process.env.JWT_SECRET || 'super_secreto_mude_isso_em_producao';

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  // 1. Obter o token do cabeçalho "Authorization: Bearer <token>"
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Acesso negado. Token não fornecido.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    // 2. Verificar se o token é válido
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    
    // 3. Anexar o ID do utilizador ao request para os controllers usarem
    req.user = { userId: decoded.userId };
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Token inválido ou expirado.' });
  }
};