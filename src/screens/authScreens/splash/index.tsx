import React, {useEffect} from 'react';
import {
  DEVICE_INFO,
  setDefaultValues,
  setGlobalUserToken,
  setUserData,
} from '../../../utils/helper';
import SplashScreen from 'react-native-splash-screen';
import {getData} from '../../../redux/apis/keyChain';
import {kUserData, kUserToken} from '../../../redux/apis/commonValue';
import {
  methodDetectDeviceLanguage,
  translateLanguage,
} from '../../../utils/language';
import {useDispatch} from 'react-redux';
import {userPayload} from '../../../redux/reducer/userSessionReducer';
import {Platform} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import {
  getFCMToken,
  requestAndroidNotificationPermission,
} from '../../../utils/notificationPermissions';

const Splash = (props: any) => {
  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      try {
        if (Platform.OS === 'android') {
          await requestAndroidNotificationPermission();
        }

        let dic = {...DEVICE_INFO};
        dic.device_unique_id = await DeviceInfo.getUniqueId();
        dic.firebase_token = (await getFCMToken()) || 'simulator';
        dic.firebase_device_type = Platform.OS;

        Object.assign(DEVICE_INFO, dic);
        console.log('✅ DEVICE_INFO ready for signup:=====>', DEVICE_INFO);
      } catch (error) {
        console.log('❌ DEVICE_INFO setup failed:', error);
      }
    })();
  }, []);

  useEffect(() => {
    setDefaultValues(props.navigation);
    const deviceLanguage = methodDetectDeviceLanguage();
    translateLanguage(deviceLanguage);
    console.log('====================================');
    console.log(DEVICE_INFO);
    console.log('====================================');
    setTimeout(() => {
      (async () => {
        let token: any = await getData(kUserToken);
        let userData: any = await getData(kUserData);
        let profileSetup = userData?.profile_setup;
        console.log('token====', token);
        console.log('userData====', userData);
        console.log('profilesetup------------->', profileSetup);
        if (token) {
          setGlobalUserToken(token);
          setUserData(userData);
          dispatch(userPayload(userData));
          if (profileSetup) {
            props.navigation.reset({
              index: 0,
              routes: [{name: 'BottomTab'}],
            });
          } else {
            props.navigation.reset({
              index: 0,
              routes: [{name: 'ProfileSetup'}],
            });
          }
        } else {
          props.navigation.reset({
            index: 0,
            routes: [{name: 'IntroScreen'}],
          });
        }
      })();
    }, 2000);
    setTimeout(() => {
      SplashScreen.hide();
    }, 3000);
  }, []);
  return <></>;
};

export default Splash;
