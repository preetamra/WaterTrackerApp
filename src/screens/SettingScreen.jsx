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
  
function SettingScreen(props) {

  const animated = new Animated.Value(1);
  const recommendAnimated = new Animated.Value(1); 
  const editListAnimated = new Animated.Value(1);

  const fadeIn = () => {
    Animated.timing(animated, {
      toValue: 0.4,
      duration: 100,
      useNativeDriver: true,
    }).start();
  };
  const fadeOut = () => {
    Animated.timing(animated, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

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
      width:horizontalScale(450),
      height:verticalScale(450),
      backgroundColor: '#ffffff',
    }}
    >
      <SafeAreaView style={{
        flex: 1,
      }}>
          <View
          style={{
            position:"absolute",
            top:10,
            left:10,
            width:horizontalScale(50),
            height:horizontalScale(50),
            zIndex: 2,
          }}
          >
            <Pressable
            style={{
              width:'100%',
              height:'100%',
            }}
            >
              <Image
               source={require('../assets/BackButton.png')}
               style={{
                  width: horizontalScale(50),
                  height: verticalScale(50),
                  backgroundColor:"transparent",
                  zIndex: 1,
                  resizeMode:"contain"
               }}
              ></Image>
            </Pressable>
          </View>
          <ScrollView
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            style={{
              flex:1,
              width:"75%",
              position:"relative",
              top:0,
              bottom:0,
              left:0,
              right:0,
              zIndex:1,
              marginTop:verticalScale(80),
              marginLeft:horizontalScale(20),
            }}
            contentContainerStyle={{
              justifyContent:'center',
              alignItems:'center',
            }}
          >
            <Animated.View
              style={
                {
                width:"100%",
                flex:1,
                justifyContent:'center',
                alignItems:'center',
                borderRadius:30,
                flexDirection:'row',
                justifyContent:'space-between',
                alignItems:'flex-start',
                padding:20,
                backgroundColor: '#e0f8fc',
                transform: [{scale: animated}]
                }
              }
            >
            <Pressable
            onPress={() => {
              props.navigation.navigate('RemainderScreen');
            }}
            onPressIn={() => {
              console.log('On Press In');
              animated.setValue(0.97);
            }}
            onPressOut={() => {
              console.log('On Press Out');
              animated.setValue(1);
            }}
            >
              <View>
                <Text style={{
                  color:'#22BDD0',
                  fontSize:30,
                  fontFamily:'Mplus-Bold',
                }}>
                  Remainder
                </Text>
                <Text
                style={{
                  fontFamily:'Mplus-Bold',
                  color:'#90A5AA',
                  fontSize:13
                }}
                >
                  Smart remainder
                </Text>
                <View>
                <Text
                style={{
                  fontFamily:'Mplus-Regular',
                  color:'#90A5AA',
                  fontSize:13
                }}
                >
                  Notification Interval: 1 hour 10 mins
                </Text>
                <Text
                style={{
                  fontFamily:'Mplus-Regular',
                  color:'#90A5AA',
                  fontSize:13
                }}
                >
                  From 8:00 AM, Until 10:00 PM
                </Text>
                </View>
              </View>
            </Pressable>              
            <View
              style={{
                flex:1,
                flexDirection:'row',
                justifyContent:'center',
                alignItems:'flex-start',
                marginTop:10,
                gap:10,
              }}
              >
                <Text
                style={{
                  color:'#66D7DA',
                  fontSize:20,
                }}
                >
                  On
                </Text>
                <Image
                source={require('../assets/BackButtonSetting.png')}
                style={{
                  width: horizontalScale(20),
                  height: verticalScale(20),
                  backgroundColor:"transparent",
                  zIndex: 1,
                  resizeMode:"contain",
                  marginTop:5,
                }}
                ></Image>
              </View>
            </Animated.View>
            <Animated.View
            style={{
              width:"100%",
              flex:1,
              justifyContent:'center',
              alignItems:'center',
              borderRadius:30,
              flexDirection:'row',
              justifyContent:'space-between',
              alignItems:'flex-start',
              padding:20,
              backgroundColor: '#00bedb',
              marginTop:20,
              transform: [{scale: recommendAnimated}]
              }}
            >
            <Pressable
            onPress={() => {
              props.navigation.navigate('Recommend');
            }}
            onPressIn={() => {
              console.log('On Press In');
              recommendAnimated.setValue(0.97);
            }}
            onPressOut={() => {
              console.log('On Press Out');
              recommendAnimated.setValue(1);
            }}
            >
              <View>
                <Text style={{
                  color:'#E5FBFB',
                  fontSize:50,
                  fontWeight:'bold',
                }}>
                  2115ml
                </Text>
                <Text
                style={{
                  fontFamily:'Mplus-Bold',
                  color:'#BCF7FB',
                  fontSize:15
                }}
                >
                  Recommended Water Intake
                </Text>
                <View>
                <Text
                style={{
                  color:'#53E9F9',
                  fontSize:12.5,
                  fontFamily:'Mplus-Bold',
                }}
                >
                  Change weight, daily activity, or weather
                </Text>
                </View>
              </View>
            </Pressable>
            <View
              style={{
                flex:1,
                flexDirection:'row',
                justifyContent:'center',
                alignItems:'flex-start',
                marginTop:10,
                gap:10,
              }}
              >
                <Image
                source={require('../assets/BackButtonSetting.png')}
                style={{
                  width: horizontalScale(20),
                  height: verticalScale(20),
                  backgroundColor:"transparent",
                  zIndex: 1,
                  resizeMode:"contain",
                  marginTop:10,
                }}
                ></Image>
              </View>
            </Animated.View>
            <Pressable
            onPress={() => {
              props.navigation.navigate('EditCustomDrinkListScreen');
            }}
            style={{
              width:"100%",
              flex:1,
              justifyContent:'center',
              alignItems:'center',
              borderRadius:30,
              flexDirection:'row',
              justifyContent:'space-between',
              alignItems:'flex-start',
              padding:20,
              backgroundColor: '#f9fbfa',
              hadowColor: '#000',
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.8,
              shadowRadius: 2,  
              elevation: 1,
              marginTop:20,
            }}
            >
              <View
              style={{
                flex:1,
                flexDirection:'row',
                justifyContent:'flex-start',
                alignItems:'center',
                gap:5
              }}
              >
                 <View
                 style={{
                  backgroundColor:'gray',
                  width:horizontalScale(40),
                  height:verticalScale(40),
                 }}
                 ></View>
                 <Text
                  style={{
                    color:'#464B51',
                    fontSize:15,
                    fontFamily:'Mplus-Bold',
                  }}
                 >
                    Add/Edit drinks list
                 </Text>
              </View>
              <View
              style={{
                width:horizontalScale(20),
                marginTop:10,
              }}
              >
                <Image
                source={require('../assets/BackButtonSetting.png')}
                ></Image>
              </View>
            </Pressable>
            <Pressable
            onPress={() => {
              props.navigation.navigate('WidgetsScreen');
            }}
            style={{
              width:"100%",
              flex:1,
              justifyContent:'center',
              alignItems:'center',
              borderRadius:30,
              flexDirection:'row',
              justifyContent:'space-between',
              alignItems:'flex-start',
              padding:20,
              backgroundColor: '#f9fbfa',
              hadowColor: '#000',
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.8,
              shadowRadius: 2,  
              elevation: 1,
              marginTop:20,
            }}
            >
              <View
              style={{
                flex:1,
                flexDirection:'row',
                justifyContent:'flex-start',
                alignItems:'center',
                gap:5
              }}
              >
                 <View
                 style={{
                  backgroundColor:'gray',
                  width:horizontalScale(40),
                  height:verticalScale(40),
                 }}
                 ></View>
                 <Text
                  style={{
                    color:'#464B51',
                    fontSize:15,
                    fontFamily:'Mplus-Bold',
                  }}
                 >
                    Widgets
                 </Text>
              </View>
              <View
              style={{
                width:horizontalScale(20),
                marginTop:10,
              }}
              >
                <Image
                source={require('../assets/BackButtonSetting.png')}
                ></Image>
              </View>
            </Pressable>
            <Pressable
            onPress={() => {
              // props.navigation.navigate('EditCustomDrinkListScreen');
            }}
            style={{
              width:"100%",
              flex:1,
              justifyContent:'center',
              alignItems:'center',
              borderRadius:30,
              flexDirection:'row',
              justifyContent:'space-between',
              alignItems:'flex-start',
              padding:20,
              backgroundColor: '#f9fbfa',
              hadowColor: '#000',
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.8,
              shadowRadius: 2,  
              elevation: 1,
              marginTop:20,
            }}
            >
              <View
              style={{
                flex:1,
                flexDirection:'row',
                justifyContent:'flex-start',
                alignItems:'center',
                gap:5
              }}
              >
                 <View
                 style={{
                  backgroundColor:'gray',
                  width:horizontalScale(40),
                  height:verticalScale(40),
                 }}
                 ></View>
                 <Text
                  style={{
                    color:'#464B51',
                    fontSize:15,
                    fontFamily:'Mplus-Bold',
                  }}
                 >
                    Measurement Units
                 </Text>
              </View>
              <View
              style={{
                width:horizontalScale(20),
                marginTop:10,
              }}
              >
                <Image
                source={require('../assets/BackButtonSetting.png')}
                ></Image>
              </View>
            </Pressable>
            <Pressable
            onPress={() => {
              // props.navigation.navigate('EditCustomDrinkListScreen');
            }}
            style={{
              width:"100%",
              flex:1,
              justifyContent:'center',
              alignItems:'center',
              borderRadius:30,
              flexDirection:'row',
              justifyContent:'space-between',
              alignItems:'flex-start',
              padding:20,
              backgroundColor: '#f9fbfa',
              hadowColor: '#000',
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.8,
              shadowRadius: 2,  
              elevation: 1,
              marginTop:20,
            }}
            >
              <View
              style={{
                flex:1,
                flexDirection:'row',
                justifyContent:'flex-start',
                alignItems:'center',
                gap:5
              }}
              >
                 <View
                 style={{
                  backgroundColor:'gray',
                  width:horizontalScale(40),
                  height:verticalScale(40),
                 }}
                 ></View>
                 <Text
                  style={{
                    color:'#464B51',
                    fontSize:15,
                    fontFamily:'Mplus-Bold',
                  }}
                 >
                    Health Sync
                 </Text>
              </View>
              <View
              style={{
                width:horizontalScale(20),
                marginTop:10,
              }}
              >
                <Image
                source={require('../assets/BackButtonSetting.png')}
                ></Image>
              </View>
            </Pressable>
            <Pressable
            onPress={() => {
              // props.navigation.navigate('EditCustomDrinkListScreen');
            }}
            style={{
              width:"100%",
              flex:1,
              justifyContent:'center',
              alignItems:'center',
              borderRadius:30,
              flexDirection:'row',
              justifyContent:'space-between',
              alignItems:'flex-start',
              padding:20,
              backgroundColor: '#f9fbfa',
              hadowColor: '#000',
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.8,
              shadowRadius: 2,  
              elevation: 1,
              marginTop:20,
            }}
            >
              <View
              style={{
                flex:1,
                flexDirection:'row',
                justifyContent:'flex-start',
                alignItems:'center',
                gap:5
              }}
              >
                 <View
                 style={{
                  backgroundColor:'gray',
                  width:horizontalScale(40),
                  height:verticalScale(40),
                 }}
                 ></View>
                 <Text
                  style={{
                    color:'#464B51',
                    fontSize:15,
                    fontFamily:'Mplus-Bold',
                  }}
                 >
                    SmartWatch
                 </Text>
              </View>
              <View
              style={{
                width:horizontalScale(20),
                marginTop:10,
              }}
              >
                <Image
                source={require('../assets/BackButtonSetting.png')}
                ></Image>
              </View>
            </Pressable>
            <Pressable
            onPress={() => {
              // props.navigation.navigate('EditCustomDrinkListScreen');
            }}
            style={{
              width:"100%",
              flex:1,
              justifyContent:'center',
              alignItems:'center',
              borderRadius:30,
              flexDirection:'row',
              justifyContent:'space-between',
              alignItems:'flex-start',
              padding:20,
              backgroundColor: '#f9fbfa',
              hadowColor: '#000',
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.8,
              shadowRadius: 2,  
              elevation: 1,
              marginTop:20,
            }}
            >
              <View
              style={{
                flex:1,
                flexDirection:'row',
                justifyContent:'flex-start',
                alignItems:'center',
                gap:5
              }}
              >
                 <View
                 style={{
                  backgroundColor:'gray',
                  width:horizontalScale(40),
                  height:verticalScale(40),
                 }}
                 ></View>
                 <Text
                  style={{
                    color:'#464B51',
                    fontSize:15,
                    fontFamily:'Mplus-Bold',
                  }}
                 >
                    Language
                 </Text>
              </View>
              <View
              style={{
                width:horizontalScale(20),
                marginTop:10,
              }}
              >
                <Image
                source={require('../assets/BackButtonSetting.png')}
                ></Image>
              </View>
            </Pressable>
            <Pressable
            onPress={() => {
              // props.navigation.navigate('EditCustomDrinkListScreen');
            }}
            style={{
              width:"100%",
              flex:1,
              justifyContent:'center',
              alignItems:'center',
              borderRadius:30,
              flexDirection:'row',
              justifyContent:'space-between',
              alignItems:'flex-start',
              padding:20,
              backgroundColor: '#f9fbfa',
              hadowColor: '#000',
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.8,
              shadowRadius: 2,  
              elevation: 1,
              marginTop:20,
            }}
            >
              <View
              style={{
                flex:1,
                flexDirection:'row',
                justifyContent:'flex-start',
                alignItems:'center',
                gap:5
              }}
              >
                 <View
                 style={{
                  backgroundColor:'gray',
                  width:horizontalScale(40),
                  height:verticalScale(40),
                 }}
                 ></View>
                 <Text
                  style={{
                    color:'#464B51',
                    fontSize:15,
                    fontFamily:'Mplus-Bold',
                  }}
                 >
                    Help and Support
                 </Text>
              </View>
              <View
              style={{
                width:horizontalScale(20),
                marginTop:10,
              }}
              >
                <Image
                source={require('../assets/BackButtonSetting.png')}
                ></Image>
              </View>
            </Pressable>
            <Pressable
            onPress={() => {
              // props.navigation.navigate('EditCustomDrinkListScreen');
            }}
            style={{
              width:"100%",
              flex:1,
              justifyContent:'center',
              alignItems:'center',
              borderRadius:30,
              flexDirection:'row',
              justifyContent:'space-between',
              alignItems:'flex-start',
              padding:20,
              backgroundColor: '#f9fbfa',
              hadowColor: '#000',
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.8,
              shadowRadius: 2,  
              elevation: 1,
              marginTop:20,
            }}
            >
              <View
              style={{
                flex:1,
                flexDirection:'row',
                justifyContent:'flex-start',
                alignItems:'center',
                gap:5
              }}
              >
                 <View
                 style={{
                  backgroundColor:'gray',
                  width:horizontalScale(40),
                  height:verticalScale(40),
                 }}
                 ></View>
                 <Text
                  style={{
                    color:'#464B51',
                    fontSize:15,
                    fontFamily:'Mplus-Bold',
                  }}
                 >
                    Hydrate your friends
                 </Text>
              </View>
              <View
              style={{
                width:horizontalScale(20),
                marginTop:10,
              }}
              >
                <Image
                source={require('../assets/BackButtonSetting.png')}
                ></Image>
              </View>
            </Pressable>
            <Pressable
            onPress={() => {
              // props.navigation.navigate('EditCustomDrinkListScreen');
            }}
            style={{
              width:"100%",
              flex:1,
              justifyContent:'center',
              alignItems:'center',
              borderRadius:30,
              flexDirection:'row',
              justifyContent:'space-between',
              alignItems:'flex-start',
              padding:20,
              backgroundColor: '#f9fbfa',
              hadowColor: '#000',
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.8,
              shadowRadius: 2,  
              elevation: 1,
              marginTop:20,
            }}
            >
              <View
              style={{
                flex:1,
                flexDirection:'row',
                justifyContent:'flex-start',
                alignItems:'center',
                gap:5
              }}
              >
                 <View
                 style={{
                  backgroundColor:'gray',
                  width:horizontalScale(40),
                  height:verticalScale(40),
                 }}
                 ></View>
                 <Text
                  style={{
                    color:'#464B51',
                    fontSize:15,
                    fontFamily:'Mplus-Bold',
                  }}
                 >
                    Restore Purchases
                 </Text>
              </View>
              <View
              style={{
                width:horizontalScale(20),
                marginTop:10,
              }}
              >
                <Image
                source={require('../assets/BackButtonSetting.png')}
                ></Image>
              </View>
            </Pressable>
            <Pressable
            onPress={() => {
              // props.navigation.navigate('EditCustomDrinkListScreen');
            }}
            style={{
              width:"100%",
              flex:1,
              justifyContent:'center',
              alignItems:'center',
              borderRadius:30,
              flexDirection:'row',
              justifyContent:'space-between',
              alignItems:'flex-start',
              padding:20,
              backgroundColor: '#f9fbfa',
              hadowColor: '#000',
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.8,
              shadowRadius: 2,  
              elevation: 1,
              marginTop:20,
            }}
            >
              <View
              style={{
                flex:1,
                flexDirection:'row',
                justifyContent:'flex-start',
                alignItems:'center',
                gap:5
              }}
              >
                 <View
                 style={{
                  backgroundColor:'gray',
                  width:horizontalScale(40),
                  height:verticalScale(40),
                 }}
                 ></View>
                 <Text
                  style={{
                    color:'#464B51',
                    fontSize:15,
                    fontFamily:'Mplus-Bold',
                  }}
                 >
                    Term & Privacy
                 </Text>
              </View>
              <View
              style={{
                width:horizontalScale(20),
                marginTop:10,
              }}
              >
                <Image
                source={require('../assets/BackButtonSetting.png')}
                ></Image>
              </View>
            </Pressable>
          </ScrollView>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}
  
export default SettingScreen;
  