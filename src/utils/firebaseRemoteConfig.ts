// import remoteConfig from "@react-native-firebase/remote-config";
// import { appLogs } from "./helper";
// import { BASE_URLS } from "../appRedux/apis/commonValue";

export let keys = {
  msg: {
    r_n: 'Please enter name', //empty condition for name
    r_f_n: 'Please enter a first name', //empty condition for first name
    r_l_n: 'Please enter a last name', //empty condition for last name
    r_u_n: 'Please enter a user name', //empty condition for username

    v_n: 'Please enter a valid name', //required condition for name
    v_f_n: 'Please enter a valid first name', //required condition for first name
    v_l_n: 'Please enter a valid last name', //required condition for last name
    v_u_n: 'Please enter a valid user name', //required condition for username

    r_e: 'Please enter your email', //required condition for email
    v_e: 'Please enter valid email', //validation condition for email

    r_ph: 'Please enter your phone number', //required condition for phone number
    r_mb: 'Please enter your mobile number', //required condition for mobile number

    r_p: 'Please enter your password', //empty condition for password(signup screen)
    r_c_p: 'Please enter old password', //empty condition for current password(change password screen)
    r_n_p: 'Please enter your new password', //empty condition for new password(change password screen)
    r_co_p: 'Please enter your confirm password', //empty condition for confirm password
    v_l_p: 'Please enter a valid password',
    o_w_p:
      'Password should be between 8 to 15 characters and should contain atleast one uppercase, one lowercase ,one number and one special character.',
    s_c_p:
      'Confirm Password should be between 8 to 15 characters and should contain atleast one uppercase, one lowercase ,one number and one special character.', //validation condition for passwords(new,old,confirm)
    s_c_p_p:
      'Confirm Password should be between 8 to 15 characters and should contain atleast one uppercase, one lowercase ,one number and one special character.',
    c_p_p:
      'Confirm Password should be between 8 to 15 characters and should contain atleast one uppercase, one lowercase ,one number and one special character.',
    v_c_p_p:
      'Confirm Password should be between 8 to 15 characters and should contain atleast one uppercase, one lowercase ,one number and one special character.',
    v_p: 'Password should be between 8 to 15 characters and should contain atleast one uppercase, one lowercase ,one number and one special character.', //validation condition for passwords(new,old,confirm)
    v_c_p:
      'Password should be between 8 to 15 characters and should contain atleast one uppercase, one lowercase ,one number and one special character.', //validation condition for passwords(new,old,confirm)
    v_n_p:
      'Password should be between 8 to 15 characters and should contain atleast one uppercase, one lowercase ,one number and one special character.', //validation condition for passwords(new,old,confirm)
    v_co_p:
      'Password should be between 8 to 15 characters and should contain atleast one uppercase, one lowercase ,one number and one special character.', //validation condition for passwords(new,old,confirm)
    c_n_p: 'Password and Confirm password must be the same',
    v_n_c_p: 'New password and confirm password must be the same', //confirm password does not match password or new password

    r_z_c: 'Please enter your zip code', //required condition for zip code

    r_i: 'Please select image', //required condition for image

    r_a: 'Please select address', //required condition for address

    r_o: 'Please enter OTP', //required condition for otp
    i_o: 'Invalid OTP', //otp does not match

    b_i_r: 'Please enter bio',
    r_t_p: 'Please agree with Terms and Condition and Privacy Policy', //required condition for terms and conditions & privacy policy
    // l_n: ""s,
  },

  Kpass: 'GamerMeetRandom@123',
  google_place_api_key:
    'UVVsNllWTjVSRU5ST0V4c01HdEVXWEUyWWs5Tk4yaFJaM05FUTFVMVQyMDRVbkZrWmsxRkdhbWVyTWVldFJhbmRvbUAxMjNVVlZzTmxsV1RqVlNSVTVTVDBWNGMwMUhkRVZYV0VVeVdXczVUazR5YUZKYU0wNUZVVEZWTVZReU1EUlZia1pyV21zeFJrZGhiV1Z5VFdWbGRGSmhibVJ2YlVBeE1qTT0=',

  lengths: {
    min_n: 1, //minimum length of name
    max_n: 45, //maximum length of name
    max_e: 50, //maximum email length
    min_p: 8, //minimum password length
    max_p: 16, //maximum password length
    min_m: 7, //minimum phone number length
    max_m: 15, //maximum phone number length
    min_z_c: 4, //minimum zip code length
    max_z_c: 10, //maximum zip code length
  },

  // "url": { ...BASE_URLS },
  // // "url": {},
  // "alert": {
  //     "message": "App update"
  // },
  // "android_version": {
  //     "version": "2.0.3",
  //     "maintenance": 0,
  //     "force_update": 0,
  //     "link": "https://google.com",
  //     "maintenance_h2": "Sorry for the inconvenience. We'll be back and running as fast as possible.",
  //     "maintenance_h1": "We're undergoing a bit of Scheduled Maintenance",
  //     "alert_title": "Update",
  //     "alert_msg": "application update available"
  // },
  // "ios_version": {
  //     "version": "2.0.3",
  //     "maintenance": 0,
  //     "force_update": 0,
  //     "link": "https://google.com",
  //     "maintenance_h2": "Sorry for the inconvenience. We'll be back and running as fast as possible.",
  //     "maintenance_h1": "We're undergoing a bit of Scheduled Maintenance",
  //     "alert_title": "Update",
  //     "alert_msg": "application update available"
  // },
  // "is_firebase":"0",
};
// export const firebaseRemoteFetchData = () => {
//     return new Promise(async (resolve, reject) => {
//         let configSettingSet = await remoteConfig().setConfigSettings({
//             minimumFetchIntervalMillis: 30000,
//         });
//         // appLogs('configSettingSet--------', configSettingSet)
//         let configFileFetch = await remoteConfig().fetchAndActivate()
//         appLogs('firebaseRemoteFetchData--------', configFileFetch)
//         if (configFileFetch) {
//             // appLogs('Configs were retrieved from the backend and activated.', configFileFetch);
//             let dataSet = await firebaseRemoteDataSet()
//             resolve(dataSet)

//         } else {
//             appLogs(
//                 'No configs were fetched from the backend, and the local configs were already activated', configFileFetch
//             );
//             resolve(false)
//         }
//     })
// }

// export const firebaseRemoteDataSet = () => {
//     return new Promise(async (resolve, reject) => {
//         const parameters = remoteConfig().getAll();
//         let dicData = {}
//         // appLogs('parameters-----------', stringData + 'objectData---android_version---' + objectData?.android_version);
//         // appLogs('parameters: ', JSON.stringify(parameters));
//         Object.entries(parameters).forEach($ => {
//             const [key, entry] = $;
//             dicData = {
//                 ...dicData,
//                 [key]: JSON.parse(entry.asString())
//             }
//         });
//         // appLogs('dicData: ', JSON.stringify([dicData]));
//         firebaseRemoteConfigData = { ...firebaseRemoteConfigData, ...dicData }
//         appLogs('dicData: ', JSON.stringify(firebaseRemoteConfigData));
//         resolve(firebaseRemoteConfigData)
//     })
// }
