import React from 'react';
import { createDrawerNavigator, useDrawerStatus } from '@react-navigation/drawer';
import { useWindowDimensions } from 'react-native';
import { Profile } from './index';
import { ClassExcuses } from '../ClassExcuses';
import { useRegister } from '../../hooks/register';

// import { Container } from './styles';

const Drawer = createDrawerNavigator();

export default function ProfileDrawer({ navigation }) {
  const { student, params } = useRegister()
    React.useEffect(() => {
        const unsubscribe = navigation.addListener('tabPress', (e) => {
          // Prevent default behavior
            
          e.preventDefault();
          navigation.navigate('ProfileDrawer');
        });
      
        return unsubscribe;
      }, [navigation]);

    const dimensions = useWindowDimensions();
    return <Drawer.Navigator id="LeftDrawer" initialRouteName='ProfileDrawer' backBehavior='none' defaultStatus='closed' detachInactiveScreens={false} screenOptions={{
        drawerStyle: {
        backgroundColor: '#efefef',
        width: 240,
        },
        drawerPosition: 'left',
        drawerType: dimensions.width >= 768 ? 'permanent' : 'front',
        swipeEnabled: false,
        headerShown: false
    }}>
        <Drawer.Screen name="ProfileDrawer" component={Profile} options={{ drawerLabel: 'Profile' }} />
        { params.allow_class_excuses.includes(student.registrationNumber.substring(0,3)) && <Drawer.Screen name="ClassExcusesDrawer" component={ClassExcuses} options={{ drawerLabel: 'Class Excuses' }} />}
    </Drawer.Navigator>;
}