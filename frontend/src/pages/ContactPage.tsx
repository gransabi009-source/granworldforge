// src/pages/ContactPage.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, Send, CheckCircle } from 'lucide-react';

export default function ContactPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');

    try {
      // SUBSTITUI pelo teu endpoint do Formspree
      const response = await fetch('https://formspree.io/f/xwvdekea', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setStatus('success');
        setFormData({ name: '', email: '', message: '' });
      } else {
        setStatus('error');
      }
    } catch (error) {
      setStatus('error');
    }
  };

  return (
    <div className="min-h-screen bg-dark-900 text-gray-100 p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <button 
          onClick={() => navigate('/dashboard')} 
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8"
        >
          <ArrowLeft className="w-5 h-5" /> Voltar ao Dashboard
        </button>

        <div className="bg-dark-800 rounded-2xl border border-gray-700 p-8">
          <div className="text-center mb-8">
            <Mail className="w-12 h-12 text-primary-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-white mb-2">Contacta-nos</h1>
            <p className="text-gray-400">
              Tens uma dúvida, sugestão ou problema? Envia-nos uma mensagem!
            </p>
          </div>

          {/* Mensagens de Status */}
          {status === 'success' && (
            <div className="mb-6 p-4 bg-green-900/30 border border-green-800 rounded-lg flex items-center text-green-200">
              <CheckCircle className="w-5 h-5 mr-3" />
              Mensagem enviada com sucesso! Responderemos em breve.
            </div>
          )}

          {status === 'error' && (
            <div className="mb-6 p-4 bg-red-900/30 border border-red-800 rounded-lg text-red-200">
              Erro ao enviar. Tenta novamente ou envia email diretamente para placido@email.com
            </div>
          )}

          {/* Formulário */}
          {status !== 'success' && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Nome</label>
                <input
                  type="text"
                  required
                  className="input-field"
                  placeholder="O teu nome"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
                <input
                  type="email"
                  required
                  className="input-field"
                  placeholder="teu@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Mensagem</label>
                <textarea
                  required
                  rows={6}
                  className="input-field resize-none"
                  placeholder="Escreve a tua mensagem aqui..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                />
              </div>

              <button
                type="submit"
                disabled={status === 'sending'}
                className="btn-primary w-full flex items-center justify-center gap-2"
              >
                {status === 'sending' ? (
                  <>A enviar...</>
                ) : (
                  <><Send className="w-4 h-4" /> Enviar Mensagem</>
                )}
              </button>
            </form>
          )}

          {/* Informações de Contacto Alternativas */}
          <div className="mt-8 pt-8 border-t border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-4">Outras Formas de Contacto</h3>
            <div className="space-y-3 text-gray-400">
              <p>
                <strong className="text-gray-300">Email direto:</strong>{' '}
                <a href="mailto:placido@email.com" className="text-primary-500 hover:text-primary-400">
                  placido@email.com
                </a>
              </p>
              <p>
                <strong className="text-gray-300">Discord:</strong>{' '}
                <a href="https://discord.gg/granworldforge" target="_blank" rel="noopener noreferrer" className="text-primary-500 hover:text-primary-400">
                  discord.gg/granworldforge
                </a>
              </p>
              <p>
                <strong className="text-gray-300">GitHub:</strong>{' '}
                <a href="https://github.com/placido/granworldforge" target="_blank" rel="noopener noreferrer" className="text-primary-500 hover:text-primary-400">
                  github.com/placido/granworldforge
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 