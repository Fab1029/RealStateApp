import { useFonts } from 'expo-font';
import { SplashScreen, Stack } from "expo-router";
import { useEffect } from 'react';

export default function RootLayout() {
  const [fontsLoaded] = useFonts(
    {
      "Rubik-Bold": require('../assets/fonts/Rubik-Bold.ttf'),
      "Rubik-ExtraBold": require('../assets/fonts/Rubik-ExtraBold.ttf'),
      "Rubik-Light": require('../assets/fonts/Rubik-Light.ttf'),
      "Rubik-Regular": require('../assets/fonts/Rubik-Regular.ttf'),
      "Rubik-SemiBold": require('../assets/fonts/Rubik-SemiBold.ttf')
    }
  )

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }

  }, [fontsLoaded]);

  if(!fontsLoaded) return null;

  return <Stack screenOptions={{headerShown: false}}/>;

}
