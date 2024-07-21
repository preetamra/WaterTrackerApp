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
    Text
} from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, interpolate, Extrapolation, useDerivedValue, useAnimatedProps } from 'react-native-reanimated';
import { Gesture, GestureDetector, GestureHandlerRootView, useCode, call} from 'react-native-gesture-handler';
import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetModalProvider,
} from '@gorhom/bottom-sheet';
import * as SQLite from 'expo-sqlite';

import GlassOfWaterSvg from '../assets/glassOfWaterSvg';

const AnimatedText  = Animated.createAnimatedComponent(TextInput);

function AddWaterScreen(props) {
   const [bottomSheetBackDrop, setBottomSheetBackDrop] = useState(false);

   const [inputValue, setInputValue] = useState('');

    const inputRef = useRef(null);
    const height = useSharedValue(10);

    const bottomSheetModalRef = useRef(null);
    const snapPoints = React.useMemo(() => ['25%', '50%'], []);

    const [isBottleSelected, setIsBottleSelected] = useState(false);

    const animatedStyle = useAnimatedStyle(() => ({
        height: interpolate(height.value, [0, 300], [300, 0], Extrapolation.CLAMP),
    }));

    const animatedText = useDerivedValue(() => {

      if(isBottleSelected)
        {
          if(Math.round(interpolate(height.value, [0,300],[1000,0], Extrapolation.CLAMP)) > 970)
          {
            return '1000'; 
          }else if(Math.round(interpolate(height.value, [0,300],[1000,0], Extrapolation.CLAMP)) < 60)
          {
            return '10';
          }
          return `${Math.round(interpolate(height.value, [0,300],[1000,0], Extrapolation.CLAMP))}`;
        }

      if(Math.round(interpolate(height.value, [0,300],[300,0], Extrapolation.CLAMP)) > 290)
        {
          return '300'; 
        }else if(Math.round(interpolate(height.value, [0,300],[300,0], Extrapolation.CLAMP)) < 20)
        {
          return '10';
        }
      return `${Math.round(interpolate(height.value, [0,300],[300,0], Extrapolation.CLAMP))}`;
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

  const GlassShape = () => (
      <GestureDetector gesture={pan}>
            <View style={{
                width: 200,
                height: 300,
                backgroundColor: '#f0f0f0',
                borderBottomLeftRadius: 20,
                borderBottomRightRadius: 20,
                transform: [{ scaleX: 0.8 }],
                overflow: 'hidden',
            }}>
                    <Animated.View
                        style={[{
                            position: 'absolute',
                            bottom: 0,
                            width: '100%',
                            backgroundColor: '#00bcd4',
                            borderBottomLeftRadius: 20,
                            borderBottomRightRadius: 20,
                        }, animatedStyle]}
                    ></Animated.View>
            </View>
      </GestureDetector>
  );

  const BottleShape = () => (
            <View style={{ alignItems: 'center' }}>
                {/* Cap */}
                <View style={{
                    width: 80,
                    height: 30,
                    backgroundColor: '#f0f0f0',
                    borderTopLeftRadius: 40,
                    borderTopRightRadius: 40,
                    borderBottomLeftRadius: 10,
                    borderBottomRightRadius: 10,
                    marginBottom: -10,
                }} />
              <GestureDetector gesture={pan}>
                {/* Body */}
                <View style={{
                    width: 180,
                    height: 300,
                    backgroundColor: '#f0f0f0',
                    borderTopLeftRadius: 90,
                    borderTopRightRadius: 90,
                    borderBottomLeftRadius: 45,
                    borderBottomRightRadius: 45,
                    overflow: 'hidden',
                }}>
                        <Animated.View
                            style={[{
                                position: 'absolute',
                                bottom: 0,
                                width: '100%',
                                backgroundColor: '#00bcd4',
                            }, animatedStyle]}
                        ></Animated.View>
                </View>
              </GestureDetector>
            </View>
  );

    const pan = Gesture.Pan()
        .onUpdate((e) => {
          // height.value = Math.max(0, Math.min(300, height.value - e.translationY));
          // e.translationY = 0; // Reset translation to avoid cumulative issues
        })
        .onBegin((e) => {
          console.log('Gesture started',e.translationY);          
        }).onTouchesMove((e) => {
          let val = e.allTouches[0].y;
          if(val > 0 && val < 290){
            height.value = e.allTouches[0].y;

            if(inputRef?.current)
              {
                inputRef.current.setNativeProps({text:`${Math.round(val)}`});
              }
          }
        })
      ;

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
          <BottomSheetModalProvider>
            <SafeAreaView style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'white',
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
                    backgroundColor: '#00bcd4',
                    padding: 10,
                    borderRadius: 10,
                    marginRight: 20,
                    marginTop: 20,
                  }}
                  >
                    <Text>
                      Close
                    </Text>
                  </Pressable>
                </View>
                <View
                    style={{
                        flex: 5,
                        position: "relative",
                        width: 250,
                        height: 450,
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    {isBottleSelected ? <BottleShape /> : <GlassShape />}
                </View>
                <AnimatedText
                    value={animatedText.value}
                    editable={false}
                    underlineColorAndroid={'transparent'}
                    animatedProps={animatedTextProps}
                    style={{
                        fontSize: 20,
                        marginTop: 10
                    }}
                />
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
                    <Button
                        title={isBottleSelected ? 'Switch' : 'Switch'}
                        onPress={() => {
                            setIsBottleSelected(!isBottleSelected);
                        }}
                    />
                    <Pressable
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
                        <GlassOfWaterSvg />
                    </Pressable>
                    <Button
                        title='Custom'
                        onPress={() => {
                            // Add custom button functionality here
                            handlePresentModalPress();
                        }}
                    />
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
                    <Text>
                      Custom Water Intake
                    </Text>
                    <TextInput
                      style={{
                        width: 200,
                        height: 40,
                        borderColor: 'gray',
                        borderWidth: 1,
                        marginTop: 20,
                      }}
                    />
                    <Button
                      title='Save'
                      onPress={() => {
                        // Add save button functionality here
                        bottomSheetModalRef.current?.dismiss();
                      }}
                    />
                  </BottomSheetView>
                </BottomSheetModal>
            </SafeAreaView>
          </BottomSheetModalProvider>
        </GestureHandlerRootView>
    );
}

export default AddWaterScreen;
