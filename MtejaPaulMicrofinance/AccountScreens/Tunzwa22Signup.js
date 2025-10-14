
import React, { useState, useEffect } from 'react';

import { View,SafeAreaView,ImageBackground,KeyboardAvoidingView,
Pressable, TextInput, Alert, Image,Platform, StyleSheet, ActivityIndicator, Text, Dimensions, ScrollView, Touchable, TouchableOpacity } from 'react-native';


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
import { LinearGradient } from 'expo-linear-gradient';

import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';


const {width,height} = Dimensions.get('window');
const SignupScreen = ({ navigation }) => {

  let [fontsLoaded] = useFonts({
    
    'Bold': require('../assets/fonts/Poppins-Bold.ttf'),
    'Medium': require('../assets/fonts/Poppins-Medium.ttf'),
    'SemiBold': require('../assets/fonts/Poppins-SemiBold.ttf'),
    'Regular': require('../assets/fonts/Poppins-Regular.ttf'),
    'Thin': require('../assets/fonts/Poppins-Thin.ttf'),
    'Light': require('../assets/fonts/Poppins-Light.ttf'),
    
    
  
});


  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

   const showAlertFunction = (message) => {
    setAlertMessage(message);
    setShowAlert(true);
  };

  const hideAlert = () => {
    setShowAlert(false);
  };

const pushToken = 'ExponentPushToken[hrqaidABV5-ky_nuq_FbDK]';

  // const [pushToken, setPushToken] = useState('');
  // const registerForPushNotificationsAsync = async () => {
  //   try {
  //     if (!Device.isDevice) {
  //       Alert.alert("Kifaa chako hakisapoti notifications");
  //       return;
  //     }

  //     if (Platform.OS === 'android') {
  //       await Notifications.setNotificationChannelAsync('default', {
  //         name: 'default',
  //         importance: Notifications.AndroidImportance.MAX,
  //       });
  //     }

  //     const { status: existingStatus } = await Notifications.getPermissionsAsync();
  //     let finalStatus = existingStatus;

  //     if (existingStatus !== 'granted') {
  //       const { status } = await Notifications.requestPermissionsAsync();
  //       finalStatus = status;
  //     }

  //     if (finalStatus !== 'granted') {
  //       Alert.alert(
  //         'Notification',
  //         'Tafadhali!, Ruhusu Notification kwenye simu yako ili uweze kupata ujumbe'
  //       );
  //       return;
  //     }

  //     const token2 = (await Notifications.getExpoPushTokenAsync()).data;
  //     setPushToken(token2);
  //   } catch (error) {
  //     console.error("Error in notification registration:", error);
  //     //Alert.alert('Error in notification registration. Please try again.');
  //   }
  // };

  // useEffect(() => {
  //   (async () => {
  //     await registerForPushNotificationsAsync();
  //   })();
  // }, []);


  //console.log("Push Token Again", pushToken);


 const [isPasswordVisible, setPasswordVisible] = useState(false);

  //const {width,height} = Dimensions.get('window');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [password2, setPassword2] = useState('');

  const [phone, setPhone] = useState('');
  //const [profile_image, setProfile_image] = useState('');
  

  const [error, setError] = useState(null); // State to hold the error message
const [isPending, setPending] =useState(false);
const emailRegex = /\S+@\S+\.\S+/;

const [errorMessage, setErrorMessage] = useState('');










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
        // Fetch and set cart data here
        // const cartResponse = await axios.get(
        //   'https://hotelappapisv1.pythonanywhere.com/Hotel/Cart/',
        //   {
        //     headers: {
        //       Authorization: `Token ${token}`,
        //     },
        //   }
        // );

        // const cartData = cartResponse.data;
        // // Update the cart state with the fetched data
        // setCart(cartData);

        // navigation.replace('Home Stack', { userData });
        navigation.reset({
          index: 0,
          routes: [{ name: 'Home Stack' }],
        });
      } catch (error) {
        
      }
    }
  };


