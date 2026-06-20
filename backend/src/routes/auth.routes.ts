// src/routes/auth.routes.ts
import { Router } from 'express';
import { registerController, loginController } from '../controllers/auth.controller';
import { validate } from '../middlewares/validate';
import { z } from 'zod';

const router = Router();

// Schema para Registo
const registerSchema = z.object({
  username: z.string().min(3, 'O nome de utilizador deve ter pelo menos 3 caracteres').max(30),
  email: z.string().email('Formato de email inválido'),
  password: z.string().min(6, 'A password deve ter pelo menos 6 caracteres')
});

// Schema para Login
const loginSchema = z.object({
  email: z.string().email('Formato de email inválido'),
  password: z.string().min(1, 'A password é obrigatória')
});

router.post('/register', validate(registerSchema), registerController);
router.post('/login', validate(loginSchema), loginController);

export default router;