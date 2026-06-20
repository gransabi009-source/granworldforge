// src/services/api.ts
import axios from 'axios';

// A URL do teu backend (ajusta se estiveres em produção no futuro)
const API_URL = 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// INTERCEPTOR: Adiciona o Token a TODOS os pedidos automaticamente
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('gwf_token'); // 'gwf' = GranWorldForge
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// INTERCEPTOR: Trata erros de autenticação (ex: token expirado)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Se o token for inválido, limpa o storage e redireciona para login
      localStorage.removeItem('gwf_token');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export default api;