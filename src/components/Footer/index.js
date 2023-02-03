import React from 'react';
import { StyleSheet, TouchableOpacity, Text, Linking } from 'react-native';
import { Entypo } from '@expo/vector-icons';
import theme from '../../global/styles/theme';

import { FooterBg } from './styles';

export default function Footer({ showLogo }) {
  return (
    <FooterBg style={{ height: 62, justifyContent: 'center' }}>
        <TouchableOpacity style={{ height: 48, alignItems: 'center', justifyContent: 'center' }} onPress={() => Linking.openURL('mailto:info@milausa.com?subject=Student Dashboard')}>
        <Text style={ styles.footer }><Entypo name="info-with-circle" /> info@milausa.com</Text>
        </TouchableOpacity>
    </FooterBg>
  );
}

const styles = StyleSheet.create({
    footer: {
        color: theme.colors.secondary,
        paddingLeft: 16
    }
  });