import React, { useEffect, useState } from 'react';
import { BackHandler, Image, Keyboard, KeyboardAvoidingView, Platform, Text, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { useDispatch, useSelector } from 'react-redux';
import {
  AppButton,
  AppInput,
  Background
} from '../../../components';
import { forgotPasswordAction } from '../../../redux/actions/userSessionAction';
import { buttonLoading } from '../../../redux/reducer/loadingReducer';
import imagePath from '../../../theme/imagePath';
import { DEVICE_INFO, ValidateFormType } from '../../../utils/helper';
import { translateText } from '../../../utils/language';
import { maxLengthEmail, ValidateForm } from '../../../utils/validation';
import styles from './styles';

const ForgotPassword = (props: any) => {
  const dispatch = useDispatch();
  const {buttonLoader} = useSelector((state: any) => state.loading);
  const [forgotPasswordForm, setForgotPasswordForm] = useState({
    email: '',
    type: 'PASSWORD_RESET',
    validators: {
      email: {
        required: true,
        email:true,
        error: '',
      },
    },
  });

  const [keyboardStatus, setKeyboardStatus] = useState<number | boolean>(false);

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

  const methodSetupForgotPasswordForm = (key: string, value: string): void => {
    let dic: any = {...forgotPasswordForm};
    value = value.replace(
      /([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g,
      '',
    );
    if (key == 'email') {
      value = value.replace(/\s/g, '');
    }
    dic[key] = value;
    if (dic.validators && dic.validators[key]) {
      dic.validators[key].error = '';
    }
    setForgotPasswordForm(dic);
  };

  const methodForgotPassword = () => {
    Keyboard.dismiss();
    const validForm: ValidateFormType = ValidateForm(forgotPasswordForm);
    setForgotPasswordForm({...forgotPasswordForm});

    if (validForm.status) {
      const request: any = {...forgotPasswordForm, ...DEVICE_INFO};
      delete request.validators;
      dispatch(buttonLoading(true));
      dispatch(forgotPasswordAction(request)).then((res: boolean) => {
        dispatch(buttonLoading(false));
        if (res) {
          props.navigation.navigate('Verification', {
            from: 'forget_password',
            forgetPasswordData: request,
          });
        }
      });
    }
  };

  return (
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
          <Image
            source={imagePath.logo}
            resizeMode={'contain'}
            style={styles.logo_image}
          />
          <Text style={styles.welcome_text}>
            {translateText('forgot_password')}
          </Text>
          <Text style={styles.enter_details_text}>
            {translateText('enter_your_registered_email_address')}
            {/* {'\n'} */}
            {/* {translateText('to_receive_otp')} */}
          </Text>
          <AppInput
            value={forgotPasswordForm?.email}
            maxLength={maxLengthEmail}
            placeholder={translateText('enter_your_email')}
            label={translateText('email_address')}
            // inputLeftImage={imagePath.email}
            onChangeText={value => {
              methodSetupForgotPasswordForm('email', value);
            }}
            errorMsg={forgotPasswordForm?.validators?.email?.error}
            returnKeyType="next"
            keyboardType="email-address"
          />
          </ScrollView>
        </KeyboardAvoidingView>

        {keyboardStatus ? (
          <></>
        ) : (
          <AppButton
            title={translateText('next')}
            onPress={() => {
              methodForgotPassword();
            }}
            isLoading={buttonLoader}
            buttonStyle={styles.buttonStyle}
          />
        )}
      </View>
    </Background>
  );
};

export default ForgotPassword;
