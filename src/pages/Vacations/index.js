import React, { useContext, useEffect, useRef, useState } from 'react';
import { Page } from './styles';
import { WebView } from 'react-native-webview';
import Header from '../../components/Header';
import { RegisterContext, useRegister } from '../../hooks/register';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { FlatList, Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import firestore from '@react-native-firebase/firestore';
import theme from '../../global/styles/theme';

export function Vacations({ navigation }) {
   const { student, setStudent, params } = useRegister();
   const { group } = useContext(RegisterContext)
   const webviewRef = useRef();
   const Stack = createNativeStackNavigator();

   const List = () => {
      const [vacations, setVacations] = useState([]);
      const [loading, setLoading] = useState(true)
      useEffect(() => {
         if(loading && student.vacations) {
            setLoading(false)
            setVacations([])
            const list = [];
            student.vacations.map(async (vacation) => {
               return list.push(
                  axios.get(`https://api.jotform.com/submission/${vacation}?apikey=${params.jotform_api_key}&addWorkflowStatus=1`)
                  .then(({ data }) => {
                  const obj = data.content.answers;
                  const anwsers = Object.keys(obj).map((key) => [key, obj[key]]);

                  // console.log(anwsers.find((answer) => answer[1].name === 'uniqueId')[0])
                  let id = null;
                  if(anwsers.find((answer) => answer[1].name === 'uniqueId')) {
                     id = anwsers.find((answer) => answer[1].name === 'uniqueId')[1]?.answer;
                  }
                  const vacationRequest = anwsers.find((answer) => answer[1].name === 'vacationsRequest')[1]?.answer;

                  let period = null;
                  if(anwsers.find((answer) => answer[1].name === 'period')) {
                     period = anwsers.find((answer) => answer[1].name === 'period')[1]?.answer;
                  }
                  
                  let startDate = anwsers.find((answer) => answer[1].name === 'startDate')[1]?.answer;
                  startDate = startDate.month+"/"+startDate.day+"/"+startDate.year;
                  
                  let endDate = anwsers.find((answer) => answer[1].name === 'endDate')[1]?.answer;
                  endDate = endDate && endDate.month+"/"+endDate.day+"/"+endDate.year;
                  
                  let returnDate = anwsers.find((answer) => answer[1].name === 'returnDate')[1]?.answer;
                  returnDate = returnDate && returnDate.month+"/"+returnDate.day+"/"+returnDate.year;
                  
                  let invoiceFree = anwsers.find((answer) => answer[1].name === 'invoiceFree')[1]?.answer;
                  invoiceFree = invoiceFree && invoiceFree.month+"/"+invoiceFree.day+"/"+invoiceFree.year;

                  let createdAt = data.content.created_at;
                  createdAt = createdAt && createdAt.substring(5,7)+"/"+createdAt.substring(8,10)+"/"+createdAt.substring(0,4)
                  
                  const status = !data.content.workflowStatusDetails ? 'Pending...' : data.content.workflowStatusDetails.text === 'ACTIVE' ? 'Pending...' : data.content.workflowStatusDetails.text === '1_Approve_Financial' ? 'Pending...' : data.content.workflowStatusDetails.text === '1_Denied_Financial' ? 'Financial Denied' : data.content.workflowStatusDetails.text === '2_Approved_Financial' ? 'Pending...' : data.content.workflowStatusDetails.text === 'DSO_Approved' ? 'Approved' : 'DSO Denied';
                  const vacationsRequest = anwsers.find((answer) => answer[1].name === 'vacationsRequest')[1]?.answer;

                  return {
                     id,
                     period,
                     vacationRequest,
                     createdAt,
                     startDate,
                     endDate,
                     returnDate,
                     invoiceFree,
                     status,
                     vacationsRequest
                   }
               }
            )
            )

            })

            Promise.all(list).then((item) => {
               setVacations([...item.sort((a,b) => a.createdAt < b.createdAt)])
            })
         } else if(!student.vacations) {
            setLoading(false)
         }
      },[loading])
      return (
         <>
         <TouchableOpacity onPress={() => setLoading(true)} style={{ width: '100%', backgroundColor: theme.colors.grayOpacity, flexDirection: 'row', height: 50, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ color: theme.colors.gray, fontWeight: 'bold' }}><Ionicons name="refresh" size={16} color={theme.colors.gray} /> {loading ? 'Loading...' : 'Refresh information'}</Text>
         </TouchableOpacity>
      <FlatList data={vacations} renderItem={({item,index}) =>  {
      return item.id && <View style={{ width: '100%', backgroundColor: index % 2 === 0 ? '#FFF' : '#fcfcfc', paddingVertical: 8, paddingHorizontal: 16, borderBottomWidth: 1, borderColor: '#efefef', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'center' }}>
         
         <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            
            <View style={{ flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center' }}>
               {item.id && <Text style={{ fontWeight: 'bold', color: theme.colors.secondary, fontSize: 16 }}>{item.id}</Text>}
               {item.createdAt && <Text><Text style={{ fontWeight: 'bold', fontSize: 13 }}>Requested:</Text> {item.createdAt}</Text>}
               {item.vacationsRequest && item.status !== 'Approved' && <Text><Text style={{ fontWeight: 'bold', fontSize: 13 }}>Period:</Text> {item.vacationsRequest}</Text>}
               {item.vacationsRequest && item.status === 'Approved' && <Text><Text style={{ fontWeight: 'bold', fontSize: 13 }}>Period:</Text> {item.period} days</Text>}
            </View>
            <Text style={{ fontWeight: 'bold', color: item.status === 'Pending...' ? theme.colors.grayOpacity2 : item.status === 'Financial Denied' ? theme.colors.primaryOpacity : item.status === 'DSO Denied' ? theme.colors.primaryOpacity : theme.colors.secondary }}>{item.status}</Text>

         </View>

         { item.status === 'Approved' && <View style={{ width: '100%', backgroundColor: '#efefef', borderRadius: 8, padding: 8, borderWidth: 1, borderColor: theme.colors.secondary, marginTop: 8, marginBottom: 16, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
            <View style={{ flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center' }}>
               <View style={{ width: 310, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  {item.startDate && <Text><Text style={{ fontWeight: 'bold', fontSize: 12, width: '50%' }}>Start date:</Text> {item.startDate} </Text>}
                  {item.returnDate && <Text><Text style={{ fontWeight: 'bold', fontSize: 12, width: '50%' }}>Return Date:</Text> {item.returnDate}</Text>}
               </View>
               <View style={{ width: 310, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  {item.endDate && <Text><Text style={{ fontWeight: 'bold', fontSize: 12, width: '50%' }}>End date:</Text> {item.endDate} </Text>}
                  {item.invoiceFree && <Text><Text style={{ fontWeight: 'bold', fontSize: 12, width: '50%' }}>Invoice Free:</Text> {item.invoiceFree}</Text>}
               </View>
            </View>
         </View>}

      </View>}
      } />
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
            const { data } = await axios.get(`https://api.jotform.com/form/${params.jotform_vacation_url_code}/submissions?apikey=${params.jotform_api_key}&addWorkflowStatus=1&orderby=created_at&limit=1`)
            data.content.map((newVacation,index) => {
               if(index === 0) {
                  const newObjVacations = student.vacations ? [...student.vacations, newVacation.id] : [newVacation.id];
                  firestore().collection('Students').doc(student.registrationNumber).update({
                     vacations: newObjVacations
                  }).then(() => {
                     setStudent({...student, vacations: newObjVacations })
                     navigation.navigate("Vacations")
                  })
               }
            })
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

      return (
         <WebView
         style={{ flex: 1 }}
         ref={webviewRef}
         originWhitelist={['*']}
         source={{ uri: `https://form.jotform.com/${params.jotform_vacation_url_code}?studentId=${student.registrationNumber}&studentsName[first]=${student.name}&studentsName[last]=${student.lastName}&emailAddress=${student.email}&group=${group[0].groupID}-${group[0].name}` }}
         onNavigationStateChange={handleWebViewNavigationStateChange}
         />);
   }

   return <Page>
      <Header showLogo={true} navigation={navigation} drawer='Class Excuses' />
      <Stack.Navigator id="Vacations" initialRouteName="Vacations" screenOptions={{ headerRight: () => (
         <TouchableOpacity onPress={() => navigation.navigate('Vacation Req.')}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text><Ionicons name="add-circle" size={24} color={theme.colors.secondary} /></Text>
                  <Text style={{ color: theme.colors.secondary, fontWeight: 'bold' }}>New Request</Text>
            </View>
         </TouchableOpacity>)
         }} >
         <Stack.Screen name="Vacations" component={List} />
         <Stack.Screen name="Vacation Req." component={NewForm}/>
   </Stack.Navigator>
   </Page>
}