import React, { useCallback } from 'react';
import { Text, View, Platform, Linking, Pressable, Button, TouchableOpacity, Alert, ScrollView } from 'react-native';
import Logo from '../../components/Logo';
import { Ionicons } from '@expo/vector-icons';
import { RFPercentage } from 'react-native-responsive-fontsize';

// import { Container } from './styles';

export default function DifferentVersion({ data }) {

    const OpenURLButton = ({url, children}) => {
        const handlePress = useCallback(async () => {
          // Checking if the link is supported for links with custom URL scheme.
          const supported = await Linking.canOpenURL(url);
      
          if (supported) {
            // Opening the link with some app, if the URL scheme is "http" the web link should be opened
            // by some browser in the mobile
            await Linking.openURL(url);
          } else {
            Alert.alert(`Don't know how to open this URL: ${url}`);
          }
        }, [url]);
      
        return <TouchableOpacity title={children} onPress={handlePress} style={{ marginTop: 36, borderWidth: 1, paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8, backgroundColor: "#FFF", borderColor: "#ccc", width: 200, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', zIndex: 4 }}>
            <Ionicons name="sync-outline" size={24} color="black" />
            <Text style={{ paddingLeft: 12, fontSize: 14, textAlign: 'left' }}>Press here to update</Text>
        </TouchableOpacity>;
    };
  return <ScrollView style={{ flex: 1, paddingHorizontal: 24, marginTop: 64 }}>
    <View style={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'center', marginTop: 64 }}>
        <TouchableOpacity>
            <Logo />
        </TouchableOpacity>
        <View style={{ paddingVertical: 60 }}>
            <Text style={{ fontSize: 16, width: 200, textAlign: 'center', color: "#444" }}>There's a <Text style={{ fontWeight: 'bold' }}>new version</Text></Text>
            <Text style={{ fontSize: 16, width: 200, textAlign: 'center', color: "#444" }}>avaiable to download</Text>
        </View>
        <View style={{ width: 200, height: 150, flexDirection: 'column', justifyContent: 'space-between' }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Ionicons name="code-working-outline" size={24} color="#222" />
                <Text style={{ flex: 1, paddingLeft: 12, textAlign: 'left', color: "#222" }}>New features</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Ionicons name="shield-checkmark-outline" size={24} color="#222" />
                <Text style={{ flex: 1, paddingLeft: 12, textAlign: 'left', color: "#222" }}>Safer</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Ionicons name="speedometer-outline" size={24} color="#222" />
                <Text style={{ flex: 1, paddingLeft: 12, textAlign: 'left', color: "#222" }}>Faster</Text>
            </View>
        </View>
        <OpenURLButton url={data.store}>Update</OpenURLButton>
        <Text style={{ color: "#aaa", fontSize: 12, marginTop: 12 }}>current version: {data.appVersion}</Text>
    </View>
  </ScrollView>;
}