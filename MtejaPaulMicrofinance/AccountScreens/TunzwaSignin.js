
import React, { useState,useCallback, useEffect } from 'react';

import { View,SafeAreaView,ImageBackground,KeyboardAvoidingView,
  Pressable,
 TextInput,
 Linking,
  
  Alert, Image, StyleSheet, ActivityIndicator,Platform, Text, Dimensions, ScrollView, Touchable, TouchableOpacity } from 'react-native';


import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { EndPoint } from '../Constant/links';
import {globalStyles} from '../Styles/GlobalStyles';
import LottieView from 'lottie-react-native';
import { EventRegister } from 'react-native-event-listeners';
import { Ionicons, FontAwesome, MaterialCommunityIcons} from '@expo/vector-icons';
import {useFonts} from 'expo-font';
import AwesomeAlert from 'react-native-awesome-alerts';
import { COLORS, SIZES } from '../Screens/src/Constant';
import LotterViewScreen from '../Screens/LotterViewScreen';
import { LinearGradient } from 'expo-linear-gradient';


const { width, height } = Dimensions.get('window');
const SigninScreen = ({ navigation }) => {

     const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

 const showAlertFunction = (message) => {
    setAlertMessage(message);
    setShowAlert(true);
  };

  const hideAlert = () => {
    setShowAlert(false);
  };



    //const [isPending, setIsPending] = useState(false);
let [fontsLoaded] = useFonts({
    
    'Bold': require('../assets/fonts/Poppins-Bold.ttf'),
    'Medium': require('../assets/fonts/Poppins-Medium.ttf'),
    'SemiBold': require('../assets/fonts/Poppins-SemiBold.ttf'),
    'Regular': require('../assets/fonts/Poppins-Regular.ttf'),
    'Thin': require('../assets/fonts/Poppins-Thin.ttf'),
    'Light': require('../assets/fonts/Poppins-Light.ttf'),
    
    
  
});





  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  //TO MAKE A LOADING MESSAGE ON A BUTTON
  const [isPending, setPending] = useState(false);

  //const navigation = useNavigation();

  useEffect(() => {
    checkLoggedIn();
  }, []);

  const checkLoggedIn = async () => {
    const token = await AsyncStorage.getItem('userToken');
    if (token) {
      try {
        const userResponse = await axios.get(
          EndPoint + '/Account/user_data/',
          {
            headers: {
              Authorization: `Token ${token}`,
            },
          }
        );

        const userData = userResponse.data;
       

      } catch (error) {
        
      }
    }
  };




// const [error, setError] = useState(null);
const [errorMessage, setErrorMessage] = useState('');
const emailRegex = /\S+@\S+\.\S+/;

const handleErrorMessage = (error) => {
    if (error.response) {
      // The request was made and the server responded with an error status code
      // if (error.response.status === 401) {
      //   showAlertFunction('Authentication Error: You are not authorized.');
      // } 
      // else if (error.response.status === 404) {
      //   showAlertFunction('Not Found: The requested resource was not found.');

      // } 
      //else if{
      //   showAlertFunction('An error occurred while processing your request.');
      // }
    }  if (error.message === 'Network Error') {
      showAlertFunction('Tatizo la mtandao, washa data na ujaribu tena.');
    } else {
      showAlertFunction('Taarifa zako sio sahihi');
    }
  };

  const handleLogin = async () => {
    

    if (!username && !password) {
      //setError('Please fill in all fields correctly');
      showAlertFunction("Tafadhali jaza taarifa zote kwa usahihi");
      return;
    }

    if (!username) {
     // setError('Please enter your registration username correctly');
      showAlertFunction("Tafadhali ingiza jina lako kwa usahihi");
      return;
    }

      // Validate email format
  
  // if (!emailRegex.test(email)) {
  //   showAlertFunction("Please enter a valid email address");
  //   return;
  // }

    if (!password) {
      //setError('Please enter your registration password correctly');
      showAlertFunction("Tafadhali ingiza password yako kwa usahihi");
      return;
    }
    setPending(true);

    try {
      const response = await axios.post(EndPoint + '/Account/login_user/', {
        username: username,
        password: password,
      });

      const token = response.data.token;
      await AsyncStorage.setItem('userToken', token);
      //navigation.emit('updateUserToken', token);

      // Now, make another request to get user data
      const userResponse = await axios.get(EndPoint + '/Account/user_data/', {
        headers: {
          Authorization: `Token ${token}`,
        },
      });

      const userData = userResponse.data;
      // Save user data to AsyncStorage
      await AsyncStorage.setItem('userData', JSON.stringify(userData));

      // Emit the 'updateUserToken' event
      // hii inasaidia kupata a login user token automatically without
      // page refreshing
      EventRegister.emit('updateUserToken', token);

        // Confirm AsyncStorage writes are complete before navigating
    await Promise.all([
      AsyncStorage.getItem('userToken'),
      AsyncStorage.getItem('userData'),
    ]);
   

   console.log("Token Saved:", token);
console.log("UserData Saved:", userData);



      // Pass the userData to Home Stack
      // navigation.replace('MainScreen', { userData });
      navigation.reset({
        index: 0,
        routes: [{ name: 'Home Stack' }],
      });
    } catch (error) {
      //setError('Invalid credentials');
      // showAlertFunction("Invalid credentials");
      
      handleErrorMessage(error);
      setPending(false);
      console.log("Error", error);
    }
  };




  const [isPasswordVisible, setPasswordVisible] = useState(false);


    return(

        <>{!fontsLoaded ? (<View/>):(

   
       



    <View style={styles.container}>
            <ImageBackground

                source={require('../assets/bg.jpg')}
                style={{
                    flex: 1,
                    opacity:1,
                }}
                resizeMode= "cover"
            >
                <ScrollView 
                keyboardShouldPersistTaps="handled"
                >
                    <View style={styles.topContainer}>


                     <Image

                  style={{
                    width:100,
                    height:100,
                    borderRadius:50,
                  }}
                   source={require('../assets/icon.png')} 
                  >
                  </Image>

            <Text style={[styles.title,
              {
                fontSize:20,

              }
              ]}>GEGWAJO - <Text style={{
              color:'wheat',
              fontSize:20,
            }}>MICROFINANCE</Text></Text>
            {/*<Text style={styles.subtitle}>Free Projects Share</Text>*/}
        </View>



                    <View style={styles.dataContainer}>
                        <TextInput 
                        placeholder='Jina La Kuingilia' 
                        style={[styles.textinput,{
                            width:width-100
                        }]} 
                        placeholderTextColor="#c07d18"
                        //keyboardType={'email-address'}
                        value={username}
                        onChangeText={text => setUsername(text)} 
                        />

         <View 
            style={[styles.dataContainer,
            {
            
             color: 'white', 
             // paddingHorizontal: 20, 
             //width:width, 
             width:width-100,
             //backgroundColor: 'white',
              marginVertical: 10,
              // paddingVertical:15,
              
              flexDirection:"row",
              justifyContent:"space-between",
              paddingHorizontal: 0, 
              flex:1,
          }]}
          >
          <TextInput
          style= {[styles.textinput,{ color: 'white',width:width-100}]}
          placeholder="Neno Siri La Kuingilia"
          secureTextEntry={!isPasswordVisible} // Toggle secureTextEntry based on isPasswordVisible state
          value={password}
          onChangeText={(text) => setPassword(text)}
        placeholderTextColor="#c07d18"
        />

        <View style={{
          // width:width-70,
          justifyContent:"center",
        }}>

         {/* Add a button to toggle password visibility */}
        <TouchableOpacity
          onPress={() => setPasswordVisible(!isPasswordVisible)}
          style={{ alignSelf: 'flex-end', marginRight: 50,color:'white' }}>
          <Text style={{ color: 'white', fontSize: 16,fontWeight:'bold' }}>
            {/*{isPasswordVisible ? 'Hide' : 'Show'} Password*/}
            {isPasswordVisible ? (
              <FontAwesome size={25} color="white" name="eye-slash" />
            ):(
              <FontAwesome size={25} color="white" name="eye" />
            )}
          </Text>
        </TouchableOpacity>

        </View>
        </View>

                    </View>

                    {!isPending &&
                <TouchableOpacity 
                        onPress={handleLogin}
                        
                        >
                    <View style={styles.btnContainer}>
                        
                            <View style={styles.button1}>
                                <Text style={styles.btnText}>INGIA</Text>
                            </View>
                        
                        </View>
                    </TouchableOpacity>}

                      {isPending &&
                         <View style={styles.btnContainer}>
                        <TouchableOpacity 
                        
                        >
                            <View style={[
                              styles.button1,
                              {
                                backgroundColor:'black',
                                borderColor:'black',
                              }

                              ]}>
                               
                             <ActivityIndicator size="large" color="red" /> 
                            </View>
                        </TouchableOpacity>
                     
                    </View>}

                   {/* <View style={styles.bottomContainer}>
                        <TouchableOpacity 
                         onPress={() => navigation.navigate("Signup Stack")}
                        >
                            <Text style={styles.text}>Don't have an account? | Sign Up</Text>
                        </TouchableOpacity>
                    </View>*/}


                </ScrollView>
            </ImageBackground>
        

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
                    <Text style={globalStyles.alertTitle}>Gegwajo Microfinance</Text>
                    <Text style={globalStyles.alertMessage}>{alertMessage}</Text>
                  </View>
                }
              />


        </View>
    

      



  

         )}</>
    )
}

