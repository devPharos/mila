import React, { useState, useEffect, useContext, useRef } from "react";
import { Page, Main, Profilepic } from "./styles";
import {
  TouchableOpacity,
  ScrollView,
  Text,
  View,
  Image,
  Alert,
  TextInput,
} from "react-native";
import { FontAwesome, FontAwesome5 } from "@expo/vector-icons";
import auth from "@react-native-firebase/auth";
import QRCode from "react-native-qrcode-svg";
import Header from "../../components/Header";
import { RegisterContext, useRegister } from "../../hooks/register";
import theme from "../../global/styles/theme";
import logoFromFile from "../../global/images/icon_4x.png";
import * as ImagePicker from "expo-image-picker";
import EnrollmentConfirmation from "../../components/EnrollmentConfirmation";
import Birthday from "../../components/Birthday";
import { format } from "date-fns";
import { Buffer } from "buffer";

export function Profile({ navigation }) {
  const [openBirthdayModal, setOpenBirthdayModal] = useState(false);
  const [showEnrollment, setShowEnrollment] = useState(false);
  const authenticated = auth().currentUser;
  const [loading, setLoading] = useState(false);
  const { profilePicChange } = useContext(RegisterContext);
  const { student, updateClassInformation } = useRegister();
  const [status, requestPermission] = ImagePicker.useCameraPermissions();
  const [requireReAuth, setRequireReAuth] = useState(false);
  const passRef = useRef();

  const launchCamera = async () => {
    if (status && !status.granted) {
      await requestPermission();
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.4,
    });

    if (!result.canceled) {
      await profilePicChange(
        result.assets[0].uri,
        student.registrationNumber,
        authenticated.email
      );
    }
  };
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      await profilePicChange(
        result.assets[0].uri,
        student.registrationNumber,
        authenticated.email
      );
    }
  };

  async function handleUpdateInfo() {
    setLoading(true);
    await updateClassInformation(student, setRequireReAuth);
    setLoading(false);
    Alert.alert("Attention!", `Your class information has been updated.`);
  }

  useEffect(() => {
    if (
      student.birthDate &&
      student.birthDate.substring(5) === format(new Date(), "MM-dd")
    ) {
      setOpenBirthdayModal(true);
    }
  }, [student]);

  const optionsProfileImage = () => {
    Alert.alert(
      "Update profile picture",
      "Choose where you want to select your image.",
      [
        { text: "From Camera", onPress: launchCamera },
        { text: "From Files", onPress: pickImage },
      ]
    );
  };

  function handleReAuth() {
    const password = passRef.current.value;
    auth()
      .signInWithEmailAndPassword(student.email, password)
      .then(async () => {
        setRequireReAuth(false);
        await updateClassInformation(student, setRequireReAuth);
      })
      .catch((err) => {
        Alert.alert("Attention!", "Wrong password.");
      });
  }

  return (
    <Page>
      <Header showLogo={true} navigation={navigation} />
      {requireReAuth && (
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "100%",
            backgroundColor: "rgba(255,255,255,.9)",
            zIndex: 10,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <View
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "#FFF",
              shadowColor: "#000",
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,
              elevation: 5,
              padding: 16,
              borderRadius: 16,
              margin: 16,
            }}
          >
            <Text
              style={{ textAlign: "center", padding: 16, textAlign: "left" }}
            >
              Please enter your password to update your information.
            </Text>
            <TextInput
              ref={passRef}
              onChangeText={(e) => (passRef.current.value = e)}
              type="password"
              style={{
                height: 40,
                marginVertical: 16,
                borderWidth: 1,
                width: "90%",
                paddingHorizontal: 8,
                borderColor: "#ccc",
                borderRadius: 4,
              }}
              placeholder="Password"
            />
            <View
              style={{
                width: "90%",
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <TouchableOpacity
                style={{
                  backgroundColor: theme.colors.secondary,
                  padding: 8,
                  borderRadius: 4,
                  marginVertical: 16,
                  alignItems: "center",
                  justifyContent: "center",
                }}
                onPress={() => {
                  handleReAuth();
                }}
              >
                <Text style={{ color: "#FFF", fontWeight: "bold" }}>
                  Update my information
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  backgroundColor: theme.colors.gray,
                  padding: 8,
                  borderRadius: 4,
                  marginVertical: 16,
                  alignItems: "center",
                  justifyContent: "center",
                }}
                onPress={() => {
                  setRequireReAuth(false);
                }}
              >
                <Text style={{ color: "#FFF", fontWeight: "bold" }}>
                  Cancel
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
      <ScrollView>
        <Main>
          <TouchableOpacity
            style={theme.buttons.secondaryButtonSimple}
            onPress={optionsProfileImage}
          >
            <Profilepic
              style={{ alignItems: "center", justifyContent: "center" }}
            >
              {student.imageUrl ? (
                <Image
                  source={{ uri: student.imageUrl }}
                  style={{ width: 180, height: 180, borderRadius: 24 }}
                />
              ) : (
                <Image
                  source={require("../../global/images/no-pic.png")}
                  style={{ width: 180, height: 180, borderRadius: 24 }}
                />
              )}
            </Profilepic>
          </TouchableOpacity>
          <Text
            style={{
              fontWeight: "bold",
              color: theme.colors.secondary,
              paddingTop: 32,
              fontSize: 18,
            }}
          >
            {student.name} {student.lastName}
          </Text>
          {loading ? (
            <View
              style={[
                { ...theme.buttons.secondaryButton },
                { justifyContent: "center", gap: 8 },
              ]}
            >
              <FontAwesome
                name="refresh"
                color={theme.colors.secondary}
                size={16}
              />
              <Text style={{ color: theme.colors.secondary }}>
                Refreshing...
              </Text>
            </View>
          ) : (
            <TouchableOpacity
              style={[
                { ...theme.buttons.secondaryButton },
                { justifyContent: "center", gap: 8 },
              ]}
              onPress={handleUpdateInfo}
            >
              <FontAwesome
                name="refresh"
                color={theme.colors.secondary}
                size={16}
              />
              <Text style={{ color: theme.colors.secondary }}>
                Refresh my class information
              </Text>
            </TouchableOpacity>
          )}
          <View
            style={{
              flexDirection: "column",
              alignItems: "flex-start",
              justifyContent: "space-evenly",
              height: 180,
              paddingVertical: 12,
            }}
          >
            {student.registrationNumber && (
              <View style={{ flexDirection: "row" }}>
                <Text style={{ fontWeight: "bold" }}>Student ID: </Text>
                <Text>{student.registrationNumber}</Text>
              </View>
            )}
            {student.email && (
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <FontAwesome name="envelope" color="#222" size={16} />
                <Text> {student.email}</Text>
              </View>
            )}
            {student.registrationNumber && (
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <FontAwesome5 name="school" color="#222" size={16} />
                <Text>
                  {" "}
                  {student.registrationNumber.substring(0, 3) === "ORL"
                    ? "Orlando"
                    : student.registrationNumber.substring(0, 3) === "MIA"
                    ? "Miami"
                    : student.registrationNumber.substring(0, 3) === "BOC"
                    ? "Boca Raton"
                    : student.registrationNumber.substring(0, 3) === "JAX"
                    ? "Jacksonville"
                    : student.registrationNumber.substring(0, 3) === "BOS"
                    ? "Boston"
                    : student.registrationNumber.substring(0, 3) === "TAM"
                    ? "Tampa"
                    : ""}
                </Text>
              </View>
            )}
            {student.level && (
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <FontAwesome5 name="medal" color="#222" size={16} />
                <Text> {student.level.toUpperCase()}</Text>
              </View>
            )}
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <FontAwesome5 name="medal" color="#222" size={16} />
              <Text> Valid Thru: Dec, {new Date().getFullYear()} </Text>
            </View>
          </View>
          {student.registrationNumber && student.registration && (
            <View
              style={{
                flexDirection: "column",
                alignItems: "flex-start",
                justifyContent: "space-evenly",
                flex: 1,
                borderTopWidth: 1,
                borderTopColor: "rgba(0,0,0,.1)",
                width: "90%",
              }}
            >
              <Text
                style={{
                  color: theme.colors.secondary,
                  marginBottom: -10,
                  fontWeight: "bold",
                  fontSize: 18,
                  textAlign: "center",
                  width: "100%",
                  paddingVertical: 12,
                }}
              >
                MILA ID
              </Text>
              {/* <Text style={{ textAlign: 'center', width: '100%',paddingVertical: 12, paddingHorizontal: 26 }}>Scan this code at the locations that require your MILA ID.</Text> */}
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "100%",
                  paddingVertical: 12,
                }}
              >
                <QRCode
                  value={`${Buffer.from(
                    student.registrationNumber + "-" + student.registration,
                    "utf-8"
                  ).toString("base64")}`}
                  logo={logoFromFile}
                  logoSize={30}
                  size={160}
                  logoBackgroundColor="#FFF"
                />
              </View>
            </View>
          )}
          {/* <TouchableOpacity style={theme.buttons.secondaryButton} onPress={() => setShowEnrollment(true)}>
               <BtnText>📃 Enrollment Letter</BtnText>
            </TouchableOpacity> */}
        </Main>
      </ScrollView>

      {openBirthdayModal ? (
        <Birthday
          setOpenBirthdayModal={setOpenBirthdayModal}
          student={student}
        />
      ) : null}

      {showEnrollment ? (
        <EnrollmentConfirmation setShowEnrollment={setShowEnrollment} />
      ) : null}
    </Page>
  );
}
