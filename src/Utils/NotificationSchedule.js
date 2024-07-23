import * as Notifications from 'expo-notifications';

export const scheduleAllNotification = async (title, body, trigger) => {
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

    // const allIntervals = getHourlyIntervalsUntil10PM();
    const allIntervals10Minutes = getTenMinuteIntervalsUntil10PM();

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
                repeats: true,
            },
        });
    })
};

function getHourlyIntervalsUntil10PM() {
    const intervals = [];
    const now = new Date();
    let currentHour = now.getHours();
    const currentMinutes = now.getMinutes();

    // Calculate the current time
    let currentTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), currentHour, currentMinutes);

    while (currentHour < 22) {
        currentTime.setHours(currentHour + 1);
        intervals.push(currentTime.toTimeString().split(' ')[0].slice(0, 5));
        currentHour++;
    }

    return intervals;
}

function getTenMinuteIntervalsUntil10PM() {
    const intervals = [];
    const now = new Date();
    const endTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 22, 0); // 10 PM

    let currentTime = new Date(now.getTime());

    while (currentTime < endTime) {
        currentTime.setMinutes(currentTime.getMinutes() + 5);
        if (currentTime <= endTime) {
            intervals.push(currentTime.toTimeString().split(' ')[0].slice(0, 5));
        }
    }

    return intervals;
}