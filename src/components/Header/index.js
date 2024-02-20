import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import theme from '../../global/styles/theme';
import { useRegister } from '../../hooks/register';
import { HeaderContainer } from './styles';
import { Entypo } from '@expo/vector-icons';

export default function Header({ showLogo = false, navigation = null, drawer = null }) {
  const { student } = useRegister();
  return (
    <>
    { showLogo ?
    <HeaderContainer>
      <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', height: 60, paddingHorizontal: 8 }}>
        {drawer && <Entypo name='menu' size={24} onPress={() => navigation.toggleDrawer()} />}
          <TouchableOpacity onPress={() => navigation.navigate('Dashboard')}>
            <Image style={styles.logo} source={require('../../global/images/logo_small.png')} />
          </TouchableOpacity>
        </View>
        
        <View style={{ flex: 1,flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', paddingRight: 22 }}>
          {student && student.name ?
          <TouchableOpacity onPress={() => navigation && navigation.navigate('Profile')} style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', padding: 10 }}>
            <>
              <Text>Hello, </Text>
              <Text style={{ fontWeight: 'bold', color: theme.colors.secondary }}>{student.name}</Text>
            </>
          </TouchableOpacity>
          : null }
        </View>
    </HeaderContainer>
    : null }
    </>
  );
}

const styles = StyleSheet.create({
    logo: {
      marginLeft: 16,
      width: 67,
      height: 32
    },
  });