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
        type: null,
        name: null, 
        level: null,
        imageUrl: null,
        schedule: null,
        birthDate: null,
        country: null,
        currentGroup: null,
        emailVerified: false,
        medicalExcuses: [],
        vacations: []
    }
    
    const defaultParams = {
        access_boca: true, 
        access_miami: true, 
        access_orlando: true, 
        allow_class_excuses: 'ORL', 
        allow_vacations: 'ORL', 
        allow_partners: 'ORL', 
        allowed_users: '', 
        contact_boc: 'dso@milabocausa.com',
        contact_mia: 'dso@milamiamiusa.com',
        contact_orl: 'dso@milaorlandousa.com',

        jotform_api_key: '29033d6c15e1b4bbe6e8c26fb3042369',
        jotform_medical_excuse_url_code: '233476310418049',
        jotform_vacation_url_code: '240667036541152',
        jotform_partners_url_code: '240026141878151',

        limit_periods_to_students: 2, 
        maxAbsenses: 0,
        version_android: '', 
        version_ios: '',
    }
    const defaultDashboard = { data: {}, fromDate: new Date() };
    const [student,setStudent] = useState(defaultStudent);
    const [dashboard, setDashboard] = useState(defaultDashboard);
    const [params, setParams] = useState(defaultParams);

    const [period,setPeriod] = useState(null);
    const [periods,setPeriods] = useState([]);

    const [blockedStudent, setBlockedStudent] = useState(false)
    
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
                    const dataParams = documentSnapshot.data();
                    setParams({...dataParams });
                })
            }).finally(async () => {
                await firestore()
                .collection('Students')
                .where('email','==',authenticated.email)
                .get()
                .then(querySnapshot => {
                    querySnapshot.forEach(async documentSnapshot => {
                        const userFB = documentSnapshot.data()
                        await getStudentFromAPI(userFB);

                        if(authenticated.email !== userFB.email) {
                            await authenticated.updateEmail(userFB.email)
                            Alert.alert("Attention!",`Your email has been changed to ${userFB.email.trim()}. Please use it in your next access.`)
                        }
                        
                        setStudent({ ...student, email: userFB.email, type: userFB.type, name: userFB.name, lastName: userFB.lastName, level: userFB.level, schedule: userFB.schedule, birthDate: userFB.birthDate, country: userFB.country, registration: userFB.registration, registrationNumber: userFB.registrationNumber, imageUrl: userFB.imageUrl, nsevis: userFB.nsevis, medicalExcuses: userFB.medicalExcuses, vacations: userFB.vacations})
                        if(userFB.type !== 'Student') {
                            setBlockedStudent(true)
                            return
                        }
                        await getDashboardData(userFB);
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

            if(userFB.type !== data.data.type || userFB.email !== data.data.email.toLowerCase() || userFB.country !== capitalizeFirstLetter(data.data.country) || userFB.nsevis !== data.data.nsevis || userFB.level !== capitalizeFirstLetter(data.data.currentGroup.level) || userFB.schedule !== capitalizeFirstLetter(data.data.currentGroup.schedule) || userFB.name !== capitalizeFirstLetter(data.data.name) || userFB.lastName !== lastName) {
                await firestore().collection('Students').doc(userFB.registrationNumber).update({
                    name: capitalizeFirstLetter(data.data.name),
                    lastName,
                    level: capitalizeFirstLetter(data.data.currentGroup.level),
                    schedule: capitalizeFirstLetter(data.data.currentGroup.schedule),
                    birthDate: data.data.birthDate,
                    country: capitalizeFirstLetter(data.data.country),
                    nsevis: data.data.nsevis,
                    type: data.data.type,
                    email: data.data.email.toLowerCase()
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
            const today = new Date();
            const month = today.getMonth();
            const year = today.getFullYear();
            const thisPeriod = year+"-"+(month+1).toString().padStart(2, '0');
            const { data } = await api.get(`/students/dashboard/${userFB.registration}`);

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

    function logOut() {
        setStudent(defaultStudent)
        auth()
            .signOut()
    }

    useEffect(() => {
        const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
        return subscriber; // unsubscribe on unmount
    }, []);

    return (
        <RegisterContext.Provider value={{ logOut, student, setStudent, blockedStudent, dashboard, updateDashboard, profilePicChange, getStudentFromAPI, getDashboardData, period,setPeriod, periods,setPeriods, periodDate,setPeriodDate,group,setGroup, periodDates,setPeriodDates,groups,setGroups, frequency, setFrequency, params}} >
            { children }
        </RegisterContext.Provider>
    )
}

async function logIn(form, setLoginError, loginError, setLoading, navigation) {
    let params = {}
    await firestore()
        .collection('Params')
        .get()
        .then(querySnapshot => {
            querySnapshot.forEach(async documentSnapshot => {
                params = documentSnapshot.data();
            })
        }).finally(() => {

            if(!params.allowed_users.includes(form.registrationNumber.trim())) {
                if(form.registrationNumber && form.registrationNumber.substring(0,3) === 'ORL' && params.access_orlando === false) {
                    Alert.alert("Attention!","Orlando access is not yet available.")
                    return
                }
            
                if(form.registrationNumber && form.registrationNumber.substring(0,3) === 'MIA' && params.access_miami === false) {
                    Alert.alert("Attention!","Miami access is not yet available.")
                    return
                }
            
                if(form.registrationNumber && form.registrationNumber.substring(0,3) === 'BOC' && params.access_boca === false) {
                    Alert.alert("Attention!","Boca Raton access is not yet available.")
                    return
                }
            }

            auth()
                .signInWithEmailAndPassword(form.email, form.pass)
                .then(() => {
                })
                .catch(async error => {
                    setLoading(false)
                    if(error.code === 'auth/wrong-password') {
                        setLoginError({ ...loginError, pass: true });
                        Alert.alert("Attention!","Wrong password.");
                    }
                    if(error.code === 'auth/user-not-found') {
                        setLoginError({ ...loginError, email: true, registrationNumber: true });
                        await firestore()
                        .collection('Students')
                        .doc(form.registrationNumber)
                        .get()
                        .then(documentSnapshot => {
                            if(documentSnapshot.exists) {
                                const { email } = documentSnapshot.data()
                                if(email.toLowerCase().trim() !== form.email.toLowerCase().trim()) {
                                    Alert.alert("Attention!",`Another email is set to your account, please login once more using the email: ${email.toLowerCase()}`)
                                    navigation.navigate('Login', { existRegistrationNumber: form.registrationNumber.toUpperCase(), existEmail: email.toLowerCase() });
                                    return;
                                }
                            }
                            Alert.alert("Attention!","Registration Number or Email Address not found. Please check your invitation to confirm.");
                        });
                    }
                });
        })

}

function forgotPW(form, setLoginError, loginError, setLoading, setRecoverySent) {
    auth()
    .sendPasswordResetEmail(form.email.toLowerCase())
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
                if(email === account.email.toLowerCase()) {
                    Alert.alert("Attention!","Email already in use. Try to log in instead.")
                    navigation.navigate('Login', { existRegistrationNumber: account.registrationNumber.toUpperCase(), existEmail: account.email.toLowerCase() });
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
        .createUserWithEmailAndPassword(account.email.toLowerCase(),account.pass)
        .then(() => {
            createUserAtFirebase(account)
            
        })
        .catch(error => {
            if (error.code === 'auth/email-already-in-use') {
                Alert.alert("Attention!","E-mail already in use. Try to log in instead.")
                navigation.navigate('Login', { existRegistrationNumber: account.registrationNumber.toUpperCase(), existEmail: account.email.toLowerCase() });
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

async function createUserAtFirebase(account) {
    try {
        await firestore()
        .collection('Students')
        .doc(account.registrationNumber.toUpperCase())
        .set({
            ...account,
            type: 'Student',
            email: account.email.toLowerCase(),
            registration: account.registration,
            registrationNumber: account.registrationNumber.toUpperCase(),
            imageUrl: account.imageUrl || null,
            name: account.name || null,
            lastName: account.lastName || null,
            level: account.level || null,
            birthDate: account.birthDate || null,
            country: account.country || null,
            nsevis: account.nsevis || null,
            schedule: account.schedule || null,
            createdAt: new Date()
        }).then(() => {
            console.log('Usuário criado')
            return true
        }).catch(() => {
            console.log('Erro')
            return false
        })
    } catch(err) {
        console.log(err)
    }
}

async function removeUser(account) {
    await firestore()
    .collection('Students')
    .doc(account.registrationNumber.toUpperCase())
    .delete()
    .then(() => {
      return true
    }).catch(() => {
        return false
    });
}

function useRegister() {
    const context = useContext(RegisterContext);

    return context
}

export { RegisterProvider, useRegister, createUserWithEmailAndPassword, createUserAtFirebase, removeUser, findUserByEmailAndStudentCode, logIn, forgotPW }