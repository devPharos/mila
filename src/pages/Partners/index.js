import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, FlatList, Modal, StyleSheet, Linking, Button } from 'react-native';
import Header from '../../components/Header';
import { useRegister } from '../../hooks/register';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { format } from 'date-fns';

import { Page } from './styles';
import Promo from './Promo';
import QRCode from 'react-native-qrcode-svg';
import theme from '../../global/styles/theme';
import axios from 'axios';

export default function Partners({ navigation }) {
  const { params } = useRegister();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [promos, setPromos] = useState([])

  const OpenURLButton = ({url, children}) => {
    const handlePress = useCallback(async () => {
      const supported = await Linking.canOpenURL(url);
  
      if (supported) {
        await Linking.openURL(url);
      }
    }, [url]);
  
    return <TouchableOpacity onPress={handlePress}>{children}</TouchableOpacity>;
  };

  useEffect(() => {
    function getCoupons(){
      const returnedPromos = []
      axios.get(`https://api.jotform.com/form/${params.jotform_partners_url_code}/submissions?apiKey=${params.jotform_api_key}&addWorkflowStatus=1&orderby=created_at`)
      .then(({ data }) => {
        
        const forms = data.content;
        forms.map((form) => {
          // if(form.status === 'ACTIVE' || form.status === 'CUSTOM') {
            const anwsers = Object.keys(form.answers).map((key) => [key, form.answers[key]]);
            const nameAnswer = anwsers.find((answer) => answer[1].name === 'partnerdata')[1]?.answer;
            if(nameAnswer) {
              const fields = Object.keys(nameAnswer).map((key) => [key, nameAnswer[key]]);
              // const name = fields[0][1];
              const address = fields[1][1];
              const city = fields[2][1];
              const state = fields[3][1];
              const zipCode = fields[4][1];

              const statusMkt = anwsers.find((answer) => answer[1].name === 'statusMkt')[1]?.answer;

              const onlyOnline = anwsers.find((answer) => answer[1].name === 'myBusiness')[1]?.answer;

              const name = anwsers.find((answer) => answer[1].name === 'businessName')[1]?.answer;
      
              const logo = anwsers.find((answer) => answer[1].name === 'logoUpload')[1]?.answer[0];

              const filials = anwsers.find((answer) => answer[1].name === 'pleaseSelect')[1]?.answer;

              const fromFilials = filials.map((filial) => {
                return filial === 'Orlando' ? 'ORL' : filial === 'Miami' ? 'MIA' : filial === 'Boca Raton' ? 'BOC' : filial === 'Jacksonville' ? 'JAC' : ''
              })
      
              
              const ifNecessary = anwsers.find((answer) => answer[1].name === 'ifNecessary')[1]?.answer;


              const homePage = anwsers.find((answer) => answer[1].name === 'homePage')[1]?.answer;
              const instagram = anwsers.find((answer) => answer[1].name === 'instagram')[1]?.answer;
              const facebook = anwsers.find((answer) => answer[1].name === 'facebook')[1]?.answer;

              const benefitArray = anwsers.find((answer) => answer[1].name === 'benefits')[1]?.answer;
              const category = anwsers.find((answer) => answer[1].name === 'category')[1]?.answer;

              const benefits = benefitArray && Object.keys(benefitArray).map((key) => [key, benefitArray[key]]).filter(benefit => benefit[1] !== '[\"\"]');
              const benefit = benefits && benefits.map((ben) => {
                if(ben[0].includes('A discount of $')) {
                  return `A discount of ${ben[1].replace('[\"','').replace('\"]','')} per transaction.`
                } else if(ben[0].includes('A discount of %')) {
                  return `A discount of ${ben[1].replace('[\"','').replace('\"]','')} per transaction.`
                } else {
                  return ben[1].replace('[\"','').replace('\"]','')
                }
              })

              const tag = category === 'Food' ? 'food-fork-drink' : category === 'Services' ? 'tools' : category === 'Entertainment' ? 'party-popper' : category === 'Shopping' ? 'shopping' : 'dots-horizontal-circle'
      
              if(statusMkt === 'ACTIVE') {
                returnedPromos.push({ id: form.id, name, logo, tag, address, city, state, zipCode, benefit, fromFilials, ifNecessary, onlyOnline, homePage, instagram, facebook }) 
              }
            }
          // }
        })
      }).finally(() => {
        setPromos(returnedPromos)
      })
    }
    getCoupons()
  },[])

  function unicodeToChar(text) {
    return text.replace(/\\u[\dA-F]{4}/gi, 
           function (match) {
                return String.fromCharCode(parseInt(match.replace(/\\u/g, ''), 16));
           });
 }

  const listOfIcons = [
    {
      id: null,
      title: 'all',
    },
    {
      id: 'food-fork-drink',
      title: 'food',
    },
    {
      id: 'shopping',
      title: 'shopping',
    },
    {
      id: 'party-popper',
      title: 'entertainment',
    },
    {
      id: 'tools',
      title: 'services',
    },
    {
      id: 'dots-horizontal-circle',
      title: 'others',
    },
  ];

  return <Page style={{ justifyContent: 'center', alignItems: 'center' }}>
    <Header showLogo={true} navigation={navigation} />
    <View style={{ backgroundColor: theme.colors.secondary, width: '100%', paddingVertical: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
      <Text style={{ fontSize: 18, fontWeight: 'bold', color: "#FFF" }}>MILA Partners</Text>
    </View>
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
      <Text style={{ color:theme.colors.secondary, fontSize: 12, paddingLeft: 12, paddingRight: 6 }}>Filter:</Text>
    <FlatList style={{ marginVertical: 18, maxHeight: 40, minHeight: 40, paddingHorizontal: 12 }} showsHorizontalScrollIndicator={false} data={listOfIcons} horizontal={true}  renderItem={({item}) => <TouchableOpacity onPress={() => setSelectedCategory(selectedCategory == item.id ? null : item.id)} style={{ borderWidth: 1, borderColor: theme.colors.secondary, borderStyle: 'dashed',backgroundColor: "#fff", paddingHorizontal: 8, paddingVertical: 8, borderRadius: 6, marginRight: 12, overflow: 'hidden', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>{item.id === null ? <Text style={{ color: selectedCategory == null ? theme.colors.secondary : "#ccc" }}>All Coupons</Text> : <MaterialCommunityIcons name={item.id} size={24} style={{ height: 24, width: 24 }} color={selectedCategory == item.id ? theme.colors.secondary : "#ccc" } />}</TouchableOpacity>} keyExtractor={item => item.id} />
    </View>
    <ScrollView style={{ width: '100%', flexDirection: 'column' }}>
      {promos.map(promo => 
        {
          return !selectedCategory || selectedCategory == promo.tag ? <Promo key={promo.id} promo={promo} setSelectedCoupon={setSelectedCoupon} /> : null
        })}
    </ScrollView>
    <Modal
        animationType="slide"
        transparent={false}
        visible={selectedCoupon && selectedCoupon.id && selectedCoupon.id > 0}
        presentationStyle='fullscreen'
        onRequestClose={() => {
          setSelectedCoupon(null);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Image source={{ uri: selectedCoupon && selectedCoupon.logo+`?apiKey=${params.jotform_api_key}` }} resizeMode='center' style={{ width: 250, height: 150}} />
            <Text style={styles.modalText}>{selectedCoupon && selectedCoupon.name}</Text>
            
            {selectedCoupon && selectedCoupon.benefit && selectedCoupon.benefit.map((ben,index) => {
                return <Text key={index} style={{ fontSize: 16, textAlign: 'justify' }}>{unicodeToChar(ben)}</Text>
            })}

            { selectedCoupon && selectedCoupon.ifNecessary &&
            <Text style={styles.modalText}>{selectedCoupon.ifNecessary}</Text>
            }

            <View style={{ flexDirection: 'row', width: 150, alignItems: 'center', justifyContent: 'center', marginTop: 24 }}>
            { selectedCoupon && selectedCoupon.homePage &&
              <OpenURLButton url={selectedCoupon.homePage}>
                <MaterialCommunityIcons name='web' size={24} style={{ height: 24, width: 24, marginRight: 24 }} color={theme.colors.secondary} />
              </OpenURLButton>
            }
            { selectedCoupon && selectedCoupon.instagram &&
              <OpenURLButton url={`https://instagram.com/${selectedCoupon.instagram}`}>
                <MaterialCommunityIcons name='instagram' size={24} style={{ height: 24, width: 24, marginRight: 24 }} color={theme.colors.secondary} />
              </OpenURLButton>
            }
            { selectedCoupon && selectedCoupon.facebook &&
              <OpenURLButton url={`https://facebook.com/${selectedCoupon.facebook}`}>
                <MaterialCommunityIcons name='facebook' size={24} style={{ height: 24, width: 24 }} color={theme.colors.secondary} />
              </OpenURLButton>
            }
            </View>

            <Text style={[styles.modalText,{marginBottom: 6, fontSize: 14, marginTop: 16}]}>Enjoy this coupon!</Text>
          </View>
          <TouchableOpacity
            onPress={() => setSelectedCoupon(null)}>
            <Text style={{ color: '#868686', paddingVertical: 16, width: 100, textAlign: 'center' }} >Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
  </Page>;
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginTop: 18,
    marginBottom: 18,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold'
  },
});