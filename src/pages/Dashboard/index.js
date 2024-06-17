import React, { useEffect, useState, useContext } from 'react';
import { TouchableWithoutFeedback, Keyboard, ScrollView, Text, TouchableOpacity, Linking, Alert } from 'react-native';
import Header from '../../components/Header';
import { Page, Container, Main } from './styles';
import { RegisterContext, useRegister } from '../../hooks/register';
import ClassReport from '../../components/ClassReport';
import Loading from '../../components/Loading';
import { Entypo } from '@expo/vector-icons';
import { isAfter, isBefore, parseISO, subDays, addDays, format } from 'date-fns';
import theme from '../../global/styles/theme';
import { BtnText } from '../Home/styles'
// import * as Notifications from 'expo-notifications';

// Notifications.setNotificationHandler({
//    handleNotification: async () => ({
//       shouldShowAlert: true,
//       shouldPlaySound: false,
//       shouldSetBadge: false,
//    }),
// });

// async function registerForPushNotificationsAsync() {
//    let token;

//    if (Platform.OS === 'android') {
//    await Notifications.setNotificationChannelAsync('default', {
//       name: 'default',
//       importance: Notifications.AndroidImportance.MAX,
//       vibrationPattern: [0, 250, 250, 250],
//       lightColor: '#FF231F7C',
//    });
//    }

//    const { status: existingStatus } = await Notifications.getPermissionsAsync();
//    let finalStatus = existingStatus;
//    if (existingStatus !== 'granted') {
//       const { status } = await Notifications.requestPermissionsAsync();
//       finalStatus = status;
//    }
//    if (finalStatus !== 'granted') {
//       alert('Failed to get push token for push notification!');
//       return;
//    }
//    token = (await Notifications.getExpoPushTokenAsync()).data;

//    return token;
// }

// async function schedulePushNotification(month = 0, day = 0, hour = 0, minute = 0) {
//    await Notifications.scheduleNotificationAsync({
//    content: {
//       title: "Today is your birthday! 🎉",
//       body: 'Happy birthday to you!',
//       // data: { data: 'goes here' },
//    },
//    trigger: { day, month, hour, minute, repeats: true },
//    });
// }

