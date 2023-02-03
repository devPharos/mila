import React, { useRef } from 'react';
import { Image, StyleSheet, Text, View, Modal, Alert, ScrollView, TouchableOpacity, Linking } from 'react-native';
import theme from '../../global/styles/theme';
import ViewShot from "react-native-view-shot";
import { BtnText } from '../../pages/Profile/styles';
import * as FileSystem from 'expo-file-system';
import storage from '@react-native-firebase/storage';


import RNImageToPdf from 'react-native-image-to-pdf';
import { useRegister } from '../../hooks/register';

// import { Container } from './styles';

export default function EnrollmentConfirmation({ setShowEnrollment }) {
    const ref = useRef();
    const { student } = useRegister();

    const myAsyncPDFFunction = async () => {
        ref.current.capture().then(async uri => {

            try {
                const options = {
                    imagePaths: [uri.replace('file://', '')],
                    name: 'PDFName.pdf',
                    // maxSize: { // optional maximum image dimension - larger images will be resized
                    //     width: 900,
                    //     height: Math.round(deviceHeight() / deviceWidth() * 900),
                    // },
                    quality: .7, // optional compression paramter
                };
                const pdf = await RNImageToPdf.createPDFbyImages(options);

                // Requests permissions for external directory
                const reference = storage().ref('enrollment_'+student.registrationNumber+'.pdf');
                // uploads file
                await reference.putFile(pdf.filePath);
                const pdfFile = await storage().ref('enrollment_'+student.registrationNumber+'.pdf').getDownloadURL()
                Linking.openURL(pdfFile)
                
            } catch(e) {
            }
        })
    }

  return <View>
    <Modal
        animationType="slide"
        transparent={true}
        visible={true}
        presentationStyle="overFullScreen"
        onRequestClose={() => {
            setShowEnrollment(false)
            // Alert.alert("Modal has been closed.");
        }} >
    <ScrollView style={{ backgroundColor: "#FFF" }}>
        <ViewShot style={{ backgroundColor: "#FFF" }} ref={ref} options={{ fileName: "enrollment", format: "jpg", quality: 0.9 }}>
            <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', padding: 20 }}>
                <Image style={styles.logo} source={require('../../global/images/logo.png')} />
            </View>
            <View style={{ width: '100%', textAlign: 'justify', padding: 20 }}>
                <Text style={{ marginBottom: 6 }}>MILA SEVIS ID: MIA214F54806001</Text>
                <Text style={{ marginBottom: 16 }}>August 29 th,2022</Text>
                
                <Text style={{ marginBottom: 6 }}>Dear Mr./Mrs,</Text>
                <Text style={{ marginBottom: 16 }}>This letter is to confirm that <Text style={{ fontWeight: 'bold' }}>Mr. {student.lastName}, {student.name}, SEVIS ID: {student.nsevis}</Text> is enrolled as
                an F-1 student in our English School as a Second Language Program. His program is from
                September 23, 2019, to December 31, 2023.</Text>
                <Text style={{ marginBottom: 16 }}>During his attendance at Miami International Language Academy, he is taking courses in the
                different skills of Language learning: Grammar, Listening, Speaking, Reading, and Writing and is
                enrolled as a full-time student.</Text>
                <Text style={{ marginBottom: 16 }}>
                    <Text style={{ fontWeight: 'bold' }}>Mr. {student.lastName}, {student.name} </Text>
                    <Text> receives instruction Monday through Thursday, 18 hours a week, and is enrolled in the Pre-Advanced Level (CEFR) according to the Common European Framework.</Text>
                </Text>
                <Text style={{marginBottom: 16 }} >
                    <Text style={{ fontWeight: 'bold' }}>Mr. {student.lastName}, {student.name} </Text>
                    <Text>pays his tuition on time.</Text>
                </Text>
                <Image style={styles.sign} source={require('../../global/images/signature.png')} />
                <Text>PDSO – Principal Designated School Official</Text>
            </View>
            <Image style={styles.footer} source={require('../../global/images/enrollment-footer.png')} />
        </ViewShot>
        <View style={{ width: '100%', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
            <TouchableOpacity style={[{margin: 20}, theme.buttons.secondaryButton]} onPress={() => myAsyncPDFFunction()}>
                <BtnText>Download</BtnText>
            </TouchableOpacity>
            <TouchableOpacity style={[{margin: 20}, theme.buttons.secondaryButtonSimple]} onPress={() => setShowEnrollment(false)}>
                <BtnText>Fechar</BtnText>
            </TouchableOpacity>
        </View>
        </ScrollView>
    </Modal>
  </View>;
}

const styles = StyleSheet.create({
    logo: {
      marginHorizontal: 32,
      width: 81,
      height: 61
    },
    sign: {
      marginHorizontal: 0,
      width: null,
      flex: 1,
      height: 96
    },
    footer: {
      width: null,
      flex: 1,
      height: 37
    },
  });