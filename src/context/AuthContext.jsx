import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    supabase.auth.getSession().then(({ data, error }) => {
      if (error) console.error('Erro ao recuperar sessão:', error.message);
      if (mounted) {
        setSession(data?.session ?? null);
        setLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      setLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signUp = (email, password, fullName) => supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: fullName } }
  });

  const signIn = (email, password) => supabase.auth.signInWithPassword({ email, password });

  const signInWithGoogle = () => supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: window.location.origin }
  });

  const signOut = () => supabase.auth.signOut();

  return <AuthContext.Provider value={{ session, user: session?.user ?? null, loading, signUp, signIn, signInWithGoogle, signOut }}>
    {children}
  </AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth precisa estar dentro de AuthProvider');
  return context;
}
