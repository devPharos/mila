import React, { createContext, useContext, useState, useEffect } from 'react';
import auth from '@react-native-firebase/auth';
import { Alert } from 'react-native';
import api from '../service/api';
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';
import { capitalizeFirstLetter } from '../global/functions/dashboard';

export const RegisterContext = createContext([]);

function RegisterProvider({ children }) {
    const [student,setStudent] = useState({
        registrationNumber: null, 
        email: null, 
        registration: null, 
        pass: null, 
        pass_confirm: null, 
        name: null, 
        level: null,
        imageUrl: null,
        schedule: null,
        birthDate: null,
        country: null,
        currentGroup: null,
        emailVerified: false
    });
    const [dashboard, setDashboard] = useState({ data: {}, fromDate: new Date() });

    const [period,setPeriod] = useState(null);
    const [periods,setPeriods] = useState([]);
    
    const [periodDate,setPeriodDate] = useState(null);
    const [periodDates,setPeriodDates] = useState([]);
    const [group,setGroup] = useState(null);
    const [groups,setGroups] = useState([]);

    async function updateDashboard(data) {
        setDashboard({...dashboard, data, fromDate: new Date()})
    }

    async function onAuthStateChanged(authenticated) {

        if(authenticated && authenticated.email) {
            
            await firestore()
            .collection('Students')
            .where('email','==',authenticated.email)
            .get()
            .then(querySnapshot => {
                querySnapshot.forEach(async documentSnapshot => {
                    const data = documentSnapshot.data()

                    firestore()
                        .collection('Students')
                        .doc(data.registrationNumber)
                        .onSnapshot(async documentSnapshot => {
                            const { email, name, lastName, level, schedule, birthDate, country, registration, registrationNumber, imageUrl } = documentSnapshot.data()
                            setStudent({ ...student, email, name, lastName, level, schedule, birthDate, country, registration, registrationNumber, imageUrl})

                            await getStudentFromAPI(registration, level, schedule, name, birthDate);
                            await getDashboardData(registration)
                        })
                })
            })
        }

    }

    async function profilePicChange(url, registrationNumber, email) {

        const reference = storage().ref('profile_'+registrationNumber);
        await reference.putFile(url);

        const finalUrl = await storage().ref('profile_'+registrationNumber).getDownloadURL();
        firestore()
        .collection('Students')
        .where('email','==',email)
        .get()
        .then(querySnapshot => {
            querySnapshot.forEach((doc) => {
                firestore().collection('Students').doc(doc.id).update({
                    imageUrl: finalUrl
                })
            })
        })
    }

    async function getStudentFromFirestore(email, updateDashboard, setPeriod, setPeriods, setGroups, setPeriodDates, setPeriodDate, setInitializing) {
        // console.log('Getting student by e-mail')
        await firestore()
        .collection('Students')
        .where('email','==',email)
        .get()
        .then(querySnapshot => {
              querySnapshot.forEach(async documentSnapshot => {
              const { email, name, level, schedule, birthDate, country, registration, registrationNumber, imageUrl } = documentSnapshot.data()
              setStudent({ ...student, email, name, level, schedule, birthDate, country, registration, registrationNumber, imageUrl})
            //   console.log({ ...student, email, name, level, schedule, birthDate, country, registration, registrationNumber, imageUrl })

              await getStudentFromAPI(registration, level, schedule, name, birthDate);
              await getDashboardData(registration)
              });
        })

    }

    async function getStudentFromAPI(registration, level, schedule, name, birthDate) {
        // console.log('getStudentFromAPI')
        try {
           const { data } = await api.get(`/students/${registration}`);

            if(level !== capitalizeFirstLetter(data.data.currentGroup.level) || schedule !== capitalizeFirstLetter(data.data.currentGroup.schedule) || name !== capitalizeFirstLetter(data.data.name)) {
                // console.log('Precisou atualizar no firestore', name, capitalizeFirstLetter(data.data.name))
                firestore()
                .collection('Students')
                .where('email','==',student.email)
                .get()
                .then(querySnapshot => {
                    querySnapshot.forEach((doc) => {
                        firestore().collection('Students').doc(doc.id).update({
                            name: capitalizeFirstLetter(data.data.name),
                            level: capitalizeFirstLetter(data.data.currentGroup.level),
                            schedule: capitalizeFirstLetter(data.data.currentGroup.schedule),
                            birthDate: data.data.birthDate,
                            country: data.data.country
                        })
                    })
                })
            }
           
        } catch(err) {
            // console.log('Error!', err)
        }
    }

    async function getDashboardData(registration) {
        // console.log('Getting dashboard data...')
        async function findUnique(datas) {
           const unique = [];
           datas.forEach(data => {
              if(!unique.includes(data.period)) {
                 unique.push(data.period);
              }
           });
           return unique;
        }
        try {
           const { data } = await api.get(`/students/dashboard/${registration}`);
            setDashboard({...dashboard, ...data.data, fromDate: new Date()});
            setPeriod(data.data.periods[data.data.periods.length - 1]);
            setPeriods(data.data.periods);
            setGroups(data.data.groups)
            const myPeriods = await findUnique(data.data.periods.reverse());
            setPeriodDates(myPeriods);
            setPeriodDate(myPeriods[0]);
            // console.log('Gotted!', myPeriods[0])
        } catch(err) {
            // console.log('Error', err)
        }
    }

    useEffect(() => {
        const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
        return subscriber; // unsubscribe on unmount
    }, []);

    return (
        <RegisterContext.Provider value={{student, setStudent, dashboard, updateDashboard, profilePicChange, getStudentFromFirestore, getStudentFromAPI, getDashboardData, period,setPeriod, periods,setPeriods, periodDate,setPeriodDate,group,setGroup, periodDates,setPeriodDates,groups,setGroups}} >
            { children }
        </RegisterContext.Provider>
    )
}

