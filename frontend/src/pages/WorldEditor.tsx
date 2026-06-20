// src/pages/WorldEditor.tsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Users, Sword, Briefcase, Crown, MapPin, Scroll, Zap, Calendar, Plus, Loader2 } from 'lucide-react';
import api from '../services/api';

type Tab = 'races' | 'characters' | 'professions' | 'kingdoms' | 'locations' | 'events' | 'lore' | 'simulator';

export default function WorldEditor() {
  const { worldId } = useParams<{ worldId: string }>();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState<Tab>('races');
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<any>({});
  
  // Estado do Simulador
  const [simData, setSimData] = useState({ factionA_Id: '', factionB_Id: '', scale: 'REGION', intensity: 5 });
  const [simResult, setSimResult] = useState<any>(null);

    // Estados para dropdowns de Personagens
  const [races, setRaces] = useState<any[]>([]);
  const [professions, setProfessions] = useState<any[]>([]);

  const [editingItem, setEditingItem] = useState<any>(null);

  useEffect(() => {
    if (!worldId) return;
    fetchData();
  }, [activeTab, worldId]);

    // Buscar Raças e Profissões quando abre a aba de Personagens
  useEffect(() => {
    if (activeTab === 'characters' && worldId) {
      fetchRacesAndProfessions();
    }
  }, [activeTab, worldId]);

  const fetchRacesAndProfessions = async () => {
    try {
      const [racesRes, professionsRes] = await Promise.all([
        api.get(`/worlds/${worldId}/races`),
        api.get(`/worlds/${worldId}/professions`)
      ]);
      setRaces(racesRes.data.data || []);
      setProfessions(professionsRes.data.data || []);
    } catch (err) {
      console.error("Erro ao buscar raças/profissões:", err);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    setShowForm(false);
    setFormData({});
    setSimResult(null);
    try {
      let endpoint = '';
            switch (activeTab) {
        case 'races': endpoint = `/worlds/${worldId}/races`; break;
        case 'characters': endpoint = `/worlds/${worldId}/characters`; break;
        case 'professions': endpoint = `/worlds/${worldId}/professions`; break; // <-- ADICIONA ISTO
        case 'kingdoms': endpoint = `/worlds/${worldId}/kingdoms`; break;
        case 'locations': endpoint = `/worlds/${worldId}/locations`; break;
        case 'events': endpoint = `/worlds/${worldId}/events`; break;
        case 'lore': endpoint = `/worlds/${worldId}/lore`; break;
      }
      if (endpoint) {
        const response = await api.get(endpoint);
        setData(response.data.data || []);
      }
    } catch (err) {
      console.error("Erro ao buscar dados:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let endpoint = '';
        if (activeTab === 'races') endpoint = `/worlds/${worldId}/races`;
        else if (activeTab === 'characters') endpoint = `/worlds/${worldId}/characters`;
        else if (activeTab === 'professions') endpoint = `/worlds/${worldId}/professions`; // <-- ADICIONA ISTO
        else if (activeTab === 'kingdoms') endpoint = `/worlds/${worldId}/kingdoms`;
        else if (activeTab === 'locations') endpoint = `/worlds/${worldId}/locations`;
        else if (activeTab === 'events') endpoint = `/worlds/${worldId}/events`;
        else if (activeTab === 'lore') endpoint = `/worlds/${worldId}/lore`;

      await api.post(endpoint, formData);
      setShowForm(false);
      setFormData({});
      fetchData();
    } catch (err: any) {
      alert("Erro ao criar: " + (err.response?.data?.error || "Erro desconhecido"));
    }
  };

  const handleSimulate = async () => {
    setLoading(true);
    try {
      const response = await api.post(`/worlds/${worldId}/simulate/conflict`, simData);
      setSimResult(response.data);
    } catch (err: any) {
      alert("Erro na simulação: " + (err.response?.data?.error || "Erro desconhecido"));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Tens a certeza que queres apagar este item? Esta ação não pode ser revertida.')) return;
    
    try {
      let endpoint = '';
      if (activeTab === 'races') endpoint = `/races/${id}`;
      else if (activeTab === 'characters') endpoint = `/characters/${id}`;
      else if (activeTab === 'professions') endpoint = `/professions/${id}`;
      else if (activeTab === 'kingdoms') endpoint = `/kingdoms/${id}`;
      else if (activeTab === 'locations') endpoint = `/locations/${id}`;
      else if (activeTab === 'events') endpoint = `/events/${id}`;
      else if (activeTab === 'lore') endpoint = `/lore/${id}`;

      await api.delete(endpoint);
      fetchData();
    } catch (err: any) {
      alert("Erro ao apagar: " + (err.response?.data?.error || "Erro desconhecido"));
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    try {
      let endpoint = '';
      if (activeTab === 'races') endpoint = `/races/${editingItem.id}`;
      else if (activeTab === 'characters') endpoint = `/characters/${editingItem.id}`;
      else if (activeTab === 'professions') endpoint = `/professions/${editingItem.id}`;
      else if (activeTab === 'kingdoms') endpoint = `/kingdoms/${editingItem.id}`;
      else if (activeTab === 'locations') endpoint = `/locations/${editingItem.id}`;
      else if (activeTab === 'events') endpoint = `/events/${editingItem.id}`;
      else if (activeTab === 'lore') endpoint = `/lore/${editingItem.id}`;

      await api.put(endpoint, formData);
      setEditingItem(null);
      setFormData({});
      fetchData();
    } catch (err: any) {
      alert("Erro ao atualizar: " + (err.response?.data?.error || "Erro desconhecido"));
    }
  };

  // Formulários específicos para cada aba
  const renderForm = () => {
    if (!showForm && !editingItem) return null;

    const isEditing = !!editingItem;
    const onSubmit = isEditing ? handleUpdate : handleSubmit;

    return (
      <form onSubmit={onSubmit} className="bg-dark-800 p-6 rounded-xl border border-primary-500/50 mb-6 space-y-4">
        <h3 className="text-lg font-bold text-white">{isEditing ? 'Editar' : 'Novo'} Registo</h3>

        {/* O resto do formulário continua igual... */}

        {/* CAMPO NOME (comum a quase tudo) */}
        {activeTab !== 'events' && (
          <input 
            className="input-field" 
            placeholder="Nome" 
            required 
            value={formData.name || ''} 
            onChange={e => setFormData({...formData, name: e.target.value})} 
          />
        )}

        {/* CAMPOS ESPECÍFICOS POR ABA */}
        {activeTab === 'races' && (
          <>
            <textarea 
              className="input-field h-24 resize-none" 
              placeholder="Descrição da raça (aspecto, cultura, história)..." 
              value={formData.description || ''} 
              onChange={e => setFormData({...formData, description: e.target.value})} 
            />
            <input 
              className="input-field" 
              placeholder='Traços (ex: ["Visão Noturna", "+2 Força"])' 
              value={formData.traits || ''} 
              onChange={e => setFormData({...formData, traits: e.target.value})} 
            />
          </>
        )}

        {activeTab === 'professions' && (
          <>
            <textarea 
              className="input-field h-24 resize-none" 
              placeholder="Descrição da profissão (o que fazem, como vivem)..." 
              value={formData.description || ''} 
              onChange={e => setFormData({...formData, description: e.target.value})} 
            />
            <input 
              className="input-field" 
              placeholder='Habilidades típicas (ex: ["Forja", "Magia de Fogo"])' 
              value={formData.typicalSkills || ''} 
              onChange={e => setFormData({...formData, typicalSkills: e.target.value})} 
            />
            <input 
              className="input-field" 
              placeholder="Requisitos (ex: 'Força 13', 'Treinamento de 5 anos')" 
              value={formData.requirements || ''} 
              onChange={e => setFormData({...formData, requirements: e.target.value})} 
            />
          </>
        )}

        {activeTab === 'characters' && (
          <>
            {/* DROPDOWN DE RAÇA */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Raça</label>
              <select 
                className="input-field" 
                value={formData.raceId || ''} 
                onChange={e => setFormData({...formData, raceId: e.target.value})}
              >
                <option value="">Seleciona uma raça...</option>
                {races.map(race => (
                  <option key={race.id} value={race.id}>{race.name}</option>
                ))}
              </select>
              {races.length === 0 && (
                <p className="text-yellow-400 text-xs mt-1">
                  ⚠️ Cria raças na aba "Raças" primeiro
                </p>
              )}
            </div>

            {/* DROPDOWN DE PROFISSÃO */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Profissão</label>
              <select 
                className="input-field" 
                value={formData.professionId || ''} 
                onChange={e => setFormData({...formData, professionId: e.target.value})}
              >
                <option value="">Seleciona uma profissão...</option>
                {professions.map(prof => (
                  <option key={prof.id} value={prof.id}>{prof.name}</option>
                ))}
              </select>
              {professions.length === 0 && (
                <p className="text-yellow-400 text-xs mt-1">
                  ⚠️ Cria profissões na aba "Profissões" primeiro
                </p>
              )}
            </div>

            <input 
              className="input-field" 
              placeholder="Idade (ex: 25, 'Imortal')" 
              value={formData.age || ''} 
              onChange={e => setFormData({...formData, age: e.target.value})} 
            />
            <input 
              className="input-field" 
              placeholder="Alinhamento (ex: Leal e Bom, Caótico e Mau)" 
              value={formData.alignment || ''} 
              onChange={e => setFormData({...formData, alignment: e.target.value})} 
            />
            <textarea 
              className="input-field h-24 resize-none" 
              placeholder="Descrição e história do personagem..." 
              value={formData.description || ''} 
              onChange={e => setFormData({...formData, description: e.target.value})} 
            />
            <input 
              className="input-field" 
              placeholder='Habilidades (ex: {"espada": 8, "magia": 5})' 
              value={formData.skills || ''} 
              onChange={e => setFormData({...formData, skills: e.target.value})} 
            />
          </>
        )}

        {activeTab === 'kingdoms' && (
          <>
            <textarea 
              className="input-field h-24 resize-none" 
              placeholder="Descrição do reino..." 
              value={formData.description || ''} 
              onChange={e => setFormData({...formData, description: e.target.value})} 
            />
            <input 
              className="input-field" 
              placeholder="Tipo de Governo (ex: Monarquia, República, Teocracia)" 
              value={formData.governmentType || ''} 
              onChange={e => setFormData({...formData, governmentType: e.target.value})} 
            />
          </>
        )}

        {activeTab === 'locations' && (
          <>
            <textarea 
              className="input-field h-24 resize-none" 
              placeholder="Descrição do local..." 
              value={formData.description || ''} 
              onChange={e => setFormData({...formData, description: e.target.value})} 
            />
            <input 
              className="input-field" 
              placeholder="Tipo (ex: Cidade, Floresta, Montanha, Taverna)" 
              value={formData.type || ''} 
              onChange={e => setFormData({...formData, type: e.target.value})} 
            />
          </>
        )}

        {activeTab === 'events' && (
          <>
            <input 
              className="input-field" 
              placeholder="Nome do Evento (ex: A Grande Batalha)" 
              required
              value={formData.name || ''} 
              onChange={e => setFormData({...formData, name: e.target.value})} 
            />
            <textarea 
              className="input-field h-24 resize-none" 
              placeholder="O que aconteceu neste evento?" 
              required
              value={formData.description || ''} 
              onChange={e => setFormData({...formData, description: e.target.value})} 
            />
            <div className="grid grid-cols-3 gap-2">
              <input 
                type="number"
                className="input-field" 
                placeholder="Ano" 
                value={formData.year || ''} 
                onChange={e => setFormData({...formData, year: Number(e.target.value)})} 
              />
              <input 
                type="number"
                className="input-field" 
                placeholder="Mês" 
                value={formData.month || ''} 
                onChange={e => setFormData({...formData, month: Number(e.target.value)})} 
              />
              <input 
                type="number"
                className="input-field" 
                placeholder="Dia" 
                value={formData.day || ''} 
                onChange={e => setFormData({...formData, day: Number(e.target.value)})} 
              />
            </div>
          </>
        )}

        {activeTab === 'lore' && (
          <>
            <select 
              className="input-field" 
              value={formData.category || ''} 
              onChange={e => setFormData({...formData, category: e.target.value})} 
              required
            >
              <option value="">Selecione a Categoria...</option>
              <option value="DEITY">Deidade</option>
              <option value="SPELL">Feitiço/Poder</option>
              <option value="ITEM">Item/Artefato</option>
              <option value="LAW">Lei/Conceito</option>
              <option value="RELIGION">Religião</option>
              <option value="LANGUAGE">Idioma</option>
              <option value="CUSTOM">Outro</option>
            </select>
            <textarea 
              className="input-field h-24 resize-none" 
              placeholder="Descrição detalhada..." 
              required
              value={formData.description || ''} 
              onChange={e => setFormData({...formData, description: e.target.value})} 
            />
          </>
        )}

        {/* BOTÕES */}
        <div className="flex gap-3">
          <button 
            type="button" 
            onClick={() => { setShowForm(false); setEditingItem(null); setFormData({}); }} 
            className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2 rounded-lg">
            Cancelar
          </button>
          <button type="submit" className="flex-1 btn-primary">Guardar</button>
        </div>
      </form>
    );
  };

  // Renderização da aba Simulador
    // Estado para guardar as listas de Reinos e Locais
  const [kingdoms, setKingdoms] = useState<any[]>([]);
  const [locations, setLocations] = useState<any[]>([]);

  // Nova função para buscar Reinos e Locais quando abre o Simulador
  useEffect(() => {
    if (activeTab === 'simulator' && worldId) {
      fetchFactions();
    }
  }, [activeTab, worldId]);

  const fetchFactions = async () => {
    try {
      const [kingdomsRes, locationsRes] = await Promise.all([
        api.get(`/worlds/${worldId}/kingdoms`),
        api.get(`/worlds/${worldId}/locations`)
      ]);
      setKingdoms(kingdomsRes.data.data || []);
      setLocations(locationsRes.data.data || []);
    } catch (err) {
      console.error("Erro ao buscar facções:", err);
    }
  };

  // Renderização da aba Simulador (ATUALIZADA COM DROPDOWNS)
  const renderSimulator = () => (
    <div className="space-y-6">
      <div className="bg-dark-800 p-6 rounded-xl border border-gray-700">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <Zap className="text-yellow-500"/> Simulador de Conflitos
        </h3>
        <p className="text-gray-400 text-sm mb-4">
          Seleciona duas facções e gera uma guerra com efeitos dominó automáticos.
        </p>
        
        {/* VERIFICA SE HÁ FACÇÕES DISPONÍVEIS */}
        {kingdoms.length === 0 && locations.length === 0 ? (
          <div className="bg-yellow-900/20 border border-yellow-800 p-4 rounded-lg">
            <p className="text-yellow-200">
              ⚠️ Precisas de criar pelo menos 2 Reinos ou Locais antes de usar o simulador.
            </p>
            <p className="text-yellow-300 text-sm mt-2">
              Vai às abas "Reinos" ou "Locais" e cria alguns primeiro!
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {/* DROPDOWN FÇÃO A */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Fação A (Atacante)</label>
                <select 
                  className="input-field" 
                  value={simData.factionA_Id} 
                  onChange={e => setSimData({...simData, factionA_Id: e.target.value})}
                >
                  <option value="">Seleciona uma facção...</option>
                  {kingdoms.length > 0 && (
                    <optgroup label="Reinos">
                      {kingdoms.map(k => (
                        <option key={k.id} value={k.id}>👑 {k.name}</option>
                      ))}
                    </optgroup>
                  )}
                  {locations.length > 0 && (
                    <optgroup label="Locais">
                      {locations.map(l => (
                        <option key={l.id} value={l.id}>📍 {l.name}</option>
                      ))}
                    </optgroup>
                  )}
                </select>
              </div>

              {/* DROPDOWN FÇÃO B */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Fação B (Defensor)</label>
                <select 
                  className="input-field" 
                  value={simData.factionB_Id} 
                  onChange={e => setSimData({...simData, factionB_Id: e.target.value})}
                >
                  <option value="">Seleciona uma facção...</option>
                  {kingdoms.length > 0 && (
                    <optgroup label="Reinos">
                      {kingdoms.map(k => (
                        <option key={k.id} value={k.id}>👑 {k.name}</option>
                      ))}
                    </optgroup>
                  )}
                  {locations.length > 0 && (
                    <optgroup label="Locais">
                      {locations.map(l => (
                        <option key={l.id} value={l.id}>📍 {l.name}</option>
                      ))}
                    </optgroup>
                  )}
                </select>
              </div>

              {/* ESCALA */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Escala do Conflito</label>
                <select 
                  className="input-field" 
                  value={simData.scale} 
                  onChange={e => setSimData({...simData, scale: e.target.value})}
                >
                  <option value="VILLAGE">🏘️ Aldeia (Local)</option>
                  <option value="CITY">🏙️ Cidade (Urbano)</option>
                  <option value="REGION">🗺️ Região (Provincial)</option>
                  <option value="CONTINENT">🌍 Continente (Nacional)</option>
                  <option value="PLANETARY">🪐 Planetário (Global)</option>
                </select>
              </div>

              {/* INTENSIDADE */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Intensidade (1-10)</label>
                <input 
                  type="number" 
                  min="1" 
                  max="10" 
                  className="input-field" 
                  placeholder="5" 
                  value={simData.intensity} 
                  onChange={e => setSimData({...simData, intensity: Number(e.target.value)})} 
                />
              </div>
            </div>

            <button 
              onClick={handleSimulate} 
              disabled={loading || !simData.factionA_Id || !simData.factionB_Id}
              className="btn-primary w-full flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin"/> : <Zap className="w-4 h-4"/>} 
              Gerar Conflito e Efeitos Dominó
            </button>
          </>
        )}
      </div>

      {/* RESULTADO DA SIMULAÇÃO (igual ao anterior) */}
            {simResult && (
        <div className="space-y-6">
          {/* RESUMO DA SIMULAÇÃO */}
          <div className="bg-gradient-to-br from-primary-900/30 to-dark-800 border border-primary-500/50 p-6 rounded-xl">
            <h4 className="text-primary-400 font-bold text-xl mb-4 flex items-center gap-2">
              <Zap className="w-6 h-6" /> Simulação Concluída!
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div className="bg-dark-900/50 p-3 rounded-lg">
                <p className="text-gray-400 text-xs">Vencedor</p>
                <p className="text-white font-bold">{simResult.data.summary.vencedor}</p>
              </div>
              <div className="bg-dark-900/50 p-3 rounded-lg">
                <p className="text-gray-400 text-xs">Perdedor</p>
                <p className="text-white font-bold">{simResult.data.summary.perdedor}</p>
              </div>
              <div className="bg-dark-900/50 p-3 rounded-lg">
                <p className="text-gray-400 text-xs">Severidade</p>
                <p className="text-red-400 font-bold">{simResult.data.summary.severidade}</p>
              </div>
              <div className="bg-dark-900/50 p-3 rounded-lg">
                <p className="text-gray-400 text-xs">Duração</p>
                <p className="text-yellow-400 font-bold">{simResult.data.summary.duracao}</p>
              </div>
            </div>
            <p className="text-gray-300">{simResult.message}</p>
          </div>

          {/* EVENTO PRINCIPAL */}
          <div className="bg-dark-800 border border-gray-700 p-6 rounded-xl">
            <h5 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-yellow-500" /> Evento Principal
            </h5>
            <h6 className="text-xl font-bold text-primary-400 mb-2">{simResult.data.mainEvent.name}</h6>
            <p className="text-gray-400">{simResult.data.mainEvent.description}</p>
          </div>

          {/* EFEITOS DOMINÓ */}
          <div>
            <h5 className="text-lg font-bold text-white mb-4">
              Efeitos Dominó ({simResult.data.rippleEffects.length} criados)
            </h5>
            <div className="space-y-4">
              {simResult.data.rippleEffects.map((effect: any, idx: number) => (
                <div key={idx} className="bg-dark-800 border border-gray-700 p-5 rounded-xl hover:border-primary-500/50 transition-all">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <h6 className="text-lg font-bold text-white">{effect.name}</h6>
                        <span className="text-xs bg-primary-900 text-primary-300 px-2 py-1 rounded font-semibold">
                          {effect.category}
                        </span>
                        <span className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded">
                          {effect.scale}
                        </span>
                      </div>
                      <p className="text-gray-400 text-sm">{effect.description}</p>
                    </div>
                  </div>

                  {/* DADOS DETALHADOS */}
                  {effect.customData && Object.keys(effect.customData).length > 0 && (
                    <div className="mt-4 pt-4 border-t border-gray-700">
                      <p className="text-xs text-gray-500 font-semibold mb-2">DETALHES:</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {Object.entries(effect.customData).map(([key, value]) => (
                          <div key={key} className="bg-dark-900/50 p-2 rounded">
                            <span className="text-gray-500 text-xs capitalize">
                              {key.replace(/_/g, ' ')}:
                            </span>
                            <span className="text-gray-300 text-sm ml-2">
                              {Array.isArray(value) ? value.join(', ') : String(value)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* TAGS */}
                  {effect.tags && effect.tags.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {effect.tags.map((tag: string, tagIdx: number) => (
                        <span key={tagIdx} className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // Renderização do conteúdo das outras abas
  const renderContent = () => {
    if (loading && !simResult) {
      return <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 text-primary-500 animate-spin" /></div>;
    }

    if (activeTab === 'simulator') return renderSimulator();

    const tabLabels: Record<Tab, string> = {
      races: 'Raça',
      characters: 'Personagem',
      professions: 'Profissão', // <-- ADICIONA ISTO
      kingdoms: 'Reino',
      locations: 'Local',
      events: 'Evento',
      lore: 'Conceito',
      simulator: 'Simulador'
    };

    return (
      <div className="space-y-4">
        {!showForm && (
          <button onClick={() => setShowForm(true)} className="btn-primary flex items-center gap-2 mb-4">
            <Plus className="w-4 h-4" /> Adicionar {tabLabels[activeTab]}
          </button>
        )}

        {renderForm()}

        <div className="grid gap-4">
          {data.length === 0 ? (
            <p className="text-gray-500 text-center py-8">Nenhum registo encontrado. Cria o primeiro!</p>
          ) : (
            data.map((item: any) => (
                              <div key={item.id} className="bg-dark-800 p-4 rounded-lg border border-gray-700 hover:border-gray-600 transition-all">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h4 className="text-lg font-bold text-white">{item.name}</h4>
                      {item.category && (
                        <span className="text-xs bg-primary-900 text-primary-300 px-2 py-0.5 rounded">
                          {item.category}
                        </span>
                      )}
                      {item.governmentType && (
                        <span className="text-xs bg-purple-900 text-purple-300 px-2 py-0.5 rounded">
                          {item.governmentType}
                        </span>
                      )}
                      {item.year && (
                        <span className="text-xs bg-yellow-900 text-yellow-300 px-2 py-0.5 rounded">
                          Ano {item.year}{item.month ? `/${item.month}` : ''}{item.day ? `/${item.day}` : ''}
                        </span>
                      )}
                      {item.race && (
                        <span className="text-xs bg-blue-900 text-blue-300 px-2 py-0.5 rounded">
                          🧬 {item.race.name}
                        </span>
                      )}
                      {item.profession && (
                        <span className="text-xs bg-green-900 text-green-300 px-2 py-0.5 rounded">
                          ⚔️ {item.profession.name}
                        </span>
                      )}
                    </div>
                    {item.description && (
                      <p className="text-gray-400 text-sm mt-2 whitespace-pre-wrap">{item.description}</p>
                    )}
                    {item.age && (
                      <p className="text-gray-500 text-xs mt-1">Idade: {item.age}</p>
                    )}
                    {item.alignment && (
                      <p className="text-gray-500 text-xs mt-1">Alinhamento: {item.alignment}</p>
                    )}
                    {item.traits && (
                      <p className="text-blue-400 text-xs mt-2">
                        Traços: {typeof item.traits === 'string' ? item.traits : JSON.stringify(item.traits)}
                      </p>
                    )}
                    {item.skills && (
                      <p className="text-yellow-500 text-xs mt-2 font-mono">
                        Habilidades: {typeof item.skills === 'string' ? item.skills : JSON.stringify(item.skills)}
                      </p>
                    )}
                  </div>
                  
                  {/* BOTÕES DE EDITAR E APAGAR */}
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => {
                        setEditingItem(item);
                        setFormData(item);
                        setShowForm(false);
                      }}
                      className="p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-900/20 rounded transition-colors"
                      title="Editar"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-2 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded transition-colors"
                      title="Apagar"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                      </svg>
                    </button>
                  </div>
                </div>
            </div>
              
            ))
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-dark-900 text-gray-100">
      {/* Cabeçalho */}
      <div className="bg-dark-800 border-b border-gray-700 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <button 
            onClick={() => navigate('/dashboard')} 
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" /> Voltar ao Dashboard
          </button>
          <h1 className="text-xl font-bold text-white">Editor de Mundo</h1>
          <div className="w-24"></div>
        </div>

        {/* Abas */}
        <div className="max-w-5xl mx-auto px-4 flex gap-1 overflow-x-auto">
            {[
                { id: 'races', label: 'Raças', icon: Users },
                { id: 'characters', label: 'Personagens', icon: Sword },
                { id: 'professions', label: 'Profissões', icon: Briefcase },
                { id: 'kingdoms', label: 'Reinos', icon: Crown },
                { id: 'locations', label: 'Locais', icon: MapPin },
                { id: 'events', label: 'Eventos', icon: Calendar },
                { id: 'lore', label: 'Lore', icon: Scroll },
                { id: 'simulator', label: 'Simulador', icon: Zap },
            ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as Tab)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === tab.id 
                  ? 'border-primary-500 text-primary-400' 
                  : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-600'
              }`}
            >
              <tab.icon className="w-4 h-4" /> {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Conteúdo */}
      <div className="max-w-5xl mx-auto px-4 py-8">
        {renderContent()}
      </div>
    </div>
  );
}