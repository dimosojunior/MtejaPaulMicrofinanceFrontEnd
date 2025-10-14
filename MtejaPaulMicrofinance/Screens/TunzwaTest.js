import React, { useState,useCallback,useRef, useEffect } from 'react';
import  {
  View,StyleSheet,Image,
  ActivityIndicator,
  ImageBackground,
  Linking,
  Animated,
  Alert,
  ScrollView,
  Dimensions,
  Pressable,
  Platform,Text,TouchableOpacity,TextInput,FlatList} from 'react-native';
import { useNavigation } from '@react-navigation/native';

import {MaterialIcons,Entypo,MaterialCommunityIcons,FontAwesome5, Ionicons,Feather,AntDesign, FontAwesome} from '@expo/vector-icons';

import COLORS  from '../Constant/colors';

import {useFonts} from 'expo-font';
import AwesomeAlert from 'react-native-awesome-alerts';
import {globalStyles} from '../Styles/GlobalStyles';
import LottieView from 'lottie-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
//import { useNavigation } from '@react-navigation/native';
import { EndPoint } from '../Constant/links';
import LotterViewScreen from '../Screens/LotterViewScreen';

import Header from '../Header/header';
import { useFocusEffect } from '@react-navigation/native';

const { width, height } = Dimensions.get('screen');

export default function HomeScreen ({navigation}) {


  

  let [fontsLoaded] = useFonts({
    
    'Bold': require('../assets/fonts/Poppins-Bold.ttf'),
    'Medium': require('../assets/fonts/Poppins-Medium.ttf'),
    'SemiBold': require('../assets/fonts/Poppins-SemiBold.ttf'),
    'Regular': require('../assets/fonts/Poppins-Regular.ttf'),
    'Thin': require('../assets/fonts/Poppins-Thin.ttf'),
    'Light': require('../assets/fonts/Poppins-Light.ttf'),
    
    
  
});


  const [dateTime, setDateTime] = useState({
    day: '',
    date: '',
    time: '',
  });

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();

      // Days of the week
      const days = [
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
      ];

      // Formatting time with leading zeros
      const formatTime = (value) => (value < 10 ? `0${value}` : value);

      // Get current day, date, and time
      const day = days[now.getDay()];
      const date = `${now.getDate()}-${now.getMonth() + 1}-${now.getFullYear()}`;
      const time = `${formatTime(now.getHours())}:${formatTime(
        now.getMinutes()
      )}:${formatTime(now.getSeconds())}`;

      setDateTime({ day, date, time });
    };

    // Update every second
    const intervalId = setInterval(updateDateTime, 1000);

    // Cleanup interval on unmount
    return () => clearInterval(intervalId);
  }, []);



// kwaajili ya kupata taarifa za aliyelogin
const [userData, setUserData] = useState({});
  const [userToken, setUserToken] = useState('');

  useEffect(() => {
    AsyncStorage.getItem("userToken").then(token => {
      setUserToken(token)
    })
    fetchUserData();
  }, [userData]);

  const fetchUserData = async () => {
    try {
      const userDataJSON = await AsyncStorage.getItem('userData');
      if (userDataJSON) {
        const parsedUserData = JSON.parse(userDataJSON);
        setUserData(parsedUserData);

        //console.log(parsedUserData);
        //console.log(userDataJSON);
      }
    } catch (error) {
      // console.log(error);
    }
  };


 useEffect(() => {
    checkLoggedIn();


  }, [userToken]);

  const checkLoggedIn = async () => {
    const token = await AsyncStorage.getItem('userToken');
    setUserToken(token);
  };


const [WatejaWote, setWatejaWote] = useState(0);
const [ActiveProjects, setActiveProjects] = useState(0);

