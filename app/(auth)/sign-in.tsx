import { colors } from '@/constants/colors';
import icons from '@/constants/icons';
import images from '@/constants/images';
import { AuthContext } from '@/context/auth-context';
import React, { useContext, useState } from 'react';
import { Alert, Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const SignIn = () => {
  const { login } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);
  
  const handleLogin = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    try {
      await login();
    } catch (error) {
      Alert.alert('Error', 'Failed to sign in. Please try again.');
      console.error('Sign in error:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <SafeAreaView style={{backgroundColor: 'white', height:'100%'}}>
      <ScrollView contentContainerStyle={{height: '100%'}}>
        <Image
          source={images.onboarding}
          style={{width:'100%', height: 500, resizeMode: 'contain'}}
        />
        <View style={{paddingHorizontal: 10}}>
          <Text style={{textAlign: 'center', color: colors.black[200], fontFamily: 'Rubik-Regular', textTransform: 'uppercase'}}>
            Wellcome to ReState
          </Text>
          <Text style={{fontSize: 25, fontFamily: 'Rubik-Bold', color: colors.black[300], textAlign: 'center', marginTop: 2}}>
            Lets Get You Closer to {'\n'}
            <Text style={{color: colors.primary[300]}}>
              Your Ideal Home
            </Text>
          </Text>
          <Text style={{fontSize: 14, fontFamily: 'Rubik-Regular', color: colors.black[200], textAlign: 'center', marginTop: 12}}>
            Login to ReState with Google
          </Text>
          <TouchableOpacity onPress={handleLogin} 
          style={{backgroundColor: 'white', borderRadius: 12, alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOffset:{width: 0, height: 3},
            shadowOpacity: 0.1, shadowRadius: 6, elevation: 5, paddingVertical: 15, paddingHorizontal: 12, flexDirection: 'row', marginHorizontal: 20, gap: 10, marginTop: 12
          }}
          >
            <Image
              source={icons.google}
              style={{width:20, height: 20, resizeMode: 'contain'}}
            />
            <Text style={{fontSize: 14, fontFamily: 'Rubik-Regular', color: colors.black[300]}}>
              Continue with Google
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default SignIn;