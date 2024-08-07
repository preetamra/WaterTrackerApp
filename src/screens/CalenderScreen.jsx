import React,{
  useEffect,
  useState
} from 'react';
import {
  Button,
  SafeAreaView,
  View,
  Text,
  FlatList
} from 'react-native';
import { GestureHandlerRootView, ScrollView } from 'react-native-gesture-handler';
import * as SQLite from 'expo-sqlite';
import { CartesianChart, Line, Bar } from 'victory-native';
import { FontWeight, LinearGradient, vec } from '@shopify/react-native-skia';
import { BarChart } from 'react-native-gifted-charts';
import { useSQLiteContext } from 'expo-sqlite';
import { useFonts } from 'expo-font';

import Calender from '../Components/Calendar';
import Chart from '../Components/Charts';
import { horizontalScale, moderateScale, verticalScale } from '../Utils/ResponsiveDesign';
import { color, min } from 'd3';

function getWeekArray() {
  // Array of days starting from Sunday
  const days = ["S", "M", "T", "W", "T", "F", "S"];
  
  // Get the current day index (0 for Sunday, 1 for Monday, etc.)
  const today = new Date().getDay();
  
  // Create the week array starting from today
  const weekArray = [];
  
  for (let i = 0; i < days.length; i++) {
    weekArray.push(days[(today + i) % days.length]);
  }
  
  return weekArray;
}

function CalenderScreen(props) {

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

  const db = useSQLiteContext();

  const [streak, setStreak] = useState(0);
  const [data, setData] = useState([]);

  const [month, setMonth] = useState(8);
  const [year, setYear] = useState(2024);

  const [selectedDate, setSelectedDate] = useState(new Date());

  const calculateStreak = (data) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize to start of the day

    let currentStreak = 0;

    // Iterate backwards through the data, starting from today
    for (let i = data.length - 1; i >= 0; i--) {
      const entryDate = new Date(data[i].value);
      entryDate.setHours(0, 0, 0, 0); // Normalize to start of the day

      // If the entry date is today, streak continues
      if (entryDate.getTime() === today.getTime()) {
        currentStreak++;
        today.setDate(today.getDate() - 1); // Move to the previous day
      } else {
        break; // Streak is broken
      }
    }

    return currentStreak;
  };

  useEffect(() => {
     (
      async() => {
        try{
          const db = await SQLite.openDatabaseAsync('databaseName');

          const allRows = await db.getAllAsync('SELECT * FROM test');
          
          const calculatedStreak = calculateStreak(allRows);
          
          setStreak(calculatedStreak);
        }catch(error){
          console.log('Error in CalenderScreen',error);
        }
      }
     )()
  },[]);

  useEffect(() => {
     (
      async() => {
        try{
          let temp = [];

          getWeekArray().forEach((day, index) => {
            temp.push({
              label: day,
              value: Math.floor(Math.random() * 100)
            });
          });

          temp.reverse();
          setData(temp);
        }catch(error){
          console.log('Error in CalenderScreen',error);
        }
      }
     )()
  },[]);

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
          width:"90%"
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
            justifyContent:'center',
            alignItems:'center',
            borderRadius:20,
            padding:moderateScale(20),
            flex:3,
            minHeight:verticalScale(250), 
           }}
           >
            <View
            style={{
              width:'100%',
              height:'auto',
              justifyContent:'space-between',
              alignItems:'center',
              flexDirection:'row',
              backgroundColor:'#f9fbfa',
              borderRadius:20,
              flex:1,
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
              flex:2
            }}
            >
              <View
              style={{
                flex:1,
              }}
              >
                <View
                  style={{
                    flex:1,
                    flexDirection:'row',
                    justifyContent:'space-between',
                  }}
                >
                  <Text>Next</Text>
                  <Text>7 Day</Text>
                  <Text>Prev</Text>
                </View>
                <Chart
                  data={data}
                ></Chart>
              </View>
            </View>
           </View>
           <View
           style={{
            width:'100%',
            height:'auto',
            alignItems:'center',
            marginTop:verticalScale(15),
            borderRadius:moderateScale(20),
            justifyContent:'center',
            flex:2,
           }}
           >
             <Calender
             month={month}
             year={year}
             decreaseCal={() => {
               setMonth(prevState => {
                if(prevState == 1)
                  {
                    setYear(prevState => prevState - 1);
                    return 12
                  }else {
                    return (prevState - 1)
                  }
               })
             }}
             increaseCal={() => {
                setMonth(prevState => {
                  if(prevState == 12)
                  {
                    setYear(prevState => prevState+1)
                    return 1
                  }else{
                    return (prevState + 1)
                  }
                })
             }}
             selectedDate={selectedDate}
             setSelectedDate={setSelectedDate}
             ></Calender>
           </View>
           <View
           style={{
            width:'100%',
            alignItems:'center',
            flex:5,
            marginTop:verticalScale(-40),
           }}
           >
            <Text
            style={{
              fontSize:moderateScale(31),
              fontFamily: "Mplus-Bold",
            }}
            >
              {
                selectedDate.toDateString()
              }
            </Text>
            <Text
            style={{
              fontSize:moderateScale(20),
              fontFamily: "Mplus-Bold",
              color:'#3CB4C6'
            }}
            >
              627 ml
            </Text>
            <Text
            style={{
              fontSize:moderateScale(15),
              fontFamily: "Mplus-Bold",
              color:'#9a9b9f'
            }}
            >
              Hydration ○ 29% of your goal
            </Text>
            <Text
            style={{
              fontSize:moderateScale(15),
              fontFamily: "Mplus-Bold",
              color:'#3CB4C6'
            }}
            >
              660ml consumed in total
            </Text>
           </View>
           <FlatList
           data={[{
            key: '1',
            title: 'Water',
            value: '627 ml',
            time: '8:00 AM'
           }]}
           keyExtractor={item => item.key}
           renderItem={({item}) => (
            <View
            style={{
              width:'100%',
              height:'100%',
              justifyContent:'space-between',
              alignItems:'center',
              flexDirection:'row',
              backgroundColor:'#f9fbfa',
              borderRadius:moderateScale(20),
              padding:moderateScale(20),
              marginTop:verticalScale(15),
              flex:1
            }}
            >
              <View
              style={{
                flex:1
              }}
              >
                <Text>
                  Icon
                </Text>
              </View>
              <View
              style={{
                flex:1
              }}
              >
                <Text>{item.title}</Text>
                <Text>{item.value}</Text>
              </View>
              <View
              style={{
                flex:2,
                justifyContent:'flex-end',
                alignItems:'flex-end',
              }}
              >
                <Text>
                {item.time}
                </Text>
              </View>
            </View>
           )}
           ></FlatList>
        </View>
        </ScrollView>
      </SafeAreaView>
      </GestureHandlerRootView>
    );
}
  
export default CalenderScreen;
  