// Fetch Wateja Data
useEffect(() => {
  const fetchWatejaData = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken'); // Get the token
      if (token) {
        const response = await axios.get(EndPoint + '/CountAllWatejaWoteView/', {
          headers: {
            Authorization: `Token ${token}`, // Pass the token in the header
          },
        });
        const { wateja_wote, wateja_hai } = response.data;
        setWatejaWote(wateja_wote);
        setActiveProjects(wateja_hai);
      } else {
        console.error("No user token found");
      }
    } catch (error) {
      console.error("Error fetching Wateja data:", error);
    }
  };

  fetchWatejaData();
}, []);








//-----------Fetch wateja wote

const [WatejaWote2, setWatejaWote2] = useState(0);
const [ActiveProjects2, setActiveProjects2] = useState(0);

// Fetch Wateja Data
useEffect(() => {
  const fetchWatejaData2 = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken'); // Get the token
      if (token) {
        const response = await axios.get(EndPoint + '/CountAllWatejaWoteNjeYaMikataView/', {
          headers: {
            Authorization: `Token ${token}`, // Pass the token in the header
          },
        });
        const { wateja_wote, wateja_hai } = response.data;
        setWatejaWote2(wateja_wote);
        setActiveProjects2(wateja_hai);
      } else {
        console.error("No user token found");
      }
    } catch (error) {
      console.error("Error fetching Wateja data:", error);
    }
  };

  fetchWatejaData2();
}, []);



const [Total_Hawajarejesha, setTotal_Hawajarejesha] = useState(0);
//const [ActiveProjects, setActiveProjects] = useState(0);

// Fetch Wateja Data
useEffect(() => {
  const fetchWatejaData3 = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken'); // Get the token
      if (token) {
        const response = await axios.get(EndPoint + '/CountHawajarejeshaJanaView/', {
          headers: {
            Authorization: `Token ${token}`, // Pass the token in the header
          },
        });
        const { jumla_hawajarejesha_jana } = response.data;
        setTotal_Hawajarejesha(jumla_hawajarejesha_jana);
        //setActiveProjects(wateja_hai);
      } else {
        console.error("No user token found");
      }
    } catch (error) {
      console.error("Error fetching Wateja data:", error);
    }
  };

  fetchWatejaData3();
}, []);



const [HawajakopaTena, setHawajakopaTena] = useState(0);
//const [ActiveProjects, setActiveProjects] = useState(0);