const handleErrorMessage = (error) => {
    if (error.response) {
      // The request was made and the server responded with an error status code
      // if (error.response.status === 401) {
      //   showAlertFunction('Registration error. Please try again later.');
      // } else if (error.response.status === 404) {
      //   showAlertFunction('Not Found: The requested resource was not found.');

      // } 
      // else {
      //   showAlertFunction('An error occurred while processing your request.');
      // }
    }  if (error.message === 'Network Error') {
      showAlertFunction('Tatizo la mtandao, washa data na ujaribu tena.');
    } else {
      showAlertFunction('Taarifa zako sio sahihi');
    }
  };

  const handleRegistration = async () => {
    // Reset the error message
    setError(null);

    // Validation checks
    if (!email && !password && !username && !phone) {
      //setError('All fields are required');
      showAlertFunction("Tafadhali jaza taarifa zote kwa usahihi");
      return;
    }

    if (!email) {
      //setError('please enter your valid email');
       showAlertFunction("Tafadhali ingiza email yako kwa usahihi");
      return;
    }

    if (!password) {
      //setError('please enter your password');
       showAlertFunction("Tafadhali ingiza password yako kwa usahihi");
      return;
    }


     if (password !== password2) {
      showAlertFunction("Neno siri ulizoingiza hazifanani");
      return;
    }

    // Validate email format
  
  if (!emailRegex.test(email)) {
    showAlertFunction("Tafadhali fuata kanuni za kuandika email, @");
    return;
  }

  // Validate password length
  if (password.length < 4) {
    showAlertFunction("tafadhali neno siri linapaswa kuwa na tarakimu zaidi ya 4");
    return;
  }

    if (!username) {
     // setError('please enter your username');
      showAlertFunction("Tafadhali ingiza jina lako kwa usahihi");
      return;
    }

    if (!phone) {
      //setError('please enter your phone number');
       showAlertFunction("Tafadhali ingiza namba yako ya simu kwa usahihi");
      return;
    }

      // Validate phone number
  if (!phone.startsWith("0")) {
    showAlertFunction("Namba ya simu lazima ianze na 0");
    return;
  }

  if (phone.length !== 10) {
    showAlertFunction("Namba ya simu lazima iwe na tarakimu 10");
    return;
  }



  // Fetch the Expo push token
  // const expoPushToken = await registerForPushNotificationsAsync();
  const expoPushToken = pushToken;

  // if (!expoPushToken) {
  //   showAlertFunction("Imeshindikana, Kifaa chako kimeshindwa kutengeneza token");
  //   return;
  // }




    setPending(true);

    try {
      const response = await axios.post(
        EndPoint + '/Account/register_user/', {
        email: email,
        password: password,
        username: username,
        phone: phone,
        expo_push_token: expoPushToken, // Pass the token here
      });
      //Alert.alert("You have registered Successfully");
       //showAlertFunction(expoPushToken);
       showAlertFunction("Umefanikiwa kujisajili na Mfugaji Smart");
      //navigation.replace('Home Stack');

      //const token = response.data.token; // Extract the token from the response
      // You can now save the token to your app's state, AsyncStorage, or Redux store
    

  


//mwanzo wa kusave user data


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



      // Pass the userData to Home Stack
      // navigation.replace('MainScreen', { userData });
      navigation.reset({
        index: 0,
        routes: [{ name: 'Home Stack' }],
      });



//mwisho wa kusave data



  // Send push notification after registration
    // await axios.post('https://exp.host/--/api/v2/push/send', {
    //   to: expoPushToken,
    //   sound: 'default',
    //   title: 'Karibu Mfugaji Smart!',
    //   body: 'Asante kwa kujisajili. Tunakukaribisha kwenye Mfugaji Smart!',
    //   data: { targetScreen: 'Home Stack' }, // The screen name to navigate to
    //   _displayInForeground: true
    // });







    } catch (error) {
      if (error.response) {
        if (error.response.data.email) {
         // setError('Email already exists');
          showAlertFunction("Email uliyotumia kujisajili tayari ipo");
          setPending(false);
        } else if (error.response.data.username) {
          //setError('Username already exists');
          showAlertFunction("Jina ulilotumia kujisajili tayari lipo");
          setPending(false);
        }else if (error.response.data.phone) {
          //setError('Phone number already exists');
          showAlertFunction("Namba ya simu uliyotumia kujisajili tayari ipo");
          setPending(false);
        }


      } else {
        //setError('Registration error. Please try again later.');
        //showAlertFunction("Registration error. Please try again later.");
        handleErrorMessage(error);
        setPending(false);
      }
    }
  };

    return(

        <>{!fontsLoaded ? (<View/>):(


       

      
       <KeyboardAvoidingView behavior="position" style={styles.mainCon}>
        <ScrollView 
        keyboardShouldPersistTaps="handled"
        >

        <View style={{padding: 20}}>
          <Pressable style={{
            //backgroundColor:'green',
          }}>
           {/* <SvgIcon icon={'back'} width={30} height={30} />*/}
             <LottieView
        style={{
        height: height/4,
         width:'100%',
         borderRadius:5,
        // backgroundColor:'red',
         // justifyContent:'center',
         // alignItems:'center',
         zIndex:1,
         marginTop:0,

        // flex:1,

        }}
        source={require('../assets/Loading/l1.json')} // Replace with your animation JSON file
        autoPlay
        loop
      />
       
          </Pressable>
        </View>
        <View style={{position: 'relative', bottom: 30}}>
          <View style={styles.loginIcon}>
            {/*<SvgIcon icon={'enterOtp'} width={280} height={280} />*/}
       
          </View>
          <View style={styles.container}>
            <View style={styles.loginLblCon}>
              <Text style={styles.loginLbl}>Mfugaji Smart</Text>
            </View>
            <View style={styles.forgotDes}>
              <Text style={styles.forgotDesLbl}>
                Ingiza taarifa kwa usahihi kuweza kujisajili
              </Text>
           {/*   <Text style={styles.forgotDesLbl}>+91 1234567890</Text>*/}
            </View>
            <View style={styles.formCon}>

            {/*  <OTPInputView
               // pinCount={4}
                autoFocusOnLoad
                style={{width: '80%', height: 70}}
                
               
              />*/}

          

                 {/*  mwanzo wa username*/}
            <View 
            style={[styles.dataContainerForPassword, 
              {
                 width:width-20,
                marginTop:0,
              }

              ]}
          >

            <View style={{
          width:'10%',
          //justifyContent:"center",
         // backgroundColor:'red',
        }}>

         {/* Add a button to toggle password visibility */}
        <TouchableOpacity
          
          style={{ 
            alignSelf: 'flex-start', 
            marginRight: 0,color:'black',
            flexDirection:'row',
            alignItems:'center',
             }}
          >

          <FontAwesome size={25} color="green" name="user-circle" />

        {/*  <Text style={{
           color: 'black', 
           fontSize: 16,
           fontWeight:'bold',
           marginLeft:10,
            }}>
            +255
          </Text>*/}
        </TouchableOpacity>

        </View>


          <TextInput
          style= {[styles.textinputi,{ 
            color: 'black',width:'88%',
            //backgroundColor:'black',

            //paddingVertical:20,
          }]}
          placeholder="Ingiza jina unalotumia"
          //keyboardType="numeric"
          
          value={username}
          onChangeText={setUsername}
        placeholderTextColor="black"
        />

      
        </View>
      {/*  mwisho wa username*/}




               {/*  mwanzo wa namba ya simu*/}
            <View 
            style={[styles.dataContainerForPassword, 
              {
                 width:width-20,
                marginTop:20,
              }

              ]}
          >

            <View style={{
          width:'10%',
          //justifyContent:"center",
        }}>

         {/* Add a button to toggle password visibility */}
        <TouchableOpacity
          
          style={{ 
            alignSelf: 'flex-start', 
            marginRight: 0,color:'black',
            flexDirection:'row',
            alignItems:'center',
             }}
          >

           <Image

          style={{
            width:30,
            height:30,
          }}
           source={require('../assets/tz.jpg')} 
          >
          </Image>

        {/*  <Text style={{
           color: 'black', 
           fontSize: 16,
           fontWeight:'bold',
           marginLeft:10,
            }}>
            +255
          </Text>*/}
        </TouchableOpacity>

        </View>


          <TextInput
          style= {[styles.textinputi,{ 
            color: 'black',width:'88%',

            //paddingVertical:20,
          }]}
          placeholder=" Namba ya simu, mfano: 0628431507"
          keyboardType="numeric"
          
          value={phone}
          onChangeText={setPhone}
        placeholderTextColor="black"
        />

      
        </View>
      {/*  mwisho wa namba ya simu*/}


          {/*     <TextInput 
              placeholder='Ingiza namba yako ya simu, 0*********' 
              //style={{width: '80%', height: 100}}
              style={[styles.textinput,{
                  width:width-20,
                  //height:70,
                  color:'black',
                  marginTop:20,
              }]} 
              placeholderTextColor="black"
             value={phone}
              onChangeText={setPhone}
              
             // keyboardType="email-address"
              />*/}

       
  

        {/*  mwanzo wa email*/}
            <View 
            style={[styles.dataContainerForPassword, 
              {
                 width:width-20,
                marginTop:20,
              }

              ]}
          >

            <View style={{
          width:'10%',
          //justifyContent:"center",
         // backgroundColor:'red',
        }}>

         {/* Add a button to toggle password visibility */}
        <TouchableOpacity
          
          style={{ 
            alignSelf: 'flex-start', 
            marginRight: 0,color:'black',
            flexDirection:'row',
            alignItems:'center',
             }}
          >

          <FontAwesome size={25} color="green" name="envelope-o" />

        {/*  <Text style={{
           color: 'black', 
           fontSize: 16,
           fontWeight:'bold',
           marginLeft:10,
            }}>
            +255
          </Text>*/}
        </TouchableOpacity>

        </View>


          <TextInput
          style= {[styles.textinputi,{ 
            color: 'black',width:'88%',
            //backgroundColor:'black',

            //paddingVertical:20,
          }]}
          placeholder="Ingiza email yako"
          //keyboardType="numeric"
           keyboardType={'email-address'}
          
          value={email}
          onChangeText={setEmail}
        placeholderTextColor="black"
        />

      
        </View>
      {/*  mwisho wa email*/}



           
          {/*  mwanzo wa neno siri*/}
            <View 
               style={[styles.dataContainerForPassword, 
              {
                 width:width-20,
                marginTop:20,
              }

              ]}
          >

                <View style={{
          width:'10%',
          //justifyContent:"center",
         // backgroundColor:'red',
        }}>

         {/* Add a button to toggle password visibility */}
        <TouchableOpacity
          
          style={{ 
            alignSelf: 'flex-start', 
            marginRight: 0,color:'black',
            flexDirection:'row',
            alignItems:'center',
             }}
          >

          <FontAwesome size={25} color="green" name="key" />

        {/*  <Text style={{
           color: 'black', 
           fontSize: 16,
           fontWeight:'bold',
           marginLeft:10,
            }}>
            +255
          </Text>*/}
        </TouchableOpacity>

        </View>

          <TextInput
          style= {[styles.textinputi,{ 
            color: 'black',
          width:'65%'
        }]}
          placeholder="Neno siri"
          secureTextEntry={!isPasswordVisible} // Toggle secureTextEntry based on isPasswordVisible state
         value={password}
          onChangeText={(text) => setPassword(text)}
        placeholderTextColor="black"
        />

        <View style={{
          width:'20%',
          justifyContent:"center",
        }}>

         {/* Add a button to toggle password visibility */}
        <TouchableOpacity
          onPress={() => setPasswordVisible(!isPasswordVisible)}
          style={{ alignSelf: 'flex-end', marginRight: 0,color:'black' }}>
          <Text style={{ color: 'black', fontSize: 16,fontWeight:'bold' }}>
            {/*{isPasswordVisible ? 'Hide' : 'Show'} Password*/}
            {isPasswordVisible ? (
              <FontAwesome size={25} color="black" name="eye-slash" />
            ):(
              <FontAwesome size={25} color="black" name="eye" />
            )}
          </Text>
        </TouchableOpacity>

        </View>
        </View>
      {/*  mwisho wa neno siri*/}






        {/*  mwanzo wa neno siri*/}
            <View 
            style={[styles.dataContainerForPassword, 
              {
                 width:width-20,
                marginTop:20,
              }

              ]}
          >

               <View style={{
          width:'10%',
          //justifyContent:"center",
         // backgroundColor:'red',
        }}>

         {/* Add a button to toggle password visibility */}
        <TouchableOpacity
          
          style={{ 
            alignSelf: 'flex-start', 
            marginRight: 0,color:'black',
            flexDirection:'row',
            alignItems:'center',
             }}
          >

          <FontAwesome size={25} color="green" name="key" />

        {/*  <Text style={{
           color: 'black', 
           fontSize: 16,
           fontWeight:'bold',
           marginLeft:10,
            }}>
            +255
          </Text>*/}
        </TouchableOpacity>

        </View>
          <TextInput
          style= {[styles.textinputi,{ 
            color: 'black',width:'65%',
            //paddingVertical:20,
          }]}
          placeholder=" Rudia neno siri"
          secureTextEntry={!isPasswordVisible} // Toggle secureTextEntry based on isPasswordVisible state
          value={password2}
          onChangeText={setPassword2}
        placeholderTextColor="black"
        />

        <View style={{
          width:'20%',
          //justifyContent:"center",
        }}>

         {/* Add a button to toggle password visibility */}
        <TouchableOpacity
          onPress={() => setPasswordVisible(!isPasswordVisible)}
          style={{ alignSelf: 'flex-end', marginRight: 0,color:'black' }}>
          <Text style={{ color: 'black', fontSize: 16,fontWeight:'bold' }}>
            {/*{isPasswordVisible ? 'Hide' : 'Show'} Password*/}
            {isPasswordVisible ? (
              <FontAwesome size={25} color="black" name="eye-slash" />
            ):(
              <FontAwesome size={25} color="black" name="eye" />
            )}
          </Text>
        </TouchableOpacity>

        </View>
        </View>
      {/*  mwisho wa neno siri*/}












       











{/*mwanzo wa forget password*/}
      <TouchableOpacity
      onPress={() => navigation.navigate("Send OTP Screen")} 
      style={{
        alignItems:'center',
        justifyContent:'space-between',
        flexDirection:'row'
      }}>

       <Text style={{
        color:'green',
        marginTop:15,
        textAlign:'right',
        fontFamily:'Medium',
      }}>
        Umesahau neno siri ?
      </Text>


      <Ionicons name='arrow-forward-circle' 
                size={28}
                color='black' 
                style={{
                  marginTop:15,
                  marginLeft:10,
                }} 
                
                 />
        
      </TouchableOpacity>

{/*mwanzo wa forget password*/}

            {!isPending && (
              <Pressable 
              style={{
                flexDirection:'row',
                justifyContent:'space-between',
                alignItems:'center',
                  backgroundColor:'green',
                  marginTop:50,
                  paddingVertical:10,
                  paddingHorizontal:40,
                  borderRadius:8,
                  color:'white',
                  borderColor:'white',
                  borderWidth:1,
               // backgroundColor:'black'
              }}
              onPress={handleRegistration}>
                <Text style={styles.registerLbl}>Jisajili</Text>
                 <Ionicons name='arrow-forward-circle' 
                size={28}
                color='white' 
                style={{
                 // marginTop:70,
                }} 
                
                 />
              </Pressable>
              )}




           {isPending &&
                         <View style={styles.btnContainer}>
                        <TouchableOpacity 
                        
                        >
                            <View style={styles.button1}>
                               
                             <ActivityIndicator size="large" color="green" /> 
                            </View>
                        </TouchableOpacity>
                     
                    </View>}





               <Pressable 
              style={{
                flexDirection:'row',
                justifyContent:'space-between',
                alignItems:'center',
                  //backgroundColor:'green',
                  marginTop:50,
                  paddingVertical:10,
                  paddingHorizontal:40,
                  borderRadius:8,
                  color:'white',
                  borderColor:'green',
                  borderWidth:1,
               // backgroundColor:'black'
              }}
             onPress={() => navigation.navigate("Signin Stack")}
              >
              
                <Text style={[styles.registerLbl,

                  {
                    color:'black',
                    //marginLeft:20,
                  }

                  ]}>Tayari umeshajisajili ? | Ingia </Text>

                   <Ionicons name='arrow-forward-circle' 
                size={28}
                color='green' 
                style={{
                 // marginTop:70,
                }} 
                
                 />
                
              </Pressable>


            </View>
          </View>
        </View>





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
                    <Image source={require('../assets/i2.jpg')} style={globalStyles.alertImage} />
                    <Text style={globalStyles.alertTitle}>Mfugaji Smart</Text>
                    <Text style={globalStyles.alertMessage}>{alertMessage}</Text>
                  </View>
                }
              />

</ScrollView>
      </KeyboardAvoidingView>

     


         )}</>
    )
}

