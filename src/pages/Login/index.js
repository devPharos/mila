import React, { useState, useRef, useEffect } from "react";
import {
  TouchableOpacity,
  Text,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  View,
  Alert,
} from "react-native";
import theme from "../../global/styles/theme";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import Header from "../../components/Header";
import Input from "../../components/Forms/Input";
import RegistrationStatus from "../../components/RegistrationStatus";
import Logo from "../../components/Logo";
import firestore from "@react-native-firebase/firestore";

import { Page, Container, BtnText, Main } from "./styles";
import { useRegister, logIn } from "../../hooks/register";
import api from "../../service/api";

const schema = Yup.object().shape({
  registrationNumber: Yup.string().required(
    "Please fill your registration number."
  ),
  email: Yup.string()
    .email("Please fill with a valid e-mail.")
    .required("Please fill your e-mail."),
  pass: Yup.string().required("Please fill your password."),
});

export function Login({ route, navigation }) {
  const account = useRegister();
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState({
    pass: false,
    registrationNumber: false,
    email: false,
  });
  const [params, setParams] = useState({
    access_orlando: true,
    access_miami: true,
    access_boca: true,
    access_jacksonville: true,
    access_boston: true,
    access_tampa: true,
    allowed_users: "",
    version_android: "",
    version_ios: "",
  });
  let defaultAccountvalues = { email: "", registrationNumber: "", pass: "" };

  if (route.params) {
    const { existEmail, existRegistrationNumber } = route.params;
    defaultAccountvalues.email = existEmail;
    defaultAccountvalues.registrationNumber = existRegistrationNumber;
    defaultAccountvalues.pass = "";
  }

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: defaultAccountvalues,
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    firestore()
      .collection("Params")
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach(async (documentSnapshot) => {
          const data = documentSnapshot.data();
          setParams(data);
        });
      });
  }, []);

  async function handleFindId(form) {
    setLoading(true);
    setLoginError({ pass: false, email: false, registrationNumber: false });

    if (!params.allowed_users.includes(form.registrationNumber.trim())) {
      if (
        form.registrationNumber &&
        form.registrationNumber.substring(0, 3) === "ORL" &&
        params.access_orlando === false
      ) {
        Alert.alert("Attention!", "Orlando access is not yet available.");
        setLoading(false);
        return;
      }

      if (
        form.registrationNumber &&
        form.registrationNumber.substring(0, 3) === "MIA" &&
        params.access_miami === false
      ) {
        Alert.alert("Attention!", "Miami access is not yet available.");
        setLoading(false);
        return;
      }

      if (
        form.registrationNumber &&
        form.registrationNumber.substring(0, 3) === "BOC" &&
        params.access_boca === false
      ) {
        Alert.alert("Attention!", "Boca Raton access is not yet available.");
        setLoading(false);
        return;
      }

      if (
        form.registrationNumber.substring(0, 3) === "JAX" &&
        params.access_jacksonville === false
      ) {
        Alert.alert("Attention!", "Jacksonville access is not yet available.");
        setLoading(false);
        return;
      }

      if (
        form.registrationNumber.substring(0, 3) === "BOS" &&
        params.access_boston === false
      ) {
        Alert.alert("Attention!", "Boston access is not yet available.");
        setLoading(false);
        return;
      }

      if (
        form.registrationNumber.substring(0, 3) === "TAM" &&
        params.access_tampa === false
      ) {
        Alert.alert("Attention!", "Tampa access is not yet available.");
        setLoading(false);
        return;
      }
    }

    await api
      .get(`/students/${form.registrationNumber}/${form.email}/`)
      .then(async (res) => {
        await logIn(form, setLoginError, loginError, setLoading, navigation);
        setTimeout(() => {
          setLoading(false);
        }, 2000);
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
        setLoginError({
          ...loginError,
          email: true,
          registrationNumber: true,
        });
      });
  }

  return (
    <Page>
      <Container>
        <RegistrationStatus />
        <Main>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <>
              <Logo />
              <View
                style={{
                  flex: 1,
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "flex-start",
                  width: "100%",
                }}
              >
                <Input
                  control={control}
                  defaultValue={account ? account.registrationNumber : null}
                  autoCapitalize="characters"
                  keyboardType="default"
                  autoCorrect={false}
                  placeholder="Registration Number"
                  name="registrationNumber"
                  error={
                    errors.registrationNumber || loginError.registrationNumber
                  }
                  icon="fingerprint"
                  iconColor={theme.colors.secondary}
                />
                {errors && errors.registrationNumber ? (
                  <Text style={{ fontSize: 12, color: "#f00" }}>
                    {errors.registrationNumber.message}
                  </Text>
                ) : null}
                <Input
                  control={control}
                  defaultValue={account ? account.email : null}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  autoCorrect={false}
                  placeholder="E-mail"
                  name="email"
                  error={errors.email || loginError.email}
                  icon="email"
                  iconColor={theme.colors.secondary}
                />
                {errors && errors.email ? (
                  <Text style={{ fontSize: 12, color: "#f00" }}>
                    {errors.email.message}
                  </Text>
                ) : null}
                <Input
                  control={control}
                  keyboardType="default"
                  placeholder="Password"
                  secureTextEntry={true}
                  autoCorrect={false}
                  name="pass"
                  error={errors.pass || loginError.pass}
                  icon="key"
                  iconColor={theme.colors.secondary}
                />

                {loginError.email || loginError.registrationNumber ? (
                  <>
                    <Text style={{ fontSize: 12, color: "#f00" }}>
                      * Registration Number or Email Address not found.
                    </Text>
                    <Text
                      style={{
                        fontSize: 12,
                        color: "#f00",
                        marginBottom: 15,
                      }}
                    >
                      Please check your invitation to confirm.
                    </Text>
                  </>
                ) : null}
                <View
                  style={{
                    width: "100%",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "flex-start",
                    gap: 4,
                  }}
                >
                  {!loading ? (
                    <>
                      <TouchableOpacity
                        style={theme.buttons.secondaryButton}
                        onPress={handleSubmit(handleFindId)}
                      >
                        <BtnText>Log In</BtnText>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={theme.buttons.secondaryButtonSimple}
                        onPress={() => {
                          navigation.push("Forgot");
                        }}
                      >
                        <Text style={{ color: theme.colors.secondary }}>
                          I forgot my password
                        </Text>
                      </TouchableOpacity>
                    </>
                  ) : (
                    <View style={theme.buttons.secondaryButton}>
                      <BtnText>Searching...</BtnText>
                    </View>
                  )}
                  <TouchableOpacity
                    style={theme.buttons.secondaryButtonSimple}
                    onPress={() => {
                      navigation.push("FirstAccess");
                    }}
                  >
                    <Text style={{ color: theme.colors.secondary }}>
                      This is my first access
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </>
          </TouchableWithoutFeedback>
        </Main>
      </Container>
    </Page>
  );
}
