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
} from 'react-native-reanimated';
import { Gesture, GestureDetector, GestureHandlerRootView, useCode, call} from 'react-native-gesture-handler';
import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetModalProvider,
  BottomSheetTextInput
} from '@gorhom/bottom-sheet';
import * as SQLite from 'expo-sqlite';

import GlassOfWaterSvg from '../assets/glassOfWaterSvg.jsx';

const customTransition = SharedTransition.custom((values) => {
  'worklet';
  console.log(values);
  return {
    height: withSpring(values.targetHeight),
    width: withSpring(values.targetWidth),
    originX: withSpring(values.targetOriginX),
    originY: withSpring(values.targetOriginY),
  };
});

const AnimatedText  = Animated.createAnimatedComponent(TextInput);

function AddWaterScreen(props) {
   const [bottomSheetBackDrop, setBottomSheetBackDrop] = useState(false);

   const [inputValue, setInputValue] = useState('');

   const [customValue, setCustomValue] = useState('');

    const inputRef = useRef(null);
    const height = useSharedValue(10);

    const bottomSheetModalRef = useRef(null);
    const snapPoints = React.useMemo(() => ['25%', '50%'], []);

    const [isBottleSelected, setIsBottleSelected] = useState(false);

    const animatedStyle = useAnimatedStyle(() => ({
        height: interpolate(height.value, [0, 300], [400, 0], Extrapolation.CLAMP),
    }));

    const animatedText = useDerivedValue(() => {
      const step = 10;
      const interpolatedValue = isBottleSelected
        ? interpolate(height.value, [0, 300], [1000, 0], Extrapolation.CLAMP)
        : interpolate(height.value, [0, 300], [300, 0], Extrapolation.CLAMP);

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
          // height.value = Math.max(0, Math.min(300, height.value - e.translationY));
          // e.translationY = 0; // Reset translation to avoid cumulative issues
        })
        .onBegin((e) => {
          console.log('Gesture started',e.translationY);
          console.log('Touches Start',e);
        }).onTouchesMove((e) => {
          let val = e.allTouches[0].y;
          if(val > 0 && val < 380){
            height.value = e.allTouches[0].y - 100;
          }
        })
      ;

    return (
      <Animated.View style={{
        flex:1
      }}
      /* sharedTransitionTag='addWaterScreen'
      sharedTransitionStyle={customTransition} */
      >
        <GestureHandlerRootView style={{ flex: 1 }}>
          <BottomSheetModalProvider>
            <SafeAreaView style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'white',
                marginTop: 20,
            }}>
              {
                bottomSheetBackDrop && (
                  <View style={{
                    position: 'absolute',
                    top:0,
                    bottom:0,
                    left:0,
                    right:0,
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
                    props.navigation.navigate('HomeScreen');
                  }}
                  style={{
                    padding: 10,
                    borderRadius: 10,
                    marginRight: 20,
                    marginTop: 20,
                  }}
                  >
                   <Image
                   source={require('../assets/closeButton.png')}
                   style={{
                      width: 30,
                      height: 50,
                      resizeMode: 'center',
                      transform: [{ scale: 1.5 }],
                    }}
                   ></Image>
                  </Pressable>
                </View>
                <View
                    style={{
                        flex: 8,
                        position: "relative",
                        width: "100%",
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: "100%",
                    }}
                >
                  <View
                   style={{
                    width: isBottleSelected ? "60%" : "70%",
                    height: isBottleSelected ? "70.15%" :"70%",
                    backgroundColor: '#f0f0f0',
                   }}
                  >
                    <Animated.View
                      style={[{
                        position: 'absolute',
                        bottom: 0,
                        width: '100%',
                        backgroundColor: '#00bcd4',
                      }, animatedStyle]}
                    ></Animated.View>
                  </View>
                  <GestureDetector gesture={pan}>
                  <View
                   style={{
                    width: "60%",
                    height: "60%",
                    position: 'absolute',
                    zIndex:3,
                   }}
                  >
                  </View>
                  </GestureDetector>
                  <Image
                    source={
                      {
                        uri: isBottleSelected ? Image.resolveAssetSource(require('../assets/BottleOutLine.png')).uri : Image.resolveAssetSource(require('../assets/GlassOutlineNew.png')).uri
                      }
                    }
                    style={
                      [
                        {
                          width: "100%",
                          height: "100%",
                          position: 'absolute',
                          bottom: 0,
                          zIndex: 2,
                          paddingLeft: 10,
                          resizeMode: 'center',
                          backgroundColor: 'transparent',
                        },
                        isBottleSelected ? {
                          transform: [{ scale: 1.12 }],
                        }: {

                        }
                      ]
                    }
                  ></Image>
                </View>
                <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'flex-start',
                  flexDirection: 'row',
                  marginBottom: 20,
                }}
                >
                <AnimatedText
                    value={animatedText.value}
                    editable={false}
                    underlineColorAndroid={'transparent'}
                    animatedProps={animatedTextProps}
                    style={{
                      fontSize: 52,
                      fontFamily: 'Inter',
                      fontWeight: '500',
                    }}
                />
                <Text
                style={{
                  fontSize: 52,
                  marginBottom: 20,
                  fontFamily: 'Inter',
                  fontWeight: '500',
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
                        marginBottom: 10,
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
                      padding: 10,
                      borderRadius: 10,
                      marginLeft: 20,
                      transform: [{ scale: 0.8 }],
                    }}
                  >
                      <Image
                      source={require('../assets/BottleSmall.png')}
                      ></Image>
                    </Pressable>
                    <Pressable
                        style={{
                          flex:1,
                          flexDirection: 'row',
                          padding: 10,
                          borderRadius: 39,
                          marginHorizontal: 40,
                          marginVertical: 10,
                          justifyContent: 'space-evenly',
                          alignItems: 'center',
                          backgroundColor: '#54BCD9',
                          paddingHorizontal: 30,
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
                        width: 50,
                        height: 50,
                        resizeMode: 'center',
                        transform: [{ scale: 2 }],
                      }}
                      ></Image>
                      <Text
                      style={{
                        fontSize: 27,
                        fontFamily: 'Inter',
                        fontWeight: '600',
                        color: '#ECF7F9',
                      }}
                      >
                        Water
                      </Text>
                    </Pressable>
                    <Pressable
                    onPress={() => {
                      handlePresentModalPress();
                    }}
                    style={{
                      padding: 10,
                      borderRadius: 10,
                      marginRight: 20,
                      transform: [{ scale: 0.8 }],
                    }}
                    >
                      <Image
                      source={require('../assets/AddCustomButtom.png')}
                      style={{
                        width: 50,
                        height: 50,
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
                  }}>
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
                    bottomSheetModalRef.current?.close();
                  }}
                  style={{
                    padding: 10,
                    borderRadius: 10,
                    marginRight: 20,
                    marginTop: 20,
                  }}
                  >
                   <Image
                   source={require('../assets/closeButton.png')}
                   style={{
                      width: 30,
                      height: 50,
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
                  marginBottom: 20,
                  justifyContent: 'center',
                }}
                >
                  <View style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginHorizontal: 20,
                  }}>
                  <BottomSheetTextInput
                    value={customValue}
                    style={{
                      alignSelf: "stretch",
                      marginHorizontal: 12,
                      padding: 12,
                      borderRadius: 12,
                      textAlign: "center",
                      fontSize: 52,
                      fontFamily: 'Inter',
                      fontWeight: '500',
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
                  fontSize: 52,
                  fontFamily: 'Inter',
                  fontWeight: '500',                  
                 }}
                 >
                  ml
                 </Text>
                  </View>
                  <Text
                  style={{
                    fontSize: 21.5,
                    fontFamily: 'Inter',
                    fontWeight: '500',
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
                  marginBottom: 20,
                  marginHorizontal: 70,
                }}
                >
                  <Pressable
                    style={{
                      flex:1,
                      flexDirection: 'row',
                      padding: 10,
                      borderRadius: 39,
                      marginHorizontal: 40,
                      marginVertical: 10,
                      justifyContent: 'space-evenly',
                      alignItems: 'center',
                      backgroundColor: '#54BCD9',
                      paddingHorizontal: 30,
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
                        width: 50,
                        height: 50,
                        resizeMode: 'center',
                        transform: [{ scale: 2 }],
                      }}
                      ></Image>
                      <Text
                      style={{
                        fontSize: 27,
                        fontFamily: 'Inter',
                        fontWeight: '800',
                        color: '#ECF7F9',
                      }}
                      >
                        Water
                      </Text>
                    </Pressable>
                </View>
                  </BottomSheetView>
                </BottomSheetModal>
            </SafeAreaView>
          </BottomSheetModalProvider>
        </GestureHandlerRootView>
      </Animated.View>
    );
}

export default AddWaterScreen;
