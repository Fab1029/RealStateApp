import AsyncStorage from '@react-native-async-storage/async-storage'
import { makeRedirectUri } from 'expo-auth-session'
import * as QueryParams from 'expo-auth-session/build/QueryParams'
import * as WebBrowser from 'expo-web-browser'
import { supabase } from './supabase'

WebBrowser.maybeCompleteAuthSession();

const redirectTo = makeRedirectUri({ scheme: 'realstateapp' });
const SESSION_KEY = 'supabase_session';


export const saveSession = async (session: any) => {
  try {
    await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(session));
  } catch (e) {
    console.error('Error saving session', e);
  }
}

export const getSession = async () => {
  try {
    const json = await AsyncStorage.getItem(SESSION_KEY);
    if (!json) 
      return null;

    return JSON.parse(json);
  } catch (e) {
    console.error('Error reading session', e);
    return null;
  }
}

export const logout = async () => {
  try {
    await supabase.auth.signOut();
    await AsyncStorage.removeItem(SESSION_KEY);
  } catch (e) {
    console.error('Error clearing session', e);
  }
}

const createSessionFromUrl = async (url: string) => {
  try {
    const { params, errorCode } = QueryParams.getQueryParams(url);
    if (errorCode) throw new Error(errorCode);

    const { access_token, refresh_token } = params;
    if (!access_token) return

    const { data, error } = await supabase.auth.setSession({
      access_token,
      refresh_token,
    });

    if (error) throw error;
    await saveSession(data.session) ;
    return data.session;
  } catch (error) {
    console.error('Error creating session form url', error);
  }

}


export const login = async () => {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo,
        skipBrowserRedirect: true,
      },
    });

    if (error) throw error;

    const res = await WebBrowser.openAuthSessionAsync(data?.url ?? '', redirectTo);

    if (res.type === 'success') {
      const { url } = res
      return await createSessionFromUrl(url)
    }
    
    return null;
  }catch (error) {
    console.error('Error login', error);
    return null
  }
}
