// src/server.ts
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

// Importar rotas
import authRoutes from './routes/auth.routes';
import worldRoutes from './routes/world.routes';
import contentRoutes from './routes/content.routes';

// Carregar variáveis de ambiente
dotenv.config();

// Inicializar Express e Prisma
const app = express();
export const prisma = new PrismaClient();

// ============================================
// MIDDLEWARES (devem vir PRIMEIRO)
// ============================================

// Segurança
app.use(helmet());

// CORS - permitir frontend local e online
app.use(cors({ 
  origin: ['http://localhost:5173', 'https://granworldforge.vercel.app'],
  credentials: true 
}));

// Rate limiting (proteção contra DDoS)
const limiter = rateLimit({ 
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100 // máximo 100 pedidos por IP
});
app.use('/api/', limiter);

// Parse JSON
app.use(express.json());

// ============================================
// ROTAS (todas juntas, sem duplicação)
// ============================================

// Health check (para testar se o servidor está a correr)
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'GranWorldForge API is running',
    timestamp: new Date().toISOString()
  });
});

// Rotas de autenticação
app.use('/api/auth', authRoutes);

// Rotas de mundos
app.use('/api/worlds', worldRoutes);

// Rotas de conteúdo (raças, personagens, reinos, etc.)
app.use('/api', contentRoutes);

// ============================================
// TRATAMENTO DE ERROS (deve vir POR ÚLTIMO)
// ============================================

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('❌ Erro no servidor:', err.stack);
  res.status(500).json({ 
    error: 'Algo correu mal no servidor.',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// ============================================
// INICIAR SERVIDOR (deve vir no FIM)
// ============================================

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor seguro rodando na porta ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/api/health`);
});