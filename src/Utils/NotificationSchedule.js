import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import * as BackgroundFetch from 'expo-background-fetch';
import * as TaskManager from 'expo-task-manager';

const BACKGROUND_FETCH_TASK = 'background-fetch';

async function registerBackgroundFetchAsync() {
  console.log("Registering background fetch task",new Date().toLocaleString());
  return BackgroundFetch.registerTaskAsync(BACKGROUND_FETCH_TASK, {
    minimumInterval: 60 * 10, // 15 minutes
    stopOnTerminate: false, // android only,
    startOnBoot: true, // android only
  });
}

export const scheduleAllNotification = async (hours,mins,targetHour,targetMins) => {
    Notifications.setNotificationHandler({
        handleNotification: async () => ({
          shouldShowAlert: true,
          shouldPlaySound: false,
          shouldSetBadge: false,
        }),
    });

    const settings = await Notifications.getPermissionsAsync();
    if(
        !(
            settings.granted || settings.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL
        )
    ){
        await Notifications.requestPermissionsAsync({
            ios: {
              allowAlert: true,
              allowBadge: true,
              allowSound: true,
              allowAnnouncements: true,
            },
        });
    }
    
    await Notifications.cancelAllScheduledNotificationsAsync();

    const allIntervals10Minutes = getTimeIntervalsUntil(targetHour?targetHour:23,targetMins?targetMins:0,hours,mins);

    console.log("allIntervals10Minutes :- ",allIntervals10Minutes);

    allIntervals10Minutes.forEach((interval) => {
        const [hour, minute] = interval.split(':');
        const triggerTime = new Date();
        triggerTime.setHours(hour);
        triggerTime.setMinutes(minute);

        Notifications.scheduleNotificationAsync({
            content: {
                title: "Don't forget to drink water!",
                body: "It's time to drink water."+" "+interval,
            },
            trigger: {
                hour: triggerTime.getHours(),
                minute: triggerTime.getMinutes(),
            },
        });
    });
};

export const cancellAllNotification = () => {
    try{
        Notifications.cancelAllScheduledNotificationsAsync();
        console.log("All notifications cancelled");
    }catch(e){
        console.log(e);
    }
}

// Function to schedule a notification at a specific 12-hour format time
export const scheduleNotificationAtTime = async (time12h, message) => {

    const [hour24, minute] = convert12hTo24h(time12h);
    
    const settings = await Notifications.getPermissionsAsync();
    if (!(settings.granted || settings.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL)) {
      await Notifications.requestPermissionsAsync({
        ios: {
          allowAlert: true,
          allowBadge: true,
          allowSound: true,
          allowAnnouncements: true,
        },
        android: {
            allowAlert: true,
            allowNotificationAlert: true,
            allowNotificationSound: true,
            allowNotificationBadge: true,
            allowNotificationForeground: true,
            allowNotificationResponseInput: true,
        }
      });
    }

    if(Platform.OS == "android")
    {
        registerBackgroundFetchAsync();
    }else{
        return await Notifications.scheduleNotificationAsync({
            content: {
              title: "Reminder",
              body: message || `It's time for your scheduled activity at ${time12h}`,
            },
            trigger: {
              hour: hour24,
              minute: minute,
              repeats: false,
            },
          });
    }
    console.log(`Notification scheduled at ${time12h}`);
  };
  
  // Helper function to convert 12-hour format to 24-hour format
  const convert12hTo24h = (time12h) => {

    const [time, modifier] = time12h.split(' ');
    let [hours, minutes] = time.split(':').map(Number);
  
    if (hours === 12) {
      hours = 0;
    }
    if (modifier === 'PM') {
      hours += 12;
    }
  
    return [hours, minutes];
  };

function getTimeIntervalsUntil(targetHour, targetMinute, intervalHours, intervalMinutes) {
    const intervals = [];
    const now = new Date();
    const endTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), targetHour, targetMinute);

    console.log("End Time",endTime);
    console.log("Now",now);

    let currentTime = new Date(now.getTime());

    while (currentTime < endTime) {
        currentTime.setHours(currentTime.getHours() + intervalHours);
        currentTime.setMinutes(currentTime.getMinutes() + intervalMinutes);
        if (currentTime <= endTime) {
            intervals.push(currentTime.toTimeString().split(' ')[0].slice(0, 5));
        }
    }

    return intervals;
}