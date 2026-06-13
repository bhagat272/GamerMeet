import {
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  Keyboard,
  BackHandler,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import styles from './styles';
import imagePath from '../../../theme/imagePath';
import {AppButton, AppInput, Background} from '../../../components';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useDispatch, useSelector} from 'react-redux';
import {
  maxLengthEmail,
  maxLengthPassword,
  ValidateForm,
} from '../../../utils/validation';
import {DEVICE_INFO, ValidateFormType} from '../../../utils/helper';
import {loginAction} from '../../../redux/actions/userSessionAction';
import {buttonLoading} from '../../../redux/reducer/loadingReducer';
import {kRememberData} from '../../../redux/apis/commonValue';
import {getData, setData} from '../../../redux/apis/keyChain';
import {translateText} from '../../../utils/language';
import {SafeAreaView} from 'react-native-safe-area-context';
import {getFCMToken} from '../../../utils/notificationPermissions';
import {ScrollView} from 'react-native-gesture-handler';
// import { getFCMToken} from '../../../components/notificationPermissions';

/**
 * Login Component
 *
 * This component provides the login screen for the user.
 * It includes fields for email and password, handles form validation,
 * manages "Remember Me" functionality, and dispatches a login action.
 *
 * Features:
 * - Pre-fills email and password if "Remember Me" data exists.
 * - Validates user input before submitting.
 * - Allows toggling of password visibility.
 * - Provides navigation to "Forgot Password" and "Signup" screens.
 * - Disables back button when a login action is in progress.
 */
