import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { FontAwesome, MaterialCommunityIcons, Entypo } from '@expo/vector-icons';

// import { Container } from './styles';

const FooterTabs = ({ navigation}) => {
  return <View style={{ width: '100%', backgroundColor: '#fff', height: 56, borderTopWidth: 1, borderColor: '#efefef', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly'}}>
    <TouchableOpacity onPress={() => navigation.push('Groupchat')}>
        <Entypo name="chat" color="#222" size={22} />
    </TouchableOpacity>
    <TouchableOpacity onPress={() => navigation.push('Dashboard')}>
        <MaterialCommunityIcons name="view-dashboard-outline" color="#222" size={22} />
    </TouchableOpacity>
    <TouchableOpacity onPress={() => navigation.push('Profile')}>
        <FontAwesome name="user" color="#222" size={22} />
    </TouchableOpacity>
  </View>;
}

export default FooterTabs;