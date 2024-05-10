import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { FontAwesome, MaterialCommunityIcons, Entypo, Ionicons } from '@expo/vector-icons';

import { Countainer } from './styles';
import theme from '../../../global/styles/theme';
import { useRegister } from '../../../hooks/register';

export default function Promo({ promo = null, setSelectedCoupon = null}) {
    const { params, student } = useRegister()
    if(!promo) {
        return null;
    }

  return promo.fromFilials.includes(student.registrationNumber.substring(0,3)) && <Countainer>
    
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 6 }}>
        <View style={{ width: 80, height: 80, borderWidth: 1, borderColor: '#ccc', padding: 5, overflow: 'hidden', borderRadius: 8 }}>
            <Image source={{ uri: promo.logo+`?apiKey=${params.jotform_api_key}`}}  style={{ width: 70, height: 70 }} />
        </View>
        <View style={{ flex: 1, flexDirection: 'column', paddingLeft: 6, justifyContent: 'flex-start' }}>
            <Text style={{ fontWeight: 'bold', fontSize: 13 }}>{promo.name}</Text>
            <Text style={{ fontSize: 13 }}>{promo && promo.address}</Text>
            
        </View>
        </View>
        <View style={{ borderTopWidth: 1, borderStyle: 'dashed', borderColor: "#ccc", paddingTop: 12, marginTop: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', paddingHorizontal: 12 }}>

        <TouchableOpacity style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', padding: 6 }} onPress={() => setSelectedCoupon(promo)}>
            <MaterialCommunityIcons name="qrcode-scan" size={20} color={theme.colors.secondary} style={{ marginRight: 16}} />
            <Text style={{ fontSize: 12, color: theme.colors.secondary }}>Use this coupon</Text>
        </TouchableOpacity>

        { promo.tag ? <MaterialCommunityIcons name={promo.tag} size={18} color="#868686" style={{ backgroundColor: "#efefef", paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 }} /> : <View /> }
    </View>
    </Countainer>;
}