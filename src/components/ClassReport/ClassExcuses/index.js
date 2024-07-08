import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import theme from '../../../global/styles/theme';
import { MaterialIcons } from '@expo/vector-icons';

import { Container } from './styles';
import { useRegister } from '../../../hooks/register';

const ClassExcuses = ({ navigation }) => {
  const { params, student } = useRegister()
  return (
    <>
      <Container style={{ width: '100%', marginBottom: 8, marginTop: -36, height: 75, padding: 0, overflow: 'visible' }}>

        {(params.allow_class_excuses.includes(student.registrationNumber.substring(0, 3))
          &&
          params.allow_vacations.includes(student.registrationNumber.substring(0, 3)))
          || params.allowed_users.includes(student.registrationNumber.trim())
          ?
          <TouchableOpacity onPress={() => navigation.toggleDrawer()} style={{ borderWidth: 1, borderStyle: 'dashed', borderColor: theme.colors.secondary, width: '100%', height: 75, marginBottom: 8, backgroundColor: '#fff', borderRadius: 16, padding: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <View>
              <Text style={{ fontSize: 16, color: theme.colors.secondary, fontWeight: 'bold' }}>Vacations & Excuses</Text>
              <Text style={{ color: '#868686', fontSize: 12 }}>Send a request or check your request status.</Text>
            </View>
            <MaterialIcons style={{ color: theme.colors.secondary, fontSize: 22 }} name={`menu-open`} />
            <View style={{ position: 'absolute', top: -5, right: -5, backgroundColor: theme.colors.primary, borderRadius: 12 }}><Text style={{ color: '#FFF', fontSize: 10, paddingVertical: 4, paddingHorizontal: 8, overflow: 'hidden' }}>New!</Text></View>
          </TouchableOpacity>
          :
          params.allow_class_excuses.includes(student.registrationNumber.substring(0, 3)) ?
            <TouchableOpacity onPress={() => navigation.toggleDrawer()} style={{ borderWidth: 1, borderStyle: 'dashed', borderColor: theme.colors.secondary, width: '100%', height: 75, marginBottom: 8, backgroundColor: '#fff', borderRadius: 16, padding: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <View>
                <Text style={{ fontSize: 16, color: theme.colors.secondary, fontWeight: 'bold' }}>Absence Excuse</Text>
                <Text style={{ color: '#868686', fontSize: 12 }}>Send a request or check your request status.</Text>
              </View>
              <MaterialIcons style={{ color: theme.colors.secondary, fontSize: 22 }} name={`menu-open`} />
              <View style={{ position: 'absolute', top: -5, right: -5, backgroundColor: theme.colors.primary, borderRadius: 12 }}><Text style={{ color: '#FFF', fontSize: 10, paddingVertical: 4, paddingHorizontal: 8, overflow: 'hidden' }}>New!</Text></View>
            </TouchableOpacity>
            :
            params.allow_vacations.includes(student.registrationNumber.substring(0, 3)) ?
              <TouchableOpacity onPress={() => navigation.toggleDrawer()} style={{ borderWidth: 1, borderStyle: 'dashed', borderColor: theme.colors.secondary, width: '100%', height: 75, marginBottom: 8, backgroundColor: '#fff', borderRadius: 16, padding: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <View>
                  <Text style={{ fontSize: 16, color: theme.colors.secondary, fontWeight: 'bold' }}>Vacations</Text>
                  <Text style={{ color: '#868686', fontSize: 12 }}>Send a request or check your request status.</Text>
                </View>
                <MaterialIcons style={{ color: theme.colors.secondary, fontSize: 22 }} name={`menu-open`} />
                <View style={{ position: 'absolute', top: -5, right: -5, backgroundColor: theme.colors.primary, borderRadius: 12 }}><Text style={{ color: '#FFF', fontSize: 10, paddingVertical: 4, paddingHorizontal: 8, overflow: 'hidden' }}>New!</Text></View>
              </TouchableOpacity>
              : null
        }


      </Container>
    </>
  );
}
export default ClassExcuses;
