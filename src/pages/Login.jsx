import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { signIn, signUp, signInWithGoogle } = useAuth();
  const [mode, setMode] = useState('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  async function handleSubmit(e) {
    e.preventDefault(); setBusy(true); setMessage(''); setError('');
    try {
      if (mode === 'signup') {
        if (!name.trim()) throw new Error('Informe seu nome.');
        const { data, error } = await signUp(email, password, name.trim());
        if (error) throw error;
        if (!data.session) setMessage('Cadastro realizado! Confira seu e-mail para confirmar a conta antes de entrar.');
        else navigate('/app', { replace: true });
      } else {
        const { error } = await signIn(email, password);
        if (error) throw error;
        navigate(location.state?.from?.pathname || '/app', { replace: true });
      }
    } catch (err) { setError(err.message || 'Não foi possível concluir.'); }
    finally { setBusy(false); }
  }

  async function handleGoogle() {
    setBusy(true); setError('');
    const { error } = await signInWithGoogle();
    if (error) { setError(error.message); setBusy(false); }
  }

  return <main className="auth-page">
    <section className="auth-card">
      <div className="brand-mark">3 <span>♥♥♥</span></div>
      <p className="eyebrow">CAFETERIA 3 CORAÇÕES</p>
      <h1>{mode === 'login' ? 'Que bom ter você de volta!' : 'Crie sua conta'}</h1>
      <p className="muted">Entre para acessar a área da cafeteria.</p>
      <button className="google-button" onClick={handleGoogle} disabled={busy}><span className="google-g">G</span> Entrar com Google</button>
      <div className="separator"><span>ou use seu e-mail</span></div>
      <form onSubmit={handleSubmit}>
        {mode === 'signup' && <label>Nome completo<input value={name} onChange={e => setName(e.target.value)} autoComplete="name" required placeholder="Seu nome" /></label>}
        <label>E-mail<input type="email" value={email} onChange={e => setEmail(e.target.value)} autoComplete="email" required placeholder="voce@email.com" /></label>
        <label>Senha<input type="password" value={password} onChange={e => setPassword(e.target.value)} autoComplete={mode === 'login' ? 'current-password' : 'new-password'} minLength={6} required placeholder="Mínimo de 6 caracteres" /></label>
        {error && <p className="feedback error">{error}</p>}{message && <p className="feedback success">{message}</p>}
        <button className="primary-button" type="submit" disabled={busy}>{busy ? 'Aguarde...' : mode === 'login' ? 'Entrar' : 'Cadastrar'}</button>
      </form>
      <p className="switch-mode">{mode === 'login' ? 'Ainda não tem conta?' : 'Já tem uma conta?'} <button onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError(''); setMessage(''); }}>{mode === 'login' ? 'Cadastre-se' : 'Fazer login'}</button></p>
      <Link className="back-link" to="/">Voltar para a página inicial</Link>
    </section>
  </main>;
}
