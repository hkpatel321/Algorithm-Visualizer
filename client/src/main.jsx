import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import Chat from './components/Chat/Chat.jsx';
import VisualiseHero from './components/VisualiseHero/VisualiseHero.jsx';
import Login from './components/Auth/Login.jsx';
import Signup from './components/Auth/Signup.jsx';
import ChatHistory from './components/Chat/ChatHistory.jsx';
import Layout from './components/Layout/Layout.jsx';
import { AuthProvider } from './context/AuthContext';
import Footer from './components/Footer/Footer';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Navigate to="/visualize" replace />} />
            <Route path="/visualize" element={<VisualiseHero />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/chat-history" element={<ChatHistory />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </Layout>
        <Footer />
      </BrowserRouter>
    </AuthProvider>
  </StrictMode>,
);
