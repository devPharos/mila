import React, { useEffect, useState } from 'react';
import { TouchableOpacity, Text, TouchableWithoutFeedback, Keyboard, View, Alert } from 'react-native';
import theme from '../../global/styles/theme';
import { useForm } from 'react-hook-form'
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import api from '../../service/api';

import Header from '../../components/Header';
import Input from '../../components/Forms/Input';
import RegistrationStatus from '../../components/RegistrationStatus';
import Logo from '../../components/Logo';
import firestore from '@react-native-firebase/firestore';

import { Page, Container, BtnText, Main } from './styles';
import { findUserByEmailAndStudentCode, useRegister } from '../../hooks/register';

const schema = Yup.object().shape({
    registrationNumber: Yup.string().required('Please fill your student code.'),
    email: Yup.string().email('Please fill with a valid e-mail.').required('Please fill your e-mail.')
})


export function FirstAccess({ route, navigation }) {
    const account = useRegister();
    let defaultAccountvalues = { email: '', registrationNumber: '' }
    const [loading, setLoading] = useState(false);
    const [params, setParams] = useState({ access_orlando: true, access_miami: true, access_boca: true, allowed_users: '', version_android: '', version_ios: '' })

    if (route.params) {
        const { existEmail, existRegistrationNumber } = route.params;
        defaultAccountvalues.email = existEmail;
        defaultAccountvalues.registrationNumber = existRegistrationNumber;
    }

    const { control, handleSubmit, formState: { errors } } = useForm({ defaultValues: defaultAccountvalues, resolver: yupResolver(schema) });

    useEffect(() => {
        firestore()
            .collection('Params')
            .get()
            .then(querySnapshot => {
                querySnapshot.forEach(async documentSnapshot => {
                    const data = documentSnapshot.data();
                    setParams(data);
                })
            })
    }, [])

    async function handleFindId(form) {
        setLoading(true)
        const { registrationNumber, email } = form;
        account.email = null;
        account.registration = null;
        account.registrationNumber = null;
        account.searched = true;

        if (!params.allowed_users.includes(form.registrationNumber.trim())) {

            if (form.registrationNumber.toUpperCase().substring(0, 3) === 'ORL' && params.access_orlando === false) {
                Alert.alert("Attention!", "Orlando access is not yet available.")
                setLoading(false)
                return
            }

            if (form.registrationNumber.substring(0, 3) === 'MIA' && params.access_miami === false) {
                Alert.alert("Attention!", "Miami access is not yet available.")
                setLoading(false)
                return
            }

            if (form.registrationNumber.substring(0, 3) === 'BOC' && params.access_boca === false) {
                Alert.alert("Attention!", "Boca Raton access is not yet available.")
                setLoading(false)
                return
            }

        }
        try {
            //Verificação na API do MILA Pro referente a Registration Number e Email.
            const { data } = await api.get(`/students/${registrationNumber}/${email}/`);
            account.registration = data.data.studentID;
            account.registrationNumber = registrationNumber.toUpperCase();
            account.email = email.toLowerCase();
            findUserByEmailAndStudentCode(account, navigation);
        } catch (err) {
            setLoading(false)
        }
    }

    return (
        <Page>
            <Header showLogo={false} />
            <Container>
                <RegistrationStatus step="1" />
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <Main>
                        <Logo />
                        <Container>
                            <Input control={control} defaultValue={account ? account.registrationNumber : null} autoCapitalize="characters" keyboardType="default" autoCorrect={false} placeholder="Registration Number" name="registrationNumber" error={errors.registrationNumber || (account.searched && !account.registration)} icon="fingerprint" iconColor={theme.colors.secondary} />
                            {errors && errors.registrationNumber ? <Text style={{ fontSize: 12, color: '#f00' }}>{errors.registrationNumber.message}</Text> : null}

                            <Input control={control} defaultValue={account ? account.email : null} autoCapitalize="none" keyboardType="email-address" autoCorrect={false} placeholder="E-mail" name="email" error={errors.email || (account.searched && !account.registration)} icon="email" iconColor={theme.colors.secondary} />
                            {errors && errors.email ? <Text style={{ fontSize: 12, color: '#f00' }}>{errors.email.message}</Text> : null}

                            {(account.searched && !account.registration) ?
                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <Text style={{ fontSize: 12, color: '#f00', paddingRight: 8 }}>*</Text>
                                    <View>
                                        <Text style={{ fontSize: 12, color: '#222' }}>Registration Number or Email not found.</Text>
                                        <Text style={{ fontSize: 12, color: '#222' }}>Please check your invitation to confirm.</Text>
                                    </View>
                                </View>
                                :
                                null
                            }
                        </Container>
                        {!loading ?
                            <TouchableOpacity style={theme.buttons.secondaryButton} onPress={handleSubmit(handleFindId)}>
                                <BtnText>Continue</BtnText>
                            </TouchableOpacity>
                            :
                            <View style={theme.buttons.secondaryButton}>
                                <BtnText>Searching...</BtnText>
                            </View>
                        }
                        <TouchableOpacity style={theme.buttons.secondaryButtonSimple} onPress={() => { navigation.push('Login') }}>
                            <Text style={{ color: theme.colors.secondary }}>Back to Log In</Text>
                        </TouchableOpacity>
                    </Main>
                </TouchableWithoutFeedback>
            </Container>
        </Page>
    );
}
