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
    Switch,
} from 'react-native';
import Slider from '@react-native-community/slider';
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';

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

function RemainderScreen() {
  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled(previousState => !previousState);

  const [sliderValue, setSliderValue] = useState(1);
  const onSliderValueChange = (value) => {
    setSliderValue(value);
  }

    return (
      <SafeAreaView style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white'
      }}>
        <View
        style={{
          flex:1,
          justifyContent: 'center',
          alignItems: 'center',
        }}
        >
        </View>
        <View
        style={{
          flex:5,
          position:"relative",
          width:450,
          height:450,
          justifyContent: 'center',
          alignItems: 'center',
        }}
        >
            <Text>
                Remainder Screen
            </Text>
            <Switch
        trackColor={{false: '#767577', true: '#81b0ff'}}
        thumbColor={isEnabled ? '#f5dd4b' : '#f4f3f4'}
        ios_backgroundColor="#3e3e3e"
        onValueChange={toggleSwitch}
        value={isEnabled}
      />
        </View>
        <View
        style={{
          flex:1,
          justifyContent: 'center',
          alignItems: 'center',
        }}
        >
          <Button
          title='Send Notification'
          onPress={() => {
            (
              async () => {
                try{
                  const settings = await Notifications.getPermissionsAsync();
                  console.log("Notification settings", settings.granted || settings.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL);
                  if(!(settings.granted || settings.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL))
                  {
                    Notifications.requestPermissionsAsync({
                      ios: {
                        allowAlert: true,
                        allowBadge: true,
                        allowSound: true,
                        allowAnnouncements: true,
                      },
                    });
                  }else{
                    const value = await AsyncStorage.getItem('recommend');
                    if (value !== null) {
                      await schedulePushNotification(value);
                    }
                  }
                }catch(e){
                  console.log(e);
                }
              }
            )()
          }}
          ></Button>
        <Text
        style={{
          fontSize: 20,
          color: 'black',
        }}
        >
          {
            sliderValue
          } Hrs
        </Text>
        <Slider
          style={{width: 400, height: 40}}
          minimumValue={0}
          maximumValue={4}
          step={1}
          value={sliderValue}
          onValueChange={onSliderValueChange}
          minimumTrackTintColor="#000000"
          maximumTrackTintColor="#000000"
        />
        </View>
      </SafeAreaView>
    );
}
  
export default RemainderScreen;  