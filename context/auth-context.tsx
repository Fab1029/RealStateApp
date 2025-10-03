import React, { createContext, ReactNode, useEffect, useState } from 'react';
import { getSession, logout, saveSession } from '../services/auth';
import { supabase } from '../services/supabase';

type AuthContextType = {
  session: any;
  setSession: (s: any) => void;
  logout: () => Promise<void>;
  loading: boolean;
};

export const AuthContext = createContext<AuthContextType>({
  session: null,
  setSession: () => {},
  logout: async () => {},
  loading: true,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSession = async () => {
      const s = await getSession();
      if (s) {
        setSession(s);
        // refrescar token automáticamente
        const { data, error } = await supabase.auth.setSession(s);
        if (error) console.error('Error restoring session', error);
      }
      setLoading(false);
    };

    loadSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (_event, currentSession) => {
        setSession(currentSession);
        if (currentSession) {
          await saveSession(currentSession); 
        } else {
          await logout();
        }
      }
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await logout();
    setSession(null);
  };

  return (
    <AuthContext.Provider
      value={{ session, setSession, logout: handleLogout, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};
