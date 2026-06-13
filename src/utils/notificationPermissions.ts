// import messaging from '@react-native-firebase/messaging';
// import {Platform} from 'react-native';
// import {
//   check,
//   Permission,
//   PERMISSIONS,
//   PermissionStatus,
//   request,
// } from 'react-native-permissions';

// export async function getFCMToken() {
//   let token: any = null;
//   if (Platform.OS === 'android') {
//     token = await getToken();
//   } else {
//     token = await checkPermission();
//   }

//   return token;
// }

// export async function getToken() {
//   // console.log("updateDeviceToken>",updateDeviceToken);

//   let fcmToken = null;
//   // if (Platform.OS == 'ios') {
//   //   if (!messaging().isDeviceRegisteredForRemoteMessages) {
//   //     await messaging().registerDeviceForRemoteMessages();
//   //   }
//   // }
//   if (Platform.OS === 'ios') {
//     if (!messaging().isDeviceRegisteredForRemoteMessages) {
//       await messaging().registerDeviceForRemoteMessages();
//       await messaging().getAPNSToken();
//     }
//   }
//   await new Promise(resolve => setTimeout(resolve, 500));
//   fcmToken = await messaging().getToken();
//   return fcmToken;
// }

// export async function checkPermission() {
//   return await messaging()
//     .hasPermission()
//     .then(enabled => {
//       if (enabled) {
//         console.log('hvjbkl');

//         return getToken();
//       } else {
//         return requestPermission();
//       }
//     });
// }

// export async function requestPermission() {
//   try {
//     return messaging()
//       .requestPermission()
//       .then(enabled => {
//         console.log('dfssfssfsfsfsfsfss', enabled);
//         if (enabled) {
//           return getToken();
//         }
//       });
//   } catch (error) {}
// }

// export const requestAndroidNotificationPermission =
//   async (): Promise<boolean> => {
//     return new Promise<boolean>((resolve, reject) => {
//       check(
//         Platform.select({
//           android: PERMISSIONS.ANDROID.POST_NOTIFICATIONS,
//         }) as Permission, // Type assertion for the permission value (which is a string)
//       )
//         .then((result: PermissionStatus) => {
//           if (
//             result === 'blocked' ||
//             result === 'unavailable' ||
//             result === 'denied'
//           ) {
//             request(
//               Platform.select({
//                 android: PERMISSIONS.ANDROID.POST_NOTIFICATIONS,
//               }) as Permission, // Type assertion for the permission value (which is a string)
//             )
//               .then(() => {
//                 resolve(true);
//               })
//               .catch(() => {
//                 resolve(false);
//               });
//           } else {
//             resolve(true);
//           }
//         })
//         .catch(e => {
//           resolve(false);
//         });
//     });
//   };

import {getApp} from '@react-native-firebase/app';
import {
  deleteToken as firebaseDeleteToken,
  getToken as firebaseGetToken,
  requestPermission as firebaseRequestPermission,
  getMessaging,
  hasPermission,
  registerDeviceForRemoteMessages,
} from '@react-native-firebase/messaging';
import {Platform} from 'react-native';
import {check, PERMISSIONS, request} from 'react-native-permissions';
import {kUserFCMToken} from '../redux/apis/commonValue';
import {DEVICE_INFO} from './helper';
import {getData, setData} from '../redux/apis/keyChain';

const app = getApp();
const messaging = getMessaging(app);

const IS_IOS = Platform.OS === 'ios';

export async function updateDeviceToken() {
  try {
    let token: string | null = null;
    if (IS_IOS) {
      token = await getFCMToken();
    } else {
      token = await checkFirebasePermission();
    }

    // Optionally send token to backend
    // if (global?.userData?.id) {
    //   updateDeviceTokenMethod(token);
    // }

    return token;
  } catch (error) {
    console.error('Error updating device token:', error);
    return null;
  }
}

export async function getFCMToken(): Promise<string | null> {
  console.log('getFCMToken');
  try {
    const cachedToken = await getData<string>(kUserFCMToken);
    if (cachedToken) {
      console.log('Using cached FCM token:', cachedToken);
      DEVICE_INFO.firebase_token = cachedToken;
      return cachedToken;
    }

    if (IS_IOS) {
      await registerDeviceForRemoteMessages(messaging);
    }

    console.log('Fetching new FCM token...');
    const fcmToken = await firebaseGetToken(messaging);

    if (fcmToken) {
      DEVICE_INFO.firebase_token = fcmToken;
      await setData(kUserFCMToken, fcmToken);
      console.log('New FCM token saved:', fcmToken);
    } else {
      console.warn('No FCM token returned from Firebase');
    }

    return fcmToken;
  } catch (error) {
    console.error('Error getting FCM token:', error);
    return null;
  }
}

// export async function getFCMToken(): Promise<string | null> {
//   console.log('getFCMToken');
//   try {
//     // Delete existing token to force refresh
//     await firebaseDeleteToken(messaging);

//     if (IS_IOS) {
//       await registerDeviceForRemoteMessages(messaging);
//     }

//     console.log('Fetching FCM Token...');
//     const fcmToken = await firebaseGetToken(messaging);
//     console.log('FCM Token:', fcmToken);
//     return fcmToken;
//   } catch (error) {
//     console.error('Error getting FCM token:', error);
//     return null;
//   }
// }

export async function checkFirebasePermission(): Promise<string | null> {
  try {
    const permissionGranted = await hasPermission(messaging);
    if (permissionGranted) {
      return await getFCMToken();
    } else {
      return await requestFirebasePermission();
    }
  } catch (error) {
    console.error('Error checking Firebase permission:', error);
    return null;
  }
}

export async function requestFirebasePermission(): Promise<string | null> {
  try {
    const permissionGranted = await firebaseRequestPermission(messaging);
    if (permissionGranted) {
      return await getFCMToken();
    } else {
      console.warn('User denied notification permission');
      return null;
    }
  } catch (error) {
    console.error('Error requesting Firebase permission:', error);
    return null;
  }
}

export const requestAndroidNotificationPermission =
  async (): Promise<boolean> => {
    try {
      const result = await check(
        Platform.select({
          android: PERMISSIONS.ANDROID.POST_NOTIFICATIONS,
        })!,
      );

      console.log('Android notification permission status:', result);

      if (['blocked', 'unavailable', 'denied'].includes(result)) {
        const requestResult = await request(
          Platform.select({
            android: PERMISSIONS.ANDROID.POST_NOTIFICATIONS,
          })!,
        );

        return requestResult === 'granted';
      }

      return true;
    } catch (error) {
      console.error('Error requesting Android notification permission:', error);
      return false;
    }
  };

// const updateDeviceTokenMethod = async token => {
//   let unicId = await getDeviceUniqueId();
//   let request = {
//     device_id: token,
//     device_type: Platform.OS.toUpperCase(),
//     device_uniqueid: unicId,
//   };
//    console.log('request----updateDeviceToken-----', request);
//   try {
//     const response = await post({
//       url: VERSION_API.update_token,
//       header: JSON_HEADER,
//       data: JSON.stringify(request),
//     });
//     console.log('response-------update_token-----------', response);
//   } catch (error) {
//     console.log('update_token-error----------', error);
//   }
// };
export function listenForFCMTokenRefresh() {
  messaging().onTokenRefresh(async newToken => {
    console.log('FCM token refreshed:', newToken);
    DEVICE_INFO.firebase_token = newToken;
    await setData(kUserFCMToken, newToken);
  });
}
