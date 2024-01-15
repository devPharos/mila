import React, { useEffect, useState } from 'react';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { Dashboard } from '../Dashboard';
import { Profile } from '../Profile';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import theme from '../../global/styles/theme';
import Groupchat from '../Groupchat';
import { useRegister } from '../../hooks/register';
import { Image, Platform } from 'react-native';
import appJson from '../../../app.json'
import DifferentVersion from '../DifferentVersion';
const Tab = createMaterialBottomTabNavigator();

export default function TabNavigation() {
  const { student, params } = useRegister();
  const [differentVersion, setDifferentVersion] = useState(null)

  useEffect(() => {
    if(params.version_android && !differentVersion) {
      
      if(Platform.OS === 'android') {
        if(appJson.expo.version !== params.version_android) {
          setDifferentVersion({appVersion: appJson.expo.version, currentVersion: params.version_android, store: "https://play.google.com/store/apps/details?id=com.mila.studentdashboard" })
        }
      } else {
        if(appJson.expo.version !== params.version_ios) {
          setDifferentVersion({appVersion: appJson.expo.version, currentVersion: params.version_ios, store: "https://apps.apple.com/br/app/student-dashboard/id6443608497" })
        }
      }
      
    }
  },[params])

  if(differentVersion) {
    return <DifferentVersion data={differentVersion} />
  }

  return (
    <Tab.Navigator initialRouteName="Dashboard"
    activeColor={theme.colors.Present}
    inactiveColor={theme.colors.grayOpacity2}
    labeled={false}
    shifting={false}
    backBehavior="initialRoute"
    barStyle={{ backgroundColor: '#fff' }}>
      { student.registrationNumber === 'ORL000611' &&
    <Tab.Screen name="Groupchat" component={Groupchat} options={{
          tabBarLabel: 'Group Chat',
          tabBarIcon: ({ color }) => (
            <Ionicons name="pricetags" color={color} size={22} />
          ),
        }} />
        }
    <Tab.Screen name="Dashboard" component={Dashboard} options={{
          tabBarLabel: 'Dashboard',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="view-dashboard-outline" color={color} size={22} />
          ),
        }} />
    <Tab.Screen name="Profile" component={Profile} options={{
          tabBarLabel: 'Profile',
          tabBarColor: 'rgb(0,255,0)',
          tabBarIcon: ({ color }) => (
          student.imageUrl ? 
            <Image source={{ uri: student.imageUrl }} style={{ width: 28, height: 28, borderRadius: 28 }} />
            : <Image source={require('../../global/images/no-pic.png')} style={{ width: 28, height: 28, borderRadius: 28 }} />
          ),
        }} />
  </Tab.Navigator>
  );
}