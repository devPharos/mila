import React, { useEffect, useState, useContext } from 'react';
import { TouchableWithoutFeedback, Keyboard, ScrollView } from 'react-native';
import Header from '../../components/Header';
import { Page, Container, Main } from './styles';
import { RegisterContext } from '../../hooks/register';
import ClassReport from '../../components/ClassReport';
import Loading from '../../components/Loading';
import { isAfter, isBefore, parseISO } from 'date-fns';
import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
   handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
   }),
});

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

async function schedulePushNotification(month = 0, day = 0, hour = 0, minute = 0) {
   await Notifications.scheduleNotificationAsync({
   content: {
      title: "Today is your birthday! 🎉",
      body: 'Happy birthday to you!',
      // data: { data: 'goes here' },
   },
   trigger: { day, month, hour, minute, repeats: true },
   });
}

export function Dashboard({ navigation }) {
   // const { student } = useRegister();
   const [initializing, setInitializing] = useState(true);
   const { periods, periodDate, setGroup, groups } = useContext(RegisterContext);


   useEffect(() => {
      if(periodDate) {
         setInitializing(true);
         const retGroups = []
         let periodAbsences = 0;
         groups.forEach(g => {
            if(typeof g.otherClasses === 'undefined') {
               g.otherClasses = [];
            }
            if(typeof g.otherAbsences === 'undefined') {
               g.otherAbsences = [];
            }
            if(parseInt(periodDate.replace('-','')) >= parseInt(g.studentStartDate.substr(0,7).replace('-','')) && parseInt(periodDate.replace('-','')) <= parseInt(g.studentEndDate ? g.studentEndDate.substr(0,7).replace('-','') : g.groupEndDate.substr(0,7).replace('-',''))) {
               g.classes = [];
               periods.forEach(p => {
                  if(p.groupID === g.groupID) {
                     if(parseInt(p.period.replace('-','')) === parseInt(periodDate.replace('-',''))) {
                        p.classes.forEach(pclass => {
                           if(isAfter(parseISO(pclass.classDate),parseISO(g.studentStartDate)) && isBefore(parseISO(pclass.classDate),g.studentEndDate ? parseISO(g.studentEndDate) : parseISO(g.groupEndDate))) {
                              // console.log('pclass',pclass)
                              g.classes.push(pclass);
                              g.totalAbsences = p.totalAbsences || 0;
                           }
                        })
                     }
                     p.classes.forEach(pclass => {
                        if(!g.otherClasses.includes(pclass.classDate)) {
                           g.otherClasses.push(pclass.classDate);
                           if(pclass.presenceStatus === 'Absent') {
                              g.otherAbsences.push(pclass.classDate)
                           }
                        }
                     })
                  }
               })
               periodAbsences += parseInt(g.totalAbsences || 0)
               retGroups.push(g);
            }
         })
         retGroups.map(group => {
            return group.periodAbsences = periodAbsences;
         })
         setGroup(retGroups);
         setInitializing(false);
      }
   },[periodDate])
    
    return (
    <Page>
      <Header showLogo={true} />
        <ScrollView>
        {/* <Birthday /> */}
            <Container>
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <Main>
                     { initializing ? <Loading title="Loading..." /> :
                        <ClassReport />
                     }
                    </Main>
                </TouchableWithoutFeedback>
            </Container>
        </ScrollView>
    </Page>
);
}