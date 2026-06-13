import React, { useEffect, useRef, useState } from 'react';
import {
  BackHandler,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  View,
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { useDispatch, useSelector } from 'react-redux';
import {
  AppButton,
  AppInput,
  Background
} from '../../../components';
import { resetPasswordAction } from '../../../redux/actions/userSessionAction';
import { buttonLoading } from '../../../redux/reducer/loadingReducer';
import imagePath from '../../../theme/imagePath';
import { ValidateFormType } from '../../../utils/helper';
import { translateText } from '../../../utils/language';
import { maxLengthPassword, ValidateForm } from '../../../utils/validation';
import styles from './styles';

const ResetPassword = (props: any) => {
  const dispatch = useDispatch();
  const {buttonLoader} = useSelector((state: any) => state.loading);
  const passwordRef = useRef<TextInput>(null);
  const [securePassword, setSecurePassword] = useState(true);
  const [securePasswordConfirm, setSecurePasswordConfirm] = useState(true);
  const {forgetPasswordData, from, otp, resetToken} = props?.route?.params
    ? props?.route?.params
    : false;

  const [resetPasswordReq, setResetPasswordReq] = useState({
    password: '',
    confirm_password: '',
    validators: {
      password: {
        required: true,
        password: true,
        error: '',
      },
      confirm_password: {
        required: true,
        matchWith: 'password',
        error: '',
      },
    },
  });

  const [keyboardStatus, setKeyboardStatus] = useState<number | boolean>(false);

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

  const methodSetupResetPassword = (key: string, value: string): void => {
    let dic: any = {...resetPasswordReq};
    value = value.replace(
      /([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g,
      '',
    );
    if (key == 'password' || key == 'confirm_password') {
      value = value.replace(/\s/g, '');
    }
    dic[key] = value;
    if (dic.validators && dic.validators[key]) {
      dic.validators[key].error = '';
    }
    setResetPasswordReq(dic);
  };

  const methodResetPassword = () => {
    Keyboard.dismiss();
    const validForm: ValidateFormType = ValidateForm(resetPasswordReq);
    setResetPasswordReq({...resetPasswordReq});
    if (validForm.status) {
      const request = {...resetPasswordReq, ...forgetPasswordData, otp};
      delete request.validators;
      const dic = {
        reset_token: resetToken,
        new_password: resetPasswordReq?.password,
      };
      dispatch(buttonLoading(true));
      dispatch(resetPasswordAction(dic)).then((res: boolean) => {
        dispatch(buttonLoading(false));
        if (res) {
          props.navigation.reset({
            index: 0,
            routes: [{name: 'Login'}],
          });
        }
      });
    }
  };

  return (
    <View
      pointerEvents={buttonLoader ? 'none' : 'auto'}
      style={styles.container}>
      <Background>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{flex: 1}}>
          <ScrollView
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}>
            {' '}
            <Image
              source={imagePath.logo}
              resizeMode={'contain'}
              style={styles.logo_image}
            />
            <Text style={styles.welcome_text}>
              {translateText('reset_password')}
            </Text>
            <Text style={styles.enter_details_text}>
              {translateText('set_a_new_password_for')}
              {/* {'\n'} */}
              {/* {translateText('your_account')}. */}
            </Text>
            <AppInput
              placeholder={translateText('enter_password')}
              label={translateText('password')}
              // inputLeftImage={imagePath.password}
              leftImageStyle={styles.password_icon_style}
              getFocus={passwordRef}
              value={resetPasswordReq?.password}
              maxLength={maxLengthPassword}
              secureTextEntry={securePassword}
              inputRightImage={
                !securePassword ? imagePath.eye_on : imagePath.eye_off
              }
              onPressRight={() => {
                setSecurePassword(!securePassword);
              }}
              onChangeText={value => {
                methodSetupResetPassword('password', value);
              }}
              errorMsg={resetPasswordReq?.validators?.password?.error}
              returnKeyType="next"
              setFocus={() => {
                if (passwordRef?.current) {
                  passwordRef?.current?.focus();
                }
              }}
            />
            <AppInput
              placeholder={translateText('enter_your_new_password')}
              label={translateText('confirm_password')}
              // inputLeftImage={imagePath.password}
              getFocus={passwordRef}
              maxLength={maxLengthPassword}
              secureTextEntry={securePasswordConfirm}
              inputRightImage={
                !securePasswordConfirm ? imagePath.eye_on : imagePath.eye_off
              }
              onPressRight={() => {
                setSecurePasswordConfirm(!securePasswordConfirm);
              }}
              value={resetPasswordReq?.confirm_password}
              leftImageStyle={styles.password_icon_style}
              onChangeText={value => {
                methodSetupResetPassword('confirm_password', value);
              }}
              errorMsg={resetPasswordReq?.validators?.confirm_password?.error}
              returnKeyType="done"
            />
          </ScrollView>
        </KeyboardAvoidingView>
        {keyboardStatus ? (
          <></>
        ) : (
          <AppButton
            title={translateText('reset_password')}
            onPress={() => {
              methodResetPassword();
            }}
            isLoading={buttonLoader}
          />
        )}
      </Background>
    </View>
  );
};

export default ResetPassword;
