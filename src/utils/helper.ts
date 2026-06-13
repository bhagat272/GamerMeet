import DeviceInfo from 'react-native-device-info';
import {showToastMessage} from './toast';
import {
  KAUthToken,
  kSorryError,
  kUserData,
  kUserFCMToken,
  kUserToken,
} from '../redux/apis/commonValue';
import {removeItemValue, setData} from '../redux/apis/keyChain';
import {handleSetRoot} from '../navigation/navigationService';
import {Platform} from 'react-native';
import {socketCustomLogoutDisconnect, socketIsConnected} from './socket';
import {userPayload} from '../redux/reducer/userSessionReducer';
import base64 from 'react-native-base64';
import {keys} from './firebaseRemoteConfig';

export const socketInstance: any = {
  socket: null,
  isCustomDisconnect: false,
  isDuringConnection: false,
  launchApp: true,
  last_api_call_time: '',
};

export const setDefaultValues = (navigation: any) => {
  global.navRef = navigation;
};

export const setGlobalUserToken = (token: string | any) => {
  global.userToken = token;
};
export const setUserData = (data: object | any) => {
  global.userData = data;
};

export const showErrorMessage = (p0: string) => {
  showToastMessage(kSorryError);
};

export const logout = async (isLogin = true) => {
  setGlobalUserToken('');
  setUserData('');
  await removeItemValue(kUserData);
  await removeItemValue(kUserToken);
  await removeItemValue(KAUthToken);
  await removeItemValue(kUserFCMToken);
  if (socketIsConnected()) {
    socketCustomLogoutDisconnect();
  }
  if (isLogin) {
    handleSetRoot({name: 'Login'});
  }
};

export const getDeviceUniqueId = async () => {
  let device = await DeviceInfo.getUniqueId();
  DEVICE_INFO.device_unique_id = device;
  return device;
};

export const DEVICE_INFO = {
  firebase_device_type: Platform.OS.toLocaleUpperCase(),
  firebase_device_id: DeviceInfo.getDeviceId(),
  device_unique_id: 'simulator',
  firebase_token: 'simulator',
};

export const saveAuthToken = (authToken: string) => {
  global.authToken = authToken;
};

export interface ValidateFormType {
  value: object;
  status?: boolean;
}

export const updateUserData = (userDetail: any, dispatch: any) => {
  setData(kUserData, userDetail);
  setUserData(userDetail);
  dispatch(userPayload(userDetail));
};

export const methodSecurityEncoded = (data: any) => {
  let singleEncode = base64.encode(data);
  let encodeSingleWithPass = base64.encode(singleEncode + keys?.Kpass);
  let sendEncode = base64.encode(
    singleEncode + keys?.Kpass + encodeSingleWithPass,
  );
  console.log('sendEncode-----------', sendEncode);
  return sendEncode;
};

export const methodSecurityDecoded = (data: any) => {
  let doubleDecodeString = base64.decode(data);
  let singleDat = doubleDecodeString.split(keys?.Kpass);
  if (singleDat && singleDat.length > 0) {
    let singleEndCodeData = singleDat[0];
    let singleDecodeString = base64.decode(singleEndCodeData);
    //console.log('sendDecode-----------', singleDecodeString);
    return singleDecodeString;
  }
};

export function debounce<F extends (...args: any[]) => any>(
  func: F,
  delay: number,
): (...args: Parameters<F>) => void {
  let timer: ReturnType<typeof setTimeout>;
  return (...args: Parameters<F>) => {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      func(...args);
    }, delay);
  };
}


