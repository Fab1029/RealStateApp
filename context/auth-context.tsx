import AsyncStorage from '@react-native-async-storage/async-storage';
import { Session } from '@supabase/supabase-js';
import React, { createContext, ReactNode, useEffect, useState } from 'react';
import { supabase } from '../services/supabase';


import * as QueryParams from 'expo-auth-session/build/QueryParams';
import * as Linking from 'expo-linking';
import * as WebBrowser from 'expo-web-browser';


const SESSION_KEY = 'supabase_session';

type AuthContextType = {
  session: Session | null;
  loading: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextType>({
  session: null,
  loading: true,
  login: async () => {},
  logout: async () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  // Inicializar sesión
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Verificar sesión local
        const storedSession = await AsyncStorage.getItem(SESSION_KEY);
        if (storedSession) {
          const parsedSession = JSON.parse(storedSession);
          const { data: { session: currentSession }, error } = await supabase.auth.setSession(parsedSession);
          
          if (!error && currentSession) {
            setSession(currentSession);
          } else {
            // Sesión inválida, limpiar
            await AsyncStorage.removeItem(SESSION_KEY);
          }
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        await AsyncStorage.removeItem(SESSION_KEY);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // Listeners de autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        console.log('Auth state changed:', event);
        
        if (newSession) {
          await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(newSession));
          setSession(newSession);
        } else {
          await AsyncStorage.removeItem(SESSION_KEY);
          setSession(null);
        }
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const login = async () => {
    try {
      const redirectUrl = Linking.createURL('/');
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
          skipBrowserRedirect: true,
        },
      });

      if (error) throw error;
      if (!data.url) throw new Error('No authentication URL');

      const result = await WebBrowser.openAuthSessionAsync(
        data.url,
        redirectUrl
      );

      if (result.type !== 'success') {
        throw new Error('Authentication cancelled');
      }

      const { params } = QueryParams.getQueryParams(result.url);
      
      if (params.error) {
        throw new Error(params.error);
      }

      const { access_token, refresh_token } = params;
      
      if (!access_token) {
        throw new Error('No access token received');
      }

      const { data: sessionData, error: sessionError } = await supabase.auth.setSession({
        access_token,
        refresh_token,
      });

      if (sessionError) throw sessionError;

    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      // Limpiar estado local primero
      setSession(null);
      await AsyncStorage.removeItem(SESSION_KEY);
      
      // Luego cerrar sesión en Supabase
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
    } catch (error) {
      console.error('Logout error:', error);
      // Forzar limpieza incluso si hay error
      setSession(null);
      await AsyncStorage.removeItem(SESSION_KEY);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};