export function Dashboard({ navigation }) {
   const [initializing, setInitializing] = useState(true);
   const { periods, periodDate, setGroup, groups, params, frequency, student, group, blockedStudent, logOut } = useContext(RegisterContext);

   useEffect(() => {
      if (student.registrationNumber) {
         if (!params.allowed_users.includes(student.registrationNumber.trim())) {
            if (student.registrationNumber.substring(0, 3) === 'ORL' && params.access_orlando === false) {
               Alert.alert("Attention!", "Orlando access is not yet available.")
               logOut()
            }

            if (student.registrationNumber.substring(0, 3) === 'MIA' && params.access_miami === false) {
               Alert.alert("Attention!", "Miami access is not yet available.")
               logOut()
            }

            if (student.registrationNumber.substring(0, 3) === 'BOC' && params.access_boca === false) {
               Alert.alert("Attention!", "Boca Raton access is not yet available.")
               logOut()
            }
         }
      }
   }, [params.allowed_users, params.access_orlando, params.access_miami, params.access_boca, student.registrationNumber])

   useEffect(() => {
      if (!blockedStudent && periodDate) {
         setInitializing(true);
         const retGroups = []
         groups.forEach(g => {
            if (typeof g.otherClasses === 'undefined') {
               g.otherClasses = [];
            }
            if (typeof g.otherAbsences === 'undefined') {
               g.otherAbsences = [];
            }
            if (parseInt(periodDate.replace('-', '')) >= parseInt(g.studentStartDate.substr(0, 7).replace('-', '')) && parseInt(periodDate.replace('-', '')) <= parseInt(g.studentEndDate ? g.studentEndDate.substr(0, 7).replace('-', '') : g.groupEndDate.substr(0, 7).replace('-', ''))) {
               g.classes = [];
               periods.forEach(p => {
                  if (p.groupID === g.groupID) {
                     if (parseInt(p.period.replace('-', '')) === parseInt(periodDate.replace('-', ''))) {
                        p.classes.forEach(pclass => {
                           if (isAfter(parseISO(pclass.classDate), subDays(parseISO(g.studentStartDate), 1)) && isBefore(parseISO(pclass.classDate), g.studentEndDate ? parseISO(g.studentEndDate) : parseISO(g.groupEndDate))) {
                              g.classes.push(pclass);
                           }
                        })
                     }
                     p.classes.forEach(pclass => {
                        if (!g.otherClasses.includes(pclass.classDate)) {
                           g.otherClasses.push(pclass.classDate);
                           if (pclass.presenceStatus === 'Absent') {
                              g.otherAbsences.push(pclass.classDate)
                           }
                        }
                     })
                  }
               })
               retGroups.push(g);
            }
         })
         setGroup(retGroups);
         setInitializing(false);
      }
      if (blockedStudent) {
         setInitializing(false)
      }
   }, [periodDate])

   return (
      <Page>
         <Header showLogo={true} navigation={navigation} drawer={`${group ? 'Dashboard' : ''}`} />
         <ScrollView>
            {/* <Birthday /> */}
            <Container>
               <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                  <Main>
                     {initializing ? <Loading title="Loading..." /> :
                        blockedStudent ?
                           <>
                              <Container style={{
                                 backgroundColor: "#FFF",
                                 width: '90%',
                                 flexDirection: 'column',
                                 alignItems: 'center',
                                 justifyContent: 'space-between',
                                 padding: 32,
                                 borderRadius: 16
                              }}>
                                 <Text style={{ textAlign: 'left', width: '100%' }}>Dear student,</Text>

                                 <Text style={{ textAlign: 'left', width: '100%', marginTop: 32, marginBottom: 8 }}>Your status has been changed to ex-student. In case you need any information, please contact: </Text>
                                 {student.registrationNumber && student.registrationNumber.substring(0, 3) === 'ORL' ?
                                    <TouchableOpacity style={{ textAlign: 'left', width: '100%' }} onPress={() => Linking.openURL(`mailto:${params.contact_orl}?subject=Ex-student access`)}>
                                       <Text style={{ fontWeight: 'bold' }}>
                                          <Entypo name="info-with-circle" /> {params.contact_orl}
                                       </Text>
                                    </TouchableOpacity>
                                    : student.registrationNumber && student.registrationNumber.substring(0, 3) === 'MIA' ?
                                       <TouchableOpacity style={{ textAlign: 'left', width: '100%' }} onPress={() => Linking.openURL(`mailto:${params.contact_mia}?subject=Ex-student access`)}>
                                          <Text style={{ fontWeight: 'bold' }}>
                                             <Entypo name="info-with-circle" /> {params.contact_mia}
                                          </Text>
                                       </TouchableOpacity>
                                       : student.registrationNumber && student.registrationNumber.substring(0, 3) === 'BOC' ?
                                          <TouchableOpacity style={{ textAlign: 'left', width: '100%' }} onPress={() => Linking.openURL(`mailto:${params.contact_boc}?subject=Ex-student access`)}>
                                             <Text style={{ fontWeight: 'bold' }}>
                                                <Entypo name="info-with-circle" /> {params.contact_boc}
                                             </Text>
                                          </TouchableOpacity>
                                          :
                                          <TouchableOpacity style={{ textAlign: 'left', width: '100%' }} onPress={() => Linking.openURL(`mailto:${params.contact_orl}?subject=Student Dashboard`)}>
                                             <Text style={{ fontWeight: 'bold' }}>
                                                <Entypo name="info-with-circle" /> {params.contact_orl}
                                             </Text>
                                          </TouchableOpacity>
                                 }
                                 <Text style={{ textAlign: 'left', width: '100%' }}>MILA's Intelligence Team</Text>

                              </Container>
                              <TouchableOpacity style={[theme.buttons.secondaryButton, { flexDirection: 'column', height: 60 }]} onPress={() => { navigation.push('AccessChanged') }}>
                                 <BtnText style={{ fontSize: 14 }}>I have been transfered to</BtnText>
                                 <BtnText style={{ fontSize: 14 }}>another MILA branch</BtnText>
                              </TouchableOpacity>
                           </>
                           :
                           frequency[frequency.findIndex(freq => freq.period === format(new Date(), 'Y-MM'))].percFrequency < params.maxAbsenses ?
                              <Container style={{
                                 backgroundColor: "#FFF",
                                 width: '90%',
                                 flexDirection: 'column',
                                 alignItems: 'center',
                                 justifyContent: 'space-between',
                                 padding: 32,
                                 borderRadius: 16
                              }}>
                                 <Text style={{ textAlign: 'left', width: '100%' }}>Dear student,</Text>

                                 <Text style={{ textAlign: 'left', width: '100%', marginTop: 32, marginBottom: 8 }}>Please send an e-mail to</Text>
                                 {student.registrationNumber && student.registrationNumber.substring(0, 3) === 'ORL' ?
                                    <TouchableOpacity style={{ textAlign: 'left', width: '100%' }} onPress={() => Linking.openURL(`mailto:${params.contact_orl}?subject=Student Dashboard`)}>
                                       <Text style={{ fontWeight: 'bold' }}>
                                          <Entypo name="info-with-circle" /> {params.contact_orl}
                                       </Text>
                                    </TouchableOpacity>
                                    : student.registrationNumber && student.registrationNumber.substring(0, 3) === 'MIA' ?
                                       <TouchableOpacity style={{ textAlign: 'left', width: '100%' }} onPress={() => Linking.openURL(`mailto:${params.contact_mia}?subject=Student Dashboard`)}>
                                          <Text style={{ fontWeight: 'bold' }}>
                                             <Entypo name="info-with-circle" /> {params.contact_mia}
                                          </Text>
                                       </TouchableOpacity>
                                       : student.registrationNumber && student.registrationNumber.substring(0, 3) === 'BOC' ?
                                          <TouchableOpacity style={{ textAlign: 'left', width: '100%' }} onPress={() => Linking.openURL(`mailto:${params.contact_boc}?subject=Student Dashboard`)}>
                                             <Text style={{ fontWeight: 'bold' }}>
                                                <Entypo name="info-with-circle" /> {params.contact_boc}
                                             </Text>
                                          </TouchableOpacity>
                                          :
                                          <TouchableOpacity style={{ textAlign: 'left', width: '100%' }} onPress={() => Linking.openURL(`mailto:${params.contact_orl}?subject=Student Dashboard`)}>
                                             <Text style={{ fontWeight: 'bold' }}>
                                                <Entypo name="info-with-circle" /> {params.contact_orl}
                                             </Text>
                                          </TouchableOpacity>
                                 }
                                 <Text style={{ textAlign: 'left', width: '100%', marginTop: 8, marginBottom: 32 }}>to receive information about your attendance.</Text>

                                 <Text style={{ textAlign: 'left', width: '100%' }}>MILA's Intelligence Team</Text>
                              </Container>
                              :
                              <ClassReport navigation={navigation} />
                     }
                  </Main>
               </TouchableWithoutFeedback>
            </Container>
         </ScrollView>
      </Page>
   );
}
