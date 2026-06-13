import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  BackHandler,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import {useDispatch} from 'react-redux';
import {
  AppButton,
  AppInput,
  Background,
  GamingBoxShimmer,
  GoogleSearchLocation,
  SelectPicker,
  Stepper,
} from '../../../components';
import {handleSetRoot} from '../../../navigation/navigationService';
import {
  getFavoriteGame,
  getGameSchedule,
  getGamingGenre,
  getGamingPlatform,
  getGender,
  getPlayingStyle,
} from '../../../redux/actions/appSessionAction';
import {createEditProfileAction} from '../../../redux/actions/userSessionAction';
import imagePath from '../../../theme/imagePath';
import {translateText} from '../../../utils/language';
import {alphabetsOnlyRegex, numberRegex} from '../../../utils/regex';
import {showToastMessage} from '../../../utils/toast';
import styles from './styles';
import {getFCMToken} from '../../../utils/notificationPermissions';
import {Colors} from '../../../theme';

interface LocationProp {
  address: string;
  latitude: number | null;
  longitude: number | null;
}
const ProfileSetupStepTwo = (props: any) => {
  const [genderModalVisible, setGenderModalVisible] = useState(false);
  const [gender, setGender] = useState('');
  const dispatch = useDispatch();
  const [genderOptions, setGenderOptions] = useState([]);
  const [gamingPlatformOptions, setGamingPlatformOptions] = useState([]);
  const [gamingGenreOptions, setGamingGenreOptions] = useState([]);
  const [favoriteGameOptions, setFavoriteGameOptions] = useState([]);
  const [playingStyleOptions, setPlayingStyleOptions] = useState([]);
  const [gamingSchedule, setGamingSchedule] = useState([]);
  const [locationModalVisible, setLocationModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const userImages = props?.route.params?.profileImages || [];
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [genderLoad, setGenderLoad] = useState(true);

  const [form, setForm] = useState({
    name: '',
    age: '',
    location: '',
    gender: '',
  });
  const [location, setLocation] = useState<LocationProp>({
    address: '',
    latitude: null,
    longitude: null,
  });

  const [selected, setSelected] = useState({
    gamingPlatforms: [],
    gameGenres: [],
    favoriteGames: [],
    playingStyle: [],
    gamingSchedule: [],
  });

  // const handleInputChange = (key: string, value: string) => {
  //   setForm({...form, [key]: value});
  // };

  const handleInputChange = (key: string, value: string) => {
    // Prevent spaces in the name field

    if (key === 'name') {
      // value = value.replace(/\s/g, '');
      if (value.length === 1) {
        value = value.trim();
      }
      value = value.replace(/[^a-zA-Z]+/g, ' ');
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

    setForm({...form, [key]: value});
  };

  // const toggleSelection = (category: string, id: string) => {
  //   setSelected(prev => {
  //     const current = prev[category as keyof typeof prev];
  //     const updated = current.includes(id)
  //       ? current.filter(i => i !== id)
  //       : [...current, id];
  //     return {...prev, [category]: updated};
  //   });
  // };
  const toggleSelection = (category: string, id: string) => {
    setSelected((prev: any) => {
      const current = prev[category as keyof typeof prev];

      // 🎯 "playingStyle" → single-select only
      if (category === 'playingStyle') {
        return {
          ...prev,
          playingStyle: current.includes(id) ? [] : [id],
        };
      }

      // 🟢 All other categories → multi-select
      const updated = current.includes(id)
        ? current.filter(i => i !== id)
        : [...current, id];

      return {...prev, [category]: updated};
    });
  };

  const renderChips = (
    data: Array<{id: string; name: string}>,
    category: string,
  ) => (
    <View style={styles.chipContainer}>
      {data.map(item => {
        const isSelected = selected[
          category as keyof typeof selected
        ]?.includes(item.id);
        return (
          <TouchableOpacity
            key={item.id}
            style={[styles.chip, isSelected && styles.chipSelected]}
            onPress={() => toggleSelection(category, item.id)}>
            <Text
              style={[styles.chipText, isSelected && styles.chipTextSelected]}>
              {item.name}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );

  useEffect(() => {
    fetchGender();
    fetchGamingPlatform();
    fetchGamingGenre();
    fetchFavoriteGame();
    fetchPlayingStyle();
    fetchGamingSchedule();
  }, []);

  const fetchGender = async () => {
    setGenderLoad(true);
    try {
      let dic = {
        isActive: true,
      };
      const response = await dispatch(getGender(dic));
      if (response?.data) {
        setGenderLoad(false);
        setGenderOptions(
          response.data.map((item: any) => ({
            id: item._id,
            name: item.name,
          })),
        );
      }
    } catch (error) {
      setGenderLoad(false);
      console.error('Error fetching gender:', error);
    }
  };

  const fetchGamingPlatform = async () => {
    try {
      const response = await dispatch(getGamingPlatform({}));
      if (response?.data) {
        setGamingPlatformOptions(
          response.data.map((item: any) => ({
            id: item._id,
            name: item.name,
          })),
        );
      }
    } catch (error) {
      console.error('Error fetching gaming platforms:', error);
    }
  };

  const fetchGamingGenre = async () => {
    try {
      const response = await dispatch(getGamingGenre({}));
      if (response?.data) {
        setGamingGenreOptions(
          response.data.map((item: any) => ({
            id: item._id,
            name: item.name,
          })),
        );
      }
    } catch (error) {
      console.error('Error fetching gaming genre:', error);
    }
  };

  const fetchFavoriteGame = async () => {
    try {
      const response = await dispatch(getFavoriteGame({}));
      if (response?.data) {
        setFavoriteGameOptions(
          response.data.map((item: any) => ({
            id: item._id,
            name: item.name,
          })),
        );
      }
    } catch (error) {
      console.error('Error fetching favorite game:', error);
    }
  };

  const fetchPlayingStyle = async () => {
    try {
      const response = await dispatch(getPlayingStyle({}));
      if (response?.data) {
        setPlayingStyleOptions(
          response.data.map((item: any) => ({
            id: item._id,
            name: item.name,
          })),
        );
      }
    } catch (error) {
      console.error('Error fetching playing style game:', error);
    }
  };

  const fetchGamingSchedule = async () => {
    try {
      const response = await dispatch(getGameSchedule({}));
      if (response?.data) {
        setGamingSchedule(
          response.data.map((item: any) => ({
            id: item._id,
            name: item.name,
          })),
        );
      }
    } catch (error) {
      console.error('Error fetching schedule:', error);
    }
  };

  // Update your validation configuration
  const formValidators = {
    name: {
      required: true,
      minLength: 2,
      maxLength: 40,
      alphabetsOnly: true,
      error: '',
      messages: {
        required: 'Please enter your name',
        minLength: 'Name should be at least 2 characters',
        maxLength: 'Name should not exceed 40 characters',
        alphabetsOnly: 'Name should contain only alphabets',
        noSpaces: 'Spaces are not allowed in username',
      },
    },
    age: {
      required: true,
      numeric: true,
      minAge: 18,
      maxLengthDigit: 2,
      error: '',
      messages: {
        required: 'Please enter your age',
        numeric: 'Age must be a number',
        minAge: 'You must be at least 18 years old',
        maxLengthDigit: 'Age must not exceed 2 digits',
      },
    },
    gender: {
      required: true,
      error: '',
      messages: {
        required: 'Please select your gender',
      },
    },
    location: {
      required: true,
      error: '',
      messages: {
        required: 'Please select your location',
      },
    },
    gamingPlatforms: {
      required: true,
      minLength: 1,
      error: '',
      messages: {
        required: 'Please select at least one gaming platform',
        minLength: 'Please select at least one gaming platform',
      },
    },
    gameGenres: {
      required: true,
      minLength: 1,
      error: '',
      messages: {
        required: 'Please select at least one game genre',
        minLength: 'Please select at least one game genre',
      },
    },
    favoriteGames: {
      required: true,
      minLength: 1,
      error: '',
      messages: {
        required: 'Please select at least one favorite game',
        minLength: 'Please select at least one favorite game',
      },
    },
    playingStyle: {
      required: true,
      minLength: 1,
      error: '',
      messages: {
        required: 'Please select at least one playing style',
        minLength: 'Please select at least one playing style',
      },
    },
    gamingSchedule: {
      required: true,
      minLength: 1,
      error: '',
      messages: {
        required: 'Please select at least one gaming schedule',
        minLength: 'Please select at least one gaming schedule',
      },
    },
  };

  // Update your validateForm function
  const validateForm = () => {
    let isValid = true;
    const newErrors: Record<string, string> = {};

    // Validate name
    if (!form.name.trim()) {
      newErrors.name = formValidators.name.messages.required;
      isValid = false;
    } else if (form.name.length < formValidators.name.minLength) {
      newErrors.name = formValidators.name.messages.minLength;
      isValid = false;
    } else if (form.name.length > formValidators.name.maxLength) {
      newErrors.name = formValidators.name.messages.maxLength;
      isValid = false;
    } else if (!alphabetsOnlyRegex.test(form.name)) {
      newErrors.name = formValidators.name.messages.alphabetsOnly;
      isValid = false;
    }
    // Validate age
    if (!form.age.trim()) {
      newErrors.age = formValidators.age.messages.required;
      isValid = false;
    } else if (!numberRegex.test(form.age)) {
      newErrors.age = formValidators.age.messages.numeric;
      isValid = false;
    } else if (form.age.length > formValidators.age.maxLengthDigit) {
      newErrors.age = formValidators.age.messages.maxLengthDigit;
      isValid = false;
    } else if (
      parseInt(form.age, 10) < formValidators.age.minAge &&
      form.age !== ''
    ) {
      newErrors.age = formValidators.age.messages.minAge;
      isValid = false;
    }

    // Validate gender
    if (!form.gender.trim()) {
      newErrors.gender = formValidators.gender.messages.required;
      isValid = false;
    }

    // Validate location
    if (!location.address.trim()) {
      newErrors.location = formValidators.location.messages.required;
      isValid = false;
    }

    // Validate gaming platforms
    if (selected.gamingPlatforms.length === 0) {
      newErrors.gamingPlatforms =
        formValidators.gamingPlatforms.messages.required;
      isValid = false;
    }
    if (selected.gameGenres.length === 0) {
      newErrors.gameGenres = formValidators.gameGenres.messages.required;
      isValid = false;
    }
    if (selected.favoriteGames.length === 0) {
      newErrors.favoriteGames = formValidators.favoriteGames.messages.required;
      isValid = false;
    }
    if (selected.playingStyle.length === 0) {
      newErrors.playingStyle = formValidators.playingStyle.messages.required;
      isValid = false;
    }
    if (selected.gamingSchedule.length === 0) {
      newErrors.gamingSchedule =
        formValidators.gamingSchedule.messages.required;
      isValid = false;
    }

    setErrors(newErrors);

    if (!isValid) {
      const firstErrorKey = Object.keys(newErrors)[0];
      showToastMessage(newErrors[firstErrorKey], 'danger');
    }

    return isValid;
  };

  useEffect(() => {
    if (loading) {
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
  }, [loading]);

  const handleSubmit = async () => {
    if (!validateForm()) {
      return; // validateForm will show the specific error message
    }
    Keyboard.dismiss();

    setLoading(true);

    try {
      const formData = new FormData();

      userImages.forEach((imgPath: string, index: number) => {
        if (imgPath) {
          formData.append('avatar', {
            uri: imgPath,
            type: 'image/jpeg',
            name: `profile_${index}.jpg`,
          });
        }
      });

      formData.append('username', form.name);
      formData.append('age', form.age);
      formData.append('gender', form.gender);
      formData.append('address', location?.address || '');
      formData.append('latitude', Number(location.latitude) || '');
      formData.append('longitude', Number(location.longitude) || '');
      formData.append('playing_style', selected.playingStyle.join(',') || '');
      formData.append(
        'gaming_platform',
        selected.gamingPlatforms.join(',') || '',
      );
      formData.append('game_genre', selected.gameGenres.join(',') || '');
      formData.append('favourite_game', selected.favoriteGames.join(',') || '');
      formData.append(
        'gaming_schedule',
        selected.gamingSchedule.join(',') || '',
      );
      // formData.append('firebase_token','simulator');
      // formData.append('device_type', Platform.OS);

      formData.append('profile_picture', '');
      // formData.append('firebase_device_type', Platform.OS.toLocaleUpperCase());
      // formData.append('firebase_device_id', DeviceInfo.getDeviceId());
      // formData.append('device_version', Platform.Version.toString());
      formData.append('roles', '1');
      console.log(formData);
      const response = await dispatch(createEditProfileAction(formData));

      if (response) {
        showToastMessage('Profile created successfully', 'success');

        handleSetRoot({name: 'ProfileStepThree'});
      }
    } catch (error) {
      showToastMessage('Failed to update profile. Please try again.', 'danger');

      console.log('Error updating profile:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Background>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{flex: 1}}>
        <ScrollView
          contentContainerStyle={styles.background}
          showsVerticalScrollIndicator={false}>
          <Text style={styles.subtitle}>
            {translateText('lets_get_started')}
          </Text>
          <Text style={styles.title}>
            {translateText('set_up_your_profile')}
          </Text>

          <Stepper currentStep={2} />

          <AppInput
            placeholder={translateText('enter_your_name')}
            value={form.name}
            label={translateText('name')}
            onChangeText={text => handleInputChange('name', text)}
            maxLength={30}
          />

          <AppInput
            placeholder={translateText('enter_your_age')}
            label={translateText('age')}
            value={form.age}
            maxLength={2}
            keyboardType="number-pad"
            onChangeText={text => {
              if (text === '' || numberRegex.test(text)) {
                handleInputChange('age', text);
              }
            }}
          />
          <Text style={styles.label_text}>{translateText('gender')}</Text>

          <TouchableOpacity
            onPress={() => setGenderModalVisible(true)}
            disabled={genderLoad}
            style={styles.input}>
            <Text style={!gender ? styles.genderText : styles.genderText2}>
              {gender || translateText('select_gender')}
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
          <Text style={styles.label_text}>{translateText('Location')}</Text>

          <TouchableOpacity
            onPress={() => setLocationModalVisible(true)}
            style={styles.input}>
            <Text
              style={
                !location.address ? styles.genderText : styles.genderText2
              }>
              {location.address || translateText('select_location')}
            </Text>
          </TouchableOpacity>

          <GoogleSearchLocation
            visible={locationModalVisible}
            onCancel={() => {
              setLocationModalVisible(false);
            }}
            onSubmit={(res: any) => {
              setLocationModalVisible(false);

              setLocation({
                address: res?.address,
                latitude: res?.latitude,
                longitude: res?.longitude,
              });
            }}
          />

          <SelectPicker
            modalVisible={genderModalVisible}
            onClose={() => setGenderModalVisible(false)}
            items={genderOptions}
            onValueChange={item => {
              setGender(item.name);
              setForm((prev: any) => ({...prev, gender: item.id}));
              setGenderModalVisible(false);
            }}
            title={translateText('select_an_option')}
          />

          <View style={styles.content}>
            <Text style={styles.label}>
              {translateText('gaming_platforms')}
            </Text>
            {gamingPlatformOptions.length > 0 ? (
              renderChips(gamingPlatformOptions, 'gamingPlatforms')
            ) : (
              <GamingBoxShimmer boxNumber={2} />
            )}

            <Text style={styles.label}>{translateText('game_genres')}</Text>
            {gamingGenreOptions.length ? (
              renderChips(gamingGenreOptions, 'gameGenres')
            ) : (
              <GamingBoxShimmer boxNumber={4} />
            )}

            <Text style={styles.label}>{translateText('favorite_games')}</Text>
            {favoriteGameOptions.length ? (
              renderChips(favoriteGameOptions, 'favoriteGames')
            ) : (
              <GamingBoxShimmer boxNumber={4} />
            )}

            <Text style={styles.label}>{translateText('playing_style')}</Text>
            {playingStyleOptions.length ? (
              renderChips(playingStyleOptions, 'playingStyle')
            ) : (
              <GamingBoxShimmer boxNumber={5} />
            )}

            <Text style={styles.label}>{translateText('gaming_schedule')}</Text>
            {gamingSchedule.length ? (
              renderChips(gamingSchedule, 'gamingSchedule')
            ) : (
              <GamingBoxShimmer />
            )}
          </View>

          <AppButton
            title={
              loading
                ? translateText('submitting...')
                : translateText('continue')
            }
            onPress={handleSubmit}
            buttonStyle={styles.button}
            disabled={loading}
            isLoading={loading}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </Background>
  );
};

export default ProfileSetupStepTwo;
