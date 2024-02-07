import React, {  useState, useEffect, useContext } from 'react';
import { Page, Main, Profilepic } from './styles';
import { TouchableOpacity, ScrollView, Text, View, Image } from 'react-native';
import { FontAwesome, FontAwesome5 } from '@expo/vector-icons';
import auth from '@react-native-firebase/auth';
import QRCode from 'react-native-qrcode-svg';

import Header from '../../components/Header';
import { RegisterContext, useRegister } from '../../hooks/register';
import theme from '../../global/styles/theme';
import logoFromFile from '../../global/images/icon_4x.png'
import * as ImagePicker from 'expo-image-picker';
import EnrollmentConfirmation from '../../components/EnrollmentConfirmation';
import Birthday from '../../components/Birthday';
import { format } from 'date-fns';
import { Buffer } from 'buffer'



export function Profile() {
   const [openBirthdayModal, setOpenBirthdayModal] = useState(false);
   const [showEnrollment, setShowEnrollment] = useState(false);
   const authenticated = auth().currentUser;
   const { profilePicChange } = useContext(RegisterContext)
   const { student } = useRegister();

   const pickImage = async () => {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

  
      if (!result.canceled) {
         await profilePicChange(result.uri, student.registrationNumber, authenticated.email);
      }
    };

    useEffect(() => {
      if(student.birthDate.substring(5) === format(new Date(), 'MM-dd')) {
         setOpenBirthdayModal(true);
      }
    },[student])

   return (<Page>
      <Header showLogo={true} student={student} />
      
      <ScrollView>
         <Main>
         
         <TouchableOpacity style={theme.buttons.secondaryButtonSimple} onPress={pickImage}>

            <Profilepic style={{ alignItems: 'center', justifyContent: 'center'}}>


            { student.imageUrl ?
               <Image source={{ uri: student.imageUrl }} style={{ width: 180, height: 180, borderRadius: 24 }} />
             :
               <Image source={require('../../global/images/no-pic.png')} style={{ width: 180, height: 180, borderRadius: 24 }} />
            }

            </Profilepic>

         </TouchableOpacity>
         <Text style={{ fontWeight: 'bold',color: theme.colors.secondary, paddingTop: 32, fontSize: 18 }}>{student.name} {student.lastName}</Text>
         <View style={{ flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'space-evenly', height: 180,paddingVertical: 12 }}>
            <View style={{ flexDirection: 'row'}}>
               <Text style={{ fontWeight: 'bold' }}>Student ID: </Text>
               <Text>{student.registrationNumber}</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center'}}>
               <FontAwesome name="envelope" color="#222" size={16} />
               <Text>   {student.email}</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center'}}>
               <FontAwesome5 name="school" color="#222" size={16} />
               <Text>   {student.registrationNumber.substring(0,3) === 'ORL' ? 'Orlando' : student.registrationNumber.substring(0,3) === 'MIA' ? 'Miami' : student.registrationNumber.substring(0,3) === 'BOC' ? 'Boca Raton' : ''}</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center'}}>
               <FontAwesome5 name="medal" color="#222" size={16} />
               <Text>   {student.level.toUpperCase()}</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center'}}>
               <FontAwesome5 name="medal" color="#222" size={16} />
               <Text>   Valid Thru: Dec, {new Date().getFullYear()} </Text>
            </View>
         </View>
         <View style={{ flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'space-evenly', flex: 1, borderTopWidth: 1, borderTopColor: 'rgba(0,0,0,.1)', width: '90%' }}>
         
            <Text style={{ color: theme.colors.secondary, marginBottom: -10, fontWeight: 'bold', fontSize: 18, textAlign: 'center', width: '100%',paddingVertical: 12 }}>MILA ID</Text>
            {/* <Text style={{ textAlign: 'center', width: '100%',paddingVertical: 12, paddingHorizontal: 26 }}>Scan this code at the locations that require your MILA ID.</Text> */}
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: '100%',paddingVertical: 12}}>
               <QRCode
                  value={`${Buffer.from(student.registrationNumber+"-"+student.registration, 'utf-8').toString('base64')}`}
                  logo={logoFromFile}
                  logoSize={30}
                  size={160}
                  logoBackgroundColor="#FFF"
               />
            </View>
         </View>
         {/* <TouchableOpacity style={theme.buttons.secondaryButton} onPress={() => setShowEnrollment(true)}>
            <BtnText>📃 Enrollment Letter</BtnText>
         </TouchableOpacity> */}
            
            
         </Main>
      </ScrollView>
      
      { openBirthdayModal ?
         <Birthday setOpenBirthdayModal={setOpenBirthdayModal} student={student} />
         : null }

      {showEnrollment ?
         <EnrollmentConfirmation setShowEnrollment={setShowEnrollment} />
      :
      null}
   </Page>);
}