function logOut() {
    auth()
        .signOut()
}

function logIn(form, setLoginError, loginError, setLoading) {
    auth()
    .signInWithEmailAndPassword(form.email, form.pass)
    .then(() => {
    })
    .catch(error => {
        setLoading(false)
        if(error.code === 'auth/wrong-password') {
            setLoginError({ ...loginError, pass: true });
            Alert.alert("Attention!","Wrong password.");
        }
        if(error.code === 'auth/user-not-found') {
            setLoginError({ ...loginError, email: true, registrationNumber: true });
            Alert.alert("Attention!","Registration Number or Email Address not found. Please check your invitation to confirm.");
        }
    });
}

async function findUserByEmailAndStudentCode(account, navigation) {
    await firestore()
        .collection('Students')
        .doc(account.registrationNumber)
        .get()
        .then(documentSnapshot => {
            if(documentSnapshot.exists) {
                const { email } = documentSnapshot.data()
                if(email === account.email) {
                    Alert.alert("Attention!","Email already in use. Try to log in instead.")
                    navigation.navigate('Login', { existRegistrationNumber: account.registrationNumber, existEmail: account.email });
                    return;
                }
                Alert.alert("Attention!","Wrong Email.")
                return;
            }
            navigation.push('CreatePassword');
            return;
        });
}

function createUserWithEmailAndPassword(account,navigation) {
    auth()
        .createUserWithEmailAndPassword(account.email,account.pass)
        .then(() => {
            firestore()
                .collection('Students')
                .doc(account.registrationNumber)
                .set({
                    type: 'Student',
                    email: account.email,
                    registration: account.registration,
                    registrationNumber: account.registrationNumber,
                    imageUrl: null,
                    name: null,
                    level: null,
                    birthDate: null,
                    country: null,
                    createdAt: new Date()
                })
                .then(() => {
                });
            
        })
        .catch(error => {
            if (error.code === 'auth/email-already-in-use') {
                Alert.alert("Attention!","E-mail already in use. Try to log in instead.")
                navigation.navigate('Login', { existRegistrationNumber: account.registrationNumber, existEmail: account.email });
                return;
            }

            if (error.code === 'auth/invalid-email') {
                return;
            }
            Alert.alert("Attention!",error.message);
            // console.error(error);
            return;
        });
}

function useRegister() {
    const context = useContext(RegisterContext);

    return context
}

export { RegisterProvider, useRegister, createUserWithEmailAndPassword, findUserByEmailAndStudentCode, logIn, logOut }