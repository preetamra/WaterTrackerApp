import React, { 
  useRef, 
  useState,
  useCallback,
  useEffect
} from 'react';
import {
  Button,
  SafeAreaView,
  View,
  Pressable,
  TextInput,
  Text,
  Image,
  PanResponder
} from 'react-native';
import Animated,
{
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  interpolate,
  Extrapolation,
  useDerivedValue,
  useAnimatedProps,
  SharedTransition,
  runOnJS,
} from 'react-native-reanimated';
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView
} from 'react-native-gesture-handler';
import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetModalProvider,
  BottomSheetTextInput
} from '@gorhom/bottom-sheet';
import * as SQLite from 'expo-sqlite';
import Rive from 'rive-react-native';
import { useFonts } from 'expo-font';
import { useDispatch, useSelector } from 'react-redux';

import { horizontalScale, moderateScale, verticalScale } from '../Utils/ResponsiveDesign.js';
import { categoryActions } from '../store/categoriesSlice.js';
import AsyncStorage from '@react-native-async-storage/async-storage';
  
const customTransition = SharedTransition.custom((values) => {
  'worklet';
  return {
    height: withSpring(verticalScale(values.targetHeight)),
    width: withSpring(horizontalScale(values.targetWidth)),
    originX: withSpring(values.targetOriginX),
    originY: withSpring(values.targetOriginY)
  };
});
  
const AnimatedText  = Animated.createAnimatedComponent(TextInput);

const nameToRiveAnimationMap = [
  {
    name:'SPARKLING WATER',
    url:"https://firebasestorage.googleapis.com/v0/b/blockerplus-6ba24.appspot.com/o/Forever%20Bubblewrap.riv?alt=media&token=f7e1dbf5-b6fc-4f32-96b4-43eccb8b00fd"
  },
  {
    name: 'COCONUT WATER',
    url:'coconutwater'
  },
  {
    name: 'BLACK TEA',
    url:'blacktea'
  }
]

const outsideBounds = {
  y:[],
  x:0,
  stopExecution:false,
}

