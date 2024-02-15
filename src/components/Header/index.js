import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import theme from '../../global/styles/theme';
import { useRegister } from '../../hooks/register';
import { HeaderContainer } from './styles';

export default function Header({ showLogo, navigation }) {
  const { student } = useRegister();
  return (
    <>
    { showLogo ?
    <HeaderContainer>
        <Image style={styles.logo} source={require('../../global/images/logo_small.png')} />
        
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
      marginHorizontal: 32,
      width: 67,
      height: 32
    },
  });