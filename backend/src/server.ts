// src/server.ts
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

import authRoutes from './routes/auth.routes';
import worldRoutes from './routes/world.routes';

dotenv.config();

const app = express();
export const prisma = new PrismaClient();

app.use(helmet());
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173', credentials: true }));

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });
app.use('/api/', limiter);

app.use(express.json());

// Rotas
app.use('/api/auth', authRoutes);
app.use('/api/worlds', worldRoutes); // (Vamos atualizar esta a seguir para usar o middleware de auth)

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Algo correu mal no servidor.' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor seguro rodando na porta ${PORT}`);
});

// ... (código existente)
import contentRoutes from './routes/content.routes'; // <-- ADICIONA ISTO

// ... (middlewares existentes)

app.use('/api/auth', authRoutes);
app.use('/api/worlds', worldRoutes);
app.use('/api', contentRoutes); // <-- ADICIONA ISTO (As rotas já têm /worlds/... no nome)

// ... (resto do código)