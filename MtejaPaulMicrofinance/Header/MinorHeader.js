
import  {View,StyleSheet,Image,Text,TouchableOpacity,FlatList,Dimensions} from 'react-native';

// import {WalletCoinCard} from './WalletCoinCard';
// import {CoinCard} from './CoinCard';
import { useNavigation } from '@react-navigation/native';

import {MaterialIcons,Entypo,MaterialCommunityIcons,FontAwesome5, Ionicons,Feather,AntDesign, FontAwesome} from '@expo/vector-icons';


import React, {useState, useEffect, useContext} from 'react';
import {globalStyles} from '../Styles/GlobalStyles';
import {useFonts} from 'expo-font';

export default function MinorHeader(  {title} ) {

    let [fontsLoaded] = useFonts({
    
    'Bold': require('../assets/fonts/Poppins-Bold.ttf'),
    'Medium': require('../assets/fonts/Poppins-Medium.ttf'),
    'SemiBold': require('../assets/fonts/Poppins-SemiBold.ttf'),
    'Regular': require('../assets/fonts/Poppins-Regular.ttf'),
    'Thin': require('../assets/fonts/Poppins-Thin.ttf'),
    'Light': require('../assets/fonts/Poppins-Light.ttf'),
    
    
  
});



const navigation = useNavigation();

  const openMenu = () => {
    navigation.openDrawer();
  }

const GoHome = () => {
    navigation.navigate('Home Stack');
  }


 const goBackPage = () => {
    //navigation.navigate(screenName);
    navigation.goBack();
  }



  return (

     <>{!fontsLoaded ? (<View/>):(

     
  
<View style={styles.header}>
        <Text style={styles.title}>Microfinance</Text>
        <View style={styles.headerIcons}>

         <TouchableOpacity 
         onPress={goBackPage}
         >
          <Ionicons name="arrow-back" size={24} color="#fff" 
          style={{ marginRight: 15 }}
           />
           </TouchableOpacity>
          
          <TouchableOpacity
          onPress={GoHome} 
          style={styles.avatar} >
          <FontAwesome name="home" size={20} color="#c07d18"/>
        </TouchableOpacity>






        </View>





      </View>




     )}</>
  );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#0f172a',
     paddingHorizontal: 20, paddingTop: 50,

      },
  header: { flexDirection: 'row', justifyContent: 'space-between',
   alignItems: 'center',
   marginTop:30,
   paddingHorizontal: 20,
   marginBottom:30,
    },

  title: { color: '#fff', fontSize: 22, fontWeight: '700' },
  headerIcons: { flexDirection: 'row', alignItems: 'center' },
  avatar: { 
    width: 32, 
    height: 32, 
    borderRadius: 16, 
    backgroundColor: '#1e293b' ,
    justifyContent:'center',
    alignItems:'center',
  },

     });

