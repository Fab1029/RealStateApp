import { colors } from '@/constants/colors';
import icons from '@/constants/icons';
import { Tabs } from 'expo-router';
import { Image, StyleSheet, Text, View } from 'react-native';

interface Props {
  focused: boolean;
  icon: any;
  title: string;
}

const TabIcon = ({focused, icon, title}: Props) => (
  <View style={{flexDirection: 'column', justifyContent: "center", alignItems: 'center', flex:1, marginTop: 15}}>
    <Image
      source={icon}
      tintColor={focused ? "#0061ff" : "#666876"}
      style={{width: 25, height: 25, resizeMode: 'contain'}}
    />

    <Text style={[styles.textTabIcon, focused && styles.textTabIConActive]}>
      {title}    
    </Text>
  </View>
)

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel : false,
        tabBarStyle: {
          position: 'absolute',
          backgroundColor: 'white',
          borderTopColor: '#0061FF1A',
          borderTopWidth: 1,
          minHeight: 70

        }
      }}
    >
      <Tabs.Screen
        name = 'index'
        options={{
          title: 'Home',
          headerShown: false,
          tabBarIcon: ({focused}) => (
            <TabIcon icon={icons.home} focused={focused} title='Home'/>
          )
        }}
      />

      <Tabs.Screen
        name = 'explore'
        options={{
          title: 'Explore',
          headerShown: false,
          tabBarIcon: ({focused}) => (
            <TabIcon icon={icons.search} focused={focused} title='Explore'/>
          )
        }}
      />

      <Tabs.Screen
        name = 'profile'
        options={{
          title: 'Profile',
          headerShown: false,
          tabBarIcon: ({focused}) => (
            <TabIcon icon={icons.person} focused={focused} title='Profile'/>
          )
        }}
      />
    </Tabs>
  );
}


const styles = StyleSheet.create({
  textTabIcon: {
    width: '100%',
    fontSize: 12,
    color: colors.black[200],
  },
  textTabIConActive: {
    color: colors.primary[300]
  }
})


/*import { AuthContext } from '@/context/auth-context';
import { useContext } from 'react';*/