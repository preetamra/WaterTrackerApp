import React,{
  useEffect,
  useState
} from 'react';
import {
  Button,
  SafeAreaView,
  View,
  Text,
  FlatList,
  Pressable,
  Image
} from 'react-native';
import { GestureHandlerRootView, ScrollView } from 'react-native-gesture-handler';
import * as SQLite from 'expo-sqlite';
import { CartesianChart, Line, Bar } from 'victory-native';
import { FontWeight, LinearGradient, size, vec } from '@shopify/react-native-skia';
import { BarChart } from 'react-native-gifted-charts';
import { useSQLiteContext } from 'expo-sqlite';
import { useFonts } from 'expo-font';
import {
  useDispatch
} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Calender from '../Components/Calendar';
import Chart from '../Components/Charts';
import { horizontalScale, moderateScale, verticalScale } from '../Utils/ResponsiveDesign';
import { categoryActions } from '../store/categoriesSlice.js';

function toPercentageArray(arr) {
  const total = arr.reduce((sum, num) => sum + num, 0);
  
  if (total === 0) {
      return arr.map((_, index) => index === 0 ? 100 : 0);
  }
  
  return arr.map(num => (num / total) * 100);
}

function getPreviousSixMonthsDates() {
  const datesArray = [];
  const today = new Date();

  for (let i = 0; i < 6; i++) {
    const start = new Date(today.getFullYear(), today.getMonth() - i, 1);
    const end = new Date(today.getFullYear(), today.getMonth() - i + 1, 0);

    datesArray.unshift({
      start: start,
      end: end
    });
  }

  return datesArray;
}

function getWeekArray(type) {
  // console.log('Type',type);
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  if(type == 'Days')
  {
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
  }else if(type == 'Weeks')
  {
    const weeks = ["W1", "W2", "W3", "W4"];
    const currentDate = new Date();
    const weekArray = [];
    for (let i = 0; i < 4; i++) {
      let currDate = currentDate.getDate();
      let tempText = '';
      tempText = months[currentDate.getMonth()];
      currentDate.setDate(currentDate.getDate() - 6);
      tempText += (currentDate.getDate()+"-"+currDate);
      weekArray.push(tempText);
    }
    return weekArray;
  }else if(type == 'Months')
    {
      const currentDate = new Date();
      const Localmonths = [];
      for (let i=0; i<6; i++)
      {
        let tempText = '';
        tempText = months[currentDate.getMonth()];
        currentDate.setMonth(currentDate.getMonth()-1);

        Localmonths.push(tempText);
      }
      return Localmonths;
    }
}

