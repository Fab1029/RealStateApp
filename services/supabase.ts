/* Primero en el proyecto instalar el supabse del cliente */
/*npm install @supabase/supabase-js*/
/*expo install @react-native-async-storage/async-storage*/
/*npx expo install expo-auth-session*/

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);


