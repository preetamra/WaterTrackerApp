import React,{
    useEffect,
    useState,
    useRef
} from 'react';
import {
  Button,
  SafeAreaView,
  StyleSheet,
  TextInput,
  View,
  Text,
  Dimensions,
  Pressable,
  Image,
  ScrollView,
  FlatList,
  TouchableOpacity
} from 'react-native';
import { line, curveBasis,area, scaleLinear } from 'd3';
import {
  useSharedValue,
  withRepeat,
  withTiming,
  useDerivedValue,
  Easing,
  SharedTransition,
  withSpring,
  runOnJS
} from 'react-native-reanimated';
import Animated from 'react-native-reanimated';
import * as BackgroundFetch from 'expo-background-fetch';
import * as TaskManager from 'expo-task-manager';
import { useFonts } from 'expo-font';
import { useSQLiteContext } from 'expo-sqlite';
import CircularProgress from 'react-native-circular-progress-indicator';

import GlassOfWaterSvg from '../assets/glassOfWaterSvg';
import { horizontalScale, moderateScale, verticalScale } from '../Utils/ResponsiveDesign';
import AddWaterScreen from './AddWaterScreen';
import Rive from 'rive-react-native';
  
const size = 200;
const value = 45;

const images = [
  {
    title: 'WATER',
    image: require('../assets/HomeScreenContainer/Water.png'),
  },
  {
    title: 'SPARKLING WATER',
    image: require('../assets/HomeScreenContainer/Water.png'),
  },
  {
    title: 'COCONUT WATER',
    image: require('../assets/HomeScreenContainer/Coconut Water.png'),
  },
  {
    title: 'BLACK TEA',
    image: require('../assets/HomeScreenContainer/Black Tea.png'),
  }
]
  
const customTransition = SharedTransition.custom((values) => {
  'worklet';
  return {
    height: withSpring(verticalScale(values.targetHeight)),
    width: withSpring(horizontalScale(values.targetWidth)),
    originX: withSpring(values.targetOriginX),
    originY: withSpring(values.targetOriginY),
  };
});

