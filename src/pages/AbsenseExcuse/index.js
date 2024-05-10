import React, { useEffect, useRef, useState } from 'react';
import { Page } from './styles';
import { WebView } from 'react-native-webview';
import Header from '../../components/Header';
import { useRegister } from '../../hooks/register';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { FlatList, Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import firestore from '@react-native-firebase/firestore';
import theme from '../../global/styles/theme';

export function AbsenseExcuse({ navigation }) {
   const { student, setStudent, params } = useRegister();
   const [editForm, setEditForm] = useState(null)
   const webviewRef = useRef();
   const Stack = createNativeStackNavigator();

   const List = () => {
      const [medicalExcuses, setMedicalExcuses] = useState([]);
      const [loading, setLoading] = useState(true)
      useEffect(() => {
         if(loading && student.medicalExcuses) {
            setMedicalExcuses([])
            setLoading(false)
            const list = [];
            student.medicalExcuses.map(async (excuse) => {
               return list.push(
                  axios.get(`https://api.jotform.com/submission/${excuse}?apikey=${params.jotform_api_key}&addWorkflowStatus=1`)
                  .then(({ data }) => {
                  const obj = data.content.answers;
                  const anwsers = Object.keys(obj).map((key) => [key, obj[key]]);
                  
                  const id = anwsers.find((answer) => answer[1].name === 'uniqueId')[1].answer;
                  const dateFromRet = anwsers.find((answer) => answer[1].name === 'startDate')[1].answer;
                  const dateFrom = dateFromRet.month+"/"+dateFromRet.day+"/"+dateFromRet.year;
                  const dateToRet = anwsers.find((answer) => answer[1].name === 'endDate')[1].answer;
                  const dateTo = dateToRet.month+"/"+dateToRet.day+"/"+dateToRet.year;
                  const createdAt = data.content.created_at;
                  const status = data.content.workflowStatus === 'ACTIVE' ? 'Pending...' : data.content.workflowStatus === 'Deny' ? 'Denied' : data.content.workflowStatus === 'More Information' ? 'Add More Information' : 'Approved';

                  return {
                     id,
                     createdAt,
                     dateFrom,
                     dateTo,
                     status,
                     submission_id: excuse
                   }
               }
            )
            )

            })

            Promise.all(list).then((item) => {
               setMedicalExcuses([...item.sort((a,b) => a.createdAt < b.createdAt)])
            })
         }
      },[loading])

      function handleEditForm(item) {
         setEditForm(item)
         navigation.navigate("New Request")
      }

      return (
         <>
         <TouchableOpacity onPress={() => setLoading(true)} style={{ width: '100%', backgroundColor: theme.colors.grayOpacity, flexDirection: 'row', height: 50, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ color: theme.colors.gray, fontWeight: 'bold' }}><Ionicons name="refresh" size={16} color={theme.colors.gray} /> {loading ? 'Loading...' : 'Refresh information'}</Text>
         </TouchableOpacity>
      <FlatList data={medicalExcuses} renderItem={({item,index}) => (
      <TouchableOpacity onPress={() => item.status === 'Add More Information' ? handleEditForm(item) : null} style={{ width: '100%', backgroundColor: index % 2 === 0 ? '#FFF' : '#fcfcfc', paddingVertical: 8, paddingHorizontal: 16, borderBottomWidth: 1, borderColor: '#efefef', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
         
         <View>
            <Text style={{ fontWeight: 'bold', color: theme.colors.secondary, fontSize: 16 }}>{item.id}</Text>
            
            {item.dateTo ? <>
               <Text><Text style={{ fontWeight: 'bold', fontSize: 13, width: '50%' }}>Start date:</Text> {item.dateFrom}</Text>
               <Text><Text style={{ fontWeight: 'bold', fontSize: 13, width: '50%' }}>End date:</Text> {item.dateTo}</Text>
            </> :
               <Text><Text style={{ fontWeight: 'bold', fontSize: 13, width: '50%'}}>Date:</Text> {item.dateFrom}</Text>
            }
         </View>
         <Text style={{ fontWeight: 'bold', color: item.status === 'Pending...' ? theme.colors.grayOpacity2 : item.status === 'Add More Information' ? theme.colors.Transfer : item.status === 'Denied' ? theme.colors.primaryOpacity : theme.colors.secondary }}>{item.status}</Text>
      </TouchableOpacity>
      )} />
      </>
      )
   }

   const NewForm = ({ navigation }) => {
      // navigation.setOptions({
      //    headerRight: null
      //  })
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
         if (!url.includes('jotform.com')) {
            return
         }
   
         if(url.includes('https://submit.jotform.com/submit/')) {
            if(!editForm) {
               const { data } = await axios.get(`https://api.jotform.com/form/${params.jotform_medical_excuse_url_code}/submissions?apikey=${params.jotform_api_key}&addWorkflowStatus=1&filter={"workflowStatus":"ACTIVE"}&orderby=created_at&limit=1`)
               data.content.map((newExcuses,index) => {
                  if(index === 0) {
                     const newObjExcuses = student.medicalExcuses ? [...student.medicalExcuses, newExcuses.id] : [newExcuses.id];
                     firestore().collection('Students').doc(student.registrationNumber).update({
                        medicalExcuses: newObjExcuses
                     }).then(() => {
                        setStudent({...student, medicalExcuses: newObjExcuses })
                        navigation.navigate("Class Excuses")
                     })
                  }
               })
            } else {
               navigation.navigate("Class Excuses")
            }
         }
   
         // handle certain doctypes
         if (url.includes('.pdf')) {
            webviewRef.stopLoading();
         // open a modal with the PDF viewer
         }
   
         // one way to handle a successful form submit is via query strings
         if (url.includes('?message=success')) {
            webviewRef.stopLoading();
         // maybe close this view?
         }
   
         // one way to handle errors is via query string
         if (url.includes('?errors=true')) {
            webviewRef.stopLoading();
         }
      };

      let formUri = '';
      if(editForm) {
         formUri = `https://jotform.com/edit/${editForm.submission_id}`;
      } else {
         formUri = `https://form.jotform.com/${params.jotform_medical_excuse_url_code}?studentid=${student.registrationNumber}&studentfull=${student.name} ${student.lastName}&studentemail=${student.email}`;
      }

      return (
         <WebView
         style={{ flex: 1 }}
         ref={webviewRef}
         originWhitelist={['*']}
         source={{ uri: formUri }}
         onNavigationStateChange={handleWebViewNavigationStateChange}
         />);
   }

   return <Page>
      <Header showLogo={true} navigation={navigation} drawer='Absense Excuse' />
      <Stack.Navigator id="AbsenseExcuse" initialRouteName="Absense Excuse" screenOptions={{ headerRight: () => (
         <TouchableOpacity onPress={() => navigation.navigate('New Request')}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text><Ionicons name="add-circle" size={24} color={theme.colors.secondary} /></Text>
                  <Text style={{ color: theme.colors.secondary, fontWeight: 'bold' }}>New Request</Text>
            </View>
         </TouchableOpacity>)
         }} >
         <Stack.Screen name="Absense Excuse" component={List} />
         <Stack.Screen name="New Request" component={NewForm}/>
   </Stack.Navigator>
   </Page>
}