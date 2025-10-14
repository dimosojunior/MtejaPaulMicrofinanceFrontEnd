import React, { useState,useCallback,useRef, useEffect } from 'react';
import  {
  View,StyleSheet,Image,
  ActivityIndicator,
  ImageBackground,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  RefreshControl,
  Keyboard,
  Linking,
  Animated,
  Modal,
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

import MinorHeader from '../Header/MinorHeader';
import { useFocusEffect } from '@react-navigation/native';
import { getFormatedDate } from "react-native-modern-datepicker";
import DatePicker from "react-native-modern-datepicker";
import * as Print from 'expo-print';
import { shareAsync } from 'expo-sharing';

import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('screen');

const html = `
<html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
  </head>
  <body style="text-align: center;">
    <h1 style="font-size: 50px; font-family: Helvetica Neue; font-weight: normal;">
      Gegwajo Microfinance
    </h1>
    <img
      src="https://d30j33t1r58ioz.cloudfront.net/static/guides/sdk.png"
      style="width: 90vw;" />
  </body>
</html>
`;


const RiportSummary = ({ navigation }) => {
  const [fontsLoaded] = useFonts({
    Bold: require('../assets/fonts/Poppins-Bold.ttf'),
    Medium: require('../assets/fonts/Poppins-Medium.ttf'),
    SemiBold: require('../assets/fonts/Poppins-SemiBold.ttf'),
    Regular: require('../assets/fonts/Poppins-Regular.ttf'),
    Thin: require('../assets/fonts/Poppins-Thin.ttf'),
    Light: require('../assets/fonts/Poppins-Light.ttf'),
  });

const [totalRejeshoLeo, setTotalRejeshoLeo] = useState(0);

 const [queryset, setQueryset] = useState([]);
const [current_page, setcurrent_page] = useState(1);
const [isLoading, setIsLoading] = useState(false);
const [loading, setLoading] = useState(false);
const [endReached, setEndReached] = useState(false)
const [isPending, setPending] = useState(true);

  const [input, setInput] = useState('');


    const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

 const showAlertFunction = (message) => {
    setAlertMessage(message);
    setShowAlert(true);
  };

  const hideAlert = () => {
    setShowAlert(false);
  };


  const openUrl = async (url) => {
        const isSupported = await Linking.canOpenURL(url);
        if (isSupported) {
            await Linking.openURL(url);
        } else {
            Alert.alert(`Programu imeshindwa kufungua hii linki: ${url}`);
        }
    }
//const [modalVisible, setModalVisible] = useState(false);
const WebsiteLink = EndPoint + `/admin/`
  

// kwaajili ya kupata taarifa za aliyelogin
const [userData, setUserData] = useState({});
  const [userToken, setUserToken] = useState('');


 const fetchUserData = async () => {
    try {
      const userDataJSON = await AsyncStorage.getItem('userData');
      if (userDataJSON) {
        setUserData(JSON.parse(userDataJSON));
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const fetchTokenAndData = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      setUserToken(token);
      if (token) {
        //setcurrent_page(1); // Reset page when refetching
       // getItems(token); // Start fetching from the first page
      }
    } catch (error) {
      console.error('Error fetching token:', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      setPending(true); // Set pending to true immediately when entering the screen
      fetchUserData();
      fetchTokenAndData();

      return () => {
        //setQueryset([]); // Reset queryset to avoid stale data
        setcurrent_page(1); // Reset pagination
        setEndReached(false); // Ensure endReached is reset for new focus
      };
    }, [])
  );





 const [summaryData, setSummaryData] = useState(null);
 // const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSummaryData = async () => {
    const url = EndPoint + `/GetTransactionSummaryView/`
      try {
        const token = await AsyncStorage.getItem('userToken');
         setUserToken(token);

        const response = await fetch(url, {
          headers: {
            Authorization: `Token ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const data = await response.json();
        setSummaryData(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setPending(false);
      }
    };

    fetchSummaryData();
  }, []);

 //kwa ajili ya kurefresh pages
   const [refresh, setRefresh] = useState(false);

  // const pullMe =() => {
  //   setRefresh(true)

  //   setTimeout (() => {
  //     setRefresh(false)
  //   }, 10)
  // }



  const formatDate2 = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const formatToThreeDigits = (number) => {
    return number
      ? number.toLocaleString('en-US', {
          minimumFractionDigits: 0,
          maximumFractionDigits: 2,
        })
      : null;
  };

  const handlePress = (item) => navigation.navigate('Home', { item });
  const DeletehandlePress = (item) =>
    navigation.navigate('Delete Mteja', { ...item, postId: item.id });

const handlePressDetailsPage = (item) =>
    navigation.navigate('Mteja Details', { ...item });




//-----------Fetch wateja wote

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








//-----------filter data by date-----------------
const [startDate, setStartDate] = useState(null);
 const [modalVisible, setModalVisible] = useState(false);
 const [isRange, setisRange] = useState(false);

  //const [endDate, setEndDate] = useState(null);

  // Utility function to format the date as "YYYY-MM-DD"
  const formatDate = (dateString) => {
    if (!dateString) {
      return null;
    }
    const [year, month, day] = dateString.split("/");
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    if (startDate) {
      handleFilterByDate();
      //setisPending(true);
    }
  }, [startDate]);




  const handleFilterByDate = () => {
  // Convert the selected dates to the desired format (e.g., "YYYY-MM-DD")
  const formattedStartDate = formatDate(startDate);

  if (!startDate) {
    // Check if the startDate is not selected
    Alert.alert("Tafadhali chagua tarehe husika.");
    return;
  }

  setPending(true);

  axios
    .get(`${EndPoint}/FilterRipotiYaSikuByDate/?startDate=${formattedStartDate}`, {
      headers: {
        Authorization: `Token ${userToken}`, // Add the Authorization header here
      },
    })
    .then((response) => {
      const { queryset, total_rejesho_leo } = response.data;
      setQueryset(queryset);
      setTotalRejeshoLeo(total_rejesho_leo);
      setModalVisible(false);
      setPending(false);
      setisRange(true);
    })
    .catch((error) => {
      console.error("Error fetching filtered data: ", error);
      setModalVisible(false);
      setPending(false);
    });
};


// Function to format the datetime to date
  const formatToShortDate = (dateTimeString) => {
    if (!dateTimeString) {
      return "";
    }
    const date = new Date(dateTimeString);
    const options = { year: "numeric", month: "long", day: "numeric" };
    return date.toLocaleDateString("en-US", options);
  };









//----------------PRINTING RECEIPT-----------------

 const [selectedPrinter, setSelectedPrinter] = React.useState();
 const [order, setOrder] = useState([]);
 //const [modalVisibleReceipt, setModalVisibleReceipt] = useState(false);

const [SharedClicked, setSharedClicked] = useState(false);




  const print = async () => {
    setSharedClicked(true);
    //setModalVisible(false);
    console.log("Clicked print");
    
    // On iOS/android prints the given html. On web prints the HTML from the current page.
    await Print.printAsync({
      html: createDynamicTable(),
      printerUrl: selectedPrinter?.url, // iOS only

    });

    setSharedClicked(false);
    //setModalVisible(false);
    console.log("Print Ends");
  }

  const printToFile = async () => {
    // On iOS/android prints the given html. On web prints the HTML from the current page.
    const { uri } = await Print.printToFileAsync({
      html
    });
    
    await shareAsync(uri, { UTI: '.pdf', mimeType: 'application/pdf' });
  }

  const selectPrinter = async () => {
    const printer = await Print.selectPrinterAsync(); // iOS only
    setSelectedPrinter(printer);
  }


 const createDynamicTable = () => {
  var rows1 = '';
  var rows2 = '';
  var rows3 = '';
  var rows4 = '';

  for (let i in queryset) {
    const item = queryset[i];
    
    rows1 += `
      <tr>
        <td>${item.IdadiYaMikopoYaLeo}</td>
        <td>${item.IdadiYaMikatabaMipyaLeo}</td>
        <td>${item.IdadiYaWenyeMikatabaHai}</td>
        <td>${item.IdadiYaWaliorejeshaLeo}</td>
        <td>${item.IdadiYaFainiZilizopokelewaLeo}</td>
      </tr>
    `;
    
    rows2 += `
      <tr>
        <td>${item.JumlaMarejeshoYaLeo}</td>
        <td>${item.JumlaFainiLeo}</td>
        <td>${item.FomuNaBima}</td>
        <td>${item.BakiJana}</td>
        <td>${item.ImetokaKwaBosi}</td>
        <td>${item.ImetokaKituoJirani}</td>
        <td>${item.MapatoYaJumla}</td>
      </tr>
    `;

    rows3 += `
      <tr>
        <td>${item.Mkopo}</td>
        <td>${item.Posho}</td>
        <td>${item.ImeendaKwaBosi}</td>
        <td>${item.ImeendaKituoJirani}</td>
        <td>${item.MatumiziMengine}</td>
        <td>${item.MatumiziYaJumla}</td>
      </tr>
    `;

    rows4 += `
      <tr>
        <td>${item.Balance}</td>
      </tr>
    `;
  }

  const html = `
  <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
      <style>
        body {
          font-family: Arial, sans-serif;
          text-align: center;
          margin: 0;
          padding: 0;
          background-color:#243137;
        }
        h1 {
          font-size: 24px;
          font-weight: bold;
          margin-bottom: 20px;
          color:white;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 20px;
        }
        th {
          border: 1px solid #ddd;
          padding: 12px;
          text-align: center;
        }

        td {
          border: 1px solid #ddd;
          padding: 15px;
          text-align: center;
        }


        th {
          background-color: #c07d18;
          font-weight: bold;
        }
        tr:nth-child(even) {
          background-color: #c07d18;
        }
      </style>
    </head>
    <body>
      <h1>Gegwajo Microfinance</h1>


      <h1>Ripoti ya siku</h1>
      <!-- First Table -->
      <table>
        <tr>
          <th>MKP</th>
          <th>MKT</th>
          <th>WOTE</th>
          <th>REJ</th>
          <th>FIN</th>
        </tr>
        ${rows1}
      </table>

      <!-- Second Table -->
      <table>
        <tr>
          <th>Marejesho</th>
          <th>Faini</th>
          <th>Fomu + Bima</th>
          <th>Baki Jana</th>
          <th>Imetoka Kwa Bosi</th>
          <th>Imetoka Kwa kituo jirani</th>
          <th>Mapato Ya Jumla</th>
        </tr>
        ${rows2}
      </table>

      <!-- Third Table -->
      <table>
        <tr>
          <th>Mkopo</th>
          <th>Posho</th>
          <th>Imeenda Kwa Bosi</th>
          <th>Imeenda kituo jirani</th>
          <th>Matumizi Mengine</th>
          <th>Matumizi Ya Jumla</th>
        </tr>
        ${rows3}
      </table>

      <!-- Fourth Table -->
      <table>
        <tr>
          <th>Inakabidhiwa</th>
        </tr>
        ${rows4}
      </table>
    </body>
  </html>
  `;
  return html;
};




  return (
      <>{!fontsLoaded ? (<View/>):(

            <>


 {!isPending ? (



       <LinearGradient colors={['#243137', '#000']} style={globalStyles.container}>

          <MinorHeader />

          <View style={{ width: '100%', marginVertical: 0 }}>
           {!isRange ? (
            <Text
              style={{
                color: 'white',
                paddingVertical: 10,
                paddingHorizontal: 20,
                width: '90%',
                marginHorizontal: 10,
                borderRadius: 10,
                fontFamily: 'Medium',
              }}
            >
              Taarifa za vituo vyote za mikopo kwa wateja wote hai (wanaondelea na mikopo)
            </Text>
            ):(
          <Text
              style={{
                color: 'white',
                paddingVertical: 10,
                paddingHorizontal: 20,
                width: '90%',
                marginHorizontal: 10,
                borderRadius: 10,
                fontFamily: 'Medium',
              }}
            >
              Ripoti ya tarehe  {formatDate(startDate)}
            </Text>
            )}


          </View>

     
          <ScrollView 
      
          horizontal
          >
            <ScrollView 

            keyboardShouldPersistTaps="handled"
          
         showsVerticalScrollIndicator={false}
       
         // onScroll={handleScroll} scrollEventThrottle={16}
            >

        
              <View style={globalStyles.table}>
           

                {/* Render Table Rows */}
            

          
 
             
  <Pressable >

     


  {/*mwisho wa fomu na bima*/}

{/*mwanzo wa Full taarifa za marejesho View Ya 1*/}

<View 
style={globalStyles.FullRipotiYaSikuContainer22}
>

<Pressable 
style={globalStyles.FullRipotiYaSikuLeftMajorContainer22}
>
  


{/*mwanzo wa Left View*/} 
<View 
style={globalStyles.FullRipotiYaSikuLeftContainer22}
>
<Text 
style={globalStyles.FullRipotiYaSikuLeftText22}
 >Mikopo Yote Iliyotoka</Text>
</View>
{/*mwisho wa Left View*/} 


{/*mwanzo wa Left View*/} 
<View 
style={globalStyles.FullRipotiYaSikuLeftContainer22}
>
<Text 
style={globalStyles.FullRipotiYaSikuLeftText22}
 >Mikopo Iliyotoka Leo</Text>
</View>
{/*mwisho wa Left View*/} 


{/*mwanzo wa Left View*/} 
<View 
style={globalStyles.FullRipotiYaSikuLeftContainer22}
>
<Text 
style={globalStyles.FullRipotiYaSikuLeftText22}
 >Jumla Ya Riba Zote</Text>
</View>
{/*mwisho wa Left View*/} 


{/*mwanzo wa Left View*/} 
<View 
style={globalStyles.FullRipotiYaSikuLeftContainer22}
>
<Text 
style={globalStyles.FullRipotiYaSikuLeftText22}
 >Jumla Ya Riba Za Leo</Text>
</View>
{/*mwisho wa Left View*/} 

{/*mwanzo wa Left View*/} 
<View 
style={globalStyles.FullRipotiYaSikuLeftContainer22}
>
<Text 
style={globalStyles.FullRipotiYaSikuLeftText22}
 >Faini Zote Zilizopokelewa</Text>
</View>
{/*mwisho wa Left View*/} 


{/*mwanzo wa Left View*/} 
<View 
style={globalStyles.FullRipotiYaSikuLeftContainer22}
>
<Text 
style={globalStyles.FullRipotiYaSikuLeftText22}
 >Faini Zilizopokelewa Leo</Text>
</View>
{/*mwisho wa Left View*/} 


{/*mwanzo wa Left View*/} 
<View 
style={globalStyles.FullRipotiYaSikuLeftContainer22}
>
<Text 
style={globalStyles.FullRipotiYaSikuLeftText22}
 >Faini Zote Zilizokatwa</Text>
</View>
{/*mwisho wa Left View*/} 


{/*mwanzo wa Left View*/} 
<View 
style={globalStyles.FullRipotiYaSikuLeftContainer22}
>
<Text 
style={globalStyles.FullRipotiYaSikuLeftText22}
 >Faini Zilizokatwa Jana</Text>
</View>
{/*mwisho wa Left View*/} 

{/*mwanzo wa Left View*/} 
<View 
style={globalStyles.FullRipotiYaSikuLeftContainer22}
>
<Text 
style={globalStyles.FullRipotiYaSikuLeftText22}
 >Idadi Ya Wanaodaiwa</Text>
</View>
{/*mwisho wa Left View*/} 

{/*mwanzo wa Left View*/} 
<View 
style={globalStyles.FullRipotiYaSikuLeftContainer22}
>
<Text 
style={globalStyles.FullRipotiYaSikuLeftText22}
 >Wateja Wote</Text>
</View>
{/*mwisho wa Left View*/} 

{/*mwanzo wa Left View*/} 
<View 
style={globalStyles.FullRipotiYaSikuLeftContainer22}
>
<Text 
style={globalStyles.FullRipotiYaSikuLeftText22}
 >Wateja Wote Hai</Text>
</View>
{/*mwisho wa Left View*/} 


{/*mwanzo wa Left View*/} 
<View 
style={[globalStyles.FullRipotiYaSikuLeftContainer22,
  {
    backgroundColor:'#c07d18',
  }

  ]}
>
<Text 
style={[globalStyles.FullRipotiYaSikuLeftText22,
  {
    fontFamily:'Bold',
  }

  ]}
 >Jumla Ya Mikopo</Text>
</View>
{/*mwisho wa Left View*/} 


</Pressable>





{/*Right start here----------------------------------------------------*/}

<Pressable 
style={globalStyles.FullRipotiYaSikuRightMajorContainer22}
>
 

{/*mwanzo wa Right View*/} 
<View 
style={globalStyles.FullRipotiYaSikuRightContainer22}
>
{summaryData && summaryData.jumla_mikopo_iliyotoka > 0 ? (
<Text 
style={globalStyles.FullRipotiYaSikuRightText22}
 >{formatToThreeDigits(summaryData.jumla_mikopo_iliyotoka)}</Text>
 ):(
<Text 
style={globalStyles.FullRipotiYaSikuRightText22}
 >0</Text>
 )}
</View>
{/*mwisho wa Right View*/} 


{/*mwanzo wa Right View*/} 
<View 
style={globalStyles.FullRipotiYaSikuRightContainer22}
>
{summaryData && summaryData.jumla_mikopo_iliyotoka_leo > 0 ? (
<Text 
style={globalStyles.FullRipotiYaSikuRightText22}
 >{formatToThreeDigits(summaryData.jumla_mikopo_iliyotoka_leo)}</Text>
 ):(
<Text 
style={globalStyles.FullRipotiYaSikuRightText22}
 >0</Text>
 )}
</View>
{/*mwisho wa Right View*/} 


{/*mwanzo wa Right View*/} 
<View 
style={globalStyles.FullRipotiYaSikuRightContainer22}
>
{summaryData && summaryData.jumla_riba_zote > 0 ? (
<Text 
style={globalStyles.FullRipotiYaSikuRightText22}
 >{formatToThreeDigits(summaryData.jumla_riba_zote)}</Text>
 ):(
<Text 
style={globalStyles.FullRipotiYaSikuRightText22}
 >0</Text>
 )}
</View>
{/*mwisho wa Right View*/} 




{/*mwanzo wa Right View*/} 
<View 
style={globalStyles.FullRipotiYaSikuRightContainer22}
>
{summaryData && summaryData.jumla_riba_zote_za_leo > 0 ? (
<Text 
style={globalStyles.FullRipotiYaSikuRightText22}
 >{formatToThreeDigits(summaryData.jumla_riba_zote_za_leo)}</Text>
 ):(
<Text 
style={globalStyles.FullRipotiYaSikuRightText22}
 >0</Text>
 )}
</View>
{/*mwisho wa Right View*/} 


{/*mwanzo wa Right View*/} 
<View 
style={globalStyles.FullRipotiYaSikuRightContainer22}
>
{summaryData && summaryData.jumla_faini_zote_zilizopokelewa > 0 ? (
<Text 
style={globalStyles.FullRipotiYaSikuRightText22}
 >{formatToThreeDigits(summaryData.jumla_faini_zote_zilizopokelewa)}</Text>
 ):(
<Text 
style={globalStyles.FullRipotiYaSikuRightText22}
 >0</Text>
 )}
</View>
{/*mwisho wa Right View*/} 


{/*mwanzo wa Right View*/} 
<View 
style={globalStyles.FullRipotiYaSikuRightContainer22}
>
{summaryData && summaryData.jumla_faini_zote_zilizopokelewa_leo > 0 ? (
<Text 
style={globalStyles.FullRipotiYaSikuRightText22}
 >{formatToThreeDigits(summaryData.jumla_faini_zote_zilizopokelewa_leo)}</Text>
 ):(
<Text 
style={globalStyles.FullRipotiYaSikuRightText22}
 >0</Text>
 )}
</View>
{/*mwisho wa Right View*/} 


{/*mwanzo wa Right View*/} 
<View 
style={globalStyles.FullRipotiYaSikuRightContainer22}
>
{summaryData && summaryData.jumla_faini_zote_zilizokatwa > 0 ? (
<Text 
style={globalStyles.FullRipotiYaSikuRightText22}
 >{formatToThreeDigits(summaryData.jumla_faini_zote_zilizokatwa)}</Text>
 ):(
<Text 
style={globalStyles.FullRipotiYaSikuRightText22}
 >0</Text>
 )}
</View>
{/*mwisho wa Right View*/} 


{/*mwanzo wa Right View*/} 
<View 
style={globalStyles.FullRipotiYaSikuRightContainer22}
>
{summaryData && summaryData.jumla_faini_zote_zilizokatwa_leo > 0 ? (
<Text 
style={globalStyles.FullRipotiYaSikuRightText22}
 >{formatToThreeDigits(summaryData.jumla_faini_zote_zilizokatwa_leo)}</Text>
 ):(
<Text 
style={globalStyles.FullRipotiYaSikuRightText22}
 >0</Text>
 )}
</View>
{/*mwisho wa Right View*/} 


{/*mwanzo wa Right View*/} 
<View 
style={globalStyles.FullRipotiYaSikuRightContainer22}
>
{summaryData && summaryData.idadi_ya_wasiomaliza_mikopo > 0 ? (
<Text 
style={globalStyles.FullRipotiYaSikuRightText22}
 >{summaryData.idadi_ya_wasiomaliza_mikopo}</Text>
 ):(
<Text 
style={globalStyles.FullRipotiYaSikuRightText22}
 >0</Text>
 )}
</View>
{/*mwisho wa Right View*/} 

{/*mwanzo wa Right View*/} 
<View 
style={globalStyles.FullRipotiYaSikuRightContainer22}
>
{summaryData && summaryData.jumla_wateja_wote > 0 ? (
<Text 
style={globalStyles.FullRipotiYaSikuRightText22}
 >{summaryData.jumla_wateja_wote}</Text>
 ):(
<Text 
style={globalStyles.FullRipotiYaSikuRightText22}
 >0</Text>
 )}
</View>
{/*mwisho wa Right View*/} 

{/*mwanzo wa Right View*/} 
<View 
style={globalStyles.FullRipotiYaSikuRightContainer22}
>
{summaryData && summaryData.jumla_wateja_wote_hai > 0 ? (
<Text 
style={globalStyles.FullRipotiYaSikuRightText22}
 >{summaryData.jumla_wateja_wote_hai}</Text>
 ):(
<Text 
style={globalStyles.FullRipotiYaSikuRightText22}
 >0</Text>
 )}
</View>
{/*mwisho wa Right View*/} 


{/*mwanzo wa Right View*/} 
<View 
style={[globalStyles.FullRipotiYaSikuRightContainer22,

   {
    backgroundColor:'#c07d18',
  }


  ]}
>
{summaryData && summaryData.jumla_mikopo_iliyotoka > 0 ? (
<Text 
style={[globalStyles.FullRipotiYaSikuRightText22,
  {
    fontFamily:'Bold',
  }

  ]}
 >{formatToThreeDigits(summaryData.jumla_mikopo_iliyotoka)}</Text>
 ):(
<Text 
style={[globalStyles.FullRipotiYaSikuRightText22,
  {
    fontFamily:'Bold',
  }

  ]}
 >0</Text>
 )}
</View>
{/*mwanzo wa Right View*/} 


</Pressable>


</View>

</Pressable>

{/*mwiso wa Full taarifa za marejesho View Ya 1*/}

      





       <View style={{ width: width, marginVertical: 0 }}>
           {!isRange ? (
            <Text
              style={{
                color: 'white',
                paddingVertical: 10,
                paddingHorizontal: 20,
                width: '90%',
                marginHorizontal: 10,
                borderRadius: 10,
                fontFamily: 'Medium',
              }}
            >
              Taarifa za mikopo kituo cha {userData && userData.JinaLaKituo && userData.JinaLaKituo.JinaLaKituo  && (
                <Text style={{
                  color:'wheat',
                  fontFamily: 'Medium',
                }}>
                {userData.JinaLaKituo.JinaLaKituo}
              </Text>)} kwa wateja wote hai (wanaondelea na mikopo)
            </Text>
            ):(
          <Text
              style={{
                color: 'white',
                paddingVertical: 10,
                paddingHorizontal: 20,
                width: '90%',
                marginHorizontal: 10,
                borderRadius: 10,
                fontFamily: 'Medium',
              }}
            >
              Ripoti ya tarehe  {formatDate(startDate)}
            </Text>
            )}


          </View>
 





 <Pressable >

     


  {/*mwisho wa fomu na bima*/}

{/*mwanzo wa Full taarifa za marejesho View Ya 1*/}

<View 
style={globalStyles.FullRipotiYaSikuContainer22}
>

<Pressable 
style={globalStyles.FullRipotiYaSikuLeftMajorContainer22}
>
  


{/*mwanzo wa Left View*/} 
<View 
style={globalStyles.FullRipotiYaSikuLeftContainer22}
>
<Text 
style={globalStyles.FullRipotiYaSikuLeftText22}
 >Mikopo Yote Iliyotoka</Text>
</View>
{/*mwisho wa Left View*/} 


{/*mwanzo wa Left View*/} 
<View 
style={globalStyles.FullRipotiYaSikuLeftContainer22}
>
<Text 
style={globalStyles.FullRipotiYaSikuLeftText22}
 >Mikopo Iliyotoka Leo</Text>
</View>
{/*mwisho wa Left View*/} 


{/*mwanzo wa Left View*/} 
<View 
style={globalStyles.FullRipotiYaSikuLeftContainer22}
>
<Text 
style={globalStyles.FullRipotiYaSikuLeftText22}
 >Jumla Ya Riba Zote</Text>
</View>
{/*mwisho wa Left View*/} 


{/*mwanzo wa Left View*/} 
<View 
style={globalStyles.FullRipotiYaSikuLeftContainer22}
>
<Text 
style={globalStyles.FullRipotiYaSikuLeftText22}
 >Jumla Ya Riba Za Leo</Text>
</View>
{/*mwisho wa Left View*/} 

{/*mwanzo wa Left View*/} 
<View 
style={globalStyles.FullRipotiYaSikuLeftContainer22}
>
<Text 
style={globalStyles.FullRipotiYaSikuLeftText22}
 >Faini Zote Zilizopokelewa</Text>
</View>
{/*mwisho wa Left View*/} 


{/*mwanzo wa Left View*/} 
<View 
style={globalStyles.FullRipotiYaSikuLeftContainer22}
>
<Text 
style={globalStyles.FullRipotiYaSikuLeftText22}
 >Faini Zilizopokelewa Leo</Text>
</View>
{/*mwisho wa Left View*/} 


{/*mwanzo wa Left View*/} 
<View 
style={globalStyles.FullRipotiYaSikuLeftContainer22}
>
<Text 
style={globalStyles.FullRipotiYaSikuLeftText22}
 >Faini Zote Zilizokatwa</Text>
</View>
{/*mwisho wa Left View*/} 


{/*mwanzo wa Left View*/} 
<View 
style={globalStyles.FullRipotiYaSikuLeftContainer22}
>
<Text 
style={globalStyles.FullRipotiYaSikuLeftText22}
 >Faini Zilizokatwa Jana</Text>
</View>
{/*mwisho wa Left View*/} 


{/*mwanzo wa Left View*/} 
<View 
style={globalStyles.FullRipotiYaSikuLeftContainer22}
>
<Text 
style={globalStyles.FullRipotiYaSikuLeftText22}
 >Idadi Ya Wanaodaiwa</Text>
</View>
{/*mwisho wa Left View*/} 

{/*mwanzo wa Left View*/} 
<View 
style={globalStyles.FullRipotiYaSikuLeftContainer22}
>
<Text 
style={globalStyles.FullRipotiYaSikuLeftText22}
 >Wateja Wote</Text>
</View>
{/*mwisho wa Left View*/} 

{/*mwanzo wa Left View*/} 
<View 
style={globalStyles.FullRipotiYaSikuLeftContainer22}
>
<Text 
style={globalStyles.FullRipotiYaSikuLeftText22}
 >Wateja Wote Hai</Text>
</View>
{/*mwisho wa Left View*/} 

{/*mwanzo wa Left View*/} 
<View 
style={[globalStyles.FullRipotiYaSikuLeftContainer22,
  {
    backgroundColor:'#c07d18',
  }

  ]}
>
<Text 
style={[globalStyles.FullRipotiYaSikuLeftText22,
  {
    fontFamily:'Bold',
  }

  ]}
 >Jumla Ya Mikopo</Text>
</View>
{/*mwisho wa Left View*/} 


</Pressable>





{/*Right start here----------------------------------------------------*/}

<Pressable 
style={globalStyles.FullRipotiYaSikuRightMajorContainer22}
>
 

{/*mwanzo wa Right View*/} 
<View 
style={globalStyles.FullRipotiYaSikuRightContainer22}
>
{summaryData && summaryData.jumla_mikopo_iliyotoka_kwenye_kituo > 0 ? (
<Text 
style={globalStyles.FullRipotiYaSikuRightText22}
 >{formatToThreeDigits(summaryData.jumla_mikopo_iliyotoka_kwenye_kituo)}</Text>
 ):(
<Text 
style={globalStyles.FullRipotiYaSikuRightText22}
 >0</Text>
 )}
</View>
{/*mwisho wa Right View*/} 


{/*mwanzo wa Right View*/} 
<View 
style={globalStyles.FullRipotiYaSikuRightContainer22}
>
{summaryData && summaryData.jumla_mikopo_iliyotoka_leo_kwenye_kituo > 0 ? (
<Text 
style={globalStyles.FullRipotiYaSikuRightText22}
 >{formatToThreeDigits(summaryData.jumla_mikopo_iliyotoka_leo_kwenye_kituo)}</Text>
 ):(
<Text 
style={globalStyles.FullRipotiYaSikuRightText22}
 >0</Text>
 )}
</View>
{/*mwisho wa Right View*/} 


{/*mwanzo wa Right View*/} 
<View 
style={globalStyles.FullRipotiYaSikuRightContainer22}
>
{summaryData && summaryData.jumla_riba_zote_kwenye_kituo > 0 ? (
<Text 
style={globalStyles.FullRipotiYaSikuRightText22}
 >{formatToThreeDigits(summaryData.jumla_riba_zote_kwenye_kituo)}</Text>
 ):(
<Text 
style={globalStyles.FullRipotiYaSikuRightText22}
 >0</Text>
 )}
</View>
{/*mwisho wa Right View*/} 




{/*mwanzo wa Right View*/} 
<View 
style={globalStyles.FullRipotiYaSikuRightContainer22}
>
{summaryData && summaryData.jumla_riba_zote_za_leo_kwenye_kituo > 0 ? (
<Text 
style={globalStyles.FullRipotiYaSikuRightText22}
 >{formatToThreeDigits(summaryData.jumla_riba_zote_za_leo_kwenye_kituo)}</Text>
 ):(
<Text 
style={globalStyles.FullRipotiYaSikuRightText22}
 >0</Text>
 )}
</View>
{/*mwisho wa Right View*/} 


{/*mwanzo wa Right View*/} 
<View 
style={globalStyles.FullRipotiYaSikuRightContainer22}
>
{summaryData && summaryData.jumla_faini_zote_zilizopokelewa_kwenye_kituo > 0 ? (
<Text 
style={globalStyles.FullRipotiYaSikuRightText22}
 >{formatToThreeDigits(summaryData.jumla_faini_zote_zilizopokelewa_kwenye_kituo)}</Text>
 ):(
<Text 
style={globalStyles.FullRipotiYaSikuRightText22}
 >0</Text>
 )}
</View>
{/*mwisho wa Right View*/} 


{/*mwanzo wa Right View*/} 
<View 
style={globalStyles.FullRipotiYaSikuRightContainer22}
>
{summaryData && summaryData.jumla_faini_zote_zilizopokelewa_leo_kwenye_kituo > 0 ? (
<Text 
style={globalStyles.FullRipotiYaSikuRightText22}
 >{formatToThreeDigits(summaryData.jumla_faini_zote_zilizopokelewa_leo_kwenye_kituo)}</Text>
 ):(
<Text 
style={globalStyles.FullRipotiYaSikuRightText22}
 >0</Text>
 )}
</View>
{/*mwisho wa Right View*/} 


{/*mwanzo wa Right View*/} 
<View 
style={globalStyles.FullRipotiYaSikuRightContainer22}
>
{summaryData && summaryData.jumla_faini_zote_zilizokatwa_kwenye_kituo > 0 ? (
<Text 
style={globalStyles.FullRipotiYaSikuRightText22}
 >{formatToThreeDigits(summaryData.jumla_faini_zote_zilizokatwa_kwenye_kituo)}</Text>
 ):(
<Text 
style={globalStyles.FullRipotiYaSikuRightText22}
 >0</Text>
 )}
</View>
{/*mwisho wa Right View*/} 


{/*mwanzo wa Right View*/} 
<View 
style={globalStyles.FullRipotiYaSikuRightContainer22}
>
{summaryData && summaryData.jumla_faini_zote_zilizokatwa_leo_kwenye_kituo > 0 ? (
<Text 
style={globalStyles.FullRipotiYaSikuRightText22}
 >{formatToThreeDigits(summaryData.jumla_faini_zote_zilizokatwa_leo_kwenye_kituo)}</Text>
 ):(
<Text 
style={globalStyles.FullRipotiYaSikuRightText22}
 >0</Text>
 )}
</View>
{/*mwisho wa Right View*/} 


{/*mwanzo wa Right View*/} 
<View 
style={globalStyles.FullRipotiYaSikuRightContainer22}
>
{summaryData && summaryData.idadi_ya_wasiomaliza_mikopo_kwenye_kituo > 0 ? (
<Text 
style={globalStyles.FullRipotiYaSikuRightText22}
 >{summaryData.idadi_ya_wasiomaliza_mikopo_kwenye_kituo}</Text>
 ):(
<Text 
style={globalStyles.FullRipotiYaSikuRightText22}
 >0</Text>
 )}
</View>
{/*mwisho wa Right View*/} 

{/*mwanzo wa Right View*/} 
<View 
style={globalStyles.FullRipotiYaSikuRightContainer22}
>
{summaryData && summaryData.jumla_wateja_wote_kwenye_kituo > 0 ? (
<Text 
style={globalStyles.FullRipotiYaSikuRightText22}
 >{summaryData.jumla_wateja_wote_kwenye_kituo}</Text>
 ):(
<Text 
style={globalStyles.FullRipotiYaSikuRightText22}
 >0</Text>
 )}
</View>
{/*mwisho wa Right View*/} 

{/*mwanzo wa Right View*/} 
<View 
style={globalStyles.FullRipotiYaSikuRightContainer22}
>
{summaryData && summaryData.jumla_wateja_wote_hai_kwenye_kituo > 0 ? (
<Text 
style={globalStyles.FullRipotiYaSikuRightText22}
 >{summaryData.jumla_wateja_wote_hai_kwenye_kituo}</Text>
 ):(
<Text 
style={globalStyles.FullRipotiYaSikuRightText22}
 >0</Text>
 )}
</View>
{/*mwisho wa Right View*/} 


{/*mwanzo wa Right View*/} 
<View 
style={[globalStyles.FullRipotiYaSikuRightContainer22,

   {
    backgroundColor:'#c07d18',
  }


  ]}
>
{summaryData && summaryData.jumla_mikopo_iliyotoka_kwenye_kituo > 0 ? (
<Text 
style={[globalStyles.FullRipotiYaSikuRightText22,
  {
    fontFamily:'Bold',
  }

  ]}
 >{formatToThreeDigits(summaryData.jumla_mikopo_iliyotoka_kwenye_kituo)}</Text>
 ):(
<Text 
style={[globalStyles.FullRipotiYaSikuRightText22,
  {
    fontFamily:'Bold',
  }

  ]}
 >0</Text>
 )}
</View>
{/*mwanzo wa Right View*/} 


</Pressable>


</View>

</Pressable>

{/*mwiso wa Full taarifa za marejesho View Ya 1*/}

    
























              </View>





            </ScrollView>
          </ScrollView>






<View style={{
  marginBottom:100,
}}>
  {/*<Text style={{
    color:'white',
  }}>Vuta juu</Text>*/}
</View>







      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
      <ScrollView>
        <View style={globalStyles.FilterModalmodalContainer}>
          <View style={globalStyles.FilterModalmodalContent}>
         {/* <TouchableOpacity 
          onPress ={move}>
            <Text style={globalstyles.modalTitle}>ALL</Text>
            </TouchableOpacity>*/}
            <DatePicker
              mode="calendar"
              selected={startDate}
              onDateChange={(date) => setStartDate(date)}
              format="YYYY-MM-DD" // Set the date format to "YYYY-MM-DD"
               options={{
                    backgroundColor: "#080516",
                    textHeaderColor: "red",
                    textDefaultColor: "#FFFFFF",
                    selectedTextColor: "#FFF",
                    mainColor: "red",
                    textSecondaryColor: "#FFFFFF",
                    borderColor: 'red',
                    borderRadius:10,
                  }}
            />

        
            <View style={[{
                      justifyContent:'space-between',
                      alignItems:'center',
                      flexDirection:'row',
                      marginVertical:15,
                      margin:6,
                    },globalStyles.ButtonConatinere]}>
                    
                    <Pressable style={[globalStyles.ButtonAdd,{
                        width:'45%',
                        backgroundColor:'red'
                    }]}  onPress={() => setModalVisible(false)} >
                        <Text style={{
                            color:'white'
                        }}>Ondoa</Text>
                    </Pressable>


                     <TouchableOpacity
              onPress={handleFilterByDate}
               
              style={[globalStyles.ButtonAdd, {
                width:'45%'
              }]}
            >
              <Text style={{  color: "white" }}>Tafuta</Text>
            </TouchableOpacity>
            </View>




          </View>
        </View>
        </ScrollView>
      </Modal>

    



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
        </LinearGradient>
  

                ):(

<LotterViewScreen />

)}

    

    </>


     )}</>
    
  );
};

export default RiportSummary;