function HomeScreen(props) {
  const [categories, setCategories] = useState([]);

  const db = useSQLiteContext();

  const [loaded, error] = useFonts({
    "Mplus-Black": require("../../assets/fonts//Mplus-Black.ttf"),
    "Mplus-Bold": require("../../assets/fonts//Mplus-Bold.ttf"),
    "Mplus-ExtraBold": require("../../assets/fonts//Mplus-ExtraBold.ttf"),
    "Mplus-Light": require("../../assets/fonts//Mplus-Light.ttf"),
    "Mplus-Medium": require("../../assets/fonts//Mplus-Medium.ttf"),
    "Mplus-Regular": require("../../assets/fonts//Mplus-Regular.ttf"),
    "Mplus-Thin": require("../../assets/fonts//Mplus-Thin.ttf"),
    "CoreSans-ExtraBold": require("../../assets/fonts//CoreSans-ExtraBold.ttf"),
    "Fact-Narrow-Bold": require("../../assets/fonts//Fact-Narrow-Bold.ttf")
  });

  const riveRef = useRef(null);
  const riveRefStreck = useRef(null);

  const [addWaterSelected, setAddWaterSelected] = useState(false);
  const [showOriginal, setShowOriginal] = useState(false);

  useEffect(() => {
    runOnJS(riveRef?.current?.setInputState)("State Machine 1", "showOriginal",showOriginal);
  },[showOriginal]);

  useEffect(() => {
    runOnJS(riveRefStreck?.current?.setInputState)("State Machine 1", "Progress",100);
  },[]);

  useEffect(() => {
    runOnJS(riveRefStreck?.current?.setTextRunValue)("StreckText","5");
  },[]);

  const getData = async () => {
    try {
      const value = await db.getAllAsync('SELECT * FROM Categories WHERE enabled = 1');
      console.log("Home Screen :- ",value);
      setCategories(value);
    } catch (e) {
      // error reading value
      console.error(e);
    }
  }

  useEffect( () => {
     (
        async() => {
          try{
            await getData();
          }catch(e){
            console.error(e);
          }
        }
     )()
  }, []);

  return (
        addWaterSelected ?
        <AddWaterScreen
        switchScreen={() => {
          setAddWaterSelected(false);
        }}
        setState={setAddWaterSelected}
        ></AddWaterScreen>
        :
        <SafeAreaView
        style={{
          flex: 8,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'white',
        }}>
          <View
          style={{
            flex:1,
            justifyContent: 'space-between',
            alignItems: 'center',
            flexDirection: 'row',
            width: '100%',
          }}
          >
          <Pressable
          onPress={() => {
            props.navigation.navigate('CalenderScreen');
          }}
          style={{
            width: horizontalScale(45),
            height: verticalScale(45),
            position: 'absolute',
            top: verticalScale(35),
            left: horizontalScale(20),
            zIndex: 2,
          }}
          >
          </Pressable>
          <TouchableOpacity
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            marginLeft: horizontalScale(20),
            width: horizontalScale(45),
            height: verticalScale(45),
            zIndex: 1,
          }}
          >
           <Rive
           url='https://firebasestorage.googleapis.com/v0/b/blockerplus-6ba24.appspot.com/o/StreckHomeScreen3.riv?alt=media&token=a0cfb112-a14f-4fe4-9f7d-1df2681ac641'
           artboardName='Artboard'
           stateMachineName='State Machine 1'
           ref={riveRefStreck}
           style={{
            width: horizontalScale(60),
            height: verticalScale(60),
            backgroundColor:"transparent",
            zIndex: 0,
           }}
           ></Rive>
          </TouchableOpacity>
          <Text>
            {""}
          </Text>
          <Pressable
          onPress={() => {
            props.navigation.navigate('SettingScreen');
          }}
          style={{
            backgroundColor: '#f1f3f5',
            borderRadius: 20,
            marginRight: horizontalScale(20),
            width: horizontalScale(45),
            height: verticalScale(45),
          }}
          >
            <Image
            source={require('../assets/SettingHomeScreen.png')}
            style={{
              width: '100%',
              height: '100%',
              resizeMode: 'center',
              transform: [{scale: 0.6}]
            }}
            ></Image>    
          </Pressable>
          </View>
          <View
          style={{
            flex:1,
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'colomn',
            width: '100%',
          }}
          >
            <Text
            style={{
              color:'#18B3CE',
              fontSize:verticalScale(54),
              fontFamily:'Mplus-Bold'
            }}
            >
             330ml
            </Text>
            <Text
            style={{
              color:'#C4C3C2',
              fontSize:verticalScale(18),
              fontFamily:'Mplus-Bold'
            }}
            >
            Hydration ○ 29% of your goal
           </Text>
          </View>
          <View
          style={{
            flex:4,
            width:horizontalScale(450),
            height:verticalScale(450),
            position: 'relative',
          }}>
          <Pressable
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: 2,
          }}
          onLongPress={() => {
            setShowOriginal(!showOriginal);
          }}
          onPress={() => {
             setShowOriginal(!showOriginal);
          }}
          ></Pressable>
          <Rive
          url={"https://firebasestorage.googleapis.com/v0/b/blockerplus-6ba24.appspot.com/o/TurtleRiveAnimation.riv?alt=media&token=8305ba32-2473-4cba-8e5b-a655800f1140"}
          artboardName="Turtle Background"
          stateMachineName='State Machine 1'
          style={{
            width: "100%",
            height: "100%",
            backgroundColor:"transparent",
            zIndex: 1,
            position: 'absolute',
            top: 0,
            left:15,
            transform: [{scale: 0.9}]
          }}
          ref={riveRef}
          ></Rive>
          </View>
          <ScrollView
          style={{
            flex:2,
            flexDirection: 'row',
            width: '100%',
            backgroundColor: 'red',
          }}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          >
           {
            categories.map((category,index) => {
              console.log(category);
              return(
                <Text>
                  ABC
                </Text>
              );
            })
           }
          </ScrollView>
        </SafeAreaView>
      );
  }
    
  export default HomeScreen;
    