import React from 'react';
import { View, StyleSheet, Text, Image, Pressable } from 'react-native';
import { horizontalScale, moderateScale, verticalScale } from '../Utils/ResponsiveDesign';
import { color } from 'd3';
import { FontWeight } from '@shopify/react-native-skia';
import { useFonts } from 'expo-font';

const App = ({ month, year, increaseCal, decreaseCal, selectedDate, setSelectedDate }) => {
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

  const generateCalendar = (month, year) => {
    const daysInMonth = new Date(year, month, 0).getDate();
    const startDay = new Date(year, month - 1, 1).getDay();
    const weeks = [];
    let week = [];
    
    // Fill initial empty cells before the start of the month
    for (let i = 0; i < startDay; i++) {
      week.push('');
    }

    // Fill the days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      week.push(day);
      if (week.length === 7) {
        weeks.push(week);
        week = [];
      }
    }

    // Fill the remaining empty cells after the end of the month
    while (week.length < 7) {
      week.push('');
    }
    weeks.push(week);

    return weeks;
  };

  const getMonthName = (month) => {
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June', 
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return monthNames[month - 1];
  };

  const weeks = generateCalendar(month, year);

  return (
    <View style={styles.container}>
      <View style={styles.navigation}>
        <Pressable
          onPress={() => {
            decreaseCal();
          }}
          style={{
            backgroundColor: "#e5f9fa",
            borderRadius: 25,
            width: verticalScale(40),
            height: horizontalScale(40),
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <Image
            source={require("../assets/leftArrow.png")}
            style={{
              width: "100%",
              height: "70%",
              resizeMode: "center"
            }}
          />
        </Pressable>
        <Text
          style={{
            color: '#3A414C',
            fontSize: moderateScale(31),
            fontFamily: "Mplus-Bold"
          }}
        >
          {getMonthName(month)}
        </Text>
        <Pressable
          onPress={() => {
            increaseCal();
          }}
          style={{
            backgroundColor: "#e5f9fa",
            borderRadius: 25,
            width: verticalScale(40),
            height: horizontalScale(40),
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <Image
            source={require("../assets/rightArrow.png")}
            style={{
              width: "100%",
              height: "70%",
              resizeMode: "center"
            }}
          />
        </Pressable>
      </View>
      <View style={styles.weekDays}>
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
          <Text key={index} style={styles.weekText}>{day}</Text>
        ))}
      </View>
      {weeks.map((week, index) => (
        <View key={index} style={styles.week}>
          {week.map((day, index) => {
            if (day) {
              const currentDate = new Date();
              const currentDay = currentDate.getDate();
              const currentMonth = currentDate.getMonth() + 1;
              const currentYear = currentDate.getFullYear();
              const isCurrentDate = day === currentDay && month === currentMonth && year === currentYear;
              const isPastDate = new Date(year, month - 1, day) < currentDate;

              // selectedDate.setDate(selectedDate.getDate() - 1);

              const isSelected = day === selectedDate.getDate() && month === selectedDate.getMonth() + 1 && year === selectedDate.getFullYear();

              console.log('Day:', day);
              console.log('Month:', month);
              console.log('Year:', year);
              console.log('Selected Date:', selectedDate);
              console.log("isDayEqual", day === selectedDate.getDate());
              console.log("isMonthEqual", month === selectedDate.getMonth() + 1);
              console.log("isYearEqual", year === selectedDate.getFullYear());
              console.log("isSelected", isSelected);

              if(isPastDate)
              {
                return (
                  <Text
                    onPress={() => {
                      console.log('Day:', day);
                      console.log('Month:', month);
                      console.log('Year:', year);
                      console.log('Selected Date:', selectedDate);

                      let newDate = new Date(year, month - 1, day);
                      // newDate.setDate(newDate.getDate() + 1);
                      setSelectedDate(newDate);
                    }}
                    key={index}
                    style={[
                      styles.day,
                      isPastDate && {
                        borderRadius:25
                      },
                      isSelected && {
                        backgroundColor:'#4E545C',
                        borderRadius:28.5,
                        color:'#DBE0E7'
                      },
                    ]}
                  >
                    {
                      day
                    }
                  </Text>
                );
              }else{
                return (
                  <Text
                    key={index}
                    style={[
                      styles.day,
                      {
                        color:'#C8C8C8'
                      }
                    ]}
                  >
                    {
                      day
                    }
                  </Text>
                );
              }
            }
            return (
              <Text key={index} style={styles.day}>{day}</Text>
            );
          })}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    marginBottom: verticalScale(20),
    marginTop: verticalScale(20),
    width: '100%',
    height: '100%',
  },
  navigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  weekDays: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  week: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  weekText:{
    flex: 1,
    textAlign: 'center',
    color:'#3CB4C6',
    fontSize:18.5,
    fontWeight:'bold'   
  },
  day: {
    flex: 1,
    textAlign: 'center',
    padding:horizontalScale(10),
    fontSize:moderateScale(15.5),
    fontFamily:'Mplus-ExtraBold',
  },
});

export default App;
