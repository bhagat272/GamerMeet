import React from 'react';
import {Alert, Platform} from 'react-native';
import {
  check,
  request,
  PERMISSIONS,
  openSettings,
} from 'react-native-permissions';
import {AppConstant} from '../constants/appconstant';
import {messages} from './permissionMessage';

export const settingAlert = msg => {
  setTimeout(() => {
    Alert.alert(
      AppConstant.appName,
      msg,
      Platform.OS == 'ios'
        ? [
            {
              text: 'CONTINUE',
              onPress: () => {},
              style: 'cancel',
            },
          ]
        : [
            {
              text: 'CONTINUE',
              onPress: () => {},
              style: 'cancel',
            },
            {
              text: 'SETTINGS',
              onPress: () => {
                openSettings().catch(() => {
                  console.warn('cannot open settings');
                });
              },
            },
          ],
      {cancelable: false},
    );
  }, 700);
};

export const cameraPermissions = async cb => {
  await check(
    Platform.select({
      android: PERMISSIONS.ANDROID.CAMERA,
      ios: PERMISSIONS.IOS.CAMERA,
    }),
  ).then(result => {
    if (result == 'granted' || result == 'limited') {
      return cb(true);
    } else if (result == 'blocked' || result == 'unavailable') {
      settingAlert(messages.CAMERA_PERMISSION_SETTING);
      return cb(false);
    }
    request(
      Platform.select({
        android: PERMISSIONS.ANDROID.CAMERA,
        ios: PERMISSIONS.IOS.CAMERA,
      }),
    ).then(status => {
      if (status == 'granted') {
        return cb(true);
      } else if (status == 'blocked') {
        settingAlert(messages.CAMERA_PERMISSION_SETTING);
        cb(false);
      }
    });
  });
};

export const galleryPermissions = async cb => {
  await check(
    Platform.select({
      android:
        Platform.Version >= 33
          ? PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE
          : PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
      ios: PERMISSIONS.IOS.PHOTO_LIBRARY,
    }),
  ).then(result => {
    console.log('result----------', result);
    if (Platform.OS === 'android') {
      return cb(true);
    }
    if (result == 'granted' || result == 'limited') {
      return cb(true);
    } else if (result == 'blocked' || result == 'unavailable') {
      settingAlert(messages.GALLERY_PERMISSION_SETTING);
      return cb(false);
    }
    request(
      Platform.select({
        android:
          Platform.Version >= 33
            ? PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE
            : PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
        ios: PERMISSIONS.IOS.PHOTO_LIBRARY,
      }),
    ).then(status => {
      console.log('status----------', status);

      if (status == 'granted') {
        cb(true);
      } else if (status == 'blocked') {
        if (Platform.OS === 'ios') {
          settingAlert(messages.GALLERY_PERMISSION_SETTING);
        }
        cb(false);
      }
    });
  });
};

export const checkMicroPhonePermission = async () => {
  return new Promise(async (resolve, reject) => {
    await check(
      Platform.select({
        android: PERMISSIONS.ANDROID.RECORD_AUDIO,
        ios: PERMISSIONS.IOS.MICROPHONE,
      }),
    ).then(result => {
      if (result == 'granted' || result == 'limited') {
        resolve(true);
      } else if (result == 'blocked' || result == 'unavailable') {
        settingAlert(messages.MICROPHONE_PERMISSION_SETTING);
        resolve(false);
        return;
      }
      request(
        Platform.select({
          android: PERMISSIONS.ANDROID.RECORD_AUDIO,
          ios: PERMISSIONS.IOS.MICROPHONE,
        }),
      ).then(status => {
        if (status == 'granted' || status == 'limited') {
          resolve(true);
        } else {
          settingAlert(messages.MICROPHONE_PERMISSION_SETTING);
          resolve(false);
          return;
        }
      });
    });
  });
};

export const locationPermissions = async cb => {
  console.log('2222222222----');

  const PERMISSION_REQUEST =
    Platform.OS == 'android'
      ? PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION
      : PERMISSIONS.IOS.LOCATION_WHEN_IN_USE;

  await check(
    // Platform.select({
    //   android: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
    //   ios: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
    // }),
    PERMISSION_REQUEST,
  ).then(result => {
    setTimeout(() => {
      if (result == 'denied') {
      }
    }, 1500);
    if (result == 'granted' || result == 'limited') {
      return cb(true);
    } else if (result == 'blocked' || result == 'unavailable') {
      settingAlert(messages.LOCATION_PERMISSION_SETTING);
      return cb(false);
    }
    request(
      PERMISSION_REQUEST,

      // Platform.select({
      //   android: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
      //   ios: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
      // }),
    ).then(status => {
      if (status == 'granted') {
        return cb(true);
      } else if (status == 'blocked') {
        settingAlert(messages.LOCATION_PERMISSION_SETTING);
        cb(false);
      }
    });
  });
};
