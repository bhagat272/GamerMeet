import {
  View,
  Keyboard,
  BackHandler,
  TouchableOpacity,
  Text,
  Image,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import styles from './styles';
import {
  AppButton,
  AppHeader,
  AppInput,
  Background,
  ImageLoadView,
  KeyboardScroll,
} from '../../../components';
import imagePath from '../../../theme/imagePath';
import {maxLengthName, ValidateForm} from '../../../utils/validation';
import {ValidateFormType} from '../../../utils/helper';
import {useDispatch, useSelector} from 'react-redux';
import {createEditProfileAction} from '../../../redux/actions/userSessionAction';
import {buttonLoading} from '../../../redux/reducer/loadingReducer';
import {translateText} from '../../../utils/language';
import {useHeaderHeight} from '@react-navigation/elements';
import {Colors} from '../../../theme';
import GoogleSearch from '../../../utils/googleSearch';
import DatePicker from 'react-native-date-picker';
import moment from 'moment';


const CreateProfile = (props: any) => {
  const dispatch = useDispatch();
  const headerHeight = useHeaderHeight();
  const {buttonLoader} = useSelector((state: any) => state.loading);

  const [keyboardStatus, setKeyboardStatus] = useState<number | boolean>(false);
  // State to control the visibility of the date picker modal
  const [selectDate, setSelectDate] = useState(false);
  // State to control the visibility of the GoogleSearch modal
  const [showGooglePlace, setShowGooglePlace] = useState(false);

  // Profile form state with all fields and their corresponding validators.
  const [profileForm, setProfileForm] = useState({
    name: '',
    // dob: '',
    // bio: '',
    // address: '',
    // latitude: '',
    // longitude: '',
    profile_picture: '',
    validators: {
      name: {
        required: true,
        error: '',
      },
      // dob: {
      //   required: true,
      //   error: '',
      // },
      // address: {
      //   required: true,
      //   error: '',
      // },
      // bio: {
      //   required: true,
      //   error: '',
      // },
    },
  });

  useEffect(() => {
    AppHeader({
      ...props,
      headerTitle: translateText('create_profile'),
    });
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

  // Listen for keyboard events to adjust layout when the keyboard is shown or hidden.
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


  const methodSetupProfile = (key: string, value: string): void => {
    const dic: any = {...profileForm};
    // Remove emojis and certain special characters
    value = value.replace(
      /([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g,
      '',
    );

    if (key == 'name') {
      // Allow only alphabets for the name and remove any spaces.
      value = value.replace(/[^a-zA-Z ]/g, '');
    }

    dic[key] = value;
    // Reset the error message for the field if it exists in validators.
    if (dic.validators && dic.validators[key]) {
      dic.validators[key].error = '';
    }
    setProfileForm(dic);
  };

 
  const methodProfileApi = () => {
    Keyboard.dismiss();
    const validForm: ValidateFormType = ValidateForm(profileForm);
    // Update the state to trigger UI changes if there are validation errors.
    setProfileForm({...profileForm});

    if (validForm.status) {
      const request: any = {...profileForm};
      // Remove validators from the request payload.
      delete request.validators;

      // Prepare form data for submission.
      const formData = new FormData();
      formData.append('username', request.name);
      // formData.append('dob', request.dob);
      // formData.append('bio', request.bio);
      // formData.append('address', request.address);
      // formData.append('latitude', request.latitude);
      // formData.append('longitude', request.longitude);
      formData.append('key', 0);
      if (profileForm?.profile_picture) {
        formData.append('profile_picture', {
          uri: profileForm?.profile_picture,
          type: 'image/jpeg',
          name: 'image_' + Math.floor(Date.now() / 1000) + '.jpeg',
        });
      }
      console.log('formData======', JSON.stringify(formData));

      // Dispatch loading action and then the API call to create/edit profile.
      dispatch(buttonLoading(true));
      dispatch(createEditProfileAction(formData)).then((res: boolean) => {
        dispatch(buttonLoading(false));
        if (res) {
          // On success, reset navigation to the BottomTab screen.
          props.navigation.reset({
            index: 0,
            routes: [{name: 'BottomTab'}],
          });
        }
      });
    }
  };


  const methodUploadImage = () => {
    props.navigation.navigate('ImageController', {
      mediaType: 'photo',
      onSuccess: (res: any) => {
        if (res?.path) {
          setProfileForm({...profileForm, profile_picture: res?.path});
        }
      },
    });
  };

  return (
    <Background>
      <View
        pointerEvents={buttonLoader ? 'none' : 'auto'}
        style={[styles.container, {paddingTop: headerHeight + 20}]}>
        <KeyboardScroll>
          {/* Profile Image Section */}
          <View style={styles.image_container_view}>
            <ImageLoadView
              source={
                profileForm?.profile_picture
                  ? {uri: profileForm?.profile_picture}
                  : imagePath.user_icon
              }
              resizeMode={'cover'}
              style={styles.profile_image_style}
            />
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                methodUploadImage();
              }}
              style={styles.add_photo_view}>
              <Image
                source={imagePath.add_icon}
                resizeMode="contain"
                style={styles.edit_icon}
              />
              <Text style={styles.add_photo_text}>Add Photo</Text>
            </TouchableOpacity>
          </View>

          {/* Name Input Field */}
          <AppInput
            value={profileForm?.name}
            // inputLeftImage={imagePath.name}
            placeholder={translateText('name')}
            onChangeText={value => {
              if (value?.length == 1) {
                value = value.replace(/\s/g, '');
              }
              methodSetupProfile('name', value);
            }}
            returnKeyType={'done'}
            maxLength={maxLengthName}
            errorMsg={profileForm?.validators?.name?.error}
          />

          {/* Date of Birth Input Field */}
          {/* <TouchableOpacity
          onPress={() => {
            setSelectDate(true);
          }}
          activeOpacity={0.7}
          style={styles.view_input}>
          <Image source={imagePath.age} resizeMode="contain" />
          <Text
            style={{
              ...styles.text_input,
              color: profileForm?.dob
                ? Colors.primary.BLACK
                : Colors.secondary.MONSOON,
            }}>
            {profileForm?.dob ? moment(profileForm?.dob,'YYYY-MM-DD').format('MM/DD/YYYY') : 'DOB(MM/DD/YYYY)'}
          </Text>
          {/* You can add a calendar icon here if desired */}
          {/* </TouchableOpacity> */}
          {/* Display error message for DOB if any */}
          {/* <Text
          style={{
            ...styles.error_message_text,
            display: profileForm?.validators?.dob?.error ? 'flex' : 'none',
          }}>
          {profileForm?.validators?.dob?.error}
        </Text> */}

          {/* Address Input Field (opens GoogleSearch modal) */}
          {/* <TouchableOpacity
          onPress={() => setShowGooglePlace(true)}
          activeOpacity={0.6}
          style={{...styles.view_input, marginHorizontal: 20}}>
          <Image source={imagePath.location} resizeMode="contain" />
          <Text
            style={[
              styles.text_input,
              {
                color: profileForm?.address
                  ? Colors.primary.BLACK
                  : Colors.secondary.MONSOON,
              },
            ]}>
            {profileForm?.address || translateText('select_location')}
          </Text>
          {/* You can add an arrow icon here if desired */}
          {/* </TouchableOpacity> */}
          {/* <Text
          style={{
            ...styles.error_message_text,
            display: profileForm?.validators?.address?.error ? 'flex' : 'none',
          }}>
          {profileForm?.validators?.address?.error}
        </Text> */}
          {/* Bio Input Field */}
          {/* <AppInput
          value={profileForm?.bio}
          placeholder={translateText('bio')}
          onChangeText={value => {
            // If the first character is entered, remove any spaces.
            if (value?.length == 1) {
              value = value.replace(/\s/g, '');
            }
            methodSetupProfile('bio', value);
          }}
          returnKeyType={'done'}
          maxLength={150}
          multiline={true}
          errorMsg={profileForm?.validators?.bio?.error}
          commonTextContainerStyle={{height: 150}}
          commonTextInputStyle={{
            textAlignVertical: 'top',
            height: 150,
            paddingVertical: 15,
          }}
        /> */}

          {/* Display the Continue button only when the keyboard is not visible */}
          {keyboardStatus ? (
            <></>
          ) : (
            <AppButton
              title={translateText('continue')}
              onPress={() => {
                methodProfileApi();
              }}
              isLoading={buttonLoader}
            />
          )}
        </KeyboardScroll>

        {/* DatePicker Modal for selecting Date of Birth */}
        {/* {selectDate && (
        <DatePicker
          modal
          mode="date"
          open={selectDate}
          // If a date of birth is already set, use it; otherwise, default to 18 years ago.
          date={
            profileForm?.dob
              ? moment(profileForm?.dob, 'YYYY-MM-DD').toDate()
              : moment().subtract(18, 'years').toDate()
          }
          // Set maximumDate to today's date minus 18 years.
          maximumDate={moment().subtract(18, 'years').toDate()}
          onConfirm={(data: object) => {
            setSelectDate(false);
            const formattedDate = moment(data).format('YYYY-MM-DD');
            methodSetupProfile('dob', formattedDate);
          }}
          onCancel={() => {
            setSelectDate(false);
          }}
        />
      )} */}

        {/* GoogleSearch Modal for selecting Address */}
        {/* <GoogleSearch
        showGoogleSearch={showGooglePlace}
        onBack={() => {
          setShowGooglePlace(false);
        }}
        onSubmit={(res: any) => {
          setProfileForm({
            ...profileForm,
            address: res?.address,
            latitude: res?.latitude,
            longitude: res?.longitude,
          });
          setShowGooglePlace(false);
        }}
      /> */}
      </View>
    </Background>
  );
};

export default CreateProfile;
