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
      Image
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
    GestureHandlerRootView,
    useCode,
    call
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
  
  import GlassOfWaterSvg from '../assets/glassOfWaterSvg.jsx';
  import { horizontalScale, moderateScale, verticalScale } from '../Utils/ResponsiveDesign.js';
  
  const customTransition = SharedTransition.custom((values) => {
    'worklet';
    return {
      height: withSpring(verticalScale(values.targetHeight)),
      width: withSpring(horizontalScale(values.targetWidth)),
      originX: withSpring(values.targetOriginX),
      originY: withSpring(values.targetOriginY),
    };
  });
  
  const AnimatedText  = Animated.createAnimatedComponent(TextInput);

function AddCustomDrinkScreen(props) {
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
      console.log('handleSheetChanges', index);
      if(index == 1)
      {
        setBottomSheetBackDrop(true);
      }else if(index == -1)
      {
        setBottomSheetBackDrop(false);
      }
    }, []);
  
      const pan = Gesture.Pan()
          .onUpdate((e) => {
          })
          .onBegin((e) => {
          }).onTouchesMove((e) => {
            let val = e.allTouches[0].y;
            if(!isBottleSelected)
            {
              if(val > 120 && val < 420){
                height.value = e.allTouches[0].y;
                // runOnJS(riveRef?.current?.setInputState)("State Machine 1", "Number 1", interpolate(val, [420,120], [0, 100], Extrapolation.CLAMP));
              }
            }else{
              if(val > 200 && val < 480){
                height.value = e.allTouches[0].y;
                // runOnJS(riveRef?.current?.setInputState)("Progress", "Number 1", interpolate(val, [480,200], [0, 100], Extrapolation.CLAMP));
              }
            }
          });

          if (!loaded && !error) {
            return null;
          }
  
      return (
        <GestureHandlerRootView style={{ flex: 1 }}>
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
                      flex: 6,
                      position: "relative",
                      width: "100%",
                      justifyContent: 'center',
                      alignItems: 'center',
                      height: "100%",
                    }}
                  >
                    {
                        isBottleSelected ?
                        <Rive
                        url={"https://firebasestorage.googleapis.com/v0/b/blockerplus-6ba24.appspot.com/o/Rive_Editor.riv?alt=media&token=ce921abf-2ccf-4908-bb25-8f4af892a708"}
                        artboardName="Artboard"
                        stateMachineName='Progress'
                        style={
                          {
                            width: horizontalScale(250),
                            height: verticalScale(250),
                            marginBottom: verticalScale(-120),
                          }
                        }
                        ref={riveRef}
                       /> :
                       <Rive
                        url={"https://firebasestorage.googleapis.com/v0/b/blockerplus-6ba24.appspot.com/o/Forever%20Bubblewrap.riv?alt=media&token=f7e1dbf5-b6fc-4f32-96b4-43eccb8b00fd"}
                        artboardName="Artboard"
                        stateMachineName='State Machine 1'
                        style={
                            {
                                width: horizontalScale(250),
                                height: verticalScale(250),
                                marginBottom: verticalScale(-120),
                            }
                        }
                        ref={riveRef}
                       />
                    }
                    <View
                     style={{
                      width: "70%",
                      height: "100%",
                      position: 'absolute',
                      zIndex:3,
                      opacity:0.5,
                    }}
                    onStartShouldSetResponder={() => true}
                    onResponderMove={(e) => {
                      let val = e.nativeEvent.locationY;

                      console.log("val :- ",val);

                      if(!isBottleSelected)
                      {
                        if(val > 120 && val < 420){
                          height.value = val;
                          runOnJS(riveRef?.current?.setInputState)("State Machine 1", "Number 1", interpolate(val, [420,120], [0, 100], Extrapolation.CLAMP));
                        }
                      }else{
                        if(val > 200 && val < 480){
                          height.value = val;
                          runOnJS(riveRef?.current?.setInputState)("Progress", "Number 1", interpolate(val, [480,200], [0, 100], Extrapolation.CLAMP));
                        }
                      }
                    }}
                    >
                    </View>
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
                        setIsBottleSelected(!isBottleSelected);
                      }}
                      style={{
                        borderRadius: moderateScale(10),
                        transform: [{ scale: 0.8 }],
                        marginLeft: horizontalScale(20),
                      }}
                    >
                        {
                            isBottleSelected ?
                            <Image
                            source={require('../assets/GlassSmall.png')}
                            ></Image>
                            :
                            <Image
                            source={require('../assets/BottleSmall.png')}
                            ></Image>
                        }
                      </Pressable>
                      <Pressable
                          style={{
                            flex:1,
                            flexDirection: 'row',
                            padding: moderateScale(10),
                            borderRadius: moderateScale(39),
                            marginVertical: verticalScale(10),
                            justifyContent: 'space-evenly',
                            alignItems: 'center',
                            backgroundColor: '#54BCD9',
                            paddingHorizontal: horizontalScale(30),
                            marginHorizontal: horizontalScale(40),
                          }}
                          onPress={() => {
                              (
                                async () => {
                                  try{
                                    const db = await SQLite.openDatabaseAsync('databaseName');
  
                                    await db.execAsync(`
                                      PRAGMA journal_mode = WAL;
                                      CREATE TABLE IF NOT EXISTS test (
                                        id INTEGER PRIMARY KEY NOT NULL,
                                        value TEXT NOT NULL,
                                        intValue INTEGER,
                                        dateTime DATETIME NOT NULL
                                      );
                                    `);
                                    
                                    const statement = await db.prepareAsync(
                                      'INSERT INTO test (value, intValue, dateTime) VALUES ($value, $intValue, $dateTime)'
                                    );
                                    
                                    let result = await statement.executeAsync({
                                      $value: new Date().toISOString(),
                                      $intValue: Math.round(interpolate(height.value, [0, 300], [isBottleSelected ? 1000 : 300, 0], Extrapolation.CLAMP)),
                                      $dateTime: new Date().toISOString()
                                    });

                                    const today = new Date().toISOString().split('T')[0];
                                    const startOfDay = `${today}T00:00:00.000Z`;
                                    const endOfDay = `${today}T23:59:59.999Z`;
                                    
                                    const todayEntries = await db.getAllAsync(
                                      'SELECT * FROM test WHERE dateTime BETWEEN ? AND ? ORDER BY dateTime ASC',
                                      [startOfDay, endOfDay]
                                    );
                                    
                                    for (const row of todayEntries) {
                                      console.log("Today :- ",row.id, row.value, row.intValue, row.dateTime);
                                    }
  
                                    const today1 = new Date();
                                    const yesterday = new Date(today1);
                                    yesterday.setDate(yesterday.getDate() - 1);
                                    
                                    const startOfYesterday = `${yesterday.toISOString().split('T')[0]}T00:00:00.000Z`;
                                    const endOfYesterday = `${yesterday.toISOString().split('T')[0]}T23:59:59.999Z`;
                                    
                                    const yesterdayEntries = await db.getAllAsync(
                                      'SELECT * FROM test WHERE dateTime BETWEEN ? AND ? ORDER BY dateTime ASC',
                                      [startOfYesterday, endOfYesterday]
                                    );
                                    
                                    for (const row of yesterdayEntries) {
                                      console.log("yesturday :- ",row.id, row.value, row.intValue, row.dateTime);
                                    }
  
                                    const allRows = await db.getAllAsync('SELECT * FROM test');

                                    for (const row of allRows) {
                                      console.log(row.id, row.value, row.intValue);
                                    }

                                     console.log("props :- ",props.switchScreen());
                                  }catch(e){
                                    console.error(e);
                                  }
                                }
                              )()
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
                           fontFamily: 'Fact-Narrow-Bold',
                          color: '#ECF7F9',
                        }}
                        >
                          WATER
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
                        // props.navigation.navigate('HomeScreen'); // Assuming 'HomeScreen' is the correct navigation target
                              (
                                async () => {
                                  try{
                                    const db = await SQLite.openDatabaseAsync('databaseName');
  
                                    await db.execAsync(`
                                      PRAGMA journal_mode = WAL;
                                      CREATE TABLE IF NOT EXISTS test (
                                        id INTEGER PRIMARY KEY NOT NULL,
                                        value TEXT NOT NULL,
                                        intValue INTEGER,
                                        dateTime DATETIME NOT NULL
                                      );
                                    `);
                                    
                                    const statement = await db.prepareAsync(
                                      'INSERT INTO test (value, intValue, dateTime) VALUES ($value, $intValue, $dateTime)'
                                    );
                                    
                                    let result = await statement.executeAsync({
                                      $value: new Date().toISOString(),
                                      $intValue: Math.round(customValue),
                                      $dateTime: new Date().toISOString()
                                    });
                                    
                                    const today = new Date().toISOString().split('T')[0];
                                    const startOfDay = `${today}T00:00:00.000Z`;
                                    const endOfDay = `${today}T23:59:59.999Z`;
                                    
                                    const todayEntries = await db.getAllAsync(
                                      'SELECT * FROM test WHERE dateTime BETWEEN ? AND ? ORDER BY dateTime ASC',
                                      [startOfDay, endOfDay]
                                    );
                                    
                                    for (const row of todayEntries) {
                                      console.log("Today :- ",row.id, row.value, row.intValue, row.dateTime);
                                    }
  
                                    const today1 = new Date();
                                    const yesterday = new Date(today1);
                                    yesterday.setDate(yesterday.getDate() - 1);
                                    
                                    const startOfYesterday = `${yesterday.toISOString().split('T')[0]}T00:00:00.000Z`;
                                    const endOfYesterday = `${yesterday.toISOString().split('T')[0]}T23:59:59.999Z`;
                                    
                                    const yesterdayEntries = await db.getAllAsync(
                                      'SELECT * FROM test WHERE dateTime BETWEEN ? AND ? ORDER BY dateTime ASC',
                                      [startOfYesterday, endOfYesterday]
                                    );
                                    
                                    for (const row of yesterdayEntries) {
                                      console.log("yesturday :- ",row.id, row.value, row.intValue, row.dateTime);
                                    }
  
                                    const allRows = await db.getAllAsync('SELECT * FROM test');
  
                                    for (const row of allRows) {
                                      console.log(row.id, row.value, row.intValue);
                                    }
                                  }catch(e){
                                    console.error(e);
                                  }
                                }
                              )()
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
  