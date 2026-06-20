// src/components/FeedbackButton.tsx
import { useState } from 'react';
import { MessageSquare, X, Send, CheckCircle } from 'lucide-react';

export default function FeedbackButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'success'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');

    try {
      // SUBSTITUI pelo teu endpoint do Formspree (pode ser o mesmo do contacto)
      await fetch('https://formspree.io/f/xwvdekea', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          name: 'Feedback Anónimo',
          email: 'feedback@granworldforge.com',
          message: `[FEEDBACK] ${feedback}`
        })
      });

      setStatus('success');
      setTimeout(() => {
        setIsOpen(false);
        setStatus('idle');
        setFeedback('');
      }, 2000);
    } catch (error) {
      setStatus('idle');
    }
  };

  return (
    <>
      {/* Botão Flutuante */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 bg-primary-600 hover:bg-primary-500 text-white p-4 rounded-full shadow-lg transition-all hover:scale-110 z-50"
          title="Dar Feedback"
        >
          <MessageSquare className="w-6 h-6" />
        </button>
      )}

      {/* Popup de Feedback */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-80 bg-dark-800 border border-gray-700 rounded-xl shadow-2xl z-50">
          {/* Header */}
          <div className="flex justify-between items-center p-4 border-b border-gray-700">
            <h3 className="text-lg font-bold text-white">Dar Feedback</h3>
            <button
              onClick={() => { setIsOpen(false); setStatus('idle'); setFeedback(''); }}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Conteúdo */}
          <div className="p-4">
            {status === 'success' ? (
              <div className="text-center py-4">
                <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-2" />
                <p className="text-green-400 font-semibold">Obrigado!</p>
                <p className="text-gray-400 text-sm mt-1">O teu feedback é muito importante.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3">
                <p className="text-gray-400 text-sm">
                  O que gostaste? O que podemos melhorar?
                </p>
                <textarea
                  required
                  rows={4}
                  className="input-field resize-none"
                  placeholder="Escreve o teu feedback aqui..."
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                />
                <button
                  type="submit"
                  disabled={status === 'sending'}
                  className="btn-primary w-full flex items-center justify-center gap-2"
                >
                  {status === 'sending' ? (
                    <>A enviar...</>
                  ) : (
                    <><Send className="w-4 h-4" /> Enviar</>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}