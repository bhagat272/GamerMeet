import React, { useEffect, useState } from 'react';
import {
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import {
  AppButton,
  AppInput,
  Background,
  GamingBoxShimmer
} from '../../../components';
import {
  getFavoriteGame,
  getGameSchedule,
  getGamingGenre,
  getGamingPlatform,
  getPlayingStyle,
} from '../../../redux/actions/appSessionAction';
import { createEditProfileAction } from '../../../redux/actions/userSessionAction';
import imagePath from '../../../theme/imagePath';
import { translateText } from '../../../utils/language';
import { showToastMessage } from '../../../utils/toast';
import styles from './styles';

const GamingPreferences = (props: any) => {
  const dispatch = useDispatch();
  const {userData} = useSelector((state: any) => state.session);

  const [gamingPlatformOptions, setGamingPlatformOptions] = useState([]);
  const [gamingGenreOptions, setGamingGenreOptions] = useState([]);
  const [favoriteGameOptions, setFavoriteGameOptions] = useState([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setLoading] = useState(false);
  const [playingStyleOptions, setPlayingStyleOptions] = useState([]);
  const [gamingSchedule, setGamingSchedule] = useState([]);
  const [form, setForm] = useState({
    discord: '',
    youtube: '',
    twitch: '',

    other: '',
  });

  const [selected, setSelected] = useState({
    gamingPlatforms:
      userData?.gaming_platform?.map((item: any) => item._id) || [],
    gameGenres: userData?.game_genre?.map((item: any) => item._id) || [],
    favoriteGames: userData?.favourite_game?.map((item: any) => item._id) || [],
    playingStyle: userData?.playing_style?.map((item: any) => item._id) || [],
    gamingSchedule:
      userData?.gaming_schedule?.map((item: any) => item._id) || [],
  });
  useEffect(() => {
    fetchGamingPlatform();
    fetchGamingGenre();
    fetchFavoriteGame();
    fetchPlayingStyle();
    fetchGamingSchedule();
  }, []);

  useEffect(() => {
    if (userData) {
      setForm({
        twitch: userData?.twitch || '',
        discord: userData?.discord || '',
        youtube: userData?.youtube || '',
        other: userData?.other_streaming_link || '',
      });
    }
  }, [userData]);

  const handleInputChange = (key: string, value: string) => {
    const socialMediaKeys = ['twitch', 'discord', 'youtube', 'other'];

    if (socialMediaKeys.includes(key)) {
      // Remove spaces
      value = value.replace(/\s/g, '');

      // Remove emojis and other unicode symbols
      value = value.replace(
        /([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g,
        '',
      );

      value = value;
    }

    setForm(prev => ({...prev, [key]: value}));
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
    setSelected(prev => {
      const current = prev[category as keyof typeof prev];

      // 🎮 For "playingStyle" → single selection only
      if (category === 'playingStyle') {
        return {
          ...prev,
          playingStyle: current.includes(id) ? [] : [id],
        };
      }

      // 🟢 For all other categories → multi-select
      const updated = current.includes(id)
        ? current.filter(i => i !== id)
        : [...current, id];

      return {...prev, [category]: updated};
    });
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

  const formValidators = {
    gamingPlatforms: {
      required: true,
      minLength: 1,
      error: '',
      messages: {
        required: translateText('please_select_at_least_one_platform'),
        minLength: translateText('please_select_at_least_one_platform'),
      },
    },
    gameGenres: {
      required: true,
      minLength: 1,
      error: '',
      messages: {
        required: translateText('please_select_at_least_one_genre'),
        minLength: translateText('please_select_at_least_one_genre'),
      },
    },
    favoriteGames: {
      required: true,
      minLength: 1,
      error: '',
      messages: {
        required: translateText('please_select_at_least_one_favorite'),
        minLength: translateText('please_select_at_least_one_favorite'),
      },
    },
    playingStyle: {
      required: true,
      minLength: 1,
      error: '',
      messages: {
        required: translateText('please_select_at_least_one_playing'),
        minLength: translateText('please_select_at_least_one_playing'),
      },
    },
    gamingSchedule: {
      required: true,
      minLength: 1,
      error: '',
      messages: {
        required: translateText('please_select_at_least_one_schedule'),
        minLength: translateText('please_select_at_least_one_schedule'),
      },
    },
    twitch: {
      required: false,
      pattern: /^https?:\/\/(www\.)?twitch\.tv\/.+$/i,
      error: '',
      messages: {
        required: translateText('please_add_your_twitch'),
        pattern: translateText('enter_a_valid_twitch_url'),
      },
    },
    discord: {
      required: false,
      pattern: /^https?:\/\/(www\.)?discord\.(com|gg)\/.+$/i,
      error: '',
      messages: {
        pattern: translateText('enter_a_valid_discord_url'),
        required: translateText('please_add_your_discord'),
      },
    },
    youtube: {
      required: false,
      pattern: /^https?:\/\/(www\.)?(youtube\.com|youtu\.be)\/.+$/i,
      error: '',
      messages: {
        pattern: translateText('enter_a_valid_youtube_url'),
        required: translateText('please_add_your_youtube'),
      },
    },
    other: {
      required: false,
      pattern: /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[^\s]*)?$/i,
      error: '',
      messages: {
        pattern: translateText('enter_a_valid_url'),
        required: translateText('please_add_your_other'),
      },
    },
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors: Record<string, string> = {};

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

    // Validate streaming links
    if (form.twitch.trim()) {
      if (!formValidators.twitch.pattern?.test(form.twitch)) {
        newErrors.twitch = formValidators.twitch.messages.pattern;
        isValid = false;
      }
    }

    if (form.discord.trim()) {
      if (!formValidators.discord.pattern?.test(form.discord)) {
        newErrors.discord = formValidators.discord.messages.pattern;
        isValid = false;
      }
    }

    if (form.youtube.trim()) {
      if (!formValidators.youtube.pattern?.test(form.youtube)) {
        newErrors.youtube = formValidators.youtube.messages.pattern;
        isValid = false;
      }
    }

    if (form.other.trim()) {
      if (!formValidators.other.pattern?.test(form.other)) {
        newErrors.other = formValidators.other.messages.pattern;
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

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }
    Keyboard.dismiss();
    setLoading(true);

    try {
      const formData = new FormData();

      // Add gaming preferences
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

      // Add streaming links
      formData.append('twitch', form.twitch.toLowerCase());
      formData.append('discord', form.discord.toLowerCase());
      formData.append('youtube', form.youtube.toLowerCase());
      formData.append('other_streaming_link', form.other.toLowerCase());

      console.log('Form data being submitted:', formData);

      const response = await dispatch(createEditProfileAction(formData));
      console.log('API response:', response);

      if (response) {
        showToastMessage('Profile updated successfully!', 'success');
        props.navigation.goBack();
      }
    } catch (error) {
      console.error('API error:', error);
      showToastMessage(translateText('failed_to_update_profile.'), 'danger');
    } finally {
      setLoading(false);
    }
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

  return (
    <Background>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{flex: 1}}>
        <ScrollView
          contentContainerStyle={styles.background}
          showsVerticalScrollIndicator={false}>
          <View style={styles.profile_info_view}>
            <TouchableOpacity
              style={styles.image_container_view}
              onPress={() => props.navigation.goBack()}>
              <Image source={imagePath.back_icon} style={styles.back} />
            </TouchableOpacity>
            <View style={styles.profile_name_email_view}>
              <Text style={styles.user_name_text}>
                {translateText('gaming_preferences')}
              </Text>
            </View>
          </View>

          <View style={styles.content}>
            <Text style={styles.label}>
              {translateText('gaming_platforms')}
            </Text>
            {gamingPlatformOptions?.length > 0 ? (
              renderChips(gamingPlatformOptions, 'gamingPlatforms')
            ) : (
              <GamingBoxShimmer boxNumber={2} />
            )}

            <Text style={styles.label}>{translateText('game_genres')}</Text>
            {gamingGenreOptions?.length ? (
              renderChips(gamingGenreOptions, 'gameGenres')
            ) : (
              <GamingBoxShimmer boxNumber={2} />
            )}

            <Text style={styles.label}>{translateText('favorite_games')}</Text>

            {favoriteGameOptions?.length ? (
              renderChips(favoriteGameOptions, 'favoriteGames')
            ) : (
              <GamingBoxShimmer boxNumber={2} />
            )}

            <Text style={styles.label}>{translateText('playing_style')}</Text>
            {playingStyleOptions?.length ? (
              renderChips(playingStyleOptions, 'playingStyle')
            ) : (
              <GamingBoxShimmer boxNumber={2} />
            )}

            <Text style={styles.label}>{translateText('gaming_schedule')}</Text>

            {gamingSchedule?.length ? (
              renderChips(gamingSchedule, 'gamingSchedule')
            ) : (
              <GamingBoxShimmer boxNumber={2} />
            )}
          </View>
          <Text style={styles.subtitle}>
            {translateText('add_your_streaming_links')}
          </Text>
          <AppInput
            label={translateText('twitch')}
            placeholder={translateText('enter_twitch_link')}
            value={form.twitch}
            keyboardType="default"
            onChangeText={text => handleInputChange('twitch', text)}
            inputLeftImage={imagePath.twitch_icon}
          />
          <AppInput
            placeholder={translateText('enter_discord_link')}
            label={translateText('discord')}
            value={form.discord}
            keyboardType="default"
            onChangeText={text => handleInputChange('discord', text)}
            inputLeftImage={imagePath.discord_icon}
          />

          <AppInput
            placeholder={translateText('enter_youtube_link')}
            value={form.youtube}
            onChangeText={text => handleInputChange('youtube', text)}
            inputLeftImage={imagePath.youtube_icon}
            keyboardType="default"
            label={translateText('youtube')}
          />

          <AppInput
            label={translateText('other')}
            placeholder={translateText('enter_other_stream_link')}
            value={form.other}
            onChangeText={text => handleInputChange('other', text)}
            inputLeftImage={imagePath.red_pin_icon}
            keyboardType="default"
          />
          <AppButton
            title={translateText('update_profile')}
            onPress={handleSubmit}
            buttonStyle={styles.button}
            isLoading={isLoading}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </Background>
  );
};
export default GamingPreferences;
