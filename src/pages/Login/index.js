import React, { useState, useRef, useEffect } from 'react';
import { TouchableOpacity, Text, TouchableWithoutFeedback, Keyboard, KeyboardAvoidingView, Platform, View } from 'react-native';
import theme from '../../global/styles/theme';
import { useForm } from 'react-hook-form'
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

import Header from '../../components/Header';
import Input from '../../components/Forms/Input';
import RegistrationStatus from '../../components/RegistrationStatus';
import Logo from '../../components/Logo';
import api from '../../service/api';

import { Page, Container, BtnText, Main } from './styles';
import { useRegister, logIn } from '../../hooks/register';



const schema = Yup.object().shape({
    registrationNumber: Yup.string().required('Please fill your registration number.'),
    email: Yup.string().email('Please fill with a valid e-mail.').required('Please fill your e-mail.'),
    pass: Yup.string().required('Please fill your password.')
})


export function Login({ route, navigation }) {
    const account = useRegister();
    const [loading,setLoading] = useState(false);
    const [loginError,setLoginError] = useState({ pass: false, registrationNumber: false, email: false});
    let defaultAccountvalues = { email: '', registrationNumber: '', pass: '' }

    if(route.params) {
        const { existEmail, existRegistrationNumber } = route.params;
        defaultAccountvalues.email = existEmail;
        defaultAccountvalues.registrationNumber = existRegistrationNumber;
        defaultAccountvalues.pass = '';
    }
    
    const { control,handleSubmit,formState: { errors } } = useForm({ defaultValues: defaultAccountvalues, resolver: yupResolver(schema) });

    async function handleFindId(form) {
        setLoading(true)
        setLoginError({ pass: false, email: false, registrationNumber: false });
        try {
            await api.get(`/students/${form.registrationNumber}/${form.email}/`);
            logIn(form, setLoginError, loginError, setLoading);
        } catch(err) {
            setLoading(false)
        }
        
    }

    return (
    <Page>
        <Header showLogo={false} />
        <Container>
            <RegistrationStatus />
                <Main>
                <Logo />
                <Container>
                    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}>
                        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                            <>
                                <Input control={control} defaultValue={account ? account.registrationNumber : null} autoCapitalize="characters" keyboardType="default" autoCorrect={false} placeholder="Registration Number" name="registrationNumber" error={errors.registrationNumber || loginError.registrationNumber} icon="fingerprint" iconColor={theme.colors.secondary} />
                                <Input control={control} defaultValue={account ? account.email : null} autoCapitalize="none" keyboardType="email-address" autoCorrect={false} placeholder="E-mail" name="email" error={errors.email || loginError.email} icon="email" iconColor={theme.colors.secondary} />
                                <Input control={control} keyboardType="default" placeholder="Password" secureTextEntry={true} autoCorrect={false} name="pass" error={errors.pass || loginError.pass} icon="key" iconColor={theme.colors.secondary} />
                            
                                {loginError.email || loginError.registrationNumber ?
                                <>
                                    <Text style={{fontSize: 12,color: '#f00'}}>* Registration Number or Email Address not found.</Text>
                                    <Text style={{fontSize: 12,color: '#f00',marginBottom: 15}}>Please check your invitation to confirm.</Text>
                                </>
                                :
                                null
                                }
                            </>
                        </TouchableWithoutFeedback>
                    </KeyboardAvoidingView>
                </Container>
                { !loading ?
                <TouchableOpacity style={theme.buttons.secondaryButton} onPress={handleSubmit(handleFindId)}>
                    <BtnText>Log In</BtnText>
                </TouchableOpacity>
                : 
                <View style={theme.buttons.secondaryButton}>
                    <BtnText>Searching...</BtnText>
                </View>
                }
                <TouchableOpacity style={theme.buttons.secondaryButtonSimple} onPress={() => { navigation.push('FirstAccess')}}>
                    <Text style={{ color: theme.colors.secondary }}>This is my first access</Text>
                </TouchableOpacity>
            </Main>
        </Container>
    </Page>
);
}