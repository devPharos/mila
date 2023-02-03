import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import theme from '../../global/styles/theme';
import { useRegister } from '../../hooks/register';
import { HeaderContainer } from './styles';

export default function Header({ showLogo }) {
  const { student } = useRegister();
  return (
    <>
    { showLogo ?
    <HeaderContainer>
        <Image style={styles.logo} source={require('../../global/images/logo_small.png')} />
        
        <View style={{ flex: 1,flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', paddingRight: 32 }}>
          {student && student.name ?
          <>
            <Text>Hello, </Text>
            <Text style={{ fontWeight: 'bold', color: theme.colors.secondary }}>{student.name}</Text>
          </>
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