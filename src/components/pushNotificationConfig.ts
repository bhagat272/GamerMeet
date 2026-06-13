import messaging from '@react-native-firebase/messaging';
import {useEffect} from 'react';
import {Platform} from 'react-native';
import PushNotification, {Importance} from 'react-native-push-notification';
const PushNotificationConfig = (props: any) => {
  PushNotification.configure({
    onNotification: (notification: Record<string, any>) => {
      if (notification && Platform.OS != 'ios') {
        props?.onPress(notification);
      }
    },
  });

  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.debug(remoteMessage, 'Remote message log');
      PushNotification.createChannel(
        {
          channelId: 'channel-id', // (required)
          channelName: 'My channel', // (required)
          channelDescription: 'A channel to categorize your notifications', // (optional) default: undefined.
          playSound: false, // (optional) default: true
          soundName: 'default', // (optional) See `soundName` parameter of `localNotification` function
          importance: Importance.HIGH, // (optional) default: Importance.HIGH. Int value of the Android notification importance
          vibrate: true, // (optional) default: true. Creates the default vibration patten if true.
        },
        () => {},
      );

      PushNotification.localNotification({
        channelId: 'channel-id',
        message: remoteMessage?.notification?.body,
        title: remoteMessage?.notification?.title,
        userInfo: remoteMessage?.data,
      });
    });
    return unsubscribe;
  }, []);

  return null;
};

export default PushNotificationConfig;
