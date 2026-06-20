// src/services/auth.service.ts
import { prisma } from '../server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// SEGURANÇA: Cost 12 é o padrão recomendado para 2026
const BCRYPT_ROUNDS = 12;
const JWT_SECRET = process.env.JWT_SECRET || 'super_secreto_mude_isso_em_producao';

export const registerUser = async (username: string, email: string, password: string) => {
  // 1. Verificar se o email já existe
  const existingUser = await prisma.user.findUnique({ 
    where: { email },
    // Já buscamos apenas o necessário para a verificação
    select: { id: true } 
  });
  
  if (existingUser) {
    throw new Error('Este email já está registado.');
  }

  // 2. Encriptar a password com segurança reforçada (12 rounds)
  const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);

  // 3. Criar o utilizador na base de dados
  const newUser = await prisma.user.create({
    data: { username, email, passwordHash },
    // SEGURANÇA CRÍTICA: Devolver apenas dados seguros para o frontend
    select: {
      id: true,
      username: true,
      email: true,
      createdAt: true
    }
  });

  // 4. Gerar o Token JWT
  const token = jwt.sign({ userId: newUser.id }, JWT_SECRET, { expiresIn: '7d' });

  return { user: newUser, token };
};

export const loginUser = async (email: string, password: string) => {
  // 1. Procurar o utilizador (PRECISAMOS do passwordHash aqui para comparar!)
  const user = await prisma.user.findUnique({ 
    where: { email } 
  });

  if (!user) {
    // Mensagem genérica para não revelar se o email existe ou não (boa prática de segurança)
    throw new Error('Email ou password incorretos.');
  }

  // 2. Verificar a password
  const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
  if (!isPasswordValid) {
    throw new Error('Email ou password incorretos.');
  }

  // 3. Gerar o Token JWT
  const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });

  // 4. SEGURANÇA CRÍTICA: Montar a resposta SEM o passwordHash
  const safeUser = {
    id: user.id,
    username: user.username,
    email: user.email,
    createdAt: user.createdAt
  };

  return { user: safeUser, token };
};