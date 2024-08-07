import React,{
    useEffect,
    useState,
    useRef,
    useCallback
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
    Switch,
    Pressable,
    ScrollView
} from 'react-native';
import Slider from '@react-native-community/slider';
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetModalProvider,
  BottomSheetTextInput
} from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import DateTimePicker from '@react-native-community/datetimepicker';
import ScrollPicker from "react-native-wheel-scrollview-picker";
import Haptics from 'expo-haptics';
import GridLayout from "@ogzhnaydn/react-native-grid-layout";
import { TimerPickerModal } from 'react-native-timer-picker';
import { LinearGradient } from 'react-native-svg';
import * as BackgroundFetch from 'expo-background-fetch';
import * as TaskManager from 'expo-task-manager';

import { scheduleAllNotification, cancellAllNotification, scheduleNotificationAtTime } from '../Utils/NotificationSchedule';
import { horizontalScale, moderateScale, verticalScale } from '../Utils/ResponsiveDesign';
import convertTo12Hour from '../Utils/TimeUtills';

const BACKGROUND_FETCH_TASK = 'background-fetch';

console.log("Registering background fetch task",new Date().toLocaleString());

TaskManager.defineTask(BACKGROUND_FETCH_TASK, async () => {
  const now = Date.now();

  console.log(`Got background fetch call at date: ${new Date(now).toISOString()}`);

  // Be sure to return the successful result type!
  return BackgroundFetch.BackgroundFetchResult.NewData;
});

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

async function schedulePushNotification(remaining) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "You've got mail! 📬",
      body: 'Water target remaining: ' + remaining + ' ml',
      data: { data: 'goes here', test: { test1: 'more data' } },
    },
    trigger: { seconds: 2 },
  });
}

async function unregisterBackgroundFetchAsync() {
  try{
    return BackgroundFetch.unregisterTaskAsync(BACKGROUND_FETCH_TASK);
  }catch(e){
    console.log(e);
  }
}

const Item = (props) => {
  return <View style={
    [
      styles.item,
      props.isEnabled && {
        backgroundColor: '#EFFDFE',
      }
    ]
    }>
    <Text
    style={[
      props.isEnabled ?
      {
        color:'#495056',
        fontSize:moderateScale(20),
      }:
      {
        color:'#BCC8CC',
        fontSize:moderateScale(20),
      }
    ]}
    >
      {
        props.time
      }
    </Text>
    <Switch
    value={props.isEnabled}
    onValueChange={(value) => {
      if(value)
      {
        props.onEnable();
      }else{
        props.onDisable();
      }
    }}
    ></Switch>
  </View>;
};

