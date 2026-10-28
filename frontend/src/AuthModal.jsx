import React, { useState } from 'react';
import { Mail, Lock, X, AlertCircle } from 'lucide-react';

export default function AuthModal({ isOpen, onClose, onAuthSuccess }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  // Login Social (Google / Apple)
  const handleOAuthLogin = (provider) => {
    setLoading(true);
    setErrorMessage('');

    setTimeout(() => {
      const demoToken = `token_${provider}_${Date.now()}`;
      onAuthSuccess(demoToken);
      setLoading(false);
      onClose();
      alert(`Sessão iniciada com sucesso via ${provider === 'google' ? 'Google' : 'Apple'}!`);
    }, 600);
  };

  // Login / Registo com Email
  const handleEmailAuth = (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    setTimeout(() => {
      const demoToken = `token_email_${Date.now()}`;
      onAuthSuccess(demoToken);
      setLoading(false);
      onClose();
      alert(isSignUp ? 'Conta criada com sucesso!' : 'Sessão iniciada com sucesso!');
    }, 600);
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      backgroundColor: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px'
    }}>
      <div style={{
        background: '#0f172a', border: '1px solid #1e293b', borderRadius: '16px',
        width: '100%', maxWidth: '420px', padding: '28px', position: 'relative', color: '#f8fafc'
      }}>
        <button 
          onClick={onClose}
          style={{ position: 'absolute', top: '16px', right: '16px', background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
        >
          <X size={20} />
        </button>

        <h2 style={{ fontSize: '22px', fontWeight: '800', textAlign: 'center', marginBottom: '8px' }}>
          {isSignUp ? 'Criar Conta no AutoVenda+' : 'Acesse sua Conta'}
        </h2>
        <p style={{ fontSize: '13px', color: '#94a3b8', textAlign: 'center', marginBottom: '24px' }}>
          Segurança integrada e negociações com custódia
        </p>

        {errorMessage && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.1)', border: '1px solid #ef4444',
            padding: '10px 14px', borderRadius: '8px', color: '#fca5a5',
            fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px'
          }}>
            <AlertCircle size={16} />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Botões Sociais */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
          <button
            type="button"
            onClick={() => handleOAuthLogin('google')}
            disabled={loading}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px',
              background: '#ffffff', color: '#0f172a', border: 'none', padding: '11px',
              borderRadius: '8px', fontWeight: '600', fontSize: '14px', cursor: 'pointer'
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
            </svg>
            Continuar com Google
          </button>

          <button
            type="button"
            onClick={() => handleOAuthLogin('apple')}
            disabled={loading}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px',
              background: '#000000', color: '#ffffff', border: '1px solid #334155', padding: '11px',
              borderRadius: '8px', fontWeight: '600', fontSize: '14px', cursor: 'pointer'
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.62-.75 1.04-1.8 0.92-2.87-.9.04-2 .6-2.63 1.35-.56.64-1.05 1.71-.92 2.74 1.01.08 2.02-.48 2.63-1.22z"/>
            </svg>
            Continuar com Apple
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', margin: '20px 0' }}>
          <div style={{ flex: 1, height: '1px', background: '#334155' }} />
          <span style={{ padding: '0 12px', fontSize: '12px', color: '#64748b' }}>OU COM E-MAIL</span>
          <div style={{ flex: 1, height: '1px', background: '#334155' }} />
        </div>

        <form onSubmit={handleEmailAuth} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <Mail size={18} color="#64748b" style={{ position: 'absolute', left: '12px' }} />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              style={{
                width: '100%', padding: '11px 12px 11px 40px', borderRadius: '8px',
                border: '1px solid #334155', background: '#1e293b', color: '#fff', fontSize: '14px'
              }}
            />
          </div>

          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <Lock size={18} color="#64748b" style={{ position: 'absolute', left: '12px' }} />
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Senha (mínimo 6 caracteres)"
              style={{
                width: '100%', padding: '11px 12px 11px 40px', borderRadius: '8px',
                border: '1px solid #334155', background: '#1e293b', color: '#fff', fontSize: '14px'
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              background: '#0284c7', color: '#ffffff', border: 'none', padding: '12px',
              borderRadius: '8px', fontWeight: '700', fontSize: '14px', cursor: 'pointer', marginTop: '6px'
            }}
          >
            {loading ? 'A autenticar...' : isSignUp ? 'Criar Minha Conta' : 'Entrar no Sistema'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '18px' }}>
          <button
            type="button"
            onClick={() => { setIsSignUp(!isSignUp); setErrorMessage(''); }}
            style={{ background: 'transparent', border: 'none', color: '#38bdf8', fontSize: '13px', cursor: 'pointer' }}
          >
            {isSignUp ? 'Já tem uma conta? Inicie sessão' : 'Ainda não tem conta? Crie uma agora'}
          </button>
        </div>
      </div>
    </div>
  );
}