import { AuthContext } from '@/context/auth-context';
import { Stack, useRouter } from 'expo-router';
import React, { useContext, useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';

export default function AuthLayout() {
  const { session, loading } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    if (!loading && session) {
      router.replace('/(root)/(tabs)');
    }
  }, [session, loading]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (session) {
    return null;
  };

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="sign-in" />
    </Stack>
  );
}