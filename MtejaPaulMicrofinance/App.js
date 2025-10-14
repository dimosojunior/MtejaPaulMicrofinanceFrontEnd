import { StatusBar } from 'expo-status-bar';
import { StyleSheet,Alert, Linking, Text,SafeAreaView, View } from 'react-native';
import HomeScreen from './Screens/HomeScreen';

import MyDrawer from './Drawer/drawer';

import MyStack from './Stack/MyStack';

import { NavigationContainer } from '@react-navigation/native';

import React, { useState,useRef, useEffect } from 'react';
import { EndPoint } from './Constant/links';
//import * as Application from 'expo-application';
import AwesomeAlert from 'react-native-awesome-alerts';

import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { EventRegister } from 'react-native-event-listeners';

import { UserProvider } from './UserContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function App({navigation}) {

const [userData, setUserData] = useState({});
  const [userToken, setUserToken] = useState('');
  
useEffect(() => {
  const listener = EventRegister.addEventListener('updateUserToken', async () => {
    const userDataJSON = await AsyncStorage.getItem('userData');
    if (userDataJSON) {
      setUserData(JSON.parse(userDataJSON));
    }
  });

  return () => EventRegister.removeEventListener(listener);
}, []);



  return (
    <SafeAreaView style={styles.container}>
    
      
    

      <UserProvider>
      <NavigationContainer>
        <MyDrawer />
      </NavigationContainer>
    </UserProvider>
      

      
      <StatusBar backgroundColor="white" barStyle="dark-content" />


    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop:10,
    // backgroundColor: '#fff',
    // alignItems: 'center',
    // justifyContent: 'center',
  },
});
