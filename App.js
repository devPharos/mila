import React, { useState, useEffect, useContext } from 'react';
import { ThemeProvider } from 'styled-components';
import { Home } from './src/pages/Home';
import theme from './src/global/styles/theme';
import { useFonts, Roboto_400Regular, Roboto_500Medium, Roboto_700Bold } from '@expo-google-fonts/roboto';
import { FirstAccess } from './src/pages/FirstAccess';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaView, StatusBar, StyleSheet } from 'react-native';
import 'react-native-gesture-handler';

import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import { RegisterContext, RegisterProvider, useRegister } from './src/hooks/register';
// import { DashboardProvider } from './src/hooks/dashboard';
import auth from '@react-native-firebase/auth';
// import firestore from '@react-native-firebase/firestore';
import { CreatePassword } from './src/pages/CreatePassword';
import { Login } from './src/pages/Login';
import { LastStep } from './src/pages/LastStep';
import TabNavigation from './src/pages/TabNavigation';
import { Dashboard } from './src/pages/Dashboard';
import Groupchat from './src/pages/Groupchat';
import { Profile } from './src/pages/Profile';

const Stack = createNativeStackNavigator();

export default function App() {
  const [authenticated,setAuthenticated] = useState(false);
  const [initializing, setInitializing] = useState(true);

  useFonts({ Roboto_400Regular, Roboto_500Medium, Roboto_700Bold })

  // const { getStudent } = useContext(RegisterContext);

  //Handle user state changes
  async function onAuthStateChanged(authenticated) {
    setAuthenticated(authenticated);

    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  if (initializing) return null;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#fff" barStyle='dark-content' hidden={false} />
      <ThemeProvider theme={theme}>
          <RegisterProvider>
            {/* <DashboardProvider> */}
              <NavigationContainer>
                <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Home">
                
                { authenticated ? (
                  <Stack.Group>
                  {/* <Stack.Screen name="Dashboard" component={Dashboard} />
                  <Stack.Screen name="Profile" component={Profile} />
                  <Stack.Screen name="Groupchat" component={Groupchat} /> */}
                    { authenticated ?
                    <Stack.Screen name="TabNavigation" component={TabNavigation} options={
                      {
                        headerStyle: {
                          backgroundColor: '#fff' 
                        }
                      }
                    } />
                    :
                    <Stack.Screen name="LastStep" component={LastStep} />
                    }
                  </Stack.Group>
                ):(
                  <Stack.Group>
                    <Stack.Screen name="Home" component={Home} />
                    <Stack.Screen name="FirstAccess" component={FirstAccess} />
                    <Stack.Screen name="CreatePassword" component={CreatePassword} />
                    <Stack.Screen name="Login" component={Login} />
                  </Stack.Group>
                )
                }
                
                </Stack.Navigator>
              </NavigationContainer>
            {/* </DashboardProvider> */}
          </RegisterProvider>
      </ThemeProvider>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#ECF0F1'
  }
});