export default SigninScreen;



const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    topContainer: {
        marginTop: 100,
        alignItems: 'center',
    },
    title: {
        color: COLORS.white,
        fontFamily: 'Medium',
        //fontSize: SIZES.h1 * 1.5
        fontSize:25,
    },
    subtitle: {
        color: COLORS.white,
        fontSize: SIZES.h4,
        paddingTop: 3,
    },
    dataContainer: {
        marginTop: 20,
    },
    textinput: {
        color: COLORS.white,
        //fontSize: SIZES.h3,
        borderBottomColor: COLORS.lightGrey,
        borderBottomWidth: 1,
        paddingVertical: 10,
        marginHorizontal: 15,
        marginVertical: 5,
        fontFamily:'Light',
    },
    btnContainer: {
        marginTop: 30,
    },
    button1: {
        //backgroundColor: 'black',
        padding: 20,
        marginHorizontal: 30,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 10,
        // borderColor:'white',
        // borderWidth:1,
    },
    btnText: {
        color: COLORS.white,
        fontWeight: 'bold',
        fontSize: SIZES.h4,
        borderColor:'white',
        borderWidth:1,
        borderRadius: 10,
        paddingHorizontal:50,
        paddingVertical:15,
        borderTopRightRadius:0,
        borderBottomLeftRadius:0,
    },
    button2: {
        flexDirection: 'row',
        backgroundColor: COLORS.blue,
        padding: 15,
        borderRadius: 10,
        marginHorizontal: 30,
        marginVertical: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logo: {
        marginRight: 10,
    },
    text: {
        color: COLORS.white,
        textAlign: 'center',
        marginTop: 10,
        fontWeight: '600',
        fontSize: SIZES.h5,
    },
    bottomContainer: {
        justifyContent: 'center',
        marginTop: 50,
    }

});
