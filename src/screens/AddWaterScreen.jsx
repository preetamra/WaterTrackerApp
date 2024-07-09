import React, { useRef, useState } from 'react';
import {
    Button,
    SafeAreaView,
    View,
    Pressable,
    TextInput
} from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, interpolate, Extrapolation, useAnimatedReaction } from 'react-native-reanimated';
import { Gesture, GestureDetector, GestureHandlerRootView, useCode, call} from 'react-native-gesture-handler';

import GlassOfWaterSvg from '../assets/glassOfWaterSvg';
import { set } from 'firebase/database';

const AnimatedText  = Animated.createAnimatedComponent(TextInput);

function AddWaterScreen(props) {
    const inputRef = useRef(null);
    const height = useSharedValue(10);

    const [isBottleSelected, setIsBottleSelected] = useState(false);

    const animatedStyle = useAnimatedStyle(() => ({
        height: interpolate(height.value, [0, 300], [300, 0], Extrapolation.CLAMP),
    }));

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
                inputRef.current.setNativeProps({text: Math.round(val)});
              }
          }
        })
      ;

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <SafeAreaView style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'white'
            }}>
                <View
                    style={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
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
                ref={inputRef}
                defaultValue="10"
                editable={false}
                underlineColorAndroid={'transparent'}
                ></AnimatedText>
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
                            props.navigation.navigate('HomeScreen'); // Assuming 'HomeScreen' is the correct navigation target
                        }}
                    >
                        <GlassOfWaterSvg />
                    </Pressable>
                    <Button
                        title='Custom'
                        onPress={() => {
                            // Add custom button functionality here
                        }}
                    />
                </View>
            </SafeAreaView>
        </GestureHandlerRootView>
    );
}

export default AddWaterScreen;
