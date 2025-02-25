import React, {
  useCallback,
  useContext,
  useRef,
  useState,
  useEffect,
} from "react";
import { Page } from "./styles";
import Header from "../../components/Header";
import { RegisterContext, useRegister } from "../../hooks/register";
import {
  Dimensions,
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Pdf from "react-native-pdf";
import storage from "@react-native-firebase/storage";

export function CalendarNextYear({ navigation }) {
  const { student, params } = useRegister();
  const { group } = useContext(RegisterContext);
  const [fileUrl, setFileUrl] = useState(null);
  const webviewRef = useRef();

  useEffect(() => {
    storage()
      .ref(
        `Calendars/${
          new Date().getFullYear() + 1
        }/${student.registrationNumber.substring(0, 3)}.pdf`
      )
      .getDownloadURL()
      .then((url) => {
        setFileUrl(url);
      });
  }, []);

  const OpenURLButton = ({ url, children }) => {
    const handlePress = useCallback(async () => {
      const supported = await Linking.canOpenURL(url);

      if (supported) {
        await Linking.openURL(url);
      }
    }, [url]);

    return (
      <TouchableOpacity onPress={handlePress}>{children}</TouchableOpacity>
    );
  };

  return (
    <Page>
      <Header
        showLogo={true}
        navigation={navigation}
        drawer={`Calendar ${new Date().getFullYear() + 1}`}
      />
      {fileUrl && (
        <View
          style={{
            flex: 1,
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Pdf
            trustAllCerts={false}
            source={{
              uri: fileUrl,
            }}
            // onLoadComplete={(numberOfPages, filePath) => {
            //   console.log(`Number of pages: ${numberOfPages}`);
            // }}
            // onPageChanged={(page, numberOfPages) => {
            //   console.log(`Current page: ${page}`);
            // }}
            // onError={(error) => {
            //   console.log(error);
            // }}
            // onPressLink={(uri) => {
            //   console.log(`Link pressed: ${uri}`);
            // }}
            style={styles.pdf}
          />
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              borderWidth: 1,
              backgroundColor: "#FFF",
              borderColor: "#efefef",
              padding: 12,
              width: 120,
              borderRadius: 8,
            }}
          >
            <OpenURLButton url={fileUrl}>
              <Text>Download</Text>
            </OpenURLButton>
          </View>
        </View>
      )}
    </Page>
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
