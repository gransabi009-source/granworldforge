// src/pages/AuthPage.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ScrollText, UserPlus, LogIn, AlertCircle } from 'lucide-react';
import api from '../services/api';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const endpoint = isLogin ? '/auth/login' : '/auth/register';
      // No registo enviamos os 3 campos, no login apenas email e password
      const payload = isLogin 
        ? { email: formData.email, password: formData.password }
        : formData;

      const response = await api.post(endpoint, payload);
      
      // GUARDAR O TOKEN (A chave para o reino!)
      localStorage.setItem('gwf_token', response.data.data.token);
      
      // Redirecionar para o Dashboard (que vamos criar a seguir)
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Ocorreu um erro. Tenta novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-900 px-4">
      <div className="max-w-md w-full bg-dark-800 rounded-2xl shadow-2xl border border-gray-700 p-8">
        
        {/* Cabeçalho */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <ScrollText className="w-12 h-12 text-primary-500" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">GranWorldForge</h1>
          <p className="text-gray-400">
            {isLogin ? 'Entra no teu mundo' : 'Começa a criar o teu universo'}
          </p>
        </div>

        {/* Mensagem de Erro */}
        {error && (
          <div className="mb-4 p-3 bg-red-900/30 border border-red-800 rounded-lg flex items-center text-red-200 text-sm">
            <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
            {error}
          </div>
        )}

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Nome de Utilizador</label>
              <input
                type="text"
                required
                className="input-field"
                placeholder="ex: MestreDosDragoes"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
            <input
              type="email"
              required
              className="input-field"
              placeholder="criador@exemplo.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Password</label>
            <input
              type="password"
              required
              className="input-field"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full flex items-center justify-center mt-6"
          >
            {loading ? (
              <span className="animate-pulse">A processar...</span>
            ) : isLogin ? (
              <><LogIn className="w-4 h-4 mr-2" /> Entrar</>
            ) : (
              <><UserPlus className="w-4 h-4 mr-2" /> Criar Conta</>
            )}
          </button>
        </form>

        {/* Alternar entre Login e Registo */}
        <div className="mt-6 text-center">
          <p className="text-gray-400 text-sm">
            {isLogin ? 'Ainda não tens conta?' : 'Já tens uma conta?'}
            <button
              onClick={() => { setIsLogin(!isLogin); setError(''); }}
              className="ml-2 text-primary-500 hover:text-primary-400 font-semibold transition-colors"
            >
              {isLogin ? 'Regista-te aqui' : 'Faz login aqui'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}