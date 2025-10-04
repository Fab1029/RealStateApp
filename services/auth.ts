import AsyncStorage from '@react-native-async-storage/async-storage'
import * as QueryParams from 'expo-auth-session/build/QueryParams'
import * as Linking from 'expo-linking'
import * as WebBrowser from 'expo-web-browser'
import { supabase } from './supabase'

const SESSION_KEY = 'supabase_session';

export const saveLocalSession = async (session: any) => {
  try {
    const result_session = await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(session));
  } catch (eror) {
    throw new Error('Could not save local session');
  }
}

export const getLocalSession = async () => {
  try {
    const json = await AsyncStorage.getItem(SESSION_KEY);
    if (!json) 
      return null;

    return JSON.parse(json);

  } catch (error) {
    throw new Error("Could not get local session");
  }
}

export const logout = async () => {
  try {
    const result_supabase =  await supabase.auth.signOut();
    const result_local_session = await AsyncStorage.removeItem(SESSION_KEY);
  
  } catch (error) {
    throw new Error("Could not log out");
  }
}

export const login = async () => {
  try {
    const redirectURL = Linking.createURL('/');

    const { data: dataProvider, error: errorProvider } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectURL,
        skipBrowserRedirect: true,
      },
    });

    if (errorProvider) throw new Error('Failed to get URL google');

    const browserResult = await WebBrowser.openAuthSessionAsync(
      dataProvider.url,
      redirectURL
    );

    if(browserResult.type !== 'success') throw new Error('Failed to sign google');
    
    const { params, errorCode } = QueryParams.getQueryParams(browserResult.url);
    
    if(errorCode) throw new Error('Could not get params from google auth');

    const { access_token, refresh_token } = params;

    if (!access_token) return

    const { data: dataSession ,error: errorSession } = await supabase.auth.setSession({
      access_token,
      refresh_token,
    });

    if(errorSession) throw new Error('Could not set session supabase');

    saveLocalSession(dataSession.session);
    return dataSession.session;

  }catch (error) {
    throw new Error('Error login');
  }
}
