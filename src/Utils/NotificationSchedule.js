import * as Notifications from 'expo-notifications';

export const scheduleAllNotification = async (hours,mins) => {
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

    const allIntervals10Minutes = getTimeIntervalsUntil(22,0,hours,mins);

    console.log(allIntervals10Minutes);

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

function getTimeIntervalsUntil(targetHour, targetMinute, intervalHours, intervalMinutes) {
    const intervals = [];
    const now = new Date();
    const endTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), targetHour, targetMinute);

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