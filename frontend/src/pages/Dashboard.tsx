// src/pages/Dashboard.tsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Globe, Plus, LogOut, Loader2, AlertCircle } from 'lucide-react';
import api from '../services/api';

interface World {
  id: string;
  name: string;
  genre?: string;
  isPublic: boolean;
  createdAt: string;
}

export default function Dashboard() {
  const [worlds, setWorlds] = useState<World[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [newWorld, setNewWorld] = useState({ name: '', genre: '', description: '' });
  const navigate = useNavigate();

  // 1. Buscar mundos ao carregar a página
  useEffect(() => {
    fetchWorlds();
  }, []);

  const fetchWorlds = async () => {
    try {
      const response = await api.get('/worlds');
      setWorlds(response.data.data);
    } catch (err: any) {
      setError('Erro ao carregar os mundos.');
    } finally {
      setLoading(false);
    }
  };

  // 2. Criar novo mundo
  const handleCreateWorld = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await api.post('/worlds', newWorld);
      setShowModal(false);
      setNewWorld({ name: '', genre: '', description: '' });
      fetchWorlds(); // Recarrega a lista
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erro ao criar o mundo.');
    }
  };

  // 3. Logout
  const handleLogout = () => {
    localStorage.removeItem('gwf_token');
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-primary-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-900 text-gray-100 p-8">
      {/* Cabeçalho */}
      <div className="flex justify-between items-center mb-8 max-w-6xl mx-auto">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-2">
            <Globe className="text-primary-500" /> Os Teus Mundos
          </h1>
          <p className="text-gray-400 mt-1">Gerencia as tuas criações e começa uma nova aventura.</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={() => setShowModal(true)}
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Novo Mundo
          </button>
          <button 
            onClick={handleLogout}
            className="bg-dark-800 hover:bg-dark-700 text-gray-300 px-4 py-2 rounded-lg border border-gray-700 transition-all flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" /> Sair
          </button>
        </div>
      </div>

      {/* Mensagem de Erro */}
      {error && (
        <div className="max-w-6xl mx-auto mb-6 p-4 bg-red-900/30 border border-red-800 rounded-lg flex items-center text-red-200">
          <AlertCircle className="w-5 h-5 mr-3 flex-shrink-0" />
          {error}
        </div>
      )}

      {/* Grelha de Mundos */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {worlds.length === 0 ? (
          <div className="col-span-full text-center py-16 bg-dark-800 rounded-xl border border-dashed border-gray-700">
            <Globe className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-300">Ainda não tens mundos</h3>
            <p className="text-gray-500 mt-2">Clica em "Novo Mundo" para começar a tua primeira criação.</p>
          </div>
        ) : (
          worlds.map((world) => (
            <div 
              key={world.id} 
              className="bg-dark-800 p-6 rounded-xl border border-gray-700 hover:border-primary-500 transition-all cursor-pointer group"
              onClick={() => navigate(`/world/${world.id}`)}
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-white group-hover:text-primary-400 transition-colors">
                  {world.name}
                </h3>
                <span className={`text-xs px-2 py-1 rounded-full ${world.isPublic ? 'bg-green-900/50 text-green-300' : 'bg-gray-700 text-gray-400'}`}>
                  {world.isPublic ? 'Público' : 'Privado'}
                </span>
              </div>
              <p className="text-gray-400 text-sm mb-4">{world.genre || 'Género não definido'}</p>
              <p className="text-gray-500 text-xs">
                Criado em {new Date(world.createdAt).toLocaleDateString('pt-PT')}
              </p>
            </div>
          ))
        )}
      </div>

      {/* Modal de Criar Mundo */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="bg-dark-800 rounded-xl border border-gray-700 p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold text-white mb-4">Criar Novo Mundo</h2>
            <form onSubmit={handleCreateWorld} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Nome do Mundo *</label>
                <input
                  type="text"
                  required
                  className="input-field"
                  placeholder="ex: Terra Média"
                  value={newWorld.name}
                  onChange={(e) => setNewWorld({ ...newWorld, name: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Género</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="ex: Fantasia Épica, Sci-Fi"
                  value={newWorld.genre}
                  onChange={(e) => setNewWorld({ ...newWorld, genre: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Descrição</label>
                <textarea
                  className="input-field h-24 resize-none"
                  placeholder="Uma breve descrição do teu mundo..."
                  value={newWorld.description}
                  onChange={(e) => setNewWorld({ ...newWorld, description: e.target.value })}
                />
              </div>
              <div className="flex gap-3 mt-6">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2 rounded-lg transition-all">
                  Cancelar
                </button>
                <button type="submit" className="flex-1 btn-primary">
                  Criar Mundo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}