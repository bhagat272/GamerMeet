import {useHeaderHeight} from '@react-navigation/elements';
import React, {useEffect, useState} from 'react';
import {
  BackHandler,
  Image,
  Keyboard,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {
  AppButton,
  AppInput,
  Background,
  CustomAlert,
  KeyboardScroll,
} from '../../../components';
import {deleteAccountAction} from '../../../redux/actions/userSessionAction';
import {loading} from '../../../redux/reducer/loadingReducer';
import imagePath from '../../../theme/imagePath';
import {ValidateFormType} from '../../../utils/helper';
import {translateText} from '../../../utils/language';
import {maxLengthPassword, ValidateForm} from '../../../utils/validation';
import styles from './styles';

const DeleteAccount = (props: any) => {
  const dispatch = useDispatch();
  const headerHeight = useHeaderHeight();
  const {buttonLoader} = useSelector((state: any) => state.loading);
  const [securePassword, setSecurePassword] = useState(true);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const [deleteAccountForm, setDeleteAccountForm] = useState({
    password: '',
    validators: {
      password: {
        required: true,
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

  const methodSetupDeleteAccountForm = (key: string, value: string): void => {
    let dic: any = {...deleteAccountForm};
    value = value.replace(
      /([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g,
      '',
    );
    if (key == 'password') {
      value = value.replace(/\s/g, '');
    }
    dic[key] = value;
    if (dic.validators && dic.validators[key]) {
      dic.validators[key].error = '';
    }
    setDeleteAccountForm(dic);
  };

  const methodDeleteAccount = () => {
    Keyboard.dismiss();
    const validForm: ValidateFormType = ValidateForm(deleteAccountForm);
    setDeleteAccountForm({...deleteAccountForm});

    if (validForm.status) {
      const request: any = {...deleteAccountForm};
      delete request.validators;
      dispatch(loading(true));
      dispatch(deleteAccountAction(request));
      setShowLogoutModal(false);
    }
  };

  return (
    <Background backgroundStyle={styles.container}>
      <KeyboardScroll>
        <View style={styles.profile_info_view}>
          <TouchableOpacity
            style={styles.image_container_view}
            onPress={() => props.navigation.goBack()}>
            <Image source={imagePath.back_icon} style={styles.back} />
          </TouchableOpacity>
          <View style={styles.profile_name_email_view}>
            <Text style={styles.user_name_text}>
              {translateText('delete_account')}
            </Text>
          </View>
        </View>
        <Text style={styles.enter_details_text}>
          {translateText('enter_your_password')}
          {'\n'}
          {translateText('to_delete_your_account')}
        </Text>
        <AppInput
          placeholder={translateText('enter_password')}
          label={translateText('password')}
          // inputLeftImage={imagePath.password}
          inputRightImage={
            !securePassword ? imagePath.eye_on : imagePath.eye_off
          }
          onPressRight={() => {
            setSecurePassword(!securePassword);
          }}
          onChangeText={value => {
            methodSetupDeleteAccountForm('password', value);
          }}
          secureTextEntry={securePassword}
          value={deleteAccountForm?.password}
          errorMsg={deleteAccountForm?.validators?.password?.error}
          maxLength={maxLengthPassword}
          returnKeyType={'done'}
          inputLeftImage={imagePath.lock_icon}
          leftImageStyle={styles.lock_icon}
          rightImageStyle={styles.eye_icon}
        />
      </KeyboardScroll>

      {keyboardStatus ? (
        <></>
      ) : (
        <AppButton
          title={translateText('delete_account')}
          onPress={() => {
            Keyboard.dismiss();

            const validForm: ValidateFormType = ValidateForm(deleteAccountForm);
            setDeleteAccountForm({...deleteAccountForm});

            if (validForm.status) {
              setShowLogoutModal(true);
            }
          }}
          isLoading={buttonLoader}
        />
      )}
      <CustomAlert
        visible={showLogoutModal}
        onConfirm={() => {
          methodDeleteAccount();
        }}
        onCancel={() => {
          setShowLogoutModal(false);
        }}
        message={translateText('are_you_sure_delete')}
        confirmText={translateText('yes')}
        cancelText={translateText('no')}
      />
    </Background>
  );
};

export default DeleteAccount;
