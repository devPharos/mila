import React, { useContext, useEffect, useRef, useState } from "react";
import { RegisterContext, useRegister } from "../../hooks/register";
import {
  Alert,
  Dimensions,
  Keyboard,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import WebView from "react-native-webview";
import Loading from "../../components/Loading";
import { Container, Main, Page } from "../Dashboard/styles";
import firestore from "@react-native-firebase/firestore";
import { format } from "date-fns";
import theme from "../../global/styles/theme";
import {
  enableSecureView,
  disableSecureView,
  forbidAndroidShare,
  allowAndroidShare,
} from "react-native-prevent-screenshot-ios-android";
import { Platform } from "react-native";

export default function ProgressTest({ navigation }) {
  const {
    student,
    setStudent,
    groups,
    tests,
    period,
    updateClassInformation,
    setParams,
  } = useRegister();
  const [loading, setLoading] = useState(true);
  const [testId, setTestId] = useState(null);
  const [reasonNotShown, setReasonNotShown] = useState(null);
  const webviewRef = useRef();

  async function load() {
    setTestId(null);
    await updateClassInformation(student);
    const updatedStudent = await firestore()
      .collection("Students")
      .doc(student.registrationNumber)
      .get()
      .then(async (documentSnapshot) => {
        if (documentSnapshot.exists) {
          const updatedStudent = documentSnapshot.data();
          if (updatedStudent.testsDone) {
            setStudent({ ...student, testsDone: updatedStudent.testsDone });
            return updatedStudent;
          }
        }
      });
    const updatedParams = await firestore()
      .collection("Params")
      .get()
      .then((querySnapshot) => {
        let updatedParams = null;
        querySnapshot.forEach(async (documentSnapshot) => {
          updatedParams = documentSnapshot.data();
          setParams({ ...updatedParams });
        });
        return updatedParams;
      });
    let today = period.classes.find(
      (c) => c.classDate === format(new Date(), "yyyy-MM-dd")
    );

    if (
      updatedParams.allowed_users.includes(
        updatedStudent.registrationNumber.trim()
      )
    ) {
      today = period.classes.find(
        (c) => c.classDate === updatedParams.progress_test_fictious_date
      );
    }

    if (!today) {
      setReasonNotShown("No progress test today.");
      setLoading(false);
      return;
    }

    if (today.presenceStatus !== "Present") {
      setReasonNotShown("You must be present to take the test.");
      setLoading(false);
      return;
    }

    if (today && tests.length > 0) {
      const progressTest = today.program.find((p) =>
        p.description.includes("PROGRESS TEST")
      );
      const levelTest = tests.find(
        (t) => t.level.toUpperCase() === updatedStudent.level.toUpperCase()
      );

      const findTestId =
        levelTest[progressTest.description.replaceAll(" ", "_").toLowerCase()];

      if (findTestId) {
        if (
          !updatedStudent.testsDone ||
          !updatedStudent.testsDone.includes(
            groups[0].groupID + "_" + findTestId
          )
        ) {
          setTestId(findTestId);
          setLoading(false);
        }
      }
      setLoading(false);
    } else {
      setLoading(false);
    }
  }

  function reload() {
    Alert.alert(
      "Attention!",
      "Are you sure you want to reload the page?\nAll filled data will be lost.",
      [
        { text: "Yes", style: "cancel", onPress: () => setLoading(true) },
        { text: "Cancel", style: "cancel" },
      ]
    );
  }

  useEffect(() => {
    if (Platform.OS === "android") {
      forbidAndroidShare();
    }
    if (Platform.OS == "ios") {
      enableSecureView();
    }
  }, []);

  useEffect(() => {
    if (loading) {
      load();
    }
  }, [loading]);

  const handleWebViewNavigationStateChange = async (newNavState) => {
    // newNavState looks something like this:
    // {
    //   url?: string;
    //   title?: string;
    //   loading?: boolean;
    //   canGoBack?: boolean;
    //   canGoForward?: boolean;
    // }
    const { url } = newNavState;

    if (!url) return;

    // redirect somewhere else
    if (!url.includes("jotform.com")) {
      return;
    }

    if (url.includes("https://submit.jotform.com/submit/")) {
      if (
        !student.testsDone ||
        !student.testsDone.includes(groups[0].groupID + "_" + testId)
      ) {
        firestore()
          .collection("Students")
          .doc(student.registrationNumber)
          .update({
            testsDone: [...student.testsDone, groups[0].groupID + "_" + testId],
          })
          .then(() => {
            setStudent({
              ...student,
              testsDone: [
                ...student.testsDone,
                groups[0].groupID + "_" + testId,
              ],
            });
          });
      }
    }

    // handle certain doctypes
    if (url.includes(".pdf")) {
      webviewRef.stopLoading();
      // open a modal with the PDF viewer
    }

    // one way to handle a successful form submit is via query strings
    if (url.includes("?message=success")) {
      webviewRef.stopLoading();
      // maybe close this view?
    }

    // one way to handle errors is via query string
    if (url.includes("?errors=true")) {
      webviewRef.stopLoading();
    }
  };

  if (loading) {
    return (
      <Page>
        {/* <Birthday /> */}
        <Container>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <Main>
              <Loading title="Loading..." />
            </Main>
          </TouchableWithoutFeedback>
        </Container>
      </Page>
    );
  }

  return (
    <>
      {testId ? (
        <>
          <WebView
            style={{ flex: 1 }}
            ref={webviewRef}
            originWhitelist={["*"]}
            source={{
              uri: `https://form.jotform.com/${testId}?StudentName=${
                student.name
              }&MilaId=${student.registrationNumber.trim()}&TeachersName=TESTER USER&GroupId=${
                groups[0].groupID
              }${"_"}${groups[0].name}`,
            }}
            onNavigationStateChange={handleWebViewNavigationStateChange}
          />
          <TouchableOpacity
            onPress={reload}
            style={{
              padding: 12,
              backgroundColor: "#222",
              marginTop: 16,
            }}
          >
            <Text style={{ textAlign: "center", fontSize: 12, color: "#FFF" }}>
              Reload page
            </Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <View
            style={{
              marginTop: 16,
              flex: 1,
              paddingHorizontal: 16,
              gap: 16,
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text
              style={{
                textAlign: "center",
                fontSize: 18,
                color: theme.colors.secondary,
              }}
            >
              {reasonNotShown
                ? reasonNotShown
                : "No Progress Test available for you today."}
            </Text>
            <Text
              style={{
                textAlign: "center",
                fontSize: 18,
                color: theme.colors.secondary,
              }}
            >
              If you believe this is an error, please contact your teacher.
            </Text>
          </View>
          <TouchableOpacity
            onPress={reload}
            style={{
              padding: 12,
              backgroundColor: "#222",
              marginTop: 16,
            }}
          >
            <Text style={{ textAlign: "center", fontSize: 12, color: "#FFF" }}>
              Reload page
            </Text>
          </TouchableOpacity>
        </>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  pdf: {
    flex: 1,
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
});
