import React, { useState } from 'react';
import { TouchableOpacity, Text, TouchableWithoutFeedback, Keyboard, KeyboardAvoidingView, Platform, View, Alert } from 'react-native';
import theme from '../../global/styles/theme';
import { useForm } from 'react-hook-form'
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

import Header from '../../components/Header';
import Input from '../../components/Forms/Input';
import RegistrationStatus from '../../components/RegistrationStatus';
import Logo from '../../components/Logo';

import { Page, Container, BtnText, Main } from './styles';
import { useRegister, createUserAtFirebase, removeUser, logIn, logOut } from '../../hooks/register';
import api from '../../service/api';

const schema = Yup.object().shape({
    registrationNumber: Yup.string().required('Please fill your registration number.').min(9,'Please fill your registration number.')
})

export function AccessChanged({ route, navigation }) {
    const account = useRegister();
    const [loading,setLoading] = useState(false);
    const defaultLoginError = { registrationNumber: false, sameInfo: false }
    const [loginError,setLoginError] = useState(defaultLoginError);
    const { control,handleSubmit,formState: { errors } } = useForm({ resolver: yupResolver(schema) });

    async function handleFindId(form) {
        setLoginError({...defaultLoginError })
        if(form.registrationNumber === account.student.registrationNumber) {
            setLoginError({...defaultLoginError, sameInfo: true})
            return
        }
        try {
            const { data } = await api.get(`/students/${form.registrationNumber}/${account.student.email}/`);
            if(data.data.studentID === account.student.registration) {
                setLoading(true)
                await removeUser(account.student)
                await createUserAtFirebase({ ...account.student, registrationNumber: form.registrationNumber })
                Alert.alert("Attention!","Your access has been transfered. Please log in again.",[
                    {
                        text: 'Ok',
                        onPress: () => {
                            logOut()
                        }
                    }
                ])
                setLoading(false)
            } else {
                setLoginError({...loginError, registrationNumber: true })
            }
        } catch(err) {
            setLoginError({...loginError, registrationNumber: true })
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
                                <Input control={control} defaultValue={account ? account.registrationNumber : null} autoCapitalize="characters" keyboardType="default" autoCorrect={false} placeholder="New Registration Number" name="registrationNumber" error={errors.registrationNumber || loginError.registrationNumber} icon="fingerprint" iconColor={theme.colors.secondary} />
                                {errors && errors.registrationNumber && <Text style={{fontSize: 12,color: '#f00'}}>{errors.registrationNumber.message}</Text>}
                                
                                {loginError.registrationNumber && <Text style={{fontSize: 12,color: '#f00',marginBottom: 15}}>Please check your invitation to confirm.</Text>}
                                {loginError.sameInfo && <Text style={{fontSize: 12,color: '#f00',marginBottom: 15}}>You must fill with your new Registration Number.</Text>}
                            </>
                        </TouchableWithoutFeedback>
                    </KeyboardAvoidingView>
                </Container>
                { !loading ?
                <>
                    <TouchableOpacity style={theme.buttons.secondaryButton} onPress={handleSubmit(handleFindId)}>
                        <BtnText>Transfer my access</BtnText>
                    </TouchableOpacity>
                </>
                : 
                <View style={theme.buttons.secondaryButton}>
                    <BtnText>Searching...</BtnText>
                </View>
                }
            </Main>
        </Container>
    </Page>
);
}