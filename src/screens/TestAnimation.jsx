import React, { 
  useState,
  useRef,
  useEffect
} from 'react';
import { 
  SafeAreaView, 
  ScrollView, 
  View, 
  Text, 
  Image,
  Pressable,
  BackHandler,
  Button
} from 'react-native';
import Rive,{
  RiveRef
} from 'rive-react-native';
import {
  useSharedValue,
  runOnJS,
  interpolate,
  Extrapolation,
  runOnUI
} from 'react-native-reanimated';

import {
  horizontalScale, 
  verticalScale,
  moderateScale,
} from '../Utils/ResponsiveDesign';
import {
  GestureHandlerRootView, 
  GestureDetector,
  Gesture,
} from 'react-native-gesture-handler';

function Test(props) {
  const [bottomSheetBackDrop, setBottomSheetBackDrop] = useState(false);
  const [isBottleSelected, setIsBottleSelected] = useState(false);

  const riveRef = useRef<RiveRef>(null);

  const riveRefGlass = useRef(null);
  const riveRefBottle = useRef(null);

  const height = useSharedValue(10);

  const pan = Gesture.Pan()
  .onUpdate((e) => {
    // height.value = Math.max(0, Math.min(300, height.value - e.translationY));
    // e.translationY = 0; // Reset translation to avoid cumulative issues
  })
  .onBegin((e) => {
    /* console.log('Gesture started',e.translationY);
    console.log('Touches Start',e); */
  }).onTouchesMove((e) => {
    let val = e.allTouches[0].y;
    if(!isBottleSelected)
    {
      if(val > 120 && val < 420){
        height.value = e.allTouches[0].y;
        /* runOnJS(() => {
          if(riveRefGlass?.current)
          {
             riveRefGlass?.current?.setInputState("State Machine 1", "Number 1", interpolate(val, [420,120], [0, 100], Extrapolation.CLAMP));  
          }
        }) */
        // runOnJS(riveRefGlass?.current?.setInputState)("State Machine 1", "Number 1", interpolate(val, [420,120], [0, 100], Extrapolation.CLAMP));
        // riveRefGlass?.current?.setInputState("State Machine 1", "Number 1", interpolate(val, [420,120], [0, 100], Extrapolation.CLAMP));
        // console.log('Value',interpolate(val, [420,120], [0, 100], Extrapolation.CLAMP));
      }
    }else{
      if(val > 200 && val < 480){
        height.value = e.allTouches[0].y;
        // runOnJS(riveRefBottle?.current?.setInputState)("Progress", "Number 1", interpolate(val, [480,200], [0, 100], Extrapolation.CLAMP));
      }
    }
  });

  useEffect(() => {
    const backButton = BackHandler.addEventListener('hardwareBackPress',() => {
      console.log('Back Pressed');
    })

    return () => {
      backButton.remove();
    }
  },[])
  
  return (
    <GestureHandlerRootView
    style={{
      flex: 1,
    }}
    >
    <SafeAreaView
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        marginTop: verticalScale(20),
      }}
      >
        {
          bottomSheetBackDrop && (
            <View
              style={{
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
                        ref={riveRefGlass}
                       />
                    <GestureDetector gesture={pan}>
                    <View
                     style={{
                      width: "70%",
                      height: "100%",
                      position: 'absolute',
                      zIndex:3,
                    }}
                    >
                    </View>
                    </GestureDetector>
                  </View>
                  <Button
                  title='Set Water level to 50'
                  onPress={() => {
                    riveRefGlass?.current?.setInputState("State Machine 1", "Number 1", 50);
                  }}
                  ></Button>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

export default Test;