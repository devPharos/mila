import React from 'react';
import { TouchableOpacity, StyleSheet, View } from 'react-native';
import theme from '../../global/styles/theme';

import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Logo from '../../components/Logo';

import { Page, Container, BtnText, Main } from './styles';

export function Home({ navigation }) {
  return (
    <Page>
        <Header showLogo={false} />
        <Container>
            <Main>
                <Logo />
                <TouchableOpacity style={theme.buttons.primaryButton} onPress={() => { navigation.push('FirstAccess')}}>
                    <BtnText>This is my first access</BtnText>
                </TouchableOpacity>
                <TouchableOpacity style={theme.buttons.secondaryButton} onPress={() => { navigation.push('Login')}}>
                    <BtnText>Log In</BtnText>
                </TouchableOpacity>
            </Main>
        </Container>
        <Footer />
    </Page>
);
}