import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  SafeAreaView,
  ImageBackground,
  KeyboardAvoidingView,
  TextInput,
  Animated,
  Image,
  StyleSheet,
  ActivityIndicator,
  Platform,
  Text,
  Dimensions,
  TouchableOpacity,
  Keyboard,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { EndPoint } from '../Constant/links';
import { globalStyles } from '../Styles/GlobalStyles';
import { EventRegister } from 'react-native-event-listeners';
import { Ionicons } from '@expo/vector-icons';
import { useFonts } from 'expo-font';
import AwesomeAlert from 'react-native-awesome-alerts';
import { LinearGradient } from 'expo-linear-gradient';

import { AppName } from '../Constant/links';

const { width, height } = Dimensions.get('window');

/**
 * Animated sign-in screen
 * - "popup" background animated circles when screen mounts ("chengachenga" effect)
 * - form fields slide from top to center on mount
 * - login button is NOT visible initially; it slides in from left when both fields have values
 *   and slides out to the right when any field becomes empty after being filled
 *
 * NOTE: durations intentionally slowed for a smoother, more elegant feel.
 */

const SigninScreen = ({ navigation }) => {
  // fonts
  let [fontsLoaded] = useFonts({
    Bold: require('../assets/fonts/Poppins-Bold.ttf'),
    Medium: require('../assets/fonts/Poppins-Medium.ttf'),
    SemiBold: require('../assets/fonts/Poppins-SemiBold.ttf'),
    Regular: require('../assets/fonts/Poppins-Regular.ttf'),
    Thin: require('../assets/fonts/Poppins-Thin.ttf'),
    Light: require('../assets/fonts/Poppins-Light.ttf'),
  });

  // form state
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [secureText, setSecureText] = useState(true);

  const [loading, setLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  // animation refs (slower durations)
  const popupAnim = useRef(new Animated.Value(0)).current; // controls popup circles opacity/scale
  const formTranslateY = useRef(new Animated.Value(-90)).current; // slide form from top
  const formOpacity = useRef(new Animated.Value(0)).current;

  // button animation (translateX). Start off-screen to left.
  const buttonTranslateX = useRef(new Animated.Value(-width * 1.2)).current;
  const buttonOpacity = useRef(new Animated.Value(0)).current;
  const buttonVisibleRef = useRef(false); // track current visibility

  // overlay little floating circles for "popup" effect - use multiple animated values
  const circleScales = useRef([
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
  ]).current;

  useEffect(() => {
    // entry animations - slowed for elegance
    Animated.parallel([
      Animated.timing(popupAnim, {
        toValue: 1,
        duration: 1400,
        useNativeDriver: true,
      }),
      Animated.timing(formTranslateY, {
        toValue: 0,
        duration: 1200,
        delay: 260,
        useNativeDriver: true,
      }),
      Animated.timing(formOpacity, {
        toValue: 1,
        duration: 1000,
        delay: 300,
        useNativeDriver: true,
      }),
      // stagger circle scales for a playful popup but slower
      Animated.stagger(
        220,
        circleScales.map((v) =>
          Animated.timing(v, {
            toValue: 1,
            duration: 1200,
            useNativeDriver: true,
          })
        )
      ),
    ]).start(() => {
      // after initial pop we'll gently pulse circles slower
      Animated.loop(
        Animated.sequence([
          Animated.timing(circleScales[0], { toValue: 0.95, duration: 1600, useNativeDriver: true }),
          Animated.timing(circleScales[0], { toValue: 1.0, duration: 1600, useNativeDriver: true }),
        ])
      ).start();
    });

    // check logged in token but do not navigate here (kept from original)
    checkLoggedIn();
  }, []);

  useEffect(() => {
    // show/hide login button depending on whether both fields are filled
    const shouldShow = username.trim().length > 0 && password.trim().length > 0;

    if (shouldShow && !buttonVisibleRef.current) {
      // animate in from left to center (slower)
      buttonVisibleRef.current = true;
      Animated.parallel([
        Animated.timing(buttonTranslateX, {
          toValue: 0,
          duration: 900,
          useNativeDriver: true,
        }),
        Animated.timing(buttonOpacity, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }),
      ]).start();
    } else if (!shouldShow && buttonVisibleRef.current) {
      // animate out to the right (slower)
      buttonVisibleRef.current = false;
      Animated.parallel([
        Animated.timing(buttonTranslateX, {
          toValue: width * 1.2,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(buttonOpacity, {
          toValue: 0,
          duration: 650,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [username, password]);

  // keep original login logic but simplified error handling
  const showAlertFunction = (message) => {
    setAlertMessage(message);
    setShowAlert(true);
  };
  const hideAlert = () => setShowAlert(false);

  const checkLoggedIn = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (token) {
        const userResponse = await axios.get(EndPoint + '/Account/user_data/', {
          headers: { Authorization: `Token ${token}` },
        });
        // you may navigate based on token if wanted
      }
    } catch (e) {
      // ignore
    }
  };

  const handleErrorMessage = (error) => {
    if (error.message === 'Network Error') showAlertFunction('Tatizo la mtandao, washa data na ujaribu tena.');
    else showAlertFunction('Taarifa zako sio sahihi');
  };

  const handleLogin = async () => {
    // small validation - button shouldn't be visible otherwise
    if (!username || !password) return;

    // hide keyboard
    Keyboard.dismiss();
    setLoading(true);

    try {
      const response = await axios.post(EndPoint + '/Account/login_user/', {
        username,
        password,
      });
      const token = response.data.token;
      await AsyncStorage.setItem('userToken', token);

      const userResponse = await axios.get(EndPoint + '/Account/user_data/', {
        headers: { Authorization: `Token ${token}` },
      });
      const userData = userResponse.data;
      await AsyncStorage.setItem('userData', JSON.stringify(userData));
      EventRegister.emit('updateUserToken', token);

      // navigate to Home Stack and reset
      navigation.reset({ index: 0, routes: [{ name: 'Home Stack' }] });
    } catch (error) {
      handleErrorMessage(error);
      console.log('Error', error?.response || error?.message || error);
    } finally {
      setLoading(false);
    }
  };

  // small components for popup circles
  const PopupCircle = ({ style, scale }) => (
    <Animated.View
      style={[
        styles.popupCircle,
        style,
        { transform: [{ scale: scale }], opacity: popupAnim },
      ]}
    />
  );

  // render
  return (
    <>{!fontsLoaded ? <View /> : (
      <LinearGradient colors={["#000", "#00122b", "#011230"]} style={styles.container}>

        {/* popup animated decorative circles */}
        <View style={styles.popupContainer} pointerEvents="none">
          <PopupCircle style={{ left: 30, top: 40, width: 140, height: 140 }} scale={circleScales[0]} />
          <PopupCircle style={{ right: 30, top: 120, width: 110, height: 110 }} scale={circleScales[1]} />
          <PopupCircle style={{ left: width * 0.20, bottom: 60, width: 90, height: 90 }} scale={circleScales[2]} />
        </View>

        {/* form container with slide-from-top animation */}
        <Animated.View style={[styles.content, { opacity: formOpacity, transform: [{ translateY: formTranslateY }] }]}>

          <View style={styles.logoContainer}>
            <Image source={require('../assets/icon.png')} style={styles.logo} />
            <Text style={styles.companyName}>{AppName}</Text>
            <Text style={styles.description}>Karibu Tena! Tafadhali jaza taarifa kwa usahihi kuendelea.</Text>
          </View>

          {/* Username Field */}
          <View style={styles.inputContainer}>
            <Ionicons name="person-outline" size={20} color="#fff" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Jina La Kuingilia"
              placeholderTextColor="#bbb"
              value={username}
              onChangeText={(text) => setUsername(text)}
              autoCapitalize="none"
              returnKeyType="next"
              onSubmitEditing={() => { /* focus next field if you wire refs */ }}
            />
          </View>

          {/* Password Field */}
          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed-outline" size={20} color="#fff" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Neno Siri La Kuingilia"
              placeholderTextColor="#bbb"
              secureTextEntry={secureText}
              value={password}
              onChangeText={(text) => setPassword(text)}
              autoCapitalize="none"
              returnKeyType="done"
              onSubmitEditing={handleLogin}
            />
            <TouchableOpacity onPress={() => setSecureText(!secureText)}>
              <Ionicons name={secureText ? "eye-off-outline" : "eye-outline"} size={20} color="#fff" />
            </TouchableOpacity>
          </View>

          {/* Animated Login Button - it only appears when both fields are filled */}
          <Animated.View
            style={{
              width: '100%',
              transform: [{ translateX: buttonTranslateX }],
              opacity: buttonOpacity,
            }}
          >
            <TouchableOpacity
              style={[styles.loginButton, loading && { opacity: 0.7 }]}
              onPress={handleLogin}
              activeOpacity={0.85}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.loginText}>Ingia</Text>
              )}
            </TouchableOpacity>
          </Animated.View>

        </Animated.View>

        {/* Loader Overlay (kept from original) */}
        {loading && (
          <View style={globalStyles.loaderOverlay}>
            <View style={globalStyles.loaderContent}>
              <ActivityIndicator size="large" color="#fff" />
              <Text style={globalStyles.loaderText}>Ingia</Text>
              <Text style={globalStyles.loaderCounter2}>tafadhali subiri....</Text>
            </View>
          </View>
        )}

        <AwesomeAlert
          show={showAlert}
          showProgress={false}
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
              <Text style={globalStyles.alertTitle}>{AppName}</Text>
              <Text style={globalStyles.alertMessage}>{alertMessage}</Text>
            </View>
          }
        />

      </LinearGradient>
    )}</>
  );
};

export default SigninScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    width: '85%',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 26,
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 10,
    borderRadius: 50,
  },
  companyName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
  },
  description: {
    fontSize: 14,
    color: '#bbb',
    textAlign: 'center',
    marginTop: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#001f46',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginBottom: 15,
    width: '100%',
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#fff',
  },
  loginButton: {
    backgroundColor: '#015d68',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    width: '100%',
  },
  loginText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },

  // popup circles
  popupContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
    zIndex: 0,
  },
  popupCircle: {
    position: 'absolute',
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 999,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
  },
});
