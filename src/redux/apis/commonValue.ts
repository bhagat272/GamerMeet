const BASE_URL = 'https://gamersmeet-stg-api.appsk.dev/api/v1/';
// LIVE_URL = 'https://gamersmeet-stg-api.appsk.dev/';
// DEMO_URL = 'https://gamersmeet-api.apps.demo2server.com'
// SOCKET_DEMO = 'https://gamersmeet-api.apps.demo2server.com/
const IMAGE_URL = 'https://gamersmeet-stg-api.appsk.dev';
const PRIVACY_POLICY =
  'https://gamersmeet-stg-web.appsk.dev/pages/privacy-policy';
const TERMS_AND_CONDITIONS =
  'https://gamersmeet-stg-web.appsk.dev/pages/terms-and-conditions';
const ABOUT_US = 'https://gamersmeet-stg-web.appsk.dev/pages/about-us';
const SOCKET_URL = 'https://gamersmeet-stg-api.appsk.dev/';
const GOOGLE_PLACE_KEY = 'AIzaSyDuln1NBCXrGoxBMaKhXMgR3o-xWuWas-4';

const kInternetError = "You're offline \n Please check internet connection.";
const kSorryError = 'Sorry, something went wrong.';
const APP_ID_IOS = 'ca-app-pub-5809470103488531~3347258534';
const APP_ID_ANDROID = 'ca-app-pub-5809470103488531~3295287649';
const AD_MOB_BANNER_IOS = 'ca-app-pub-5809470103488531/5179214955';
const AD_MOB_BANNER_ANDROID = 'ca-app-pub-5809470103488531/5973421873';
const kTrue = true;
const kFalse = false;

const kPost = 'POST';
const kGet = 'GET';
const kPut = 'PUT';
const kDelete = 'DELETE';

const kUserToken = 'user_token';
const kUserData = 'userData';
const kRememberData = 'remember_me_data';
const kAndroidProminent = 'androidProminent';
const KAUthToken = 'auth_token';
const PROJECT_ID = 'd959f724-5a35-4495-9116-72a436a8987c';
const kUserFCMToken = 'simulator';


const JSON_HEADER = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
};

const MULTI_PART_HEADER = {
  Accept: 'application/json',
  'Content-Type': 'multipart/form-data',
};

const API_FAILED = {
  status: false,
  message: kSorryError,
 };

const INTERNET_FAILED = {
  status: false,
  message: kInternetError,
  success: false,
};

export {
  BASE_URL,
  IMAGE_URL,
  PRIVACY_POLICY,
  TERMS_AND_CONDITIONS,
  ABOUT_US,
  kTrue,
  kFalse,
  kDelete,
  kPost,
  kGet,
  kPut,
  kUserToken,
  kUserData,
  kRememberData,
  kAndroidProminent,
  KAUthToken,
  JSON_HEADER,
  MULTI_PART_HEADER,
  API_FAILED,
  INTERNET_FAILED,
  kSorryError,
  kInternetError,
  GOOGLE_PLACE_KEY,
  SOCKET_URL,
  APP_ID_IOS,
  APP_ID_ANDROID,
  AD_MOB_BANNER_IOS,
  AD_MOB_BANNER_ANDROID,
  PROJECT_ID,
  kUserFCMToken,
};
