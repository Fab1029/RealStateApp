import { colors } from '@/constants/colors';
import { settings } from '@/constants/data';
import icons from '@/constants/icons';
import { AuthContext } from '@/context/auth-context';
import React, { useContext } from 'react';
import { Image, ImageSourcePropType, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface Props {
  icon: ImageSourcePropType;
  title: string;
  onPress?: () => void;
  textStyle?: string;
  showArrow?: boolean;
};

const SettingsItem = ({ icon, title, onPress, textStyle, showArrow = true}: Props) => (
  <TouchableOpacity style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 3}} onPress={onPress}>
    <View style={{flexDirection: 'row', alignItems: 'center', gap: 8}}>
      <Image
        source={icon}
        style={{width: 20, height: 20, resizeMode: 'contain'}}
      />
      <Text style={{fontSize: 14, fontFamily: 'Rubik-SemiBold', color: colors.black[300]}}>
        {title}
      </Text>
    </View>
    {showArrow && <Image source={icons.rightArrow} style={{width: 18, height: 18, resizeMode: 'contain'}}/>}
  </TouchableOpacity>
);

const Profile = () => {
  const { session, logout } = useContext(AuthContext);
   
  const handleLogout = async () => {
    await logout();
  };

  console.log(session);

  return (
    <SafeAreaView style={{height: '100%', backgroundColor: 'white', paddingHorizontal: 10}}>
      <ScrollView
        showsVerticalScrollIndicator= {false}
        contentContainerStyle = {{paddingBottom: 32, paddingHorizontal: 7}}
      >
        <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 5}}>
          <Text style={{fontSize: 16, fontFamily: 'Rubik-Bold'}}>
            Profile
          </Text>
          <Image
            source={icons.bell}
            style={{width: 20, height: 20 ,resizeMode: 'contain'}}
          />
        </View>

        <View style={{flexDirection: 'column', alignItems: 'center', marginTop: 5}}>
          <View style={{marginTop: 5, position: 'relative'}}>
            <Image
              source={{uri: session.user.user_metadata.avatar_url}}
              style={{width: 100, height: 100, borderRadius: 50}}
            />
            <TouchableOpacity style={{position: 'absolute', bottom: 2, right: 0}}>
              <Image
                source={icons.edit}
                style={{width: 20, height: 20, resizeMode: 'contain'}}
              />
            </TouchableOpacity>
          </View>
          <Text style={{fontSize: 14, fontFamily: 'Rubik-Bold'}}>
            {session.user.user_metadata.name}
          </Text>
        </View>

        <View style={{flexDirection: 'column', marginTop: 20, gap: 10}}>
          <SettingsItem icon={icons.calendar} title='My Bookings'/>
          <SettingsItem icon={icons.wallet} title='Payments'/>
        </View>

        <View style={{flexDirection: 'column', marginTop: 25, gap: 10}}>
          {settings.slice(2).map((item, index) => (
            <SettingsItem key={index} {...item}/>
          ))}
        </View>

        <View style={{flexDirection: 'column', marginTop: 50, gap: 10}}>
          <SettingsItem icon={icons.logout} title='Logout' showArrow={false} onPress={handleLogout}/>
        </View>

      </ScrollView>
      
    </SafeAreaView>
  )
}

export default Profile;