function CalenderScreen(props) {

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

  const db = useSQLiteContext();

  const [streak, setStreak] = useState(0);
  const [data, setData] = useState([]);

  const [type, setType] = useState('Days');

  const [month, setMonth] = useState(8);
  const [year, setYear] = useState(2024);

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedDateData,setSelectedDateData] = useState([]);

  useEffect(() => {
     (
      async() => {
        try{
          let temp = [];

          if(type == 'Days')
          {
            const startDate = new Date();
            startDate.setDate(startDate.getDate() - 6); // Set start of today

            const endDate = new Date();

            // console.log('Start Date',startDate);
            // console.log('End Date',endDate);

            const value = await db.getAllAsync('SELECT * FROM Transactions WHERE dateTime BETWEEN ? AND ?', [startDate.toISOString(), endDate.toISOString()]);

            // console.log('Value',value);

            const valuesArray = [0,0,0,0,0,0,0];

            let tempObj = {};

            value.forEach((item) => {
              let date = new Date(item.dateTime).toISOString().split('T')[0];              
              tempObj[date] = tempObj[date] ? tempObj[date] + item.size : item.size;
            });

            // console.log('TempObj',tempObj);

            for (const [key, value] of Object.entries(tempObj)) {
              // console.log(`${key}: ${value}`);
              let date = new Date();
              let compareDate = new Date(key);
              for(let i=0; i<7; i++)
              {
                 date.setDate(date.getDate() - i);
                //  console.log('Date',date.toISOString().split('T')[0]);
                if(date.toISOString().split('T')[0] == compareDate.toISOString().split('T')[0])
                {
                  valuesArray[i] = value;
                }
              }
            }

            // console.log('Values Array',valuesArray);

            let outputArray = toPercentageArray(valuesArray);
            getWeekArray(type).forEach((day,index) => {
              temp.push({
                label: day,
                value: Math.floor(outputArray[index]),
                size: valuesArray[index]
              });
            });
          }else if(type == 'Weeks')
          {
            let from = new Date();
            let value = [0,0,0,0];
            for(let i=1; i<5; i++)
            {
              let to = new Date();
              to.setDate(from.getDate() - 6);
              const valueDB = await db.getAllAsync('SELECT * FROM Transactions WHERE dateTime BETWEEN ? AND ?', [to.toISOString(), from.toISOString()]);
              let count = valueDB.reduce((acc,item) => {
                acc += item.size;
                return acc;
              },0);
              value[i-1] = count;
              from = to;
            }
            // console.log('Value',value);

            let outputArray = toPercentageArray(value);

            // console.log('Output Array',outputArray);
            getWeekArray(type).forEach((day,index) => {
              temp.push({
                label: day,
                value: Math.floor(outputArray[index]),
                size: value[index]
              });
            });
          }else if(type == 'Months')
          {
            let from = new Date();
            let value = [0,0,0,0,0,0];

            let datesObjArr = getPreviousSixMonthsDates();

            // console.log(datesObjArr);

            for(let i=0; i<datesObjArr.length; i++)
            {
              // console.log("------ START ------");
              // console.log('Dates',datesObjArr[i]);
              let valuesDB = await db.getAllAsync('SELECT * FROM Transactions WHERE dateTime BETWEEN ? AND ?', [datesObjArr[i].start.toISOString(), datesObjArr[i].end.toISOString()]);
              // console.log('Values DB',valuesDB);
              let count = valuesDB.reduce((acc,curr) => {
                acc += curr.size;
                return acc
              },0);
              // console.log("Count :- ",count);
              // console.log("i :- ",i);
              value[i] = count;
              // console.log("------ END ------");
            }

            // console.log('Value Month',value);
            
            value.reverse();

            let outputArray = toPercentageArray(value);

            // console.log('Output Array',outputArray);
            getWeekArray(type).forEach((day,index) => {
              temp.push({
                label: day,
                value: Math.floor(outputArray[index]),
                size: value[index]
              });
            });
          }

          temp.reverse();
          setData(temp);
        }catch(error){
          console.log('Error in CalenderScreen',error);
        }
      }
     )()
  },[type]);

  const getDataTransactions = async () => {
    try {
      const startDate = new Date();
      startDate.setHours(0, 0, 0, 0); // Set start of today

      const endDate = new Date();
      endDate.setHours(23, 59, 59, 999); // Set end of today

      const value = await db.getAllAsync('SELECT * FROM Transactions WHERE dateTime BETWEEN ? AND ?', [startDate.toISOString(), endDate.toISOString()]);

      dispatch(categoryActions.todaysTransactions(value));
    } catch (e) {
      console.error(e);
    }
  }

  useEffect(() => {
    (
      async() => {
        try{
          await getDataTransactions();

          let item = await AsyncStorage.getItem("STREAKDATA");
          // console.log('Item',item);
          if(item != null)
          {
            setStreak(parseInt(item));
          }else{
            setStreak(1);
          }
        }catch(error){
          console.log('Error in CalenderScreen',error);
        }
      }
    )()
  },[]);

  useEffect(() => {
    // console.log("Selected Date :- ",selectedDate);
    const selectedDateLocalStart = new Date(selectedDate);
    const selectedDateLocalEnd = new Date(selectedDate);
    selectedDateLocalStart.setHours(0,0,0,0);
    selectedDateLocalEnd.setHours(23,59,59,59);
    // console.log("selectedDateLocalStart :- ",selectedDateLocalStart);
    // console.log("selectedDateLocalEnd :- ",selectedDateLocalEnd);
    (
      async() => {
        try{
          const valueDB = await db.getAllAsync('SELECT * FROM Transactions WHERE dateTime BETWEEN ? AND ?',[selectedDateLocalStart.toISOString(),selectedDateLocalEnd.toISOString()]);
          //Dont touch this code editing this is a nightmare
          const objData = valueDB.map((val,index) => {
            console.log('Val',val);
            return{
              key:index,
              title:val.category_id,
              value:val.size,
              time:new Date(val.dateTime).toLocaleTimeString()
            }
          })

          //Dont touch this code editing this is a nightmare
          console.log("ObjData :- ",objData);

          (
            async() => {
              try{
                 for(let i=0; i<objData.length; i++)
                 {
                  let item = await db.getAllAsync('SELECT * FROM Categories WHERE id = ?',[objData[i].title]);
                  let tempTime = objData[i].time;
                  let formattedTime = tempTime.slice(0, -6) + tempTime.slice(-3);
                  objData[i].time = formattedTime;
                  objData[i].title = item[0].name;
                 }

                 console.log("ObjData :- ",objData);

                 setSelectedDateData(objData);
              }catch(e)
              {
                console.log(e);
              }
            }
          )()

          // console.log("Mapped DB :- ",mapedData);

          // setSelectedDateData(mapedData);
          
        }catch(e)
        {
          console.log(e);
        }
      }
    )()
  },[selectedDate]);

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
                {
                  streak
                }
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
              <Pressable
              onPress={() => {
                setType('Days');
              }}
              style={
                [
                  {
                    backgroundColor:'#EFF1F2',
                    padding:moderateScale(10),
                    borderRadius:moderateScale(20),
                  },
                  type == 'Days' ? {
                    backgroundColor:'#253241',
                  } : {}
                ]}
              >
                <Text
                style={{
                  color:'#CAD4DC',
                  fontSize:moderateScale(16.5),
                  fontFamily: "Mplus-Bold",
                }}
                >Days</Text>
              </Pressable>
              <Pressable
              onPress={() => {
                setType('Weeks');
              }}
              style={
                [
                  {
                    backgroundColor:'#EFF1F2',
                    padding:moderateScale(10),
                    borderRadius:moderateScale(20),
                  },
                  type == 'Weeks' ? {
                    backgroundColor:'#253241',
                  } : {}
                ]}
              >
                <Text
                style={{
                  color:'#CAD4DC',
                  fontSize:moderateScale(16.5),
                  fontFamily: "Mplus-Bold",
                }}
                >Weeks</Text>
              </Pressable>
              <Pressable
              onPress={() => {
                setType('Months');
              }}
              style={
                [
                  {
                    backgroundColor:'#EFF1F2',
                    padding:moderateScale(10),
                    borderRadius:moderateScale(20),
                  },
                  type == 'Months' ? {
                    backgroundColor:'#253241',
                  } : {}
                ]}
              >
                <Text
                style={{
                  color:'#CAD4DC',
                  fontSize:moderateScale(16.5),
                  fontFamily: "Mplus-Bold",
                }}
                >Months</Text>
              </Pressable>
              <Pressable
              onPress={() => {
                console.log('Weeks');
              }}
              style={{
                backgroundColor:'#253241',
                padding:moderateScale(10),
                borderRadius:moderateScale(20),
              }}
              >
                      <Image
                        source={require('../assets/AddWaterPlus.png')}
                        style={{
                        }}
                      ></Image>
              </Pressable>
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
                    marginTop:verticalScale(24),
                  }}
                >
                  <Text>Next</Text>
                  <Text
                  style={{
                    color:'#495057',
                    fontSize:moderateScale(22),
                    fontFamily: "Mplus-Bold",
                  }}
                  >
                    {type == 'Days' ? 'Last 7 Days' : type == 'Weeks' ? 'Last 4 Weeks' : 'Last 6 Months'}
                  </Text>
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
              {
                selectedDateData.reduce((acc,curr) => {
                  acc += curr.value;
                  return acc;
                },0)+ 'ml'
              }
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
           </View>
           <FlatList
           data={selectedDateData}
           keyExtractor={item => item.key}
           ListEmptyComponent={() => (
              <View
              style={{
                width:verticalScale(200),
                height:horizontalScale(200),
                justifyContent:'center',
                alignItems:'center',
              }}
              >
                <Text>
                  No Data Found
                </Text>
              </View>
           )}
           renderItem={({item}) => (
            <View
            style={{
              width:'100%',
              height:'100%',
              justifyContent:'space-between',
              alignItems:'center',
              flexDirection:'row',
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
                <Image
                source={require('../assets/CalenderScreenDrinkIcons/Almond Milk.png')}
                style={{
                  width:moderateScale(40),
                  height:moderateScale(40)
                }}
                ></Image>
              </View>
              <View
              style={{
                flex:2
              }}
              >
                <Text
                style={{
                  fontSize:moderateScale(16),
                  fontFamily: "Mplus-Bold",
                  color:'#35BDCF'
                }}
                >
                  {item.title.charAt(0).toUpperCase() + item.title.slice(1).toLowerCase()}
                </Text>
                <Text
                style={{
                  color:'#4C5157',
                  fontFamily: "Mplus-Bold",
                  fontSize:moderateScale(12),
                }}
                >{item.value}</Text>
              </View>
              <View
              style={{
                flex:1.5,
                justifyContent:'flex-end',
                alignItems:'flex-end',
              }}
              >
                <Text
                style={{
                  color:'#AEAEB1',
                  fontSize:moderateScale(12),
                  fontFamily: "Mplus-Bold"
                }}
                >
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
  