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
} from 'react-native';
import { horizontalScale, moderateScale, verticalScale } from '../Utils/ResponsiveDesign';
import { GestureHandlerRootView, ScrollView } from 'react-native-gesture-handler';
import {Calendar, CalendarList, Agenda} from 'react-native-calendars';
  
function CalenderScreen(props) {

    return (
      <GestureHandlerRootView
      style={{
        flex:1
      }}
      >
      <SafeAreaView
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white'
      }}>
        <ScrollView
        showsVerticalScrollIndicator={false}
        style={{
          flex:1,
          width:"80%"
        }}
        >
        <View
        style={{
          flex:1,
          justifyContent: 'space-between',
          alignItems: 'center',
          flexDirection: 'row',
          width:'100%',
          position:'absolute',
          top:0,
        }}
        >
          <Text>
          </Text>
          <Button
          title='Back'
          onPress={() => {
            props.navigation.navigate('HomeScreen');
          }}
          ></Button>
        </View>
        <View
        style={{
          flex:5,
          position:"relative",
          alignItems: 'center',
        }}
        >
           <View
           style={{
            width:'100%',
            height:'auto',
            flex:1,
            justifyContent:'center',
            alignItems:'center'
           }}
           >
             <View
             style={{
              width:verticalScale(200),
              height:verticalScale(200),
              flex:1,
              justifyContent:'center',
              alignItems:'center',
              borderRadius:100,
              transform:[{
                scale:0.8
              }],
              position:'relative'
             }}
             >
               <View
               style={{
                  position:'absolute',
                  width:verticalScale(150),
                  height:verticalScale(150),
                  backgroundColor:'#01bede',
                  borderRadius:60,
                  justifyContent:'center',
                  alignItems:'center',
               }}
               >
              <Text
               style={{
                 fontSize:moderateScale(50),
                 color:'#E8FBFB'
               }}
               >
                1
               </Text>
               <Text
               style={{
                fontSize:moderateScale(15),
                fontFamily:'Arial',
                color:'#B7F4F9'
               }}
               >
                  Day Streak
               </Text>
               </View>
             </View>
           </View>
           <View
           style={{
            width:'100%',
            backgroundColor:'#f9fbfa',
            height:verticalScale(250),
            justifyContent:'center',
            alignItems:'center',
            borderRadius:20,
           }}
           >
            <View
            style={{
              width:'100%',
              height:verticalScale(50),
              justifyContent:'space-evenly',
              alignItems:'center',
              flexDirection:'row',
              backgroundColor:'#f9fbfa',
              borderBottomWidth:1,
              borderBottomColor:'#01bede'
            }}
            >
              <Text>
                Days
              </Text>
              <Text>
                Weeks
              </Text>
              <Text>
                Months
              </Text>
            </View>
            <View
            style={{
              width:'100%',
              height:verticalScale(200),
              justifyContent:'center',
              alignItems:'center',
            }}
            >
              <Text>
                Graph
              </Text>
            </View>
           </View>
           <View
           style={{
            width:'100%',
            height:verticalScale(250),
            alignItems:'center',
            marginTop:verticalScale(20),
            borderRadius:moderateScale(20),
            justifyContent:'center',
           }}
           >
            {/* <Calendar
              onDayPress={day => {
                console.log('selected day', day);
              }}
            /> */}
            <Text>
              ABC
            </Text>
           </View>
           <View
           style={{
            width:'100%',
            height:verticalScale(250),
            justifyContent:'center',
            alignItems:'center',
            marginTop:verticalScale(20)
           }}
           >
            <Text>
              History
            </Text>
           </View>
        </View>
        </ScrollView>
      </SafeAreaView>
      </GestureHandlerRootView>
    );
}
  
export default CalenderScreen;
  