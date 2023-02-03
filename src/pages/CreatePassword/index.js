import React from 'react';
import { TouchableOpacity, Text, TouchableWithoutFeedback, Keyboard } from 'react-native';
import theme from '../../global/styles/theme';
import { useForm } from 'react-hook-form'
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

import Header from '../../components/Header';
import Input from '../../components/Forms/Input';
import RegistrationStatus from '../../components/RegistrationStatus';
import Logo from '../../components/Logo';
import { useRegister, createUserWithEmailAndPassword } from '../../hooks/register';

import { Page, Container, BtnText, Main } from './styles';

const schema = Yup.object().shape({
    pass: Yup.string()
    .test('len', 'Must be at least 8 characters', val => val.length >= 8).required('Please create a strong password.'),
    pass_confirm: Yup.string().oneOf([Yup.ref('pass'), null], 'Passwords must match')
})

export function CreatePassword({ navigation }) {
    const account = useRegister();
    const { control,handleSubmit,formState: { errors } } = useForm({ resolver: yupResolver(schema) });

    function register(form) {
        account.pass = form.pass;
        account.pass_confirm = form.pass_confirm;
        createUserWithEmailAndPassword(account, navigation)
    }

    return (
    <Page>
        <Header showLogo={false} />
        <Container>
            <RegistrationStatus step="2" />
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <Main>
                    <Logo />
                    <Container>
                        <Input control={control} keyboardType="default" placeholder="Create a strong password" secureTextEntry={true} autoCorrect={false} name="pass" error={errors.pass} icon="key" iconColor={theme.colors.secondary} />
                        {errors && errors.pass ? <Text style={{fontSize: 12,color: '#f00',marginBottom: 15}}>{errors.pass.message}</Text> : null}

                        <Input control={control} keyboardType="default" placeholder="Confirm your password" secureTextEntry={true} autoCorrect={false} name="pass_confirm" error={errors.pass_confirm} icon="key" iconColor={theme.colors.primary} />
                        {errors && errors.pass_confirm ? <Text style={{fontSize: 12,color: '#f00',marginBottom: 15}}>{errors.pass_confirm.message}</Text> : null}
                        <Text style={{fontSize: 12,color: '#868686'}}>A valid password must contain</Text>
                        <Text style={{fontSize: 12,color: '#868686'}}>at least 8 characters.</Text>
                    </Container>
                    <TouchableOpacity style={theme.buttons.secondaryButton} onPress={handleSubmit(register)}>
                        <BtnText>Create my account</BtnText>
                    </TouchableOpacity>
                    <TouchableOpacity style={theme.buttons.secondaryButtonSimple} onPress={() => { navigation.push('Login')}}>
                        <Text style={{ color: theme.colors.secondary }}>Back to Log In</Text>
                    </TouchableOpacity>
                </Main>
            </TouchableWithoutFeedback>
        </Container>
    </Page>
);
}