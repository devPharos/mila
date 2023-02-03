import React from 'react';
import { TouchableOpacity, Text, TouchableWithoutFeedback, Keyboard } from 'react-native';
import theme from '../../global/styles/theme';
import { Entypo } from '@expo/vector-icons';

import Header from '../../components/Header';
import RegistrationStatus from '../../components/RegistrationStatus';
import Logo from '../../components/Logo';
import { logOut } from '../../hooks/register';

import { Page, Container, Box, Main } from './styles';

export function LastStep({ navigation }) {

    return (
    <Page>
        <Header showLogo={false} />
        <Container>
            <RegistrationStatus step='3' />
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <Main>
                    <Logo />
                    <Container>
                        <Box>
                            <Text style={{fontSize: 18,fontWeight: 'bold',color: '#222',marginBottom: 24}}>One last step!</Text>
                            <Text style={{fontSize: 14,textAlign: 'justify',color: '#222',marginBottom: 24}}>In a few moments you are going to receive a verification email.</Text>
                            <Text style={{fontSize: 14,textAlign: 'justify',color: '#222'}}>Please click on the link to finish your registration process.</Text>
                        </Box>
                    </Container>
                    <TouchableOpacity style={theme.buttons.primaryButton} onPress={() => { logOut();}}>
                        <Text style={{ color: '#868686'}}><Entypo name="chevron-left" /> Back to Log In</Text>
                    </TouchableOpacity>
                </Main>
            </TouchableWithoutFeedback>
        </Container>
    </Page>
);
}