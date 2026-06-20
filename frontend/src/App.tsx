// src/App.tsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AuthPage from './pages/AuthPage';
import Dashboard from './pages/Dashboard';
import WorldEditor from './pages/WorldEditor';
import ContactPage from './pages/ContactPage'; // <-- NOVO
import FeedbackButton from './components/FeedbackButton'; // <-- NOVO

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem('gwf_token');
  if (!token) return <Navigate to="/" replace />;
  return <>{children}</>;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AuthPage />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/world/:worldId" element={<ProtectedRoute><WorldEditor /></ProtectedRoute>} />
        <Route path="/contact" element={<ProtectedRoute><ContactPage /></ProtectedRoute>} /> {/* <-- NOVO */}
      </Routes>
      
      {/* Botão de Feedback Flutuante (aparece em todas as páginas) */}
      <FeedbackButton />
    </Router>
  );
}

export default App;