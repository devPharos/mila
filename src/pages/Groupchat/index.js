import React, { useEffect } from 'react';
import { View, Text, ScrollView, TextInput, Image } from 'react-native';
import Header from '../../components/Header';
import theme from '../../global/styles/theme';
import { useRegister } from '../../hooks/register';
// import { Profilepic } from '../Profile/styles';

import { Page, Profilepic } from './styles';

export default function Groupchat({ navigation }) {
  const { student } = useRegister();
  return <Page style={{ justifyContent: 'center', alignItems: 'center' }}>
    <Header showLogo={true} student={student} />
    <ScrollView style={{ width: '100%', flexDirection: 'column' }}>
      <View style={{ flex: 1, flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
        <View style={{ backgroundColor: "#fff", width: '80%', padding: 16, color: "#222", borderColor: '#fff', borderRadius: 8 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <Profilepic style={{ alignItems: 'center', justifyContent: 'center'}}>
              <Image source={{ uri: student.imageUrl }} style={{ width: 60, height: 60, borderRadius: 30, borderWidth: 2, borderColor: theme.colors.Sick }} />
            </Profilepic>
            <Text>{student.name}</Text>
            <Text>20m</Text>
          </View>
          <View>
            <Text>Oi</Text>
          </View>
          <View>
            <Text>10:14</Text>
          </View>
        </View>
      </View>
    </ScrollView>
    <View style={{ width: '96%', backgroundColor: "#FFF", padding: 16, borderWidth: 1, borderColor: '#efefef', marginVertical: 8, borderRadius: 8}}>
      <TextInput placeholder='Message'></TextInput>
    </View>
    {/* <FooterTabs navigation={navigation}></FooterTabs> */}
  </Page>;
}