// Fetch Wateja Data
useEffect(() => {
  const fetchWatejaData4 = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken'); // Get the token
      if (token) {
        const response = await axios.get(EndPoint + '/CountAllWamemalizaHawajakopaTenaView/', {
          headers: {
            Authorization: `Token ${token}`, // Pass the token in the header
          },
        });
        const { wateja_wote } = response.data;
        setHawajakopaTena(wateja_wote);
        //setActiveProjects(wateja_hai);
      } else {
        console.error("No user token found");
      }
    } catch (error) {
      console.error("Error fetching Wateja data: 4", error);
    }
  };

  fetchWatejaData4();
}, []);




    const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

 const showAlertFunction = (message) => {
    setAlertMessage(message);
    setShowAlert(true);
  };

  const hideAlert = () => {
    setShowAlert(false);
  };



  return (

       <>{!fontsLoaded ? (<View/>):(

          <View style={globalStyles.container}>


  <Header />

  <ScrollView 
        keyboardShouldPersistTaps="handled"
        >

 <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#999" />
        <TextInput placeholder="Search Clients & Contracts..." placeholderTextColor="#888" style={styles.searchInput} />
        <Ionicons name="filter-outline" size={20} color="#999" />
      </View>


<Text style={styles.sectionTitle}>Financial Summary</Text>
        <View style={styles.summaryCard}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Total Disbursed</Text>
            <Text style={styles.summaryValue}>$125,430</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Total Collected</Text>
            <Text style={[styles.summaryValue, { color: '#22c55e' }]}>$98,210</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={[styles.summaryLabel, { color: '#f87171' }]}>Outstanding</Text>
            <Text style={[styles.summaryValue, { color: '#f87171' }]}>$27,220</Text>
          </View>
        </View>








{/*mwanzo wa item*/}

{userData && userData.is_admin === true && (

  <Pressable 
   onPress={() => navigation.navigate('Riport Summary')}

style={globalStyles.ItemHomeScreenPressableContainer}

  >
 {/* mwanzowa view kubwa*/}
  <View 
  style={globalStyles.ItemHomeScreenContainer}
  >

{/* mwanzo wa view ya icon*/}
    <View 
     style={globalStyles.ItemHomeScreenFirstLeftContainer}
   >
   {/*  <Image style={{
      height:60,
      width:60
    }} 
     source={require('../assets/i2.jpg')} 
     >
     </Image>*/}
        <FontAwesome name='bar-chart' 
      size={30}
      //color="black" 
      style={globalStyles.ItemHomeScreenLeftContainerIcon}      
       />
    </View>
  {/* mwiso wa view ya icon*/}

   
      <View 
       style={globalStyles.ItemHomeScreenMiddleContainer}

    >
       <Text 
        style={globalStyles.ItemHomeScreenMiddleContainerText1}
        
        >
        REPORT SUMMARY
        </Text>
       {/* <Text 
        style={globalStyles.ItemHomeScreenMiddleContainerText2}
        >({WatejaWote})</Text>*/}
      </View>

      <View 
      style={globalStyles.ItemHomeScreenRightContainer}
     >
        {/*<Text style={{color:'black',fontWeight:"600"}}>difference</Text>*/}
        {/*<Text style={{color:'red',fontWeight:"600"}}>percentage </Text>*/}

       <Ionicons name='arrow-forward-circle' 
        onPress={() => navigation.navigate('Riport Summary')}
      size={30}
      //color="black" 
      //color="red"
      style={globalStyles.ItemHomeScreenRightContainerIcon}
         />
      
      </View>

   

  </View>
{/* mwisho wa view kubwa*/}
          </Pressable>

          )}

{/*mwisho wa item */}

 






{/*mwanzo wa item*/}

  <Pressable 
   onPress={() => navigation.navigate('Mikataba Yote')}

style={globalStyles.ItemHomeScreenPressableContainer}

  >
 {/* mwanzowa view kubwa*/}
  <View 
  style={globalStyles.ItemHomeScreenContainer}
  >

{/* mwanzo wa view ya icon*/}
    <View 
     style={globalStyles.ItemHomeScreenFirstLeftContainer}
   >
   {/*  <Image style={{
      height:60,
      width:60
    }} 
     source={require('../assets/i2.jpg')} 
     >
     </Image>*/}
        <FontAwesome name='th-large' 
      size={30}
      //color="black" 
      style={globalStyles.ItemHomeScreenLeftContainerIcon}      
       />
    </View>
  {/* mwiso wa view ya icon*/}

   
      <View 
       style={globalStyles.ItemHomeScreenMiddleContainer}

    >
        <Text 
        style={globalStyles.ItemHomeScreenMiddleContainerText1}
        
        >
        MIKATABA YOTE
        </Text>
        <Text 
        style={globalStyles.ItemHomeScreenMiddleContainerText2}
        >({WatejaWote})</Text>
      </View>

      <View 
      style={globalStyles.ItemHomeScreenRightContainer}
     >
        {/*<Text style={{color:'black',fontWeight:"600"}}>difference</Text>*/}
        {/*<Text style={{color:'red',fontWeight:"600"}}>percentage </Text>*/}

       <Ionicons name='arrow-forward-circle' 
        onPress={() => navigation.navigate('Mikataba Yote')}
      size={30}
      //color="black" 
      //color="red"
      style={globalStyles.ItemHomeScreenRightContainerIcon}
         />
      
      </View>

   

  </View>
{/* mwisho wa view kubwa*/}
          </Pressable>

{/*mwisho wa item */}

 






{/*mwanzo wa item*/}

  <Pressable 
   onPress={() => navigation.navigate('Mikataba Hai')}
style={globalStyles.ItemHomeScreenPressableContainer}

  >
 {/* mwanzowa view kubwa*/}
  <View 
  style={globalStyles.ItemHomeScreenContainer}
  >

{/* mwanzo wa view ya icon*/}
    <View 
     style={globalStyles.ItemHomeScreenFirstLeftContainer}
   >
   {/*  <Image style={{
      height:60,
      width:60
    }} 
     source={require('../assets/i2.jpg')} 
     >
     </Image>*/}
        <FontAwesome name='book' 
         onPress={() => navigation.navigate('Mikataba Hai')}
      size={30}
      //color="black" 
      style={globalStyles.ItemHomeScreenLeftContainerIcon}      
       />
    </View>
  {/* mwiso wa view ya icon*/}

   
      <View 
       style={globalStyles.ItemHomeScreenMiddleContainer}

    >
        <Text 
        style={globalStyles.ItemHomeScreenMiddleContainerText1}
        
        >
        MIKATABA HAI
        </Text>
        <Text 
        style={globalStyles.ItemHomeScreenMiddleContainerText2}
        >({ActiveProjects})</Text>
      </View>

      <View 
      style={globalStyles.ItemHomeScreenRightContainer}
     >
        {/*<Text style={{color:'black',fontWeight:"600"}}>difference</Text>*/}
        {/*<Text style={{color:'red',fontWeight:"600"}}>percentage </Text>*/}

       <Ionicons name='arrow-forward-circle' 
       onPress={() => navigation.navigate('Mikataba Hai')}
      size={30}
      //color="black" 
      //color="red"
      style={globalStyles.ItemHomeScreenRightContainerIcon}
         />
      
      </View>

   

  </View>
{/* mwisho wa view kubwa*/}
          </Pressable>

{/*mwisho wa item */}








{/*mwanzo wa item*/}

  <Pressable 
  onPress={() => navigation.navigate('Nje Ya Mkataba Leo')}
style={globalStyles.ItemHomeScreenPressableContainer}

  >
 {/* mwanzowa view kubwa*/}
  <View 
  style={globalStyles.ItemHomeScreenContainer}
  >

{/* mwanzo wa view ya icon*/}
    <View 
     style={globalStyles.ItemHomeScreenFirstLeftContainer}
   >
   {/*  <Image style={{
      height:60,
      width:60
    }} 
     source={require('../assets/i2.jpg')} 
     >
     </Image>*/}
        <FontAwesome name='user-times' 
        
      size={30}
      //color="black" 
      style={globalStyles.ItemHomeScreenLeftContainerIcon}      
       />
    </View>
  {/* mwiso wa view ya icon*/}

   
      <View 
       style={globalStyles.ItemHomeScreenMiddleContainer}

    >
        <Text 
        style={globalStyles.ItemHomeScreenMiddleContainerText1}
        
        >
        NJE YA MKATABA LEO
        </Text>
        <Text 
        style={globalStyles.ItemHomeScreenMiddleContainerText2}
        >({ActiveProjects2})</Text>
      </View>

      <View 
      style={globalStyles.ItemHomeScreenRightContainer}
     >
        {/*<Text style={{color:'black',fontWeight:"600"}}>difference</Text>*/}
        {/*<Text style={{color:'red',fontWeight:"600"}}>percentage </Text>*/}

       <Ionicons name='arrow-forward-circle' 
       onPress={() => navigation.navigate('Nje Ya Mkataba Leo')}
      size={30}
      //color="black" 
      //color="red"
      style={globalStyles.ItemHomeScreenRightContainerIcon}
         />
      
      </View>

   

  </View>
{/* mwisho wa view kubwa*/}
          </Pressable>

{/*mwisho wa item */}





{/*mwanzo wa item*/}

  <Pressable 
  onPress={() => navigation.navigate('Nje Ya Mkataba Wote')}
style={globalStyles.ItemHomeScreenPressableContainer}

  >
 {/* mwanzowa view kubwa*/}
  <View 
  style={globalStyles.ItemHomeScreenContainer}
  >

{/* mwanzo wa view ya icon*/}
    <View 
     style={globalStyles.ItemHomeScreenFirstLeftContainer}
   >
   {/*  <Image style={{
      height:60,
      width:60
    }} 
     source={require('../assets/i2.jpg')} 
     >
     </Image>*/}
        <FontAwesome name='user-secret' 
        
      size={30}
      //color="black" 
      style={globalStyles.ItemHomeScreenLeftContainerIcon}      
       />
    </View>
  {/* mwiso wa view ya icon*/}

   
      <View 
       style={globalStyles.ItemHomeScreenMiddleContainer}

    >
        <Text 
        style={globalStyles.ItemHomeScreenMiddleContainerText1}
        
        >
        NJE YA MKATABA WOTE
        </Text>
        <Text 
        style={globalStyles.ItemHomeScreenMiddleContainerText2}
        >({WatejaWote2})</Text>
      </View>

      <View 
      style={globalStyles.ItemHomeScreenRightContainer}
     >
        {/*<Text style={{color:'black',fontWeight:"600"}}>difference</Text>*/}
        {/*<Text style={{color:'red',fontWeight:"600"}}>percentage </Text>*/}

       <Ionicons name='arrow-forward-circle' 
         onPress={() => navigation.navigate('Nje Ya Mkataba Wote')}
      size={30}
      //color="black" 
      //color="red"
      style={globalStyles.ItemHomeScreenRightContainerIcon}
         />
      
      </View>

   

  </View>
{/* mwisho wa view kubwa*/}
          </Pressable>

{/*mwisho wa item */}





{/*mwanzo wa item*/}

  <Pressable 
  onPress={() => navigation.navigate('Hawajarejesha Jana')}
style={globalStyles.ItemHomeScreenPressableContainer}

  >
 {/* mwanzowa view kubwa*/}
  <View 
  style={globalStyles.ItemHomeScreenContainer}
  >

{/* mwanzo wa view ya icon*/}
    <View 
     style={globalStyles.ItemHomeScreenFirstLeftContainer}
   >
   {/*  <Image style={{
      height:60,
      width:60
    }} 
     source={require('../assets/i2.jpg')} 
     >
     </Image>*/}
        <FontAwesome name='users' 
      size={30}
      //color="black" 
      style={globalStyles.ItemHomeScreenLeftContainerIcon}      
       />
    </View>
  {/* mwiso wa view ya icon*/}

   
      <View 
       style={globalStyles.ItemHomeScreenMiddleContainer}

    >
        <Text 
        style={globalStyles.ItemHomeScreenMiddleContainerText1}
        
        >
        HAWAJAREJESHA JANA
        </Text>
        <Text 
        style={globalStyles.ItemHomeScreenMiddleContainerText2}
        >({Total_Hawajarejesha})</Text>
      </View>

      <View 
      style={globalStyles.ItemHomeScreenRightContainer}
     >
        {/*<Text style={{color:'black',fontWeight:"600"}}>difference</Text>*/}
        {/*<Text style={{color:'red',fontWeight:"600"}}>percentage </Text>*/}

       <Ionicons name='arrow-forward-circle' 
       onPress={() => navigation.navigate('Hawajarejesha Jana')}
      size={30}
      //color="black" 
      //color="red"
      style={globalStyles.ItemHomeScreenRightContainerIcon}
         />
      
      </View>

   

  </View>
{/* mwisho wa view kubwa*/}
          </Pressable>

{/*mwisho wa item */}










{/*mwanzo wa item*/}

  <Pressable 
  onPress={() => navigation.navigate('Wamemaliza Hawajakopa Tena')}
style={globalStyles.ItemHomeScreenPressableContainer}

  >
 {/* mwanzowa view kubwa*/}
  <View 
  style={globalStyles.ItemHomeScreenContainer}
  >

{/* mwanzo wa view ya icon*/}
    <View 
     style={globalStyles.ItemHomeScreenFirstLeftContainer}
   >
   {/*  <Image style={{
      height:60,
      width:60
    }} 
     source={require('../assets/i2.jpg')} 
     >
     </Image>*/}
        <FontAwesome name='user-o' 
        
      size={30}
      //color="black" 
      style={globalStyles.ItemHomeScreenLeftContainerIcon}      
       />
    </View>
  {/* mwiso wa view ya icon*/}

   
      <View 
       style={globalStyles.ItemHomeScreenMiddleContainer}

    >
        <Text 
        style={globalStyles.ItemHomeScreenMiddleContainerText1}
        
        >
        WAMEMALIZA HAWAJAKOPA TENA
        </Text>
        <Text 
        style={globalStyles.ItemHomeScreenMiddleContainerText2}
        >({HawajakopaTena})</Text>
      </View>

      <View 
      style={globalStyles.ItemHomeScreenRightContainer}
     >
        {/*<Text style={{color:'black',fontWeight:"600"}}>difference</Text>*/}
        {/*<Text style={{color:'red',fontWeight:"600"}}>percentage </Text>*/}

       <Ionicons name='arrow-forward-circle' 
         onPress={() => navigation.navigate('Wamemaliza Hawajakopa Tena')}
      size={30}
      //color="black" 
      //color="red"
      style={globalStyles.ItemHomeScreenRightContainerIcon}
         />
      
      </View>

   

  </View>
{/* mwisho wa view kubwa*/}
          </Pressable>

{/*mwisho wa item */}




</ScrollView>




   <AwesomeAlert
                show={showAlert}
                showProgress={false}
                // title="Overdose Stores"
                closeOnTouchOutside={true}
                closeOnHardwareBackPress={false}
                showCancelButton={false}
                showConfirmButton={true}
                confirmText="OK"
                confirmButtonColor="green"
                onConfirmPressed={hideAlert}
                 confirmButtonStyle={globalStyles.alertButton}
                contentContainerStyle={globalStyles.alertContainer}
                customView={
                  <View style={globalStyles.alertContent}>
                    <Image source={require('../assets/icon.png')} style={globalStyles.alertImage} />
                    <Text style={globalStyles.alertTitle}>TMCL</Text>
                    <Text style={globalStyles.alertMessage}>{alertMessage}</Text>
                  </View>
                }
              />
          </View>


          )}</>

          );
}

