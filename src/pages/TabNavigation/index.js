import React, { useState } from 'react';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { Dashboard } from '../Dashboard';
import { Profile } from '../Profile';
import { FontAwesome, MaterialCommunityIcons, Entypo } from '@expo/vector-icons';
import theme from '../../global/styles/theme';
import Groupchat from '../Groupchat';
import { RegisterProvider, useRegister } from '../../hooks/register';
import { Image } from 'react-native';
const Tab = createMaterialBottomTabNavigator();

export default function TabNavigation() {
  const [profilePic, setProfilePic] = useState(null);
  const { student } = useRegister();
  return (
    <Tab.Navigator initialRouteName="Dashboard"
    activeColor={theme.colors.Present}
    inactiveColor={theme.colors.grayOpacity2}
    labeled={false}
    shifting={false}
    backBehavior="initialRoute"
    barStyle={{ backgroundColor: '#fff' }}>
    {/* <Tab.Screen name="Groupchat" component={Groupchat} options={{
          tabBarLabel: 'Group Chat',
          tabBarIcon: ({ color }) => (
            <Entypo name="chat" color={color} size={22} />
          ),
        }} /> */}
    <Tab.Screen name="Dashboard" component={Dashboard} options={{
          tabBarLabel: 'Dashboard',
          // tabBarBadge: 1,
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="view-dashboard-outline" color={color} size={22} />
          ),
        }} />
    <Tab.Screen name="Profile" component={Profile} options={{
          tabBarLabel: 'Profile',
          // tabBarBadge: true,
          tabBarColor: 'rgb(0,255,0)',
          tabBarIcon: ({ color }) => (
          student.imageUrl ? 
            <Image source={{ uri: student.imageUrl }} style={{ width: 28, height: 28, borderRadius: 28 }} />
            : <Image source={require('../../global/images/no-pic.png')} style={{ width: 28, height: 28, borderRadius: 28 }} /> 
          // <FontAwesome name="user" color={color} size={22} />
          ),
        }} />
  </Tab.Navigator>
  );
}