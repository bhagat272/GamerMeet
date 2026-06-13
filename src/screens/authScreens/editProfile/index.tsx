import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  BackHandler,
  Image,
  ImageBackground,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {
  AppButton,
  AppInput,
  Background,
  GoogleSearchLocation,
  ImageLoadView,
  KeyboardController,
  SelectPicker,
} from '../../../components';
import {getGender} from '../../../redux/actions/appSessionAction';
import {
  checkUserAction,
  createEditProfileAction,
  profileAction,
} from '../../../redux/actions/userSessionAction';
import {IMAGE_URL} from '../../../redux/apis/commonValue';
import {buttonLoading} from '../../../redux/reducer/loadingReducer';
import imagePath from '../../../theme/imagePath';
import {translateText} from '../../../utils/language';
import {alphabetsOnlyRegex, numberRegex} from '../../../utils/regex';
import {showToastMessage} from '../../../utils/toast';
import {maxLengthEmail} from '../../../utils/validation';
import styles from './styles';
import {use} from 'i18next';
import {Colors} from '../../../theme';
import {ScrollView} from 'react-native-gesture-handler';

interface Validator {
  required?: boolean;
  error?: string;
  pattern?: RegExp;
  errorMessage?: string;
  maxLength?: number;
  minLength?: number;
  alphabetsOnly?: boolean;
  numeric?: boolean;
  minLengthDigit?: number;
  maxLengthDigit?: number;
}

interface ProfileForm {
  name: string;
  email: string;
  age: string;
  bio: string;
  instagram: string;
  facebook: string;
  twitter: string;
  threads: string;
  other_url: string;
  address: string;
  gender: string;
  latitude: string;
  longitude: string;
  profile_picture: string;
}