const Login = (props: any) => {
  const dispatch = useDispatch();
  // Get loading status from Redux state to disable interactions during processing.
  const {buttonLoader} = useSelector((state: any) => state.loading);
  // Reference for the password input to set focus when needed.
  const passwordRef = useRef<TextInput>(null);
  // State to toggle secure text entry for the password field.
  const [securePassword, setSecurePassword] = useState(true);
  // Reference for the keyboard aware scroll view.
  const keyboardRef = useRef<KeyboardAwareScrollView>(null);
  // State to track if "Remember Me" is enabled.
  const [rememberData, setRememberData] = useState(false);

  // Login form state includes email, password, and field validators.
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: '',
    validators: {
      email: {
        required: true,
        email: true,
        error: '',
      },
      password: {
        required: true,
        password: true,
        error: '',
      },
    },
  });
  const isIntro = props?.route?.params?.isIntro;

  // State to keep track of keyboard visibility and height.
  const [keyboardStatus, setKeyboardStatus] = useState<number | boolean>(false);

  // On mount, retrieve any stored "Remember Me" login data.
  useEffect(() => {
    (async () => {
      global.userToken = null;
      let RememberMeData = await getData(kRememberData);

      // Update the form with stored credentials if available.
      setLoginForm({
        ...loginForm,
        email: RememberMeData?.email,
        password: RememberMeData?.password,
      });
      // Set the state for Remember Data if credentials were found.
      setRememberData(RememberMeData == null ? false : true);
    })();
  }, []);

  // Prevent the hardware back button from working while a login request is processing.
  useEffect(() => {
    if (buttonLoader) {
      const handleBackButtonClick = () => {
        return true;
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

  // Listen for keyboard show/hide events to adjust the UI.
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

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
      hideSubscriptionDid.remove();
    };
  }, []);

  /**
   * Updates the login form state for the given field.
   *
   * @param key - The field name (e.g., 'email', 'password').
   * @param value - The value to set.
   *
   * Removes unwanted characters (like emojis) and spaces from the input.
   */
  const methodSetupLoginForm = (key: string, value: string): void => {
    let dic: any = {...loginForm};
    // Remove emojis and certain special characters from the input.
    value = value.replace(
      /([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g,
      '',
    );
    // For email and password fields, remove spaces.
    if (key == 'email' || key == 'password') {
      value = value.replace(/\s/g, '');
    }
    dic[key] = value;
    // Reset the error for the field if any.
    if (dic.validators && dic.validators[key]) {
      dic.validators[key].error = '';
    }
    setLoginForm(dic);
  };

  /**
   * Handles the login action.
   *
   * Dismisses the keyboard, validates the form, and dispatches the login action.
   * Also handles "Remember Me" functionality by storing the credentials if enabled.
   *
   * On successful login, navigates the user either to the BottomTab screen (if profile
   * is set up) or to the CreateProfile screen.
   */
  const methodLogin = async () => {
    // Dismiss the keyboard.
    Keyboard.dismiss();
    console.log('Login method started');
    // Validate the form inputs.
    const validForm: ValidateFormType = ValidateForm(loginForm);
    setLoginForm({...loginForm});
    console.log('Validation passed:', validForm);
    if (validForm.status) {
      // Prepare the request object by merging the login form and device info.
      const request: any = {...loginForm, ...DEVICE_INFO};
      console.log(request);
      // let dic = {...DEVICE_INFO};
      //   console.log('Fetching FCM token...');

      // let token: any = await getFCMToken();
      //  console.log('FCM token:', token);
      // if (!token) {
      //   dic.firebase_token = 'simulator';
      // } else {
      //   dic.firebase_token = token;
      // }
      // Object.assign(DEVICE_INFO, dic);
      delete request.validators;

      // Dispatch the loading state and login action.
      dispatch(buttonLoading(true));
      dispatch(loginAction(request)).then((res: any) => {
        dispatch(buttonLoading(false));
        if (res) {
          // If "Remember Me" is enabled, store the credentials; otherwise, clear them.
          if (rememberData) {
            setData(kRememberData, request);
          } else {
            setData(kRememberData, null);
          }
          // Navigate based on whether the user's profile is set up.
          if (res?.data?.profile_setup) {
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
        }
      });
    }
  };

  return (
    // Disable touch interactions when a login action is processing.
    <Background>
      <View
        pointerEvents={buttonLoader ? 'none' : 'auto'}
        style={styles.container}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{flex: 1}}>
          <ScrollView
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}>
            {/* App Logo */}
            <Image
              source={imagePath.logo}
              resizeMode={'contain'}
              style={styles.logo_image}
            />
            {/* Welcome Message */}
            <Text style={styles.welcome_text}>{translateText('Log_in')}</Text>
            {/* Instruction Text */}
            {/* <Text style={styles.enter_details_text}>
          {translateText('enter_your_login_detail')}
          {'\n'}
          {translateText('access_account')}
        </Text> */}

            {/* Email Input Field */}
            <AppInput
              value={loginForm?.email}
              placeholder={translateText('enter_your_email')}
              label={translateText('email_address')}
              // inputLeftImage={imagePath.email}
              onChangeText={value => {
                methodSetupLoginForm('email', value);
              }}
              // Set focus to password field after completing email.
              setFocus={() => {
                passwordRef?.current?.focus();
              }}
              returnKeyType={'next'}
              maxLength={maxLengthEmail}
              errorMsg={loginForm?.validators?.email?.error}
              keyboardType={'email-address'}
            />

            {/* Password Input Field */}
            <AppInput
              getFocus={passwordRef}
              value={loginForm?.password}
              placeholder={translateText('enter_password')}
              label={translateText('password')}
              // inputLeftImage={imagePath.password}
              leftImageStyle={styles.password_icon_style}
              onChangeText={value => {
                methodSetupLoginForm('password', value);
              }}
              secureTextEntry={securePassword}
              // Toggle the password visibility icon.
              inputRightImage={
                !securePassword ? imagePath.eye_on : imagePath.eye_off
              }
              onPressRight={() => {
                setSecurePassword(!securePassword);
              }}
              returnKeyType={'done'}
              maxLength={maxLengthPassword}
              errorMsg={loginForm?.validators?.password?.error}
            />

            {/* Remember Me and Forgot Password Section */}
            <View style={styles.remember_view_container}>
              <View style={styles.remember_me_view}>
                {/* Checkmark image based on "Remember Me" state */}
                <TouchableOpacity
                  onPress={() => {
                    setRememberData(!rememberData);
                  }}>
                  <Image
                    resizeMode="contain"
                    source={rememberData ? imagePath.check : imagePath.uncheck}
                    style={styles.check_image}
                  />
                </TouchableOpacity>
                <Text style={styles.remember_me_text}>
                  {translateText('remember_me')}
                </Text>
              </View>
              {/* Navigate to the Forgot Password screen */}
              <Text
                onPress={() => {
                  props.navigation.navigate('ForgotPassword');
                }}
                style={styles.forgot_password_text}>
                {translateText('forgot_password')}?
              </Text>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>

        {/* Display the Login button only when the keyboard is not visible */}
        {keyboardStatus ? (
          <></>
        ) : (
          <AppButton
            title={translateText('Log_in')}
            onPress={() => {
              console.log('====================================');
              console.log('dss');
              console.log('====================================');
              methodLogin();
            }}
            isLoading={buttonLoader}
          />
        )}

        {/* Navigation link to the Signup screen */}
        <Text style={styles.dont_have_acc_text}>
          {translateText('do_not_have_an_account')}{' '}
          <Text
            style={styles.sign_up_text}
            onPress={() => {
              // props.navigation.replace('Signup');
              isIntro
                ? props.navigation.goBack()
                : props.navigation.navigate('Signup');
            }}>
            {translateText('sign_up_here')}
          </Text>
        </Text>
      </View>
    </Background>
  );
};

export default Login;
