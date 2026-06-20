// src/routes/world.routes.ts
import { Router } from 'express';
import { createWorldController, getUserWorldsController } from '../controllers/world.controller';
import { validate } from '../middlewares/validate';
import { authenticate } from '../middlewares/auth.middleware';
import { z } from 'zod';

const router = Router();

const createWorldSchema = z.object({
  name: z.string().min(3).max(100),
  description: z.string().max(2000).optional(),
  genre: z.string().max(50).optional()
});

//   ROTAS PROTEGIDAS: O 'authenticate' deve vir ANTES do controller
router.post('/', authenticate, validate(createWorldSchema), createWorldController);
router.get('/', authenticate, getUserWorldsController);

export default router;