import { useNavigation } from '@react-navigation/native';
import React, { useEffect } from 'react';
import { Image, StyleSheet, Text } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, interpolate, runOnJS } from 'react-native-reanimated';
import LogoSplash from '../../../assets/splash_full.png';

import { Container } from './styles';

export function Splash() {
    const navigation = useNavigation();
    const splashAnimation = useSharedValue(0);

    const config = {
        duration: 3000,
      };

    const brandStyle = useAnimatedStyle(() => {
        return {
            opacity: interpolate(splashAnimation.value,[0, 50, 100],[0,1,0]),
        }
    })

    function startApp() {
        navigation.navigate('Home')
    }

    useEffect(() => {
        splashAnimation.value = withTiming(100, config, () => {
            'worklet'
            runOnJS(startApp)();
        })
    },[])

    return (
    <Container>
        <Animated.View style={[ brandStyle, { position: 'absolute' }]}>
            <Image source={LogoSplash} />
        </Animated.View>
    </Container>
    );
}

const styles = StyleSheet.create({
    brand: {
      opacity: 0,
    },
  });