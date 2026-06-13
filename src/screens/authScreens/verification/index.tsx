import {
  View,
  Text,
  Image,
  Keyboard,
  BackHandler,
  ActivityIndicator,
  Platform,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import styles from './styles';
import {AppButton, Background, KeyboardScroll} from '../../../components';
import imagePath from '../../../theme/imagePath';
import BackgroundTimer from 'react-native-background-timer';
import OTPTextView from 'react-native-otp-textinput';
import {showToastMessage} from '../../../utils/toast';
import {DEVICE_INFO} from '../../../utils/helper';
import {
  checkUserAction,
  forgotPasswordAction,
  signupAction,
  verifyEmailAction,
  verifyOTPAction,
} from '../../../redux/actions/userSessionAction';
import {useDispatch, useSelector} from 'react-redux';
import {buttonLoading} from '../../../redux/reducer/loadingReducer';
import {translateText} from '../../../utils/language';
import {Colors} from '../../../theme';
import {
  getFCMToken,
  requestAndroidNotificationPermission,
} from '../../../utils/notificationPermissions';
import DeviceInfo from 'react-native-device-info';
// import { getFCMToken } from '../../../components/notificationPermissions';

/**
 * Verification Component
 *
 * This component handles OTP (One Time Password) verification for different scenarios,
 * such as user signup or password reset (forget password).
 * It displays a countdown timer for OTP resend, verifies the entered OTP,
 * and dispatches appropriate Redux actions based on the context.
 */
const Verification = (props: any) => {
  const dispatch = useDispatch();
  // Get loading state from Redux to disable UI interaction during API calls.
  const {buttonLoader} = useSelector((state: any) => state.loading);
  // Reference to the OTPTextView component to control its behavior (e.g., clear inputs).
  const otpInput = useRef<any>(null);
  // State to store the OTP entered by the user.
  const [otp, setOtp] = useState('');
  // State to handle the countdown for OTP resend.
  const [counter, setCounter] = useState(60);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  // Extract parameters from navigation route. They can contain data for signup, forget password, etc.
  const {signupReqData, from, forgetPasswordData, emailChangeData} = props
    ?.route?.params
    ? props?.route?.params
    : false;
  // State to track keyboard visibility; used to conditionally render the verification button.
  const [keyboardStatus, setKeyboardStatus] = useState<number | boolean>(false);

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
        console.log('✅ DEVICE_INFO ready for signup:', DEVICE_INFO);
      } catch (error) {
        console.log('❌ DEVICE_INFO setup failed:', error);
      }
    })();
  }, []);

  // Countdown timer: decreases the counter every second and stops when it reaches 0.
  useEffect(() => {
    // Set an interval timer using BackgroundTimer to update the counter.
    let interval = BackgroundTimer.setInterval(() => {
      if (counter <= 0) {
        // When counter reaches 0, clear and stop the timer.
        BackgroundTimer.clearInterval(interval);
        BackgroundTimer.stop();
      } else {
        // Otherwise, decrement the counter.
        setCounter(counter - 1);
      }
    }, 1000);
    // Cleanup: clear the interval and stop the timer when the component unmounts.
    return () => {
      BackgroundTimer.clearInterval(interval);
      BackgroundTimer.stop();
    };
  }, [counter]);

  // Prevent hardware back button press when a button action (like OTP submission) is in progress.
  useEffect(() => {
    if (buttonLoader) {
      const handleBackButtonClick = () => {
        return true; // Disable default back action.
      };
      let backEvent = BackHandler.addEventListener(
        'hardwareBackPress',
        handleBackButtonClick,
      );
      return () => {
        backEvent.remove();
      };
    }
  }, [buttonLoader]);

  // Listen for keyboard events to update the keyboardStatus state.
  useEffect(() => {
    const showSubscription = Keyboard.addListener('keyboardDidShow', e => {
      setKeyboardStatus(e.endCoordinates.height);
    });
    const hideSubscription = Keyboard.addListener('keyboardWillHide', () => {
      setKeyboardStatus(0);
    });
    const hideSubscriptionDid = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardStatus(0);
    });

    // Cleanup listeners on unmount.
    return () => {
      showSubscription.remove();
      hideSubscription.remove();
      hideSubscriptionDid.remove();
    };
  }, []);

  const methodResetOtp = () => {
    setIsLoading(true);
    otpInput?.current?.clear();

    let request = {};

    if (from === 'forget_password') {
      request = {...forgetPasswordData, is_resend: 1};
      dispatch(forgotPasswordAction(request)).then((res: boolean) => {
        setIsLoading(false);
        if (res) {
          setCounter(60); // restart counter only after success
        }
      });
    } else if (from === 'email_change' || from === 'new_email_change') {
      request = {...emailChangeData, is_resend: 1};
      dispatch(checkUserAction(request)).then((res: boolean) => {
        setIsLoading(false);
        if (res) {
          setCounter(60);
        }
      });
    } else {
      request = {...signupReqData, is_resend: 1};
      dispatch(checkUserAction(request)).then((res: boolean) => {
        setIsLoading(false);
        if (res) {
          setCounter(60);
        }
      });
    }
  };

  /**
   * Submits the OTP for verification during signup.
   *
   * Performs simple validation to ensure OTP is numeric and exactly 6 digits,
   * then dispatches the signup action with the OTP and additional device information.
   */
  const methodSubmitVerification = async () => {
    Keyboard.dismiss(); // Dismiss the keyboard before submission.
    // Check if OTP field is empty.
    if (otp === '') {
      showToastMessage(translateText('please_enter_otp'));
      return;
    }
    // Validate that OTP contains only numeric values.
    let RegExp = /^\d+$/;
    if (!RegExp.test(otp)) {
      showToastMessage(translateText('please_enter_only_numeric_values'));
      return;
    }
    // Ensure the OTP length is exactly 6 digits.
    if (otp.length !== 6) {
      showToastMessage(translateText('please_enter_valid_otp'));
      return;
    }

    // Prepare the request object by merging signup data with device info.
    const dic = {...signupReqData};

    let signUpDic = {
      email: dic?.email,
      password: dic?.password,
      // profile_picture: false,
      otp: otp,
      firebase_token: DEVICE_INFO?.firebase_token || 'simulator',
      firebase_device_type: DEVICE_INFO?.firebase_device_type || Platform.OS,
      firebase_device_id: DEVICE_INFO?.device_unique_id || 'unknown',
    };

    dispatch(buttonLoading(true));
    dispatch(signupAction(signUpDic)).then((res: boolean) => {
      dispatch(buttonLoading(false));
      if (res) {
        // On successful verification, navigate to the CreateProfile screen.
        props.navigation.reset({
          index: 0,
          routes: [{name: 'ProfileSetup'}],
        });
      }
    });
  };

  /**
   * Submits the OTP for verification during the forget password flow.
   *
   * Performs validation on the OTP input and then dispatches verifyOTPAction.
   * Upon successful verification, navigates the user to the ResetPassword screen.
   */
  const methodSubmitForgetVerification = () => {
    Keyboard.dismiss(); // Dismiss the keyboard.
    // Check if OTP field is empty.
    if (otp === '') {
      showToastMessage(translateText('please_enter_otp'));
      return;
    }
    // Validate OTP contains only numeric values.
    let RegExp = /^\d+$/;
    if (!RegExp.test(otp)) {
      showToastMessage(translateText('please_enter_only_numeric_values'));
      return;
    }
    // Ensure the OTP length is 6 digits.
    if (otp.length !== 6) {
      showToastMessage(translateText('please_enter_valid_otp'));
      return false;
    }
    // Prepare the request object using the forget password data.
    const dic = {...forgetPasswordData};
    dic.otp = otp; // Add OTP to the request.

    // Dispatch loading state and verify OTP.
    dispatch(buttonLoading(true));
    dispatch(verifyOTPAction(dic)).then((res: any) => {
      dispatch(buttonLoading(false));
      if (res) {
        console.log('==============RESET_TOKEN======================');
        console.log(res?.data?.reset_token);
        console.log('====================================');
        // On success, navigate to the ResetPassword screen.
        props.navigation.navigate('ResetPassword', {
          from: from,
          forgetPasswordData: forgetPasswordData,
          resetToken: res?.data?.reset_token,
          // otp: otp,
        });
      } else {
        // If verification fails, clear the OTP input field.
        otpInput?.current?.clear();
      }
    });
  };

  const methodSubmitChangeEmailVerification = () => {
    Keyboard.dismiss(); // Dismiss the keyboard.
    // Check if OTP field is empty.
    if (otp === '') {
      showToastMessage(translateText('please_enter_otp'));
      return;
    }
    // Validate OTP contains only numeric values.
    let RegExp = /^\d+$/;
    if (!RegExp.test(otp)) {
      showToastMessage(translateText('please_enter_only_numeric_values'));
      return;
    }
    // Ensure the OTP length is 6 digits.
    if (otp.length !== 6) {
      showToastMessage(translateText('please_enter_valid_otp'));
      return false;
    }
    // Prepare the request object using the forget password data.
    const dic = {...emailChangeData, otp};
    dic.otp = otp; // Add OTP to the request.

    // Dispatch loading state and verify OTP.
    dispatch(buttonLoading(true));
    dispatch(verifyOTPAction(dic)).then((res: any) => {
      dispatch(buttonLoading(false));
      if (res) {
        props.navigation.replace('ChangeEmail');
      } else {
        // If verification fails, clear the OTP input field.
        otpInput?.current?.clear();
      }
    });
  };
  const methodSubmitNewEmailVerification = () => {
    Keyboard.dismiss(); // Dismiss the keyboard.
    // Check if OTP field is empty.
    if (otp === '') {
      showToastMessage(translateText('please_enter_otp'));
      return;
    }
    // Validate OTP contains only numeric values.
    let RegExp = /^\d+$/;
    if (!RegExp.test(otp)) {
      showToastMessage(translateText('please_enter_only_numeric_values'));
      return;
    }
    // Ensure the OTP length is 6 digits.
    if (otp.length !== 6) {
      showToastMessage(translateText('please_enter_valid_otp'));
      return false;
    }
    // Prepare the request object using the forget password data.
    const dic = {...emailChangeData, otp};
    dic.otp = otp; // Add OTP to the request.

    // Dispatch loading state and verify OTP.
    dispatch(buttonLoading(true));
    dispatch(verifyEmailAction(dic)).then((res: any) => {
      dispatch(buttonLoading(false));
      if (res) {
        // props.navigation.navigate('BottomTab', {
        //   screen: 'Profile',
        // });
        props.navigation.reset({
          index: 0,
          routes: [
            {
              name: 'BottomTab',
              state: {
                routes: [{name: 'Profile'}],
              },
            },
          ],
        });
      } else {
        // If verification fails, clear the OTP input field.
        otpInput?.current?.clear();
      }
    });
  };
  /**
   * Returns a partially masked email address.
   *
   * Masks the local-part of the email by replacing it with ● characters,
   * while leaving the domain intact. This is useful for displaying a hint to the user.
   */
  const methodShowPartialEmail = () => {
    let emailString = '';
    let emailStr = '';

    // Check the context to determine which email to use.
    if (from === 'forget_password') {
      emailStr = forgetPasswordData?.email;
      // Get the domain part of the email.
      emailString = forgetPasswordData?.email?.substring(
        forgetPasswordData?.email?.indexOf('@'),
        forgetPasswordData?.email?.length,
      );
    } else {
      emailStr = signupReqData?.email;
      emailString = signupReqData?.email?.substring(
        signupReqData?.email?.indexOf('@'),
        signupReqData?.email?.length,
      );
    }
    // Mask the local-part of the email with ● symbols.
    let convertedStr = emailString?.padStart(emailStr?.length, '●');

    return convertedStr;
  };

  return (
    // Disable user interaction when a button action is loading.
    <View
      pointerEvents={buttonLoader ? 'none' : 'auto'}
      style={styles.container}>
      <Background>
        {/* KeyboardScroll is a custom component that allows scrolling when the keyboard is open */}
        <KeyboardScroll>
          {/* App Logo */}
          <Image
            source={imagePath.logo}
            resizeMode={'contain'}
            style={styles.logo_image}
          />
          {/* Screen Title */}
          <Text style={styles.welcome_text}>
            {translateText('otp_verification')}
          </Text>
          {/* Instruction Text showing masked email */}
          <Text style={styles.enter_details_text}>
            {from === 'email_change'
              ? translateText('a_6-digit_otp_has_been_sent_to_current')
              : translateText('6_digit_verification_code')}
            {/* {'\n'} */}
            {/* {translateText('was_just_sent_to')} {methodShowPartialEmail()} */}
          </Text>

          {/* OTP Input Field */}
          <View style={{alignSelf: 'center'}}>
            <OTPTextView
              ref={otpInput}
              handleTextChange={(text: string) => {
                setOtp(text);
              }}
              inputCount={6}
              keyboardType="numeric"
              tintColor={Colors.secondary.OFF_WHITE}
              offTintColor={Colors.primary.APP_THEME}
              textInputStyle={styles.otp_text_input}
            />
          </View>

          {/* Display counter for OTP resend or provide a clickable "Resend OTP" text when timer expires */}

          {counter ? (
            <Text style={styles.resend_text}>
              {translateText('resend_in')} : {counter} {translateText('sec')}
            </Text>
          ) : !isLoading ? (
            <Text
              style={[styles.resend_text]}
              onPress={() => {
                methodResetOtp();
              }}>
              {translateText('resend_otp')}
            </Text>
          ) : (
            <ActivityIndicator
              color={Colors.primary.APP_THEME}
              size={'small'}
              style={styles.loader}
            />
          )}
        </KeyboardScroll>
        {/* Render the Verify button only when the keyboard is not visible */}
        {keyboardStatus ? (
          <></>
        ) : (
          <AppButton
            title={translateText('verify')}
            onPress={() => {
              // Depending on the context, call the appropriate verification method.
              if (from === 'forget_password') {
                methodSubmitForgetVerification();
              } else if (from === 'email_change') {
                methodSubmitChangeEmailVerification();
              } else if (from === 'new_email_change') {
                methodSubmitNewEmailVerification();
              } else {
                methodSubmitVerification();
              }
            }}
            isLoading={buttonLoader}
          />
        )}
      </Background>
    </View>
  );
};

export default Verification;
