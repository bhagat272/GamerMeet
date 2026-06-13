import React, { useEffect, useState } from 'react';
import {
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
import { useDispatch } from 'react-redux';
import {
  AppButton,
  AppInput,
  Background,
  Stepper
} from '../../../components';
import { handleSetRoot } from '../../../navigation/navigationService';
import { createEditProfileAction } from '../../../redux/actions/userSessionAction';
import { Colors } from '../../../theme';
import imagePath from '../../../theme/imagePath';
import { translateText } from '../../../utils/language';
import { showToastMessage } from '../../../utils/toast';
import styles from './styles';

const ProfileStepThree = (props: any) => {
  const dispatch = useDispatch();
  const [form, setForm] = useState({
    about: '',
    discord: '',
    youtube: '',
    twitch: '',
    instagram: '',
    facebook: '',
    twitter: '',
    threads: '',
    other_url: '',
    other_streaming_link: '',
  });
  const [loading, setLoading] = useState(false);

  const [voiceChatEnabled, setVoiceChatEnabled] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (key: string, value: string) => {
    const socialMediaKeys = [
      'instagram',
      'facebook',
      'twitter',
      'threads',
      'other_url',
      'other_streaming_link',
      'youtube',
      'twitch',
      'discord',
    ];
    if (socialMediaKeys.includes(key)) {
      // Remove spaces and convert to lowercase for social media links
      value = value.replace(/\s/g, '');
      value = value.replace(
        /([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g,
        '',
      );
    } else if (key === 'about') {
      if (value.startsWith(' ')) {
        value = value.trimStart();
      }
      if (value.length === 1) {
        value = value.trim();
      }
      // value = value.replace(/[^a-zA-Z]+/g, ' ');
    }

    setForm({...form, [key]: value});
  };
  // URL validation patterns
 
  const urlPatterns = {
    twitch:  /^https?:\/\/(www\.)?twitch\.tv\/.+$/i,
    discord: /^(https?:\/\/)?(www\.)?discord\.(gg|com)\/[a-zA-Z0-9]+$/i,
    youtube:
      /^(https?:\/\/)?(www\.)?youtube\.com\/(channel\/|user\/)?[a-zA-Z0-9_-]+$/i,
    instagram: /^(https?:\/\/)?(www\.)?instagram\.com\/[a-zA-Z0-9_.]+$/i,
    facebook: /^(https?:\/\/)?(www\.)?facebook\.com\/[a-zA-Z0-9.]+$/i,
    twitter: /^(https?:\/\/)?(www\.)?(twitter|x)\.com\/[a-zA-Z0-9_]+$/i,
    threads: /^(https?:\/\/)?(www\.)?threads\.net\/[A-Za-z0-9._@/-]*$/i,
    other_url: /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[^\s]*)?$/i,
    other_streaming_link: /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[^\s]*)?$/i,
  };

  //prevent hardware back button
  // Check if any field is filled or voice chat is enabled
  const isFormFilled = () =>
    form.about.trim() ||
    form.twitch.trim() ||
    form.discord.trim() ||
    form.youtube.trim() ||
    form.instagram.trim() ||
    form.facebook.trim() ||
    form.twitter.trim() ||
    form.threads.trim() ||
    form.other_url.trim() ||
    form.other_streaming_link.trim() ||
    voiceChatEnabled;

  const validateForm = () => {
    let isValid = true;
    const newErrors: Record<string, string> = {};

    // ✅ Bio validation (optional but length check if entered)
    if (form.about.trim()) {
      if (form.about.length < 10) {
        newErrors.about = translateText('bio_should_be_at_least_10');
        isValid = false;
      } else if (form.about.length > 200) {
        newErrors.about = translateText('bio_should_not_exceed_200');
        isValid = false;
      }
    }

    // ✅ Streaming/social links validation (only if entered)
    const validateLink = (
      field: string,
      pattern: RegExp,
      platformName: string,
    ) => {
      const value = form[field].trim();
      if (value && !pattern.test(value)) {
        newErrors[field] = `${translateText(
          'please_enter_a_valid',
        )} ${platformName} ${translateText('url')}`;
        isValid = false;
      }
    };

    validateLink('twitch', urlPatterns.twitch, translateText('twitch'));
    validateLink('discord', urlPatterns.discord, 'Discord');
    validateLink('youtube', urlPatterns.youtube, 'YouTube');
    validateLink(
      'other_streaming_link',
      urlPatterns.other_streaming_link,
      'Streaming',
    );
    validateLink('instagram', urlPatterns.instagram, 'Instagram');
    validateLink('facebook', urlPatterns.facebook, 'Facebook');
    validateLink('twitter', urlPatterns.twitter, 'X (Twitter)');
    validateLink('threads', urlPatterns.threads, 'Threads');
    validateLink('other_url', urlPatterns.other_url, 'URL');

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
    // ✅ Check if all inputs are empty and voice chat disabled

    const allEmpty =
      !form.about.trim() &&
      !form.twitch.trim() &&
      !form.discord.trim() &&
      !form.youtube.trim() &&
      !form.instagram.trim() &&
      !form.facebook.trim() &&
      !form.twitter.trim() &&
      !form.threads.trim() &&
      !form.other_url.trim() &&
      !form.other_streaming_link.trim() &&
      !voiceChatEnabled;

    if (allEmpty) {
      // 👉 If nothing entered, act like skip
      handleSetRoot({name: 'Welcome'});
      return;
    }
    if (!validateForm()) {
      return; // validateForm will show the specific error message
    }
    Keyboard.dismiss();

    setLoading(true);
    try {
      const formData = new FormData();
      // Text fields
      formData.append('bio', form.about);
      formData.append('twitch', form.twitch.trim());
      formData.append('discord', form.discord.trim());
      formData.append('youtube', form.youtube.trim());
      formData.append('instagram', form.instagram.trim());
      formData.append('facebook', form.facebook.trim());
      formData.append('x_link', form.twitter.trim());
      formData.append('threads', form.threads.trim());
      formData.append('other_url', form.other_url.trim());
      formData.append('other_streaming_link', form.other_streaming_link.trim());

      // Voice chat preference
      formData.append('is_voice_chat', voiceChatEnabled ? true : false);

      const response = await dispatch(createEditProfileAction(formData));

      if (response) {
        handleSetRoot({name: 'Welcome'});
        showToastMessage(
          translateText('profile_created_successfully'),
          'success',
        );

        console.log('Final profile update success:', response);
      }
    } catch (err) {
      console.log('Error submitting profile step 3:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Background>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{flex: 1}}>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.background}
          showsVerticalScrollIndicator={false}>
          <Text style={styles.subHeader}>
            {translateText('lets_get_started')}
          </Text>
          <Text style={styles.title}>
            {translateText('set_up_your_profile')}
          </Text>

          <Stepper currentStep={3} />

          <AppInput
            placeholder={translateText('enter_bio')}
            label={translateText('bio_/_about_me')}
            value={form.about}
            onChangeText={text => handleInputChange('about', text)}
            multiline
            numberOfLines={5}
            // eslint-disable-next-line react-native/no-inline-styles
            commonTextContainerStyle={{
              height: form.about.length > 37 ? 150 : 52,
            }}
            maxLength={200}
          />
          <Text style={styles.count_text}>{form?.about.length}/200</Text>

          <Text style={styles.subtitle}>
            {translateText('add_your_streaming_links')}
          </Text>
          <AppInput
            placeholder={translateText('enter_twitch_link')}
            label={translateText('twitch')}
            value={form?.twitch}
            onChangeText={text => handleInputChange('twitch', text)}
            inputLeftImage={imagePath.twitch_icon}
          />

          <AppInput
            placeholder={translateText('enter_discord_link')}
            label={translateText('discord')}
            value={form?.discord}
            onChangeText={text => handleInputChange('discord', text)}
            inputLeftImage={imagePath.discord_icon}
          />

          <AppInput
            label={translateText('youtube')}
            placeholder={translateText('enter_youtube_link')}
            value={form.youtube}
            onChangeText={text => handleInputChange('youtube', text)}
            inputLeftImage={imagePath.youtube_icon}
          />

          <AppInput
            label={translateText('other')}
            placeholder={translateText('enter_other_stream_link')}
            value={form.other_streaming_link}
            onChangeText={text =>
              handleInputChange('other_streaming_link', text)
            }
            inputLeftImage={imagePath.red_pin_icon}
          />
          <Text style={styles.subtitle2}>
            {translateText('social_media_links')}
          </Text>

          <AppInput
            label={translateText('instagram')}
            placeholder={translateText('enter_instagram_link')}
            value={form.instagram}
            onChangeText={text => handleInputChange('instagram', text)}
            inputLeftImage={imagePath.instagram_icon}
            leftImageStyle={{tintColor: Colors.primary.APP_THEME}}
          />

          <AppInput
            label={translateText('facebook')}
            placeholder={translateText('enter_facebook_link')}
            value={form.facebook}
            onChangeText={text => handleInputChange('facebook', text)}
            inputLeftImage={imagePath.facebook}
            leftImageStyle={{tintColor: Colors.primary.APP_THEME}}
          />

          <AppInput
            label={translateText('x_twitter')}
            placeholder={translateText('enter_twitter_link')}
            value={form.twitter}
            onChangeText={text => handleInputChange('twitter', text)}
            inputLeftImage={imagePath.twitter}
            leftImageStyle={{tintColor: Colors.primary.APP_THEME}}
          />

          <AppInput
            label={translateText('threads')}
            placeholder={translateText('enter_threads_link')}
            value={form.threads}
            onChangeText={text => handleInputChange('threads', text)}
            inputLeftImage={imagePath.threads_icon}
          />

          <AppInput
            placeholder={translateText('enter_other_link')}
            label={translateText('other_url')}
            value={form.other_url}
            onChangeText={text => handleInputChange('other_url', text)}
            inputLeftImage={imagePath.red_pin_icon}
          />

          <TouchableOpacity
            activeOpacity={1}
            onPress={() => setVoiceChatEnabled(prev => !prev)}
            style={styles.account_section_sub_view}>
            {/* Mic Icon Container */}
            <View style={styles.iconContainer}>
              <Image
                source={imagePath.mic_icon}
                resizeMode="contain"
                style={styles.micIcon}
              />
            </View>

            {/* Text + Toggle */}
            <View style={styles.account_section_text_container_view}>
              <View style={{flex: 1}}>
                <Text style={styles.account_section_text_style}>
                  {translateText('voice_chat_preference')}
                </Text>
                <Text style={styles.voice_text}>
                  {translateText('enable_to_receive_voice_notes')}
                </Text>
              </View>

              <Image
                source={
                  voiceChatEnabled ? imagePath.toggle_on : imagePath.toggle_off
                }
                resizeMode="contain"
                style={styles.toggle}
              />
            </View>
          </TouchableOpacity>

          {isFormFilled() && (
            <AppButton
              title={translateText('continue')}
              onPress={handleSubmit}
              buttonStyle={styles.button}
            />
          )}
          <TouchableOpacity
            style={styles.skipButton}
            onPress={() => handleSetRoot({name: 'Welcome'})}>
            <Text style={styles.skipTest}>{translateText('skip_for_now')}</Text>
          </TouchableOpacity>
          {/* </ScrollView>
      </KeyboardController> */}
        </ScrollView>
      </KeyboardAvoidingView>
    </Background>
  );
};

export default ProfileStepThree;
