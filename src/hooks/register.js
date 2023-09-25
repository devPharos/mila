import React, { createContext, useContext, useState, useEffect } from 'react';
import auth from '@react-native-firebase/auth';
import { Alert } from 'react-native';
import api from '../service/api';
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';
import { capitalizeFirstLetter } from '../global/functions/dashboard';

export const RegisterContext = createContext([]);

function RegisterProvider({ children }) {
    const defaultStudent = {
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
    }
    const defaultDashboard = { data: {}, fromDate: new Date() };
    const [student,setStudent] = useState(defaultStudent);
    const [dashboard, setDashboard] = useState(defaultDashboard);
    const [params, setParams] = useState({ maxAbsenses: 0 });

    const [period,setPeriod] = useState(null);
    const [periods,setPeriods] = useState([]);
    
    const [periodDate,setPeriodDate] = useState(null);
    const [periodDates,setPeriodDates] = useState([]);

    const [group,setGroup] = useState(null);
    const [groups,setGroups] = useState([]);

    const [frequency,setFrequency] = useState(null);

    async function updateDashboard(data) {
        setDashboard({...dashboard, data, fromDate: new Date()})
    }

    async function onAuthStateChanged(authenticated) {

        if(authenticated && authenticated.email) {

            await firestore()
            .collection('Params')
            .get()
            .then(querySnapshot => {
                querySnapshot.forEach(async documentSnapshot => {
                    const data = documentSnapshot.data();
                    setParams({...params, ...data });
                })
            })

            await firestore()
            .collection('Students')
            .where('email','==',authenticated.email)
            .get()
            .then(querySnapshot => {
                querySnapshot.forEach(async documentSnapshot => {
                    const userFB = documentSnapshot.data()
                    await getStudentFromAPI(userFB);
                    
                    setStudent({ ...student, email: userFB.email, name: userFB.name, lastName: userFB.lastName, level: userFB.level, schedule: userFB.schedule, birthDate: userFB.birthDate, country: userFB.country, registration: userFB.registration, registrationNumber: userFB.registrationNumber, imageUrl: userFB.imageUrl, nsevis: userFB.nsevis})
                    await getDashboardData(userFB);
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

    async function getStudentFromAPI(userFB) {
        try {
           const { data } = await api.get(`/students/${userFB.registration}`);

           let lastName = "";
           const arrayLastName = data.data.lastName.split(" ");
           for (var i = 0; i < arrayLastName.length; i++) {
               if(lastName.trim() != '') {
                   lastName += " ";
               }
               if(arrayLastName[i].length > 3) {
                lastName += capitalizeFirstLetter(arrayLastName[i]);
               } else {
                lastName += arrayLastName[i];
               }
           }

            if(userFB.nsevis !== data.data.nsevis || userFB.level !== capitalizeFirstLetter(data.data.currentGroup.level) || userFB.schedule !== capitalizeFirstLetter(data.data.currentGroup.schedule) || userFB.name !== capitalizeFirstLetter(data.data.name) || userFB.lastName !== lastName) {
                console.log('Mudou')
                await firestore().collection('Students').doc(userFB.registrationNumber).update({
                    name: capitalizeFirstLetter(data.data.name),
                    lastName,
                    level: capitalizeFirstLetter(data.data.currentGroup.level),
                    schedule: capitalizeFirstLetter(data.data.currentGroup.schedule),
                    birthDate: data.data.birthDate,
                    country: data.data.country,
                    nsevis: data.data.nsevis
                })
            }
           
        } catch(err) {
            // console.log('Error!', err)
        }
    }

    async function getDashboardData(userFB) {
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
           const { data } = await api.get(`/students/dashboard/${userFB.registration}`);
           const today = new Date();
           const month = today.getMonth();
           const year = today.getFullYear();
           const thisPeriod = year+"-"+(month+1).toString().padStart(2, '0');

            setDashboard({...dashboard, ...data.data, fromDate: new Date()});
            data.data.periods.map(p => {
                if(p.period == thisPeriod) {
                    setPeriod(p);
                }
            })

            setPeriods(data.data.periods);
            setGroups(data.data.groups);
            setFrequency(data.data.frequency);

            const myPeriods = await findUnique(data.data.periods.reverse());
            setPeriodDates(myPeriods);
            setPeriodDate(thisPeriod);
        } catch(err) {
            // console.log('Error', err)
        }
    }

    useEffect(() => {
        const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
        return subscriber; // unsubscribe on unmount
    }, []);

    return (
        <RegisterContext.Provider value={{student, setStudent, dashboard, updateDashboard, profilePicChange, getStudentFromAPI, getDashboardData, period,setPeriod, periods,setPeriods, periodDate,setPeriodDate,group,setGroup, periodDates,setPeriodDates,groups,setGroups, frequency, setFrequency, params}} >
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

function forgotPW(form, setLoginError, loginError, setLoading, setRecoverySent) {
    auth()
    .sendPasswordResetEmail(form.email)
    .then(() => {
        setLoading(false)
        setRecoverySent(true);
    })
    .catch(error => {
        setLoading(false)
        if(error.code === 'auth/user-not-found') {
            setLoginError({ ...loginError, email: true });
            // Alert.alert("Attention!","Email Address not found.");
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

export { RegisterProvider, useRegister, createUserWithEmailAndPassword, findUserByEmailAndStudentCode, logIn, logOut, forgotPW }