const EditProfile = (props: any) => {
  const dispatch = useDispatch();
  const {buttonLoader} = useSelector((state: any) => state.loading);
  const {userData} = useSelector((state: any) => state.session);
  const [locationModalVisible, setLocationModalVisible] = useState(false);
  const [genderModalVisible, setGenderModalVisible] = useState(false);
  const [genderOptions, setGenderOptions] = useState([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [gender, setGender] = useState(userData?.gender?.[0]?.name);
  const [genderLoad, setGenderLoad] = useState(true);
  const [profileForm, setProfileForm] = useState<ProfileForm>({
    name: '',
    email: '',
    age: '',
    bio: '',
    instagram: '',
    facebook: '',
    twitter: '',
    threads: '',
    other_url: '',
    address: '',
    gender: '',
    latitude: '',
    longitude: '',
    profile_picture: '',
  });

  // Disable hardware back button when a request is in progress
  useEffect(() => {
    if (buttonLoader) {
      const handleBackButtonClick = () => true;
      const backEvent = BackHandler.addEventListener(
        'hardwareBackPress',
        handleBackButtonClick,
      );
      return () => {
        backEvent.remove();
      };
    }
  }, [buttonLoader]);

  // Populate profileForm with userData and fetch gender options
  useEffect(() => {
    if (userData) {
      console.log('ffhhfhfghfgh', userData);

      setProfileForm(prev => ({
        ...prev,
        name: userData?.username || '',
        email: userData?.email || '',
        instagram: userData?.instagram || '',
        facebook: userData?.facebook || '',
        twitter: userData?.x_link || '',
        threads: userData?.threads || '',
        other_url: userData?.other_url || '',
        age: userData?.age ? String(userData.age) : '',
        bio: userData?.bio || '',
        // address: userData?.address || '',
        latitude: userData?.latitude || '',
        longitude: userData?.longitude || '',
        address: userData?.address || '',
        gender: userData?.gender?._id || '',
        profile_picture: userData?.avatar?.length
          ? IMAGE_URL + userData.avatar[0].avatar_url
          : '',
      }));
      setGender(userData?.gender?.name || '');
    }
  }, [userData]);

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
  const fetchGender = async () => {
    setGender(true);
    try {
      let dic = {
        isActive: true,
      };
      const response = await dispatch(getGender(dic));
      if (response?.data) {
        setGenderLoad(false);
        setGenderOptions(
          response?.data?.map((item: any) => ({
            id: item._id,
            name: item.name,
          })),
        );
      }
    } catch (error) {
      setGenderLoad(false);
      console.error('Error fetching gender:', error);
    } finally {
      setGenderLoad(false);
    }
  };

  useEffect(() => {
    dispatch(profileAction());
    fetchGender();
  }, []);

  const showVerifyButton =
    !!profileForm.email && profileForm.email !== userData?.email;

  const formValidators = {
    name: {
      required: true,
      minLength: 2,
      maxLength: 30,
      alphabetsOnly: true,
      error: '',
      messages: {
        required: translateText('please_enter_your_name'),
        minLength: translateText('name_should_be_at_least_2'),
        maxLength: translateText('name_should_not_exceed_30'),
        alphabetsOnly: translateText('name_should_contain_only'),
      },
    },
    age: {
      required: true,
      numeric: true,
      minAge: 18,
      maxLengthDigit: 2,
      error: '',
      messages: {
        required: translateText('please_enter_your_age'),
        numeric: translateText('age_should_be_a_number'),
        minAge: translateText('you_must_be_at_least_18_years'),
        maxLengthDigit: translateText('age_should_not_exceed_2_digits'),
      },
    },
    gender: {
      required: true,
      error: '',
      messages: {
        required: translateText('please_select_your_gender'),
      },
    },
    bio: {
      required: false,
      minLength: 10,
      maxLength: 200,
      error: '',
      messages: {
        required: translateText('please_enter_your_bio/about'),
        minLength: translateText('bio_should_be_at_least_10'),
        maxLength: translateText('bio_should_not_exceed_200'),
      },
    },
    address: {
      required: true,
      error: '',
      messages: {
        required: translateText('please_select_your_location'),
      },
    },
    instagram: {
      required: false,
      pattern: /^https?:\/\/(www\.)?instagram\.com\/.+$/i,
      error: '',
      messages: {
        required: translateText('please_enter_your_instagram'),
        pattern: translateText('enter_a_valid_instagram_url'),
      },
    },
    facebook: {
      required: false,
      pattern: /^https?:\/\/(www\.)?facebook\.com\/.+$/i,
      error: '',
      messages: {
        pattern: translateText('enter_a_valid_facebook_url'),
        required: translateText('please_enter_your_facebook_url'),
      },
    },
    twitter: {
      required: false,
      pattern: /^(https?:\/\/)?(www\.)?(twitter|x)\.com\/[a-zA-Z0-9_]+$/i,
      error: '',
      messages: {
        pattern: translateText('enter_a_valid_twitter/x_url'),
        required: translateText('please_enter_your_twitter_url'),
      },
    },
    threads: {
      required: false,
      pattern: /^(https?:\/\/)?(www\.)?threads\.net\/[A-Za-z0-9._@/-]*$/i,
      error: '',
      messages: {
        pattern: translateText('enter_a_valid_threads_url'),
        required: translateText('please_enter_your_threads_url'),
      },
    },
    other_url: {
      required: false,
      pattern: /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[^\s]*)?$/i,
      error: '',
      messages: {
        pattern: translateText('enter_a_valid_url'),
        required: translateText('please_enter_your_url'),
      },
    },
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors: Record<string, string> = {};

    // Validate name
    if (!profileForm.name.trim()) {
      newErrors.name = formValidators.name.messages.required;
      isValid = false;
    } else if (profileForm.name.length < formValidators.name.minLength) {
      newErrors.name = formValidators.name.messages.minLength;
      isValid = false;
    } else if (profileForm.name.length > formValidators.name.maxLength) {
      newErrors.name = formValidators.name.messages.maxLength;
      isValid = false;
    } else if (!alphabetsOnlyRegex.test(profileForm.name)) {
      newErrors.name = formValidators.name.messages.alphabetsOnly;
      isValid = false;
    }

    // Validate age
    if (!profileForm.age.trim()) {
      newErrors.age = formValidators.age.messages.required;
      isValid = false;
    } else if (!numberRegex.test(profileForm.age)) {
      newErrors.age = formValidators.age.messages.numeric;
      isValid = false;
    } else if (profileForm.age.length > formValidators.age.maxLengthDigit) {
      newErrors.age = formValidators.age.messages.maxLengthDigit;
      isValid = false;
    } else if (
      parseInt(profileForm.age, 10) < formValidators.age.minAge &&
      profileForm.age !== ''
    ) {
      newErrors.age = formValidators.age.messages.minAge;
      isValid = false;
    }

    // Validate gender
    if (!profileForm?.gender.trim()) {
      newErrors.gender = formValidators.gender.messages.required;
      isValid = false;
    }

    // Validate bio
    if (profileForm.bio.trim()) {
      if (profileForm.bio.length < formValidators.bio.minLength) {
        newErrors.bio = formValidators.bio.messages.minLength;
        isValid = false;
      } else if (profileForm.bio.length > formValidators.bio.maxLength) {
        newErrors.bio = formValidators.bio.messages.maxLength;
        isValid = false;
      }
    }

    // Validate address
    if (!profileForm.address.trim()) {
      newErrors.address = formValidators.address.messages.required;
      isValid = false;
    }

    // Validate social media URLs
    if (profileForm.instagram.trim()) {
      if (!formValidators.instagram.pattern?.test(profileForm.instagram)) {
        newErrors.instagram = formValidators.instagram.messages.pattern;
        isValid = false;
      }
    }

    if (profileForm.facebook.trim()) {
      if (!formValidators.facebook.pattern?.test(profileForm.facebook)) {
        newErrors.facebook = formValidators.facebook.messages.pattern;
        isValid = false;
      }
    }

    if (profileForm.twitter.trim()) {
      if (!formValidators.twitter.pattern?.test(profileForm.twitter)) {
        newErrors.twitter = formValidators.twitter.messages.pattern;
        isValid = false;
      }
    }

    if (profileForm.threads.trim()) {
      if (!formValidators.threads.pattern?.test(profileForm.threads)) {
        newErrors.threads = formValidators.threads.messages.pattern;
        isValid = false;
      }
    }

    if (profileForm.other_url.trim()) {
      if (!formValidators.other_url.pattern?.test(profileForm.other_url)) {
        newErrors.other_url = formValidators.other_url.messages.pattern;
        isValid = false;
      }
    }

    setErrors(newErrors);

    if (!isValid) {
      const firstErrorKey = Object.keys(newErrors)[0];
      showToastMessage(newErrors[firstErrorKey], 'danger');
    }

    return isValid;
  };

  const methodSetupProfile = (key: keyof ProfileForm, value: string): void => {
    const dic: ProfileForm = {...profileForm};

    // Remove emojis and certain special characters
    // value = value.replace(
    //   /([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g,
    //   '',
    // );

    const socialMediaKeys = [
      'instagram',
      'facebook',
      'twitter',
      'threads',
      'other_url',
    ];
    if (socialMediaKeys.includes(key)) {
      // Remove spaces and convert to lowercase for social media links
      value = value.replace(/\s/g, '');
      value = value.replace(
        /([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g,
        '',
      );
    } else if (key === 'name') {
      if (value.startsWith(' ')) {
        value = value.trimStart();
        value = value.replace(
          /([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g,
          '',
        );
      }
      if (value.length === 1) {
        value = value.trim();
      }
      value = value.replace(/[^a-zA-Z]+/g, ' ');
    } else if (key === 'bio') {
      if (value.startsWith(' ')) {
        value = value.trimStart();
      }
      if (value.length === 1) {
        value = value.trim();
      }
    } else if (key === 'age') {
      if (value.startsWith('0') && value.length > 1) {
        return;
      }

      // Prevent "00"
      if (value === '00') {
        value = '0';
      }

      // Prevent starting with 0 even if it's a single digit
      if (value.startsWith('0') && value.length === 1) {
        return;
      }
      value = value.replace(/[^0-9]/g, '');
    }

    dic[key] = value;

    // Clear error if the field is now valid
    if (errors[key]) {
      const validator = formValidators[key];
      let isFieldValid = true;

      if (validator.required && !value.trim()) {
        isFieldValid = false;
      } else if (validator.pattern && value && !validator.pattern.test(value)) {
        isFieldValid = false;
      } else if (key === 'name') {
        if (
          value.length < validator.minLength ||
          value.length > validator.maxLength
        ) {
          isFieldValid = false;
        } else if (validator.alphabetsOnly && !alphabetsOnlyRegex.test(value)) {
          isFieldValid = false;
        }
      } else if (key === 'age') {
        if (
          !/^\d+$/.test(value) ||
          value.length < validator.minLengthDigit ||
          value.length > validator.maxLengthDigit
        ) {
          isFieldValid = false;
        }
      } else if (key === 'bio') {
        if (
          value.length < validator.minLength ||
          value.length > validator.maxLength
        ) {
          isFieldValid = false;
        }
      }

      if (isFieldValid) {
        setErrors(prev => ({...prev, [key]: ''}));
      }
    }

    setProfileForm(dic);
  };

  const methodProfileApi = () => {
    Keyboard.dismiss();

    // Check if email needs verification
    if (showVerifyButton) {
      showToastMessage(translateText('please_verify_your_new_email'), 'danger');
      return;
    }

    if (!validateForm()) {
      return;
    }

    const formData = new FormData();
    formData.append('username', profileForm.name.trim());
    formData.append('age', profileForm.age);
    formData.append('bio', profileForm.bio.trim());
    formData.append('address', profileForm.address);
    formData.append('latitude', profileForm.latitude);
    formData.append('longitude', profileForm.longitude);
    formData.append('instagram', profileForm.instagram.toLowerCase());
    formData.append('facebook', profileForm.facebook.toLowerCase());
    formData.append('x_link', profileForm.twitter.toLowerCase());
    formData.append('threads', profileForm.threads.toLowerCase());
    formData.append('other_url', profileForm.other_url.toLowerCase());
    formData.append('gender', profileForm.gender);

    if (
      profileForm.profile_picture &&
      !profileForm.profile_picture.includes('http')
    ) {
      formData.append('avatar', {
        uri: profileForm.profile_picture,
        type: 'image/jpeg',
        name: 'image_' + Math.floor(Date.now() / 1000) + '.jpeg',
      });
      formData.append('is_first_avatar', 1);
    }

    dispatch(buttonLoading(true));
    dispatch(createEditProfileAction(formData)).then((res: boolean) => {
      dispatch(buttonLoading(false));
      if (res) {
        showToastMessage('Profile updated successfully', 'success');
        props.navigation.goBack();
      } else {
        showToastMessage('Failed to update profile', 'danger');
      }
    });
  };

  // New function to handle sending OTP for email change
  const methodSendEmailChangeOTP = () => {
    // if (!profileForm.email.trim()) {
    //   showToastMessage(translateText('please_enter_your_email'), 'danger');
    //   return;
    // }
    // if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profileForm.email)) {
    //   showToastMessage(translateText('enter_a_valid_email'), 'danger');
    //   return;
    // }

    const request = {email: profileForm.email, type: 'UPDATE_EMAIL'};
    dispatch(buttonLoading(true));
    dispatch(checkUserAction(request)).then((res: any) => {
      dispatch(buttonLoading(false));
      if (res) {
        props.navigation.navigate('Verification', {
          from: 'email_change',
          emailChangeData: request,
        });
      } else {
        showToastMessage(translateText('failed_to_send_otp'), 'danger');
      }
    });
  };

  return (
    <Background>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <ImageBackground
            source={imagePath.cover_image}
            style={styles.headerImage}
            resizeMode="cover">
            <View style={styles.profile_view}>
              <TouchableOpacity
                style={styles.image_containerView}
                onPress={() => props?.navigation.goBack()}>
                <Image source={imagePath.back_icon} style={styles.back} />
              </TouchableOpacity>
              <View style={styles.profile_name_email_views}>
                <Text style={styles.user_name_text}>
                  {translateText('edit_profile')}
                </Text>
              </View>
            </View>

            <View style={styles.profileImageWrapper}>
              <ImageLoadView
                source={
                  profileForm.profile_picture
                    ? {uri: profileForm.profile_picture}
                    : imagePath.user_icon
                }
                resizeMode="cover"
                style={styles.profile_image_style}
              />
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={methodUploadImage}
                style={styles.edit_icon_view}>
                <Image
                  source={imagePath.edit_pen_icon}
                  style={styles.edit_icon_style}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </View>
          </ImageBackground>
          <View
            pointerEvents={buttonLoader ? 'none' : 'auto'}
            style={styles.content}>
            <AppInput
              value={profileForm.name}
              label={translateText('name')}
              placeholder={translateText('enter_name')}
              onChangeText={value => methodSetupProfile('name', value)}
              returnKeyType={'done'}
              maxLength={30}
            />

            <AppInput
              value={profileForm?.email}
              label={translateText('email')}
              returnKeyType={'done'}
              maxLength={maxLengthEmail}
              onChangeText={value => methodSetupProfile('email', value)}
              placeholder={translateText('enter_your_email')}
              editable={false}
              inputRightImage={imagePath.change_icon}
              rightImageStyle={styles.change_icon}
              onPressRight={() => methodSendEmailChangeOTP()}
            />

            <AppInput
              value={profileForm.age}
              label={translateText('age')}
              placeholder={translateText('enter_age')}
              onChangeText={value => {
                if (value === '' || numberRegex.test(value)) {
                  methodSetupProfile('age', value);
                }
              }}
              returnKeyType={'done'}
              maxLength={2}
              keyboardType="numeric"
            />
            <Text style={styles.label_text}>{translateText('Location')}</Text>

            <TouchableOpacity
              style={styles.input}
              onPress={() => setLocationModalVisible(true)}>
              <Text
                style={
                  profileForm.address ? styles.genderText : styles.genderText2
                }>
                {profileForm.address || translateText('select_location')}
              </Text>
            </TouchableOpacity>
            <Text style={styles.label_text}>{translateText('gender')}</Text>

            <TouchableOpacity
              style={styles.input}
              disabled={genderLoad}
              onPress={() => setGenderModalVisible(true)}>
              <Text
                style={
                  profileForm.gender || gender
                    ? styles.genderText
                    : styles.genderText2
                }>
                {gender ? gender : translateText('select_gender')}
              </Text>
              {genderLoad ? (
                <ActivityIndicator
                  style={styles.arrow}
                  color={Colors.primary.APP_THEME}
                />
              ) : (
                <Image source={imagePath.right_arrow} style={styles.arrow} />
              )}
            </TouchableOpacity>

            <AppInput
              label={translateText('bio_/_about_me')}
              value={profileForm.bio}
              placeholder={translateText('enter_bio')}
              onChangeText={value => methodSetupProfile('bio', value)}
              multiline
              numberOfLines={5}
              // commonTextContainerStyle={{
              //   height:
              //     profileForm.bio.length > 50
              //       ? Platform.OS === 'ios'
              //         ? 130
              //         : 130
              //       : Platform.OS === 'ios'
              //       ? 60
              //       : 68,
              // }}
              // commonTextInputStyle={{

              // }}
              maxLength={200}
            />
            <Text style={styles.count_text}>{profileForm.bio.length}/200</Text>

            <Text style={styles.subtitle}>
              {translateText('social_media_links')}
            </Text>

            <AppInput
              label={translateText('instagram')}
              value={profileForm.instagram}
              placeholder={translateText('enter_instagram_link')}
              onChangeText={value => methodSetupProfile('instagram', value)}
              inputLeftImage={imagePath.instagram_icon}
              leftImageStyle={styles.chipSelected}
            />

            <AppInput
              label={translateText('facebook')}
              placeholder={translateText('enter_facebook_link')}
              value={profileForm.facebook}
              onChangeText={value => methodSetupProfile('facebook', value)}
              inputLeftImage={imagePath.facebook}
              leftImageStyle={styles.chipSelected}
            />

            <AppInput
              label={translateText('x_twitter')}
              placeholder={translateText('enter_twitter_link')}
              value={profileForm.twitter}
              onChangeText={value => methodSetupProfile('twitter', value)}
              inputLeftImage={imagePath.twitter}
              leftImageStyle={styles.twitter}
            />

            <AppInput
              label={translateText('threads')}
              placeholder={translateText('enter_threads_link')}
              value={profileForm.threads}
              onChangeText={value => methodSetupProfile('threads', value)}
              inputLeftImage={imagePath.threads_icon}
            />

            <AppInput
              label={translateText('other_url')}
              placeholder={translateText('enter_other_link')}
              value={profileForm.other_url}
              onChangeText={value => methodSetupProfile('other_url', value)}
              inputLeftImage={imagePath.red_pin_icon}
            />

            <AppButton
              title={translateText('update_profile')}
              onPress={methodProfileApi}
              isLoading={buttonLoader}
            />

            <GoogleSearchLocation
              visible={locationModalVisible}
              onCancel={() => setLocationModalVisible(false)}
              onSubmit={(res: any) => {
                setLocationModalVisible(false);
                setProfileForm({
                  ...profileForm,
                  address: res?.address,
                  latitude: res?.latitude,
                  longitude: res?.longitude,
                });
                setErrors(prev => ({...prev, address: ''}));
              }}
            />

            <SelectPicker
              modalVisible={genderModalVisible}
              onClose={() => setGenderModalVisible(false)}
              items={genderOptions}
              onValueChange={item => {
                setProfileForm((prev: any) => ({...prev, gender: item.id}));
                setGenderModalVisible(false);
                setGender(item.name);
              }}
              title={translateText('select_an_option')}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Background>
  );
};

export default EditProfile;