export default SignupScreen;




const styles = StyleSheet.create({
  mainCon: {
    backgroundColor: 'white',
    flex: 1,
  },
  loginIcon: {
    alignSelf: 'center',
  },
  formCon: {
    alignItems: 'center',
  },
  container: {
    paddingHorizontal: 20,
    marginTop: 50,
  },
  loginLblCon: {
    position: 'relative',
    bottom: 40,
  },
  loginLbl: {
    color: '#000',
    fontSize: 40,
    marginBottom:10,
    //fontFamily: Fonts.type.NotoSansExtraBold,
  },
  forgotDes: {
    position: 'relative',
    bottom: 35,
  },
  forgotDesLbl: {
    color: '#000',
   // fontFamily: Fonts.type.NotoSansRegular,
  },
  //registerLbl: {color: '#0057ff', fontFamily: Fonts.type.NotoSansSemiBold},


registerLbl:{
  // backgroundColor:'black',
  // marginTop:70,
  // paddingVertical:10,
  // paddingHorizontal:40,
  // borderRadius:8,
   color:'white',
  // borderColor:'green',
  // borderWidth:1,
  marginRight:20,


},




   textinput: {
        color: COLORS.white,
        //fontSize: SIZES.h3,
        // borderBottomColor: COLORS.lightGrey,
        borderColor: COLORS.green,
        borderWidth: 1,
        paddingVertical: 10,
        marginHorizontal: 15,
        marginVertical: 5,
        padding:10,
        borderRadius:8,
        fontFamily:'Light',

        borderWidth:2,
        borderColor:'black',
    },



    dataContainerForPassword: {
      color: COLORS.white,
        fontSize: SIZES.h3,
        // borderBottomColor: COLORS.lightGrey,
        borderColor: COLORS.green,
        borderWidth: 1,
        paddingVertical: 10,
        marginHorizontal: 15,
        marginVertical: 5,
        marginTop: 50,
        padding:10,
        borderRadius:8,
        width:width-100,
        flexDirection:'row',
        justifyContent:'space-between',
        flex:1,

        borderWidth:2,
        borderColor:'black',
        
         
    },

  
    textinputi: {
        color: COLORS.white,
        //fontSize: SIZES.h3,
        fontFamily:'Light',
        
        
        marginHorizontal: 0,
        
        padding:0,
        
    },



});