function AddCustomDrinkScreen(props) {
  console.log("props :- ",props.route.params.category);
  const itemDetails = props.route.params.category;

  const dispatch = useDispatch();

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

  const [bottomSheetBackDrop, setBottomSheetBackDrop] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [customValue, setCustomValue] = useState('');
  const [maxHeight,setMaxHeight] = useState(0);
  
  const inputRef = useRef(null);
  const height = useSharedValue(10);

  const bottomSheetModalRef = useRef(null);
  const snapPoints = React.useMemo(() => ['25%', '40%'], []);
  
  const [isBottleSelected, setIsBottleSelected] = useState(false);
  
  const animatedStyle = useAnimatedStyle(() => ({
    height: interpolate(height.value, [0, 300], [400, 0], Extrapolation.CLAMP),
  }));
  
  const animatedText = useDerivedValue(() => {
  const step = 10;
  if(itemDetails.name === 'WATER')
  {
    const interpolatedValue = isBottleSelected
    ? interpolate(height.value, [200, 480], [1000, 0], Extrapolation.CLAMP)
    : interpolate(height.value, [120, 420], [300, 0], Extrapolation.CLAMP);

    let roundedValue = Math.round(interpolatedValue / step) * step;

    if (roundedValue > (isBottleSelected ? 1000 : 300)) {
      roundedValue = isBottleSelected ? 1000 : 300;
    } else if (roundedValue < 10) {
      roundedValue = 10;
    }

    return `${roundedValue}`;
    }else{
    const interpolatedValue = interpolate(height.value, [0, 100], [0, props?.route?.params?.category?.size], Extrapolation.CLAMP);
    // console.log("interpolatedValue :- ",interpolatedValue);
    let roundedValue = Math.round(interpolatedValue / step) * step;

    if (roundedValue > props?.route?.params?.category?.size) {
      roundedValue = props?.route?.params?.category?.size;
    }else if(roundedValue < 10){
      roundedValue = 10;
    }

    return `${roundedValue}`;
    }
  });
  
    const animatedTextProps = useAnimatedProps(() => {
      return {
        text: animatedText.value,
      };
    });
  
    const handlePresentModalPress = useCallback(() => {
      bottomSheetModalRef.current?.present();
    }, []);
  
    const handleSheetChanges = useCallback((index) => {
      if(index == 1)
      {
        setBottomSheetBackDrop(true);
      }else if(index == -1)
      {
        setBottomSheetBackDrop(false);
      }
    }, []);

    if (!loaded && !error) {
      return null;
    }
    
    /* const panResponder = useRef(PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove:(e,gestureState) => {
        console.log("onPanResponderMove event :- ",gestureState);
      },
      onPanResponderRelease: () => {
        console.log("onPanResponderRelease");
      }
    })).current; */

    function trackSuddenJump(arr, threshold) {
      if (arr.length !== 5) {
          return "Array must have 5 elements.";
      }
  
      const jumps = [];
  
      for (let i = 1; i < arr.length; i++) {
          const difference = Math.abs(arr[i] - arr[i - 1]);
          if (difference > threshold) {
             return "Sudden jump detected.";
          }
      }
  
      return jumps.length > 0 ? jumps : "No sudden jumps detected.";
  }

  const db = SQLite.useSQLiteContext();

  function AddDrinkToDB(ml) {

    const interpolatedValue = interpolate(ml, [0, 100], [0, props?.route?.params?.category?.size], Extrapolation.CLAMP);
    let roundedValue = Math.round(interpolatedValue / 10) * 10;

    if (roundedValue > props?.route?.params?.category?.size) {
      roundedValue = props?.route?.params?.category?.size;
    }else if(roundedValue < 10){
      roundedValue = 10;
    }

    console.log("roundedValue :- ",roundedValue);
    console.log("category :- ",props.route.params.category);

    console.log("props :- ",props.route.params.category);

    (
      async () => {
        try{
          await db.withTransactionAsync(
            async () => {
              try{
                let percentage = (props.route.params.category.hydration * roundedValue) / 100;
                console.log("percentage :- ",percentage);

                const startDate = new Date();
                startDate.setHours(0, 0, 0, 0); // Set start of today

                const endDate = new Date();
                endDate.setHours(23, 59, 59, 999); // Set end of today

                const value = await db.getAllAsync('SELECT * FROM Transactions WHERE dateTime BETWEEN ? AND ?', [startDate.toISOString(), endDate.toISOString()]);
                // console.log("value :- ", value);
                // const AllVals = await db.getAllAsync('SELECT * FROM Transactions');
                // console.log("All Vals :- ",AllVals);

                dispatch(categoryActions.todaysTransactions(value));

                const Vals = await db.getAllAsync('SELECT * FROM Transactions');
                console.log("Values :- ",Vals);

                const allVals = await db.getAllAsync('SELECT * FROM Transactions ORDER BY id DESC LIMIT 1');
                console.log("All Values :- ",allVals);

                if(allVals.length != 0)
                {
                  const yesturday = new Date();
                  yesturday.setDate(yesturday.getDate() - 1);
                  console.log("yesturday :- ",yesturday.toISOString());
  
                  const lastEntryDate = new Date(allVals[0].dateTime);
                  console.log("lastEntryDate :- ",lastEntryDate.toISOString());
                    if(new Date().toISOString().split('T')[0] === lastEntryDate.toISOString().split('T')[0])
                    {
                      console.log("Same date");
                    }else{
                      if(yesturday.toISOString().split('T')[0] === lastEntryDate.toISOString().split('T')[0])
                      {
                        let item = await AsyncStorage.getItem("STREAKDATA");
                        console.log("item :- ",item);
                        if(item == null)
                        {
                          await AsyncStorage.setItem('STREAKDATA',"1");                      
                        }else{
                          let streak = parseInt(item);
                          streak = streak + 1;
                          await AsyncStorage.setItem('STREAKDATA',streak.toString());
                        }
                      }else{
                        await AsyncStorage.setItem('STREAKDATA',"1");
                      }
                    }
                }

                let tempDate = new Date();
                // tempDate.setDate(tempDate.getDate() - 1);

                await db.runAsync('INSERT INTO Transactions (category_id,size,dateTime) VALUES (?,?,?)',[props.route.params.category.id,percentage,tempDate.toISOString()]);

                props.navigation.goBack();

              }catch(e){
                console.error(e);
              }
            }
          )
        }catch(e){
          console.error(e);
        }
      }
    )()
  }
    
      return (
        <GestureHandlerRootView>
            <BottomSheetModalProvider>
              <SafeAreaView
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: 'white',
                  marginTop: verticalScale(20),
                }}>
                {
                  bottomSheetBackDrop && (
                    <View style={{
                      position: 'absolute',
                      top:verticalScale(0),
                      bottom:0,
                      left:horizontalScale(0),
                      right:horizontalScale(0),
                      backgroundColor: 'rgba(0,0,0,0.5)',
                      zIndex: 1,
                     }}>
                    </View>
                  )
                }
                  <View
                    style={{
                      flex: 1,
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flexDirection: 'row',
                      width: "100%",
                      height: "100%",
                    }}
                  >
                    <Text>
                    </Text>
                    <Pressable
                    onPress={() => {
                    //   props.navigation.navigate('HomeScreen');
                    // console.log('Back Pressed',props);
                    // runOnJS(props.navigation.goBack)();
                    props.navigation.goBack();
                    // props.setState(false);
                    }}
                    style={{
                      padding: 10,
                      borderRadius: moderateScale(10),
                      marginRight: horizontalScale(20),
                      marginTop: verticalScale(20),
                    }}
                    >
                     <Image
                     source={require('../assets/closeButton.png')}
                     style={{
                        width: horizontalScale(30),
                        height: verticalScale(50),
                        resizeMode: 'center',
                        transform: [{ scale: 1.5 }],
                      }}
                     ></Image>
                    </Pressable>
                  </View>
                  <View
                    style={{
                      flex: 3,
                      position: "relative",
                      width: "100%",
                      justifyContent: 'center',
                      alignItems: 'center',
                      height: "100%",
                      marginTop: verticalScale(150),
                    }}
                  >
                    {
                      itemDetails.name === 'WATER' ?
                      (
                        isBottleSelected
                        ?
                        <Rive
                        resourceName='bottlewater'
                        artboardName="Artboard"
                        stateMachineName='Progress'
                        style={
                          {
                            width: '100%',
                            height: '10%',
                          }
                        }
                        ref={riveRef}
                        children={

                          <View
                          onLayout={(event) => {
                           var {x, y, width, height} = event.nativeEvent.layout;
                           setMaxHeight(height);
                           console.log("height :- ",height);
                           console.log("width :- ",width);
                           console.log("x :- ",x);
                           console.log("y :- ",y);
                          }}
                          style={{
                           width: '100%',
                           height: '100%',
                           zIndex:3,
                          }}
                         onStartShouldSetResponder={() => true}
                         onResponderMove={(e) => {
                           let val = e.nativeEvent.locationY;

                           console.log("Previous Value :- ",outsideBounds.y);
                           console.log("val :- ",val);

                           if(outsideBounds.stopExecution)
                           {
                             return;
                           }

                           console.log("trackSuddenJump :- ",trackSuddenJump(outsideBounds.y,5));

                           if(outsideBounds.y.length == 5)
                           {
                             if(trackSuddenJump(outsideBounds.y,20) === "Sudden jump detected.")
                               {
                                 console.log("Sudden jump detected.");
                                 outsideBounds.stopExecution = true;

                                 console.log("difference :- ",outsideBounds.y[3] - outsideBounds.y[4])
                                 if(outsideBounds.y[3] - outsideBounds.y[4] > 0)
                                 {
                                   if(itemDetails.name === 'WATER')
                                     {
                                       runOnJS(riveRef?.current?.setInputState("State Machine 1","Number 1",1));
                                     }else{
                                       runOnJS(riveRef?.current?.setInputState("State Machine 1","Progress",1));
                                     }
                                 }else{
                                   if(itemDetails.name === 'WATER')
                                     {
                                       runOnJS(riveRef?.current?.setInputState("State Machine 1","Number 1",100));
                                     }else{
                                       runOnJS(riveRef?.current?.setInputState("State Machine 1","Progress",100));
                                     }
                                 }

                                 return;
                               }
                           }

                           if(!isBottleSelected)
                           {
                             if(maxHeight != 0)
                             {
                               if(val < maxHeight)
                               {
                                 if(itemDetails.name === 'WATER')
                                 {
                                   height.value = val;
                                   runOnJS(riveRef?.current?.setInputState("State Machine 1","Number 1",interpolate(val,[maxHeight,0],[0,100],Extrapolation.CLAMP)));
                                   // outsideBounds.y = val;
                                   if(outsideBounds.y.length == 5)
                                   {
                                     outsideBounds.y.shift();
                                     outsideBounds.y.push(val);
                                   }else{
                                     outsideBounds.y.push(val); 
                                   }
                                 }else{
                                   height.value = val;
                                   runOnJS(riveRef?.current?.setInputState("State Machine 1","Progress",interpolate(val,[maxHeight,0],[0,100],Extrapolation.CLAMP)));
                                   // outsideBounds.y = val;
                                   if(outsideBounds.y.length == 5)
                                     {
                                       outsideBounds.y.shift();
                                       outsideBounds.y.push(val);
                                     }else{
                                       outsideBounds.y.push(val); 
                                     }
                                 }
                               }
                             }
                           }else{
                             if(val > 200 && val < 480){
                               height.value = val;
                               runOnJS(riveRef?.current?.setInputState)("Progress", "Number 1", interpolate(val, [480,200], [0, 100], Extrapolation.CLAMP));
                             }
                           }
                         }}
                         onResponderRelease={(e) => {
                           console.log("onResponderRelease");
                           outsideBounds.y = [];
                           outsideBounds.stopExecution = false;
                         }}
                     >
                  </View>
                        }
                       /> 
                       :
                       <Rive
                        resourceName='glasswater'
                        artboardName="Artboard"
                        stateMachineName='State Machine 1'
                        style={
                          {
                            width: '100%',
                            height: '10%',
                          }
                        }
                        ref={riveRef}
                        children={
                          <View
                           onLayout={(event) => {
                            var {x, y, width, height} = event.nativeEvent.layout;
                            setMaxHeight(height);
                            console.log("height :- ",height);
                            console.log("width :- ",width);
                            console.log("x :- ",x);
                            console.log("y :- ",y);
                           }}
                           style={{
                            width: '100%',
                            height: '100%',
                            zIndex:3,
                           }}
                          onStartShouldSetResponder={() => true}
                          onResponderMove={(e) => {
                            let val = e.nativeEvent.locationY;

                            // console.log("Previous Value :- ",outsideBounds.y);
                            // console.log("val :- ",val);

                            if(outsideBounds.stopExecution)
                            {
                              return;
                            }

                            // console.log("trackSuddenJump :- ",trackSuddenJump(outsideBounds.y,5));

                            if(outsideBounds.y.length == 5)
                            {
                              if(trackSuddenJump(outsideBounds.y,20) === "Sudden jump detected.")
                                {
                                  // console.log("Sudden jump detected.");
                                  outsideBounds.stopExecution = true;

                                  // console.log("difference :- ",outsideBounds.y[3] - outsideBounds.y[4])
                                  if(outsideBounds.y[3] - outsideBounds.y[4] > 0)
                                  {
                                    if(itemDetails.name === 'WATER')
                                      {
                                        runOnJS(riveRef?.current?.setInputState("State Machine 1","Number 1",1));
                                      }else{
                                        runOnJS(riveRef?.current?.setInputState("State Machine 1","Progress",1));
                                      }
                                  }else{
                                    if(itemDetails.name === 'WATER')
                                      {
                                        runOnJS(riveRef?.current?.setInputState("State Machine 1","Number 1",100));
                                      }else{
                                        runOnJS(riveRef?.current?.setInputState("State Machine 1","Progress",100));
                                      }
                                  }

                                  return;
                                }
                            }

                            if(!isBottleSelected)
                            {
                              if(maxHeight != 0)
                              {
                                if(val < maxHeight)
                                {
                                  if(itemDetails.name === 'WATER')
                                  {
                                    height.value = val;
                                    runOnJS(riveRef?.current?.setInputState("State Machine 1","Number 1",interpolate(val,[maxHeight,0],[0,100],Extrapolation.CLAMP)));
                                    // outsideBounds.y = val;
                                    if(outsideBounds.y.length == 5)
                                    {
                                      outsideBounds.y.shift();
                                      outsideBounds.y.push(val);
                                    }else{
                                      outsideBounds.y.push(val); 
                                    }
                                  }else{
                                    height.value = val;
                                    runOnJS(riveRef?.current?.setInputState("State Machine 1","Progress",interpolate(val,[maxHeight,0],[0,100],Extrapolation.CLAMP)));
                                    // outsideBounds.y = val;
                                    console.log("interpolate :- ",interpolate(val,[maxHeight,0],[0,100],Extrapolation.CLAMP));
                                    if(outsideBounds.y.length == 5)
                                      {
                                        outsideBounds.y.shift();
                                        outsideBounds.y.push(val);
                                      }else{
                                        outsideBounds.y.push(val); 
                                      }
                                  }
                                }
                              }
                            }else{
                              if(val > 200 && val < 480){
                                height.value = val;
                                runOnJS(riveRef?.current?.setInputState)("Progress", "Number 1", interpolate(val, [480,200], [0, 100], Extrapolation.CLAMP));
                              }
                            }
                          }}
                          onResponderRelease={(e) => {
                            console.log("onResponderRelease");
                            outsideBounds.y = [];
                            outsideBounds.stopExecution = false;
                          }}
                      >
                   </View>
                        }
                       />
                      )
                      :
                      (
                        nameToRiveAnimationMap.map((item) => {
                          if(item.name === itemDetails.name)
                          {
                            return (
                             <Rive
                              resourceName={item.url}
                              artboardName="Artboard"
                              stateMachineName='State Machine 1'
                              style={
                                {
                                  width: '100%',
                                  height: '10%',
                                }
                              }
                              ref={riveRef}
                              children={
                                <View
                                 onLayout={(event) => {
                                  var {x, y, width, height} = event.nativeEvent.layout;
                                  setMaxHeight(height - 25);
                                  console.log("height :- ",height);
                                  console.log("width :- ",width);
                                  console.log("x :- ",x);
                                  console.log("y :- ",y);
                                 }}
                                 style={{
                                  width: '100%',
                                  height: '100%',
                                  zIndex:3,
                                 }}
                                onStartShouldSetResponder={() => true}
                                onResponderMove={(e) => {
                                  // console.log("1");
                                  let val = e.nativeEvent.locationY;
                                  // console.log("2",outsideBounds.stopExecution);
                                  // console.log("Previous Value :- ",outsideBounds.y);
                                  // console.log("val :- ",val);

                                  if(outsideBounds.stopExecution)
                                  {
                                    // console.log("3");
                                    return;
                                  }
                                  // console.log("4",outsideBounds.y.length);

                                  // console.log("trackSuddenJump :- ",trackSuddenJump(outsideBounds.y,5));

                                  if(outsideBounds.y.length == 5)
                                  {
                                    // console.log("5",trackSuddenJump(outsideBounds.y,20));
                                    if(trackSuddenJump(outsideBounds.y,20) === "Sudden jump detected.")
                                      {
                                        // console.log("6","Sudden jump detected.");
                                        // console.log("Sudden jump detected.");
                                        outsideBounds.stopExecution = true;
                                        // console.log("7");
                                        // console.log("difference :- ",outsideBounds.y[3] - outsideBounds.y[4])
                                        // console.log("8",outsideBounds.y[3] - outsideBounds.y[4]);
                                        if(outsideBounds.y[3] - outsideBounds.y[4] > 0)
                                        {
                                          // console.log("9");
                                          // height.value = 10;
                                          if(itemDetails.name === 'WATER')
                                            {
                                              // console.log("10");
                                              runOnJS(riveRef?.current?.setInputState("State Machine 1","Number 1",10));
                                            }else{
                                              height.value = 10;
                                              // console.log("11");
                                              runOnJS(riveRef?.current?.setInputState("State Machine 1","Progress",10));
                                            }
                                          // console.log("12");
                                        }else{
                                          // console.log("13");
                                          // height.value = maxHeight;
                                          if(itemDetails.name === 'WATER')
                                            {
                                              // console.log("14");
                                              runOnJS(riveRef?.current?.setInputState("State Machine 1","Number 1",100));
                                            }else{
                                              console.log("15");
                                              height.value = 100;
                                              runOnJS(riveRef?.current?.setInputState("State Machine 1","Progress",100));
                                            }
                                          // console.log("16");
                                        }
                                        // console.log("17","return");
                                        return;
                                      }
                                      // console.log("18");
                                  }

                                  // console.log("19",isBottleSelected);

                                  if(!isBottleSelected)
                                  {
                                    // console.log("20",maxHeight);
                                    if(maxHeight != 0)
                                    {
                                      // console.log("21",val);
                                      if(val < maxHeight)
                                      {
                                        // console.log("22",itemDetails.name);
                                        if(itemDetails.name === 'WATER')
                                        {
                                          // console.log("23",outsideBounds.y.length);
                                          // height.value = val;
                                          runOnJS(riveRef?.current?.setInputState("State Machine 1","Number 1",interpolate(val,[maxHeight,0],[0,100],Extrapolation.CLAMP)));
                                          // outsideBounds.y = val;
                                          if(outsideBounds.y.length == 5)
                                          {
                                            // console.log("24");
                                            outsideBounds.y.shift();
                                            outsideBounds.y.push(val);
                                          }else{
                                            // console.log("25");
                                            outsideBounds.y.push(val);
                                          }
                                          // console.log("26");
                                        }else{
                                          console.log("27",interpolate(val,[maxHeight,0],[0,100],Extrapolation.CLAMP));
                                          height.value = Math.round(interpolate(val,[maxHeight,0],[0,100],Extrapolation.CLAMP));
                                          runOnJS(riveRef?.current?.setInputState("State Machine 1","Progress",interpolate(val,[maxHeight,0],[0,100],Extrapolation.CLAMP)));
                                          // outsideBounds.y = val;
                                          // console.log("val :- ",val);
                                          // console.log("interpolate :- ",interpolate(val,[maxHeight,0],[0,100],Extrapolation.CLAMP));
                                          // console.log("28",outsideBounds.y.length);
                                          if(outsideBounds.y.length == 5)
                                          {
                                            // console.log("29");
                                            outsideBounds.y.shift();
                                            outsideBounds.y.push(val);
                                          }else{
                                            // console.log("30");
                                            outsideBounds.y.push(val);
                                          }
                                          // console.log("31");
                                        }
                                        // console.log("32");
                                      }else{
                                        // console.log("33");
                                        // height.value = 10;
                                        if(itemDetails.name === 'WATER')
                                        {
                                          // console.log("34");
                                          runOnJS(riveRef?.current?.setInputState("State Machine 1","Number 1",10));
                                        }else{
                                          height.value = 10;
                                          // console.log("35");
                                          runOnJS(riveRef?.current?.setInputState("State Machine 1","Progress",10));
                                        }
                                        // console.log("36");
                                      }
                                      // console.log("37");
                                    }
                                    // console.log("38");
                                  }else{
                                    if(val > 200 && val < 480){
                                      height.value = val;
                                      runOnJS(riveRef?.current?.setInputState)("Progress", "Number 1", interpolate(val, [480,200], [0, 100], Extrapolation.CLAMP));
                                    }
                                  }
                                }}
                                onResponderRelease={(e) => {
                                  console.log("onResponderRelease");
                                  outsideBounds.y = [];
                                  outsideBounds.stopExecution = false;
                                }}
                            >
                         </View>
                              }
                             />
                            )
                          }
                        })
                      )
                    }
                  </View>
                  <View
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'flex-start',
                    flexDirection: 'row',
                    marginBottom: verticalScale(20),
                  }}
                  >
                  <AnimatedText
                      value={animatedText.value}
                      editable={false}
                      underlineColorAndroid={'transparent'}
                      animatedProps={animatedTextProps}
                      style={{
                        fontSize: moderateScale(42),
                        fontFamily: 'Mplus-Bold',
                        color:'#0E0E0E'
                      }}
                  />
                  <Text
                  style={{
                    fontSize: moderateScale(42),
                    marginBottom: verticalScale(20),
                    fontFamily: 'Mplus-Bold',
                  }}
                  >
                    {"ml"}
                  </Text>
                  </View>
                  <View
                    style={{
                      flex: 1,
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: verticalScale(10),
                      flexDirection: 'row',
                      width: "100%",
                      height: "100%",
                    }}
                  >
                    <Pressable
                      onPress={() => {
                        if(itemDetails.name === 'WATER')
                        {
                          setIsBottleSelected(!isBottleSelected);
                        }
                      }}
                      style={{
                        borderRadius: moderateScale(10),
                        transform: [{ scale: 0.8 }],
                        marginLeft: horizontalScale(20),
                      }}
                    >
                      {
                        itemDetails.name === 'WATER' &&
                        (
                          isBottleSelected ?
                          <Image
                          source={require('../assets/GlassSmall.png')}
                          ></Image>
                          :
                          <Image
                          source={require('../assets/BottleSmall.png')}
                          ></Image>
                        )
                      }
                      {
                        itemDetails.name != 'WATER' &&
                         <View
                         style={{
                          width: horizontalScale(50),
                          height: verticalScale(50),
                         }}
                         ></View>
                      }
                    </Pressable>
                    <Pressable
                      style={{
                        flex:1,
                        flexDirection: 'row',
                        padding: moderateScale(10),
                        borderRadius: moderateScale(39),
                        justifyContent: 'space-evenly',
                        alignItems: 'center',
                        backgroundColor: '#54BCD9',
                        width:'100%',
                        gap:moderateScale(0),
                      }}
                      onPress={() => {
                        AddDrinkToDB(height.value);
                      }}
                      >
                        <Image
                        source={require('../assets/AddWaterPlus.png')}
                        style={{
                          width: horizontalScale(50),
                          height: verticalScale(50),
                          resizeMode: 'center',
                          transform: [
                            {
                              scale: 2
                            }
                          ],
                        }}
                        ></Image>
                        <Text
                        style={{
                          fontSize: moderateScale(itemDetails.name.length > 10 ? 20 : 27),
                          fontFamily: 'Fact-Narrow-Bold',
                          color: '#ECF7F9',
                        }}
                        numberOfLines={1}
                        >
                          {itemDetails.name}
                        </Text>
                        
                    </Pressable>
                      <Pressable
                      onPress={() => {
                        handlePresentModalPress();
                      }}
                      style={{
                        borderRadius: moderateScale(10),
                        transform: [{ scale: 0.8 }],
                        marginRight: horizontalScale(20),
                      }}
                      >
                        <Image
                        source={require('../assets/AddCustomButtom.png')}
                        style={{
                          width: horizontalScale(50),
                          height: verticalScale(50),
                          resizeMode: 'center',
                          transform: [{ scale: 2 }],
                        }}
                        ></Image>
                      </Pressable>
                  </View>
                  <BottomSheetModal
                  ref={bottomSheetModalRef}
                  index={1}
                  snapPoints={snapPoints}
                  onChange={handleSheetChanges}
                   >
                    <BottomSheetView style={{
                      flex: 1,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <View
                    style={{
                      flex: 1,
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flexDirection: 'row',
                      position: 'absolute',
                      top:moderateScale(-30),
                      right:moderateScale(-10),              
                    }}
                  >
                    <Pressable
                    onPress={() => {
                      bottomSheetModalRef.current?.close();
                    }}
                    style={{
                      padding: 10,
                      borderRadius: moderateScale(10),
                      marginRight: horizontalScale(20),
                      marginTop: verticalScale(20),
                    }}
                    >
                     <Image
                     source={require('../assets/closeButton.png')}
                     style={{
                        width: horizontalScale(30),
                        height: verticalScale(50),
                        resizeMode: 'center',
                        transform: [{ scale: 1.5 }],
                      }}
                     ></Image>
                    </Pressable>
                  </View>
                  <View
                  style={{
                    flex: 2,
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginBottom: verticalScale(15),
                    justifyContent: 'center'
                  }}
                  >
                    <View style={{
                      flexDirection: 'row',
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginHorizontal: horizontalScale(20),
                    }}>
                    <BottomSheetTextInput
                      value={customValue}
                      style={{
                        alignSelf: "stretch",
                        padding: 12,
                        borderRadius: moderateScale(12),
                        textAlign: "center",
                        fontSize: moderateScale(52),
                        fontFamily: 'Mplus-Bold',
                        alignItems: 'flex-end'
                      }}
                      keyboardType='numeric'
                      onChangeText={(text) => {
                        if(text.length > 3){
                          return;
                        }
                        setCustomValue(text);
                      }}
                   />
                   <Text
                   style={{
                    fontSize: moderateScale(52),
                    fontFamily: 'Mplus-Bold',
                   }}
                   >
                    ml
                   </Text>
                    </View>
                    <Text
                    style={{
                      fontSize: moderateScale(16),
                      fontFamily: 'Mplus-Bold',
                    }}
                    >
                      Custom amount
                    </Text>
                  </View>
                  <View
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'row',
                    marginHorizontal: horizontalScale(70),
                    height: verticalScale(100),
                  }}
                  >
                    <Pressable
                      style={{
                        flex:1,
                        flexDirection: 'row',
                        padding: 10,
                        borderRadius: moderateScale(39),
                        marginHorizontal: horizontalScale(40),
                        marginVertical: verticalScale(10),
                        justifyContent: 'space-evenly',
                        alignItems: 'center',
                        backgroundColor: '#54BCD9',
                        paddingHorizontal: horizontalScale(30),
                      }}
                      onPress={() => {
                        if(customValue === '')
                        {
                          return;
                        }
                        AddDrinkToDB(customValue);
                        console.log("customValue :- ",customValue);
                      }}
                      >
                        <Image
                        source={require('../assets/AddWaterPlus.png')}
                        style={{
                          width: horizontalScale(50),
                          height: verticalScale(50),
                          resizeMode: 'center',
                          transform: [{ scale: 2 }],
                        }}
                        ></Image>
                        <Text
                        style={{
                          fontSize: moderateScale(27),
                          fontFamily: 'Mplus-Bold',
                          color: '#ECF7F9',
                        }}
                        >
                          WATER
                        </Text>
                      </Pressable>
                  </View>
                    </BottomSheetView>
                  </BottomSheetModal>
              </SafeAreaView>
            </BottomSheetModalProvider>
            </GestureHandlerRootView>
      );
  }
  
  export default AddCustomDrinkScreen;
  