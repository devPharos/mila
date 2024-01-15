import React, { useState } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, FlatList, Modal, StyleSheet, Pressable } from 'react-native';
import Header from '../../components/Header';
import { useRegister } from '../../hooks/register';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { format } from 'date-fns';

import { Page } from './styles';
import Promo from './Promo';
import QRCode from 'react-native-qrcode-svg';
import theme from '../../global/styles/theme';

export default function Groupchat({ navigation }) {
  const { student } = useRegister();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedCoupon, setSelectedCoupon] = useState(null);

  const listOfIcons = [
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
      title: 'party',
    },
    {
      id: 'music',
      title: 'music',
    },
    {
      id: 'table-tennis',
      title: 'sport',
    },
    {
      id: 'bitcoin',
      title: 'music',
    },
    {
      id: 'hand-coin',
      title: 'sport',
    },
  ];

  const promos = [
    {
      id: 1,
      tag: "food-fork-drink",
      name: "Orlando's Pizza Hut",
      logo: "https://gkpb.com.br/wp-content/uploads/2014/11/novo-logo-pizza-hut-flat-design-destaque-geek-publicitario-696x473.jpg.webp",
      text: "For every $1 you spend on food and drinks you'll earn 2 points.",
      untilDate: new Date('2023-12-31')
    },
    {
      id: 2,
      tag: "shopping",
      name: "Amazon Prime",
      logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT6kgGbl1-EN4CW_8spHF_lOriJTlllmTiXBam6ViGSjrfbDVtBfS_WYbsbk_rDRpUMiTk&usqp=CAU",
      text: "Enjoy prime day with 20%.",
      untilDate: new Date('2023-12-31')
    },
    {
      id: 3,
      tag: "party-popper",
      name: "Orlando's Pizza Hut",
      logo: "https://gkpb.com.br/wp-content/uploads/2014/11/novo-logo-pizza-hut-flat-design-destaque-geek-publicitario-696x473.jpg.webp",
      text: "For every $1 you spend on food and drinks you'll earn 2 points.",
      untilDate: new Date('2023-12-31')
    },
    {
      id: 4,
      tag: "music",
      name: "Amazon Prime",
      logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT6kgGbl1-EN4CW_8spHF_lOriJTlllmTiXBam6ViGSjrfbDVtBfS_WYbsbk_rDRpUMiTk&usqp=CAU",
      text: "Enjoy prime day with 20%.",
      untilDate: new Date('2023-12-31')
    },
    {
      id: 5,
      tag: "table-tennis",
      name: "Orlando's Pizza Hut",
      logo: "https://gkpb.com.br/wp-content/uploads/2014/11/novo-logo-pizza-hut-flat-design-destaque-geek-publicitario-696x473.jpg.webp",
      text: "For every $1 you spend on food and drinks you'll earn 2 points.",
      untilDate: new Date('2023-12-31')
    },
    {
      id: 6,
      tag: "shopping",
      name: "Amazon Prime",
      logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT6kgGbl1-EN4CW_8spHF_lOriJTlllmTiXBam6ViGSjrfbDVtBfS_WYbsbk_rDRpUMiTk&usqp=CAU",
      text: "Enjoy prime day with 20%.",
      untilDate: new Date('2023-12-31')
    },
  ];

  return <Page style={{ justifyContent: 'center', alignItems: 'center' }}>
    <Header showLogo={true} student={student} />
    <View style={{ backgroundColor: theme.colors.secondary, width: '100%', paddingVertical: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
      <Text style={{ fontSize: 18, fontWeight: 'bold', color: "#FFF" }}>MILA Coupons</Text>
    </View>
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
      <Text style={{ color:theme.colors.secondary, fontSize: 12, paddingLeft: 12, paddingRight: 6 }}>Filter:</Text>
    <FlatList style={{ marginVertical: 18, maxHeight: 40, minHeight: 40, paddingHorizontal: 12 }} showsHorizontalScrollIndicator={false} data={listOfIcons} horizontal={true}  renderItem={({item}) => <TouchableOpacity onPress={() => setSelectedCategory(selectedCategory == item.id ? null : item.id)} style={{ borderWidth: 1, borderColor: theme.colors.secondary, borderStyle: 'dashed',backgroundColor: "#fff", paddingHorizontal: 10, paddingVertical: 10, borderRadius: 6, marginRight: 16, overflow: 'hidden', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}><MaterialCommunityIcons name={item.id} size={24} style={{ height: 24, width: 24 }} color={selectedCategory == item.id ? theme.colors.secondary : "#ccc" } /></TouchableOpacity>} keyExtractor={item => item.id} />
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
            <Image source={{ uri: selectedCoupon && selectedCoupon.logo }} style={{ width: 80, height: 80}} />
            <Text style={styles.modalText}>{selectedCoupon && selectedCoupon.name}</Text>
            <Text style={styles.modalText}>{selectedCoupon && selectedCoupon.text}</Text>
            <View style={{ marginBottom: 16}}>
            <QRCode
                  value={`https://www.milausa.com`}
                  logo={selectedCoupon && selectedCoupon.logo}
                  logoSize={30}
                  size={160}
                  logoBackgroundColor="#FFF"
               />
               </View>
            <Text style={[styles.modalText,{marginBottom: 6, fontSize: 12}]}>Enjoy this coupn until</Text>
            <Text style={[styles.modalText, {color: "#868686"}]}>{selectedCoupon && format(selectedCoupon.untilDate, 'MMMM do, Y')}</Text>
          </View>
          <TouchableOpacity
            onPress={() => setSelectedCoupon(null)}>
            <Text style={{ color: '#868686', paddingVertical: 16, width: 100, textAlign: 'center' }} >Cancel</Text>
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
    marginBottom: 18,
    textAlign: 'center',
  },
});