// src/services/api.ts
import axios from 'axios';

// URL do backend - funciona em produção e local
const API_URL = 'https://granworldforge-backend.onrender.com/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// INTERCEPTOR: Adiciona o Token a TODOS os pedidos automaticamente
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('gwf_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// INTERCEPTOR: Trata erros de autenticação
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('gwf_token');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export default api;