const styles = StyleSheet.create({

  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e293b',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginVertical: 5,
    marginHorizontal:10,
  },
  searchInput: { flex: 1, color: '#fff', marginHorizontal: 8 },

  sectionTitle: { color: '#fff', 
  fontSize: 18, fontWeight: '700',
   marginBottom: 10 ,
   paddingHorizontal: 10,
 },

  summaryCard: {
    backgroundColor: '#1e293b',
    borderRadius: 15,
    padding: 15,
    marginBottom: 25,
    marginHorizontal: 10,
  },
  summaryItem: { marginBottom: 10 },
  summaryLabel: { color: '#94a3b8', fontSize: 14 },
  summaryValue: { color: '#fff', fontSize: 18, fontWeight: '600' },

  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  card: {
    backgroundColor: '#1e293b',
    width: '48%',
    paddingVertical: 25,
    borderRadius: 15,
    alignItems: 'center',
    marginBottom: 15,
  },
  cardText: { color: '#fff', fontSize: 14, marginTop: 8 },

  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#1e293b',
    paddingVertical: 12,
    borderRadius: 20,
    position: 'absolute',
    bottom: 15,
    left: 20,
    right: 20,
  },
  navItem: { alignItems: 'center' },
  navText: { color: '#94a3b8', fontSize: 12, marginTop: 3 },
 
});