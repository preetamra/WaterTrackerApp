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

import { scheduleAllNotification } from '../Utils/NotificationSchedule';

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

function RemainderScreen(props) {
  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => {
    setIsEnabled(previousState => !previousState);
    scheduleAllNotification();
  };

  const [sliderValue, setSliderValue] = useState(1);
  const onSliderValueChange = (value) => {
    setSliderValue(value);
  }

  const [sliderMinValue, setSliderMinValue] = useState(1);
  const onSliderMinValueChange = (value) => {
    setSliderMinValue(value);
  }

  const [selectedTab, setSelectedTab] = useState(0);
  const [bottomSheetBackDrop, setBottomSheetBackDrop] = useState(false);

  const bottomSheetModalFromTimeRef = useRef(null);
  const bottomSheetModalToTimeRef = useRef(null);

  const snapPoints = React.useMemo(() => ['25%', '50%'], []);
  const [date, setDate] = useState(new Date(1598051730000));

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

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate;
    setDate(currentDate);
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
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        marginTop: 30,
      }}>
        <View
        style={{
          flex:1,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          width:"100%",
          marginBottom: 20,
        }}
        >
          <Pressable
          onPress={() => {
            props.navigation.goBack();
          }}
          style={{
            marginLeft: 20,
          }}
          >
          <Image
          source={
            require('../assets/BackButton.png')
          }
          style={{
            width: 40,
            height: 40,
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
          borderRadius: 20,
          height: 100,
          marginBottom: 20,
        }}
        >
          <View
          style={{
            flex: 2,
            justifyContent: 'flex-start',
            alignItems: 'center',
            marginRight: 60,
          }}
          >
            <Text
            style={{
              fontSize: 25,
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
            marginRight: 20,
            flexDirection: 'row',
            justifyContent: 'space-evenly',
            alignItems: 'center',
          }}
          >
            <Text
            style={{
              fontSize: 17.5,
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
            height: 100,
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
                borderRadius: 20,
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
                    width: 30,
                    height: 30,
                  }}
                ></Image>
                )
              }
              {
                selectedTab !== 0 && (
                  <Image
                  source={require('../assets/RemainderScreenCheckInActive.png')}
                  style={{
                    width: 30,
                    height: 30,
                  }}
                ></Image>                  
                )
              }
                <Text
                style={[
                  {
                    color: '#D6D7D8',
                    fontSize:15,
                    fontWeight: 'bold',
                    marginTop: 5,
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
                  marginLeft: 10,
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
                    width: 30,
                    height: 30,
                  }}
                ></Image>
                )
              }
              {
                selectedTab !== 1 && (
                  <Image
                  source={require('../assets/RemainderScreenCheckInActive.png')}
                  style={{
                    width: 30,
                    height: 30,
                  }}
                ></Image>                  
                )
              }
                <Text
                style={[
                  {
                    color: '#D6D7D8',
                    fontSize:15,
                    fontWeight: 'bold',
                    marginTop: 5,
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
            borderTopWidth: 5,
            borderColor: "#00bed8",
          }}
          >
            <View
            style={
              {
                height:40,
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
                  height: 'auto',
                  backgroundColor: '#e0f8fc',
                  borderBottomLeftRadius: 20,
                  borderBottomRightRadius: 20,
                  marginBottom: 20,
                }}
                >
                  <Text
                  style={{
                    fontSize: 18.5,
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
                    paddingHorizontal: 20,
                    position: 'relative',
                    marginTop: 20,
                  }}
                  >
                  <Text
        style={{
          fontSize: 21,
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
            height: "100%",
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
          marginTop: 10,
          height: 5,
          position: 'absolute',
          top: 32,
          flexDirection: 'row',
          zIndex: -1,
          paddingHorizontal: 5,
        }}
        >
          <View
          style={{
            width: '1%',
            height: 10,
            backgroundColor: '#03BED9',
          }}
          >
          </View>
          <View
          style={{
            width: '1%',
            height: 10,
            backgroundColor: '#03BED9',
          }}
          >
          </View>
          <View
          style={{
            width: '1%',
            height: 10,
            backgroundColor: '#03BED9',
          }}
          >
          </View>
          <View
          style={{
            width: '1%',
            height: 10,
            backgroundColor: '#03BED9',
          }}
          >
          </View>
          <View
          style={{
            width: '1%',
            height: 10,
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
                    paddingHorizontal: 20,
                    position: 'relative',
                    marginTop: 20,
                  }}
                  >
                  <Text
        style={{
          fontSize: 21,
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
            height: "100%",
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
          marginTop: 10,
          height: 5,
          position: 'absolute',
          top: 32,
          flexDirection: 'row',
          zIndex: -1,
          paddingHorizontal: 5,
        }}
        >
          <View
          style={{
            width: '1%',
            height: 10,
            backgroundColor: '#03BED9',
          }}
          >
          </View>
          <View
          style={{
            width: '1%',
            height: 10,
            backgroundColor: '#03BED9',
          }}
          >
          </View>
          <View
          style={{
            width: '1%',
            height: 10,
            backgroundColor: '#03BED9',
          }}
          >
          </View>
          <View
          style={{
            width: '1%',
            height: 10,
            backgroundColor: '#03BED9',
          }}
          >
          </View>
          <View
          style={{
            width: '1%',
            height: 10,
            backgroundColor: '#03BED9',
          }}
          >
          </View>
          <View
          style={{
            width: '1%',
            height: 10,
            backgroundColor: '#03BED9',
          }}
          >
          </View>
          <View
          style={{
            width: '1%',
            height: 10,
            backgroundColor: '#03BED9',
          }}
          >
          </View>
          <View
          style={{
            width: '1%',
            height: 10,
            backgroundColor: '#03BED9',
          }}
          >
          </View>
          <View
          style={{
            width: '1%',
            height: 10,
            backgroundColor: '#03BED9',
          }}
          >
          </View>
          <View
          style={{
            width: '1%',
            height: 10,
            backgroundColor: '#03BED9',
          }}
          >
          </View>
          <View
          style={{
            width: '1%',
            height: 10,
            backgroundColor: '#03BED9',
          }}
          >
          </View>
          <View
          style={{
            width: '1%',
            height: 10,
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
                    marginTop: 20,
                    height: 40,
                    backgroundColor: '#f9fdfe',
                    borderRadius: 25,
                    height: 80,
                    flexDirection: 'row',
                    paddingHorizontal: 20,
                  }}
                  >
                    <Text
                    style={{
                      fontSize: 20,
                      color: '#4C5459',
                      fontWeight: 'bold',
                    }}
                    >
                      From
                    </Text> 
                    <View>
                      <Text
                      style={{
                        fontSize: 16,
                        color: '#45BBC3',
                        fontWeight: 'bold',
                      }}
                      >
                        8:00 AM
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
                    marginTop: 20,
                    height: 40,
                    backgroundColor: '#f9fdfe',
                    borderRadius: 25,
                    height: 80,
                    flexDirection: 'row',
                    paddingHorizontal: 20,
                    marginBottom: 20,
                  }}
                  >
                    <Text
                    style={{
                      fontSize: 20,
                      color: '#4C5459',
                      fontWeight: 'bold',
                    }}
                    >
                      Until
                    </Text> 
                    <View>
                      <Text
                      style={{
                        fontSize: 16,
                        color: '#45BBC3',
                        fontWeight: 'bold',
                      }}
                      >
                        10:00 PM
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
                    marginBottom: 20,
                    flexDirection: 'row',
                  }}
                  >
                    <Text
                    style={{
                      width: '70%',
                      fontSize: 12.5,
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
                  marginBottom: 20,
                }}
                >
                  <Text
                  style={{
                    fontSize: 18.5,
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
                    paddingHorizontal: 20,
                    position: 'relative',
                    marginTop: 20,
                  }}
                  >
                  </View>
                  
                  <View
                  style={{
                    flex: 1,
                    width: '100%',
                    paddingHorizontal: 20,
                  }}
                  >
                    <View
                    style={styles.TimerMainContainer}
                    >
                      <View style={
                        [
                          styles.TimerContainer,
                          {
                            backgroundColor:"#eefcfd"
                          }
                        ]
                      }>
                        <Text
                        style={
                          [
                            styles.TimeText1,
                          ]}
                        >8:00 AM</Text>
                        <Switch
                          trackColor={{false: '#f9fbfa', true: '#00bed8'}}
                          thumbColor={isEnabled ? 'white' : '#f4f3f4'}
                          ios_backgroundColor="#f9fbfa"
                          onValueChange={toggleSwitch}
                          value={isEnabled}
                          style={{
                            transform: [{
                              scale:0.8
                            }]
                          }}
                        />
                      </View>
                      <View style={styles.TimerContainer}>
                        <Text
                        style={styles.TimeText1}
                        >8:00 AM</Text>
                        <Switch
                          trackColor={{false: '#f9fbfa', true: '#00bed8'}}
                          thumbColor={isEnabled ? 'white' : '#f4f3f4'}
                          ios_backgroundColor="#f9fbfa"
                          onValueChange={toggleSwitch}
                          value={isEnabled}
                          style={{
                            transform: [{
                              scale:0.8
                            }]
                          }}
                        />
                      </View>
                    </View>
                    <View
                    style={styles.TimerMainContainer}
                    >
                      <View style={styles.TimerContainer}>
                        <Text>8:00 AM</Text>
                        <Switch
                          trackColor={{false: '#f9fbfa', true: '#00bed8'}}
                          thumbColor={isEnabled ? 'white' : '#f4f3f4'}
                          ios_backgroundColor="#f9fbfa"
                          onValueChange={toggleSwitch}
                          value={isEnabled}
                          style={{
                            transform: [{
                              scale:0.8
                            }]
                          }}
                        />
                      </View>
                      <View style={styles.TimerContainer}>
                        <Text>8:00 AM</Text>
                        <Switch
                          trackColor={{false: '#f9fbfa', true: '#00bed8'}}
                          thumbColor={isEnabled ? 'white' : '#f4f3f4'}
                          ios_backgroundColor="#f9fbfa"
                          onValueChange={toggleSwitch}
                          value={isEnabled}
                          style={{
                            transform: [{
                              scale:0.8
                            }]
                          }}
                        />
                      </View>
                    </View>
                    <View
                    style={styles.TimerMainContainer}
                    >
                      <View style={styles.TimerContainer}>
                        <Text>8:00 AM</Text>
                        <Switch
                          trackColor={{false: '#f9fbfa', true: '#00bed8'}}
                          thumbColor={isEnabled ? 'white' : '#f4f3f4'}
                          ios_backgroundColor="#f9fbfa"
                          onValueChange={toggleSwitch}
                          value={isEnabled}
                          style={{
                            transform: [{
                              scale:0.8
                            }]
                          }}
                        />
                      </View>
                      <View style={styles.TimerContainer}>
                        <Text>8:00 AM</Text>
                        <Switch
                          trackColor={{false: '#f9fbfa', true: '#00bed8'}}
                          thumbColor={isEnabled ? 'white' : '#f4f3f4'}
                          ios_backgroundColor="#f9fbfa"
                          onValueChange={toggleSwitch}
                          value={isEnabled}
                          style={{
                            transform: [{
                              scale:0.8
                            }]
                          }}
                        />
                      </View>
                    </View>
                    <View>
                    </View>
                    <View>
                    </View>
                    <View>
                    </View>
                    <View>
                    </View>
                    <View>
                    </View>
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
                    marginBottom: 20,
                    flexDirection: 'row',
                  }}
                  >
                    <Text
                    style={{
                      width: '100%',
                      fontSize: 12.5,
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
              borderRadius: 20,
              marginBottom: 20,
              marginHorizontal: 50,
              height: 2,
            }}
            >
            </View>
            <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              width: '100%',
              height: 'auto',
              borderRadius: 20,
              marginBottom: 20,
            }}
            >
              <Text
              style={{
                fontSize: 18.5,
                color: '#36494F',
                fontFamily: 'Inter',
                fontWeight: 'bold',
              }}
              >
                Days of the week
              </Text>
              <ScrollView
              horizontal={true}
              style={{
                width: '100%',
                height: 100,
                marginTop: 20,
              }}
              >
                <View style={{
                  width:80,
                  height: 80,
                  backgroundColor: "#45BBC3",
                  borderRadius: 50,
                  flex: 1,
                  justifyContent: 'center',
                  alignContent: 'center',
                  marginHorizontal: 10,
                }}>
                  <Text
                  style={{
                    fontSize: 20,
                    color: 'white',
                    textAlign: 'center',
                  }}
                  >
                    Sun
                  </Text>
                </View>
                <View style={{
                  width:80,
                  height: 80,
                  backgroundColor: "#45BBC3",
                  borderRadius: 50,
                  flex: 1,
                  justifyContent: 'center',
                  alignContent: 'center',
                  marginHorizontal: 10,
                }}>
                  <Text
                  style={{
                    fontSize: 20,
                    color: 'white',
                    textAlign: 'center',
                  }}
                  >
                    Mon
                  </Text>
                </View>
                <View style={{
                  width:80,
                  height: 80,
                  backgroundColor: "#45BBC3",
                  borderRadius: 50,
                  flex: 1,
                  justifyContent: 'center',
                  alignContent: 'center',
                  marginHorizontal: 10,
                }}>
                  <Text
                  style={{
                    fontSize: 20,
                    color: 'white',
                    textAlign: 'center',
                  }}
                  >
                    Tue
                  </Text>
                </View>
                <View style={{
                  width:80,
                  height: 80,
                  backgroundColor: "#45BBC3",
                  borderRadius: 50,
                  flex: 1,
                  justifyContent: 'center',
                  alignContent: 'center',
                  marginHorizontal: 10,
                }}>
                  <Text
                  style={{
                    fontSize: 20,
                    color: 'white',
                    textAlign: 'center',
                  }}
                  >
                    Wed
                  </Text>
                </View>
                <View style={{
                  width:80,
                  height: 80,
                  backgroundColor: "#45BBC3",
                  borderRadius: 50,
                  flex: 1,
                  justifyContent: 'center',
                  alignContent: 'center',
                  marginHorizontal: 10,
                }}>
                  <Text
                  style={{
                    fontSize: 20,
                    color: 'white',
                    textAlign: 'center',
                  }}
                  >
                    Thu
                  </Text>
                </View>
                <View style={{
                  width:80,
                  height: 80,
                  backgroundColor: "#45BBC3",
                  borderRadius: 50,
                  flex: 1,
                  justifyContent: 'center',
                  alignContent: 'center',
                  marginHorizontal: 10,
                }}>
                  <Text
                  style={{
                    fontSize: 20,
                    color: 'white',
                    textAlign: 'center',
                  }}
                  >
                    Fri
                  </Text>
                </View>
                <View style={{
                  width:80,
                  height: 80,
                  backgroundColor: "#45BBC3",
                  borderRadius: 50,
                  flex: 1,
                  justifyContent: 'center',
                  alignContent: 'center',
                  marginHorizontal: 10,
                }}>
                  <Text
                  style={{
                    fontSize: 20,
                    color: 'white',
                    textAlign: 'center',
                  }}
                  >
                    Sat
                  </Text>
                </View>
              </ScrollView>            
            </View>
          </View>
        )
      }
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
            fontSize:25,
            fontWeight:"bold",
            fontFamily:"Inter",
            margin:20,
          }}
          >
            FROM :
          </Text>
          <DateTimePicker
            testID="dateTimePicker"
            value={date}
            mode={'time'}
            is24Hour={true}
            onChange={onChange}
            display="spinner"
          />
          <Pressable
          onPress={() => {
            console.log("Done");
          }}
          style={{
            flex:1,
            width:"40%",
            justifyContent:"center",
            alignItems:"center",
            backgroundColor:"#384250",
            borderRadius:50,
          }}
          >
            <Text
            style={{
              fontSize:20,
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
          justifyContent:'space-between',
        }}
        >
          <Text
          style={{
            fontSize:25,
            fontWeight:"bold",
            fontFamily:"Inter",
            margin:20,
          }}
          >
            UNTIL :
          </Text>
          <DateTimePicker
            testID="dateTimePicker"
            value={date}
            mode={'time'}
            is24Hour={true}
            onChange={onChange}
            display="spinner"
          />
          <Pressable
          onPress={() => {
            console.log("Done");
          }}
          style={{
            flex:1,
            width:"40%",
            justifyContent:"center",
            alignItems:"center",
            backgroundColor:"#384250",
            borderRadius:50,
          }}
          >
            <Text
            style={{
              fontSize:20,
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
    height:50,
    justifyContent:"space-around",
    alignItems:"center",
    margin:10,
    borderRadius:20
  },
  TimerMainContainer:{
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 50,
    marginVertical:10
  },
  TimeText1:{
    color:"#313a3f",
    fontSize:15.5,
  },
})
  
export default RemainderScreen;  