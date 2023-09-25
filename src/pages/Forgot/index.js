import React, { useState } from 'react';
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
import { useRegister, forgotPW } from '../../hooks/register';

const schema = Yup.object().shape({
    email: Yup.string().email('Please fill with a valid e-mail.').required('Please fill your e-mail.')
})


export function Forgot({ route, navigation }) {
    const account = useRegister();
    const [loading,setLoading] = useState(false);
    const [loginError,setLoginError] = useState({ email: false});
    const [recoverySent, setRecoverySent] = useState(false)
    let defaultAccountvalues = { email: '' }

    if(route.params) {
        const { existEmail } = route.params;
        defaultAccountvalues.email = existEmail;
    }
    
    const { control,handleSubmit,formState: { errors } } = useForm({ defaultValues: defaultAccountvalues, resolver: yupResolver(schema) });

    async function handleRecoveryEmail(form) {
        setLoading(true)
        setLoginError({ email: false });
        try {
            forgotPW(form, setLoginError, loginError, setLoading, setRecoverySent);
            setLoading(false)
        } catch(err) {
            // console.log(err)
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
                { recoverySent ?
                    <View style={{ borderWidth: 1, borderColor: theme.colors.secondary, padding: 12}}>
                      <Text style={{fontSize: 18, textAlign: 'center', color: theme.colors.secondary}}>Email sent!</Text>
                      <Text style={{fontSize: 14, textAlign: 'center', color: theme.colors.secondary}}>Please check your inbox.</Text>
                  </View>
                    :
                    <Container>
                    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}>
                            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                                <>
                                    <Input control={control} defaultValue={account ? account.email : null} autoCapitalize="none" keyboardType="email-address" autoCorrect={false} placeholder="E-mail" name="email" error={errors.email || loginError.email} icon="email" iconColor={theme.colors.secondary} />
                                    
                                    {loginError.email ?
                                    <>
                                        <Text style={{fontSize: 12,color: '#f00'}}>* Email Address not found.</Text>
                                    </>
                                    :
                                    null
                                    }
                                </>
                            </TouchableWithoutFeedback>
                        { !loading ?
                        <>
                            <TouchableOpacity style={theme.buttons.secondaryButton} onPress={handleSubmit(handleRecoveryEmail)}>
                                <BtnText>Send me a recovery email</BtnText>
                            </TouchableOpacity>
                        </>
                        : 
                        <View style={theme.buttons.secondaryButton}>
                            <BtnText>Searching...</BtnText>
                        </View>
                        }
                    </KeyboardAvoidingView>
                    </Container>
                }
                <TouchableOpacity style={theme.buttons.secondaryButtonSimple} onPress={() => { navigation.push('Login')}}>
                    <Text style={{ color: theme.colors.secondary }}>Back to Log In</Text>
                </TouchableOpacity>
            </Main>
        </Container>
    </Page>
);
}