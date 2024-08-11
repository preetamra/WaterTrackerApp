import React,{
    useEffect,
    useState
} from 'react';
import {
    Button,
    SafeAreaView,
    StyleSheet,
    TextInput,
    View,
    Text,
    Image,
    Dimensions,
    Pressable,
    Animated
} from 'react-native';
import { horizontalScale, verticalScale } from '../Utils/ResponsiveDesign';
import { GestureHandlerRootView, ScrollView } from 'react-native-gesture-handler';
import { useFonts } from 'expo-font';
  
function WidgetScreen(props) {

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

    return (
    <GestureHandlerRootView
    style={{
      flex:1,
      backgroundColor: '#ffffff',
    }}
    >
      <SafeAreaView style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
         <Text>
            Widget Screen
         </Text>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}
  
export default WidgetScreen;
  