function RemainderScreen(props) {
  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = (value) => {
    setIsEnabled(previousState => !previousState);
    if(value)
    {
      console.log("Value :- ",value);
      scheduleAllNotification(sliderValue,sliderMinValue*5,alarmString1?.split(":")[0],alarmString1?.split(":")[1]);
    }else{
      console.log("Value :- ",value);
      cancellAllNotification();
    }
    const storeData = async (value) => {
      try {
        await AsyncStorage.setItem('remainderValue', value+"");
      } catch (e) {
        // saving error
        console.log(e);
      }
    };

    storeData(value);
  };

  const [sliderValue, setSliderValue] = useState(1);
  const onSliderValueChange = (value) => {
    setSliderValue(value);

    const storeData = async (value) => {
      try {
        await AsyncStorage.setItem('hoursValue', value+"");
      } catch (e) {
        // saving error
        console.log(e);
      }
    };

    storeData(value);
  }

  const [sliderMinValue, setSliderMinValue] = useState(1);
  const onSliderMinValueChange = (value) => {
    setSliderMinValue(value);

    const storeData = async (value) => {
      try {
        await AsyncStorage.setItem('minssValue', value+"");
      } catch (e) {
        // saving error
        console.log(e);
      }
    };

    storeData(value);
  }

  const [customTimer, setCustomTimer] = useState([]);

  const [selectedTab, setSelectedTab] = useState(0);
  const [bottomSheetBackDrop, setBottomSheetBackDrop] = useState(false);

  const bottomSheetModalFromTimeRef = useRef(null);
  const bottomSheetModalToTimeRef = useRef(null);

  const snapPoints = React.useMemo(() => ['25%', '50%'], []);
  const [date, setDate] = useState(new Date(1598051730000));

  const [alarmString, setAlarmString] = useState(null);
  const [showPicker, setShowPicker] = useState(false);

  const [alarmString1, setAlarmString1] = useState(null);
  const [showPicker1, setShowPicker1] = useState(false);

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

  const formatTime = ({
    hours,
    minutes,
    seconds,
  }) => {
    const timeParts = [];

    if (hours !== undefined) {
        timeParts.push(hours.toString().padStart(2, "0"));
    }
    if (minutes !== undefined) {
        timeParts.push(minutes.toString().padStart(2, "0"));
    }
    if (seconds !== undefined) {
        timeParts.push(seconds.toString().padStart(2, "0"));
    }

    return timeParts.join(":");
  };

  useEffect(() => {
    const getData = async () => {
      try {
        const value = await AsyncStorage.getItem('remainderValue');
        if (value !== null) {
          if(value == "true")
          {
            setIsEnabled(true);
          }else{
            setIsEnabled(false);
          }
        }
      } catch (e) {
        console.log(e);
      }
    };

    getData();

    const getFromTime = async () => {
      try {
        const value = await AsyncStorage.getItem('fromTime');
        if (value !== null) {
          setAlarmString(value);
        }
      } catch (e) {
        console.log(e);
      }
    }

    getFromTime();

    const getToTime = async () => {
      try {
        const value = await AsyncStorage.getItem('toTime');
        if (value !== null) {
          setAlarmString1(value);
        }
      } catch (e) {
        console.log(e);
      }
    }

    getToTime();

    const getHoursValue = async () => {
      try {
        const value = await AsyncStorage.getItem('hoursValue');
        if (value !== null) {
          setSliderValue(parseInt(value));
        }
      } catch (e) {
        console.log(e);
      }
    }

    getHoursValue();

    const getMinsValue = async () => {
      try {
        const value = await AsyncStorage.getItem('minssValue');
        if (value !== null) {
          setSliderMinValue(parseInt(value));
        }
      } catch (e) {
        console.log(e);
      }
    }

    getMinsValue();
  },[]);

  useEffect(() => {
    const getCustomTimer = async () => {
      try {
        const value = await AsyncStorage.getItem('customTimerValue');
        if (value !== null) {
          setCustomTimer(JSON.parse(value));
        }else{
          const storeData = async (value) => {
            try {
              let customTimers = [
                {
                  time: "8:00 AM",
                  isEnabled: false,
                  id:""
                },
                {
                  time: "8:30 AM",
                  isEnabled: false,
                  id:""
                },
                {
                  time: "9:00 AM",
                  isEnabled: false,
                  id:""
                },
                {
                  time: "9:30 AM",
                  isEnabled: false,
                  id:""
                },
                {
                  time: "10:00 AM",
                  isEnabled: false,
                  id:""
                },
                {
                  time: "10:30 AM",
                  isEnabled: false,
                  id:""
                },
                {
                  time: "11:00 AM",
                  isEnabled: false,
                  id:""
                },
                {
                  time: "11:30 AM",
                  isEnabled: false,
                  id:""
                },
                {
                  time: "12:00 PM",
                  isEnabled: false,
                  id:""
                },
                {
                  time: "12:30 PM",
                  isEnabled: false,
                  id:""
                },
                {
                  time: "1:00 PM",
                  isEnabled: false,
                  id:""
                },
                {
                  time: "1:30 PM",
                  isEnabled: false,
                  id:""
                },
                {
                  time: "2:00 PM",
                  isEnabled: false,
                  id:""
                },
                {
                  time: "2:30 PM",
                  isEnabled: false,
                  id:""
                },
                {
                  time: "3:00 PM",
                  isEnabled: false,
                  id:""
                },
                {
                  time: "3:30 PM",
                  isEnabled: false,
                  id:""
                },
                {
                  time: "4:00 PM",
                  isEnabled: false,
                  id:""
                },
                {
                  time: "4:30 PM",
                  isEnabled: false,
                  id:""
                },
                {
                  time: "5:00 PM",
                  isEnabled: false,
                  id:""
                },
                {
                  time: "5:30 PM",
                  isEnabled: false,
                  id:""
                },
                {
                  time: "6:00 PM",
                  isEnabled: false,
                  id:""
                },
                { 
                  time: "6:30 PM",
                  isEnabled: false,
                  id:""
                },
                {
                  time: "7:00 PM",
                  isEnabled: false,
                  id:""
                },
                {
                  time: "7:30 PM",
                  isEnabled: false,
                  id:""
                },
                {
                  time: "8:00 PM",
                  isEnabled: false,
                  id:""
                }
              ]

              await AsyncStorage.setItem('customTimerValue', JSON.stringify(customTimers));
              setCustomTimer(customTimers);
            } catch (e) {
              console.log(e);
            }
          };

          storeData(customTimer);
        }
      } catch (e) {
        console.log(e);
      }
    }

    getCustomTimer();    
  },[])

  const [isRegistered, setIsRegistered] = React.useState(false);
  const [status, setStatus] = React.useState(null);

  React.useEffect(() => {
    checkStatusAsync();
  }, []);

  const checkStatusAsync = async () => {
    try{
      const status = await BackgroundFetch.getStatusAsync();
      const isRegistered = await TaskManager.isTaskRegisteredAsync(BACKGROUND_FETCH_TASK);
  
      console.log('BackgroundFetch status:', status);
      console.log('TaskManager status:', isRegistered);

      setStatus(status);
      setIsRegistered(isRegistered);
    }catch(e){
      console.log(e);
    }
  };

    return (
      <GestureHandlerRootView
      style={{
        flex:1,
      }}
      >
    <BottomSheetModalProvider>
      <ScrollView
      style={{
        flex: 1,
        height: '100%',
        backgroundColor: 'white'
      }}>
        {
          bottomSheetBackDrop && (
            <View style={{
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
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        marginTop: verticalScale(30),
      }}>
        <View
        style={{
          flex:1,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          width:"100%",
          marginBottom: verticalScale(20),
        }}
        >
          <Pressable
          onPress={() => {
            props.navigation.goBack();
          }}
          style={{
            marginLeft: horizontalScale(20),
          }}
          >
          <Image
          source={
            require('../assets/BackButton.png')
          }
          style={{
            width: horizontalScale(40),
            height: verticalScale(40),
          }}
          ></Image>
          </Pressable>
          <Text></Text>
        </View>
        <View
        style={{
          flex:1,
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          width:"90%",
          backgroundColor: '#f9fbfa',
          borderRadius: moderateScale(20),
          height: verticalScale(100),
          marginBottom: verticalScale(20),
        }}
        >
          <View
          style={{
            flex: 2,
            justifyContent: 'flex-start',
            alignItems: 'center',
            marginRight: horizontalScale(60),
          }}
          >
            <Text
            style={{
              fontSize: moderateScale(25),
              fontWeight: '500',
              fontFamily: 'Inter'
            }}
            >
              Remainder
            </Text>
          </View>
          <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: horizontalScale(20),
            flexDirection: 'row',
            justifyContent: 'space-evenly',
            alignItems: 'center',
          }}
          >
            <Text
            style={{
              fontSize: moderateScale(17.5),
              color: isEnabled ? '#45B8C2' : 'gray',
              fontFamily: 'Inter',
              fontWeight: '500',
            }}
            >
              {
                isEnabled ? "On" : "Off"
              }
            </Text>
            <Switch
        trackColor={{false: '#f9fbfa', true: '#00bed8'}}
        thumbColor={isEnabled ? 'white' : '#f4f3f4'}
        ios_backgroundColor="#f9fbfa"
        onValueChange={toggleSwitch}
        value={isEnabled}
      />
          </View>
        </View>
        <View
        style={{
          height: "auto",
          justifyContent: 'center',
          alignItems: 'center',
          width: '90%',
        }}
        >
        {
        isEnabled &&
        (
          <View
          style={{
            flex: 1,
            height: verticalScale(100),
          }}
          >
          <View
           style={
            [
              {
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                width:"100%",
                backgroundColor: '#f9fbfa',
                borderRadius: moderateScale(10),
                gap: 0,
               },
            ]
          }
          >
             <Pressable
             style={
              [
                {
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: "100%",
                  width: "100%",
                  borderTopEndRadius: 20,
                  borderTopStartRadius: 20,
                  backgroundColor:"#F8FAF9"
                },
                selectedTab === 0 && {
                  backgroundColor: '#03BED9',
                }
              ]}
              onPress={() => {
                setSelectedTab(0);
              }}
             >
              {
                selectedTab === 0 && (
                  <Image
                  source={require('../assets/RemainderScreenCheckActive.png')}
                  style={{
                    width: horizontalScale(30),
                    height: verticalScale(30),
                  }}
                ></Image>
                )
              }
              {
                selectedTab !== 0 && (
                  <Image
                  source={require('../assets/RemainderScreenCheckInActive.png')}
                  style={{
                    width: horizontalScale(30),
                    height: verticalScale(30),
                  }}
                ></Image>                  
                )
              }
                <Text
                style={[
                  {
                    color: '#D6D7D8',
                    fontSize:moderateScale(15),
                    fontWeight: 'bold',
                    marginTop: verticalScale(5),
                  },
                  selectedTab === 0 && {
                    color: '#A8F7FB',
                  }
                ]}
                >
                  Smart Remainder
                </Text>
             </Pressable>
             <Pressable
             style={
              [
                {
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginLeft: horizontalScale(10),
                  height: "100%",
                  width: "100%",
                  borderTopEndRadius: 20,
                  borderTopStartRadius: 20,
                  backgroundColor:"#F8FAF9"
                },
                selectedTab === 1 && {
                  backgroundColor: '#03BED9',
                }
              ]}
              onPress={() => {
                setSelectedTab(1);
              }}
             >
              {
                selectedTab === 1 && (
                  <Image
                  source={require('../assets/RemainderScreenCheckActive.png')}
                  style={{
                    width: horizontalScale(30),
                    height: verticalScale(30),
                  }}
                ></Image>
                )
              }
              {
                selectedTab !== 1 && (
                  <Image
                  source={require('../assets/RemainderScreenCheckInActive.png')}
                  style={{
                    width: horizontalScale(30),
                    height: verticalScale(30),
                  }}
                ></Image>                  
                )
              }
                <Text
                style={[
                  {
                    color: '#D6D7D8',
                    fontSize:moderateScale(15),
                    fontWeight: 'bold',
                    marginTop: verticalScale(5),
                  },
                  selectedTab === 1 && {
                    color: '#A8F7FB',
                  }
                ]}
                >
                  Custom Remainder
                </Text>
             </Pressable>
          </View>
          </View>
        )
      }
      {
        isEnabled &&
        (
          <View
          style={{
            width: '100%',
            height: 'auto',
            borderTopWidth: verticalScale(5),
            borderColor: "#00bed8",
          }}
          >
            <View
            style={
              {
                height:verticalScale(40),
                backgroundColor:"#e0f8fc"
              }
            }
            >
            </View>
            {
              selectedTab === 0 && (
                <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: '100%',
                  backgroundColor: '#e0f8fc',
                  borderBottomLeftRadius: 20,
                  borderBottomRightRadius: 20,
                  marginBottom: verticalScale(20)
                }}
                >
                  <Text
                  style={{
                    fontSize:moderateScale(18.5),
                    color: '#36494F',
                    fontFamily: 'Inter',
                    fontWeight: 'bold',
                  }}
                  >
                    Notification Interval
                  </Text>
                  <View
                  style={{
                    width: '100%',
                    justifyContent: 'center',
                    alignItems: 'center',
                    paddingHorizontal: horizontalScale(20),
                    marginTop: verticalScale(20),
                    position:"relative"
                  }}
                  >
                  <Text
                    style={{
                      fontSize:moderateScale(21),
                      color: '#3FBDC5',
                      fontWeight: 'bold',
                    }}
                  >
                {
            sliderValue
          } Hrs
                  </Text>
                <Slider
                  style={{
            width: "100%", 
          }}
          minimumValue={0}
          maximumValue={4}
          step={1}
          value={sliderValue}
          onValueChange={onSliderValueChange}
          minimumTrackTintColor="#b4e6ee"
          maximumTrackTintColor="#b4e6ee"
                />
                <View
        style={{
          width: '100%',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: verticalScale(10),
          height: verticalScale(5),
          position: 'absolute',
          top: verticalScale(30),
          flexDirection: 'row',
          zIndex: -1,
          paddingHorizontal: horizontalScale(15),
        }}
        >
          <View
          style={{
            width: '1%',
            height: verticalScale(10),
            backgroundColor: '#03BED9',
          }}
          >
          </View>
          <View
          style={{
            width: '1%',
            height: verticalScale(10),
            backgroundColor: '#03BED9',
          }}
          >
          </View>
          <View
          style={{
            width: '1%',
            height: verticalScale(10),
            backgroundColor: '#03BED9',
          }}
          >
          </View>
          <View
          style={{
            width: '1%',
            height: verticalScale(10),
            backgroundColor: '#03BED9',
          }}
          >
          </View>
          <View
          style={{
            width: '1%',
            height: verticalScale(10),
            backgroundColor: '#03BED9',
          }}
          >
          </View>
                </View>
                  </View>
                  <View
                  style={{
                    width: '100%',
                    justifyContent: 'center',
                    alignItems: 'center',
                    paddingHorizontal: horizontalScale(20),
                    position: 'relative',
                    marginTop: verticalScale(20),
                  }}
                  >
                  <Text
                    style={{
                        fontSize:moderateScale(21),
                        color: '#3FBDC5',
                        fontWeight: 'bold',
                    }}
                   >
                   {
                   sliderMinValue * 5
                   } Mins
                  </Text>
                  <Slider
                    style={{
                        width: "100%", 
                    }}
                    minimumValue={0}
                    maximumValue={12}
                    step={1}
                    value={sliderMinValue}
                    onValueChange={onSliderMinValueChange}
                    minimumTrackTintColor="#b4e6ee"
                    maximumTrackTintColor="#b4e6ee"          
                  />
                <View
                    style={{
                        width: '100%',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginTop: verticalScale(10),
                        height: verticalScale(5),
                        position: 'absolute',
                        top: verticalScale(29),
                        flexDirection: 'row',
                        zIndex: -1,
                        paddingHorizontal: horizontalScale(15),
                    }}
                >
                    <View
                      style={{
                        width: '1%',
                        height: verticalScale(10),
                        backgroundColor: '#03BED9',
                      }}
                    >
                   </View>
          <View
          style={{
            width: '1%',
            height: verticalScale(10),
            backgroundColor: '#03BED9',
          }}
          >
          </View>
          <View
          style={{
            width: '1%',
            height: verticalScale(10),
            backgroundColor: '#03BED9',
          }}
          >
          </View>
          <View
          style={{
            width: '1%',
            height: verticalScale(10),
            backgroundColor: '#03BED9',
          }}
          >
          </View>
          <View
          style={{
            width: '1%',
            height: verticalScale(10),
            backgroundColor: '#03BED9',
          }}
          >
          </View>
          <View
          style={{
            width: '1%',
            height: verticalScale(10),
            backgroundColor: '#03BED9',
          }}
          >
          </View>
          <View
          style={{
            width: '1%',
            height: verticalScale(10),
            backgroundColor: '#03BED9',
          }}
          >
          </View>
          <View
          style={{
            width: '1%',
            height: verticalScale(10),
            backgroundColor: '#03BED9',
          }}
          >
          </View>
          <View
          style={{
            width: '1%',
            height: verticalScale(10),
            backgroundColor: '#03BED9',
          }}
          >
          </View>
          <View
          style={{
            width: '1%',
            height: verticalScale(10),
            backgroundColor: '#03BED9',
          }}
          >
          </View>
          <View
          style={{
            width: '1%',
            height: verticalScale(10),
            backgroundColor: '#03BED9',
          }}
          >
          </View>
          <View
          style={{
            width: '1%',
            height: verticalScale(10),
            backgroundColor: '#03BED9',
          }}
          >
          </View>
                </View>
                  </View>
                  <Pressable
                  onPress={() => {
                    bottomSheetModalFromTimeRef.current.present();
                  }}
                  style={{
                    width: '90%',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginTop: verticalScale(20),
                    height: verticalScale(40),
                    backgroundColor: '#f9fdfe',
                    borderRadius: moderateScale(25),
                    height: verticalScale(80),
                    flexDirection: 'row',
                    paddingHorizontal: horizontalScale(20),
                  }}
                  >
                    <Text
                    style={{
                      fontSize:moderateScale(20),
                      color: '#4C5459',
                      fontWeight: 'bold',
                    }}
                    >
                      From
                    </Text> 
                    <View>
                      <Text
                      style={{
                        fontSize:moderateScale(16),
                        color: '#45BBC3',
                        fontWeight: 'bold',
                      }}
                      >
                        {
                          convertTo12Hour(alarmString)
                        }
                      </Text>
                    </View>
                  </Pressable>
                  <Pressable
                  onPress={() => {
                    bottomSheetModalToTimeRef.current.present();
                  }}
                  style={{
                    width: '90%',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginTop: verticalScale(20),
                    height: verticalScale(40),
                    backgroundColor: '#f9fdfe',
                    borderRadius: moderateScale(25),
                    height: verticalScale(80),
                    flexDirection: 'row',
                    paddingHorizontal: horizontalScale(20),
                    marginBottom: verticalScale(20),
                  }}
                  >
                    <Text
                    style={{
                      fontSize:moderateScale(20),
                      color: '#4C5459',
                      fontWeight: 'bold',
                    }}
                    >
                      Until
                    </Text> 
                    <View>
                      <Text
                      style={{
                        fontSize:moderateScale(16),
                        color: '#45BBC3',
                        fontWeight: 'bold',
                      }}
                      >
                        {
                          convertTo12Hour(alarmString1)
                        }
                      </Text>
                    </View>
                  </Pressable>
                  <View
                  style={{
                    flex: 1,
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    width: '85%',
                    height: 'auto',
                    backgroundColor: '#e0f8fc',
                    borderBottomLeftRadius: 20,
                    borderBottomRightRadius: 20,
                    marginBottom: verticalScale(20),
                    flexDirection: 'row',
                  }}
                  >
                    <Text
                    style={{
                      width: '70%',
                      fontSize:moderateScale(12.5),
                      fontFamily: 'Inter',
                      fontWeight: 'bold',
                      color: '#7F9499',
                    }}
                    numberOfLines={2}
                    >
                      Smart Notification: Notifications will be sent when you forget to drink water.
                    </Text>
                    <Image
                    source={
                      require("../assets/BulbIcon.png")
                    }
                    ></Image>
                  </View>
                </View>
              )
            }
            {
              selectedTab === 1 && (
                <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: '100%',
                  height: 'auto',
                  backgroundColor: '#e0f8fc',
                  borderBottomLeftRadius: 20,
                  borderBottomRightRadius: 20,
                  marginBottom: verticalScale(20),
                }}
                >
                  <Text
                  style={{
                    fontSize:moderateScale(18.5),
                    color: '#36494F',
                    fontFamily: 'Inter',
                    fontWeight: 'bold',
                  }}
                  >
                    Time of each notification
                  </Text>
                  <View
                  style={{
                    width: '100%',
                    justifyContent: 'center',
                    alignItems: 'center',
                    position: 'relative',
                    marginTop: verticalScale(20),
                  }}
                  >
                  </View>
                  
                  <View
                  style={styles.app}
                  >
                  {
                    customTimer.map((item,index) => {
                      return <Item
                      onEnable={() => {
                        (
                          async () => {
                            try{
                              let item1 = await scheduleNotificationAtTime(item.time, "It's time to drink water");
      
                              let temp = [...customTimer];
                              temp[index].isEnabled = true;
                              setCustomTimer(temp);
                              (
                                async () => {
                                  try{
                                    await AsyncStorage.setItem('customTimerValue', JSON.stringify(temp));
                                  }catch(e){
                                    console.log(e);
                                  }
                                }
                              )()
                            }catch(e){
                              console.log(e);
                            }
                          }
                        )()
                      }}
                      onDisable={() => {
                        let temp = [...customTimer];
                        temp[index].isEnabled = false;
                        setCustomTimer(temp);
                        (
                          async () => {
                            try{
                              await AsyncStorage.setItem('customTimerValue', JSON.stringify(temp));
                            }catch(e){
                              console.log(e);
                            }
                          }
                        )()
                      }}
                      time={item.time} 
                      isEnabled={item.isEnabled} />
                    })
                  }
                  </View>
                  
                  <View
                  style={{
                    flex: 1,
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    width: '85%',
                    height: 'auto',
                    backgroundColor: '#e0f8fc',
                    borderBottomLeftRadius: 20,
                    borderBottomRightRadius: 20,
                    marginBottom: verticalScale(20),
                    flexDirection: 'row',
                  }}
                  >
                    <Text
                    style={{
                      width: '100%',
                      fontSize:moderateScale(12.5),
                      fontFamily: 'Inter',
                      fontWeight: 'bold',
                      color: '#7F9499',
                    }}
                    numberOfLines={2}
                    >
                      Custom Notification: Notifications will be sent at selected precise time.
                    </Text>
                  </View>
                </View>
              )
            }
            <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              width: '70%',
              height: 'auto',
              backgroundColor: '#f2f2f2',
              borderRadius: moderateScale(20),
              marginBottom: verticalScale(20),
              marginHorizontal: horizontalScale(20),
              height: verticalScale(2),
            }}
            >
            </View>
          </View>
        )
      }
      <Button
      title='Check Status'
      onPress={() => {
        checkStatusAsync();
      }}
      ></Button>
      <Button
      title='Unregister Task'
      onPress={() => {
        unregisterBackgroundFetchAsync();
      }}
      ></Button>
        <Text>
          Background fetch status:{' '}
          <Text style={styles.boldText}>
            {status && BackgroundFetch.BackgroundFetchStatus[status]}
          </Text>
        </Text>
        <Text>
          Background fetch task name:{' '}
          <Text style={styles.boldText}>
            {isRegistered ? BACKGROUND_FETCH_TASK : 'Not registered yet!'}
          </Text>
        </Text>
        </View>
      </View>
      <BottomSheetModal
      ref={bottomSheetModalFromTimeRef}
      index={1}
      snapPoints={snapPoints}
      onChange={handleSheetChanges}
      >
        <BottomSheetView
        style={{
          flex:1,
          alignItems:'center',
          justifyContent:'space-between'
        }}
        >
          <Text
          style={{
            fontSize:moderateScale(25),
            fontWeight:"bold",
            fontFamily:"Inter",
            margin:20,
          }}
          >
            FROM :
          </Text>
          <Pressable
          onPress={() => {
            setShowPicker(true);
          }}
          >
          <View>
          {alarmString !== null ? (
            <Text style={{color: "#202020", fontSize: 48}}>
              {alarmString}
            </Text>
          ) : <Text style={{color: "#202020", fontSize: 48}}>
            00:00:00
        </Text>
          }
          </View>
          </Pressable>
          <TimerPickerModal
            visible={showPicker}
            setIsVisible={setShowPicker}
            onConfirm={(pickedDuration) => {
                setAlarmString(formatTime(pickedDuration));
                setShowPicker(false);
                const storeData = async (value) => {
                  try {
                    await AsyncStorage.setItem('fromTime', value);
                  } catch (e) {
                    // saving error
                  }
                };
                storeData(formatTime(pickedDuration));
            }}
            modalTitle="Set Alarm"
            onCancel={() => setShowPicker(false)}
            closeOnOverlayPress
            use12HourPicker
            LinearGradient={LinearGradient}
            Haptics={Haptics}
            styles={{
                theme: "light",
            }}
        />
          <Pressable
          onPress={() => {
             bottomSheetModalFromTimeRef.current.dismiss();
          }}
          style={{
            width:"50%",
            justifyContent:"center",
            alignItems:"center",
            backgroundColor:"#384250",
            borderRadius: moderateScale(30),
            height: moderateScale(80),
            marginHorizontal: moderateScale(20),
            marginVertical: moderateScale(20),
          }}
          >
            <Text
            style={{
              fontSize:moderateScale(20),
              fontWeight:"bold",
              fontFamily:"Inter",
              color:"#f9fdfe",
            }}
            >
              Done
            </Text>
          </Pressable>
        </BottomSheetView>
      </BottomSheetModal>
      <BottomSheetModal
      ref={bottomSheetModalToTimeRef}
      index={1}
      snapPoints={snapPoints}
      onChange={handleSheetChanges}
      >
        <BottomSheetView
        style={{
          flex:1,
          alignItems:'center',
          justifyContent:'space-between'
        }}
        >
          <Text
          style={{
            fontSize:moderateScale(25),
            fontWeight:"bold",
            fontFamily:"Inter",
            margin:20,
          }}
          >
            Until :
          </Text>
          <Pressable
          onPress={() => {
            setShowPicker1(true);
          }}
          >
          <View>
          {alarmString1 !== null ? (
            <Text style={{color: "#202020", fontSize: 48}}>
              {alarmString1}
            </Text>
          ) : <Text style={{color: "#202020", fontSize: 48}}>
            00:00:00
        </Text>
          }
          </View>
          </Pressable>
          <TimerPickerModal
            visible={showPicker1}
            setIsVisible={setShowPicker1}
            onConfirm={(pickedDuration) => {
                setAlarmString1(formatTime(pickedDuration));
                setShowPicker1(false);

                const storeData = async (value) => {
                  try {
                    await AsyncStorage.setItem('toTime', value);
                  } catch (e) {
                    // saving error
                  }
                };
                storeData(formatTime(pickedDuration));
            }}
            modalTitle="Set Alarm"
            onCancel={() => setShowPicker1(false)}
            closeOnOverlayPress
            use12HourPicker
            LinearGradient={LinearGradient}
            Haptics={Haptics}
            styles={{
                theme: "light",
            }}
        />
          <Pressable
          onPress={() => {
              bottomSheetModalToTimeRef.current.dismiss();
          }}
          style={{
            width:"50%",
            justifyContent:"center",
            alignItems:"center",
            backgroundColor:"#384250",
            borderRadius: moderateScale(30),
            height: moderateScale(80),
            marginHorizontal: moderateScale(20),
            marginVertical: moderateScale(20),
          }}
          >
            <Text
            style={{
              fontSize:moderateScale(20),
              fontWeight:"bold",
              fontFamily:"Inter",
              color:"#f9fdfe",
            }}
            >
              Done
            </Text>
          </Pressable>
        </BottomSheetView>
      </BottomSheetModal>
    </ScrollView>
    </BottomSheetModalProvider>  
    </GestureHandlerRootView>
    );
}

const styles = StyleSheet.create({
  TimerContainer:{
    flex:1,
    flexDirection:"row",
    backgroundColor:"#f9fdfe",
    height:verticalScale(80),
    justifyContent:"space-around",
    alignItems:"center",
    margin:10,
    borderRadius: moderateScale(20),
  },
  TimerMainContainer:{
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: verticalScale(50),
    marginVertical: verticalScale(10)
  },
  TimeText1:{
    color:"#313a3f",
    fontSize:moderateScale(15.5),
  },
  app: {
    marginHorizontal: "auto",
    width: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
  item: {
    flex: 1,
    minWidth: 150,
    maxWidth: 150,
    height: 60,
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#f9fdfe",
    flexDirection: "row",
    borderRadius: 20,
  },
})
  
export default RemainderScreen;  