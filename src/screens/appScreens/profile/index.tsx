import {useIsFocused} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {
  Image,
  ImageBackground,
  Linking,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {useDispatch, useSelector} from 'react-redux';
import {
  Background,
  BannerAds,
  CustomAlert,
  GamingBoxShimmer,
  ImageLoadView,
} from '../../../components';
import {handlePush} from '../../../navigation/navigationService';
import {
  createEditProfileAction,
  deleteAvatarAction,
  logoutAction,
  profileAction,
} from '../../../redux/actions/userSessionAction';
import {IMAGE_URL} from '../../../redux/apis/commonValue';
import {loading} from '../../../redux/reducer/loadingReducer';
import imagePath from '../../../theme/imagePath';
import {DEVICE_INFO} from '../../../utils/helper';
import {translateText} from '../../../utils/language';
import {showToastMessage} from '../../../utils/toast';
import styles from './styles';
import {useBottomTabBarHeight} from '@react-navigation/bottom-tabs';

interface UserProfile {
  username: string;
  email: string;
  age: number | null;
  gender: string;
  avatar: any[];
  gaming_platform: Array<{_id: string; name: string}>;
  game_genre: Array<{_id: string; name: string}>;
  favourite_game: Array<{_id: string; name: string}>;
  playing_style: Array<{_id: string; name: string}>;
  gaming_schedule: Array<{_id: string; name: string}>;
  is_voice_chat: boolean;
  is_ghost_user?: boolean;
  notification_status: boolean;
  bio?: string;
  facebook: string;
  twitter: string;
  instagram: string;
}

const Profile = (props: any) => {
  const tabBarHeight = useBottomTabBarHeight();
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const {userData} = useSelector((state: any) => state.session);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [profileForm, setProfileForm] = useState<UserProfile>({
    username: '',
    email: '',
    age: null,
    gender: '',
    avatar: [],
    gaming_platform: [],
    game_genre: [],
    favourite_game: [],
    playing_style: [],
    gaming_schedule: [],
    is_ghost_user: false,
    is_voice_chat: false,
    notification_status: false,
    bio: '',
    facebook: '',
    twitter: '',
    instagram: '',
  });

  useEffect(() => {
    if (isFocused) {
      fetchProfile();
      console.log('---------focus dfsfsfsdfsfsd');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFocused]);

  const fetchProfile = () => {
    dispatch(profileAction());
  };

  useEffect(() => {
    if (userData) {
      setProfileForm({
        username: userData?.username || '',
        email: userData?.email || '',
        age: userData?.age || null,
        gender: userData?.gender?.name || '',
        avatar: userData?.avatar || [],
        gaming_platform: userData?.gaming_platform || [],
        game_genre: userData?.game_genre || [],
        favourite_game: userData?.favourite_game || [],
        playing_style: userData?.playing_style || [],
        gaming_schedule: userData?.gaming_schedule || [],
        is_voice_chat: userData?.is_voice_chat || false,
        is_ghost_user: userData?.is_ghost_user || false,
        notification_status: userData?.notification_status || false,
        bio: userData?.bio || '',
        facebook: userData?.facebook || '',
        twitter: userData?.x_link || '',
        instagram: userData?.instagram || '',
      });
    }
  }, [userData]);

  const isValidUrl = (url: string) => {
    return typeof url === 'string' && /^https?:\/\/.+/.test(url);
  };

  const openLink = async (url: string) => {
    console.log(url, 'link');

    if (isValidUrl(url)) {
      try {
        const canOpen = await Linking.canOpenURL(url);
        if (canOpen) {
          await Linking.openURL(url);
        } else {
          showToastMessage('Cannot open the link', 'warning');
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      showToastMessage('Invalid or missing link', 'warning');
    }
  };

  const getAvatarSource = () => {
    return profileForm?.avatar?.length > 0
      ? {uri: IMAGE_URL + profileForm?.avatar[0].avatar_url}
      : imagePath.user_icon;
  };

  // Inside your component:

  const methodUploadImage = () => {
    props.navigation.navigate('ImageController', {
      mediaType: 'photo',
      onSuccess: (res: any) => {
        if (res?.path) {
          handleProfileUpdate({
            avatar: [res.path],
          });
          // 1. Immediately add the image to avatar in state for fast UI
          setProfileForm(prev => ({
            ...prev,
            avatar: [...prev.avatar, res.path],
          }));
        }
      },
    });
  };

  const handleProfileUpdate = async (fieldsToUpdate: Partial<UserProfile>) => {
    try {
      const formData = new FormData();

      Object.entries(fieldsToUpdate).forEach(([key, value]) => {
        if (key === 'avatar' && Array.isArray(value)) {
          value.forEach((imgUri: string, idx: number) => {
            if (
              imgUri &&
              (imgUri.includes('/tmp/') ||
                imgUri.includes('file://') ||
                imgUri.includes('/data/'))
            ) {
              // Treat as local file upload
              formData.append('avatar', {
                uri: imgUri.startsWith('file://') ? imgUri : `file://${imgUri}`,
                type: 'image/jpeg',
                name: `avatar${idx}.jpg`,
              });
            } else {
              // Treat as existing image path (e.g. already uploaded one)
              formData.append('avatar', imgUri);
            }
          });
        } else if (value !== undefined && value !== null) {
          formData.append(key, value.toString());
        }
      });

      // Debug: print formData contents
      console.log('formData:');
      (formData as any)._parts?.forEach((part: any) => {
        console.log('  ', part[0], part[1]);
      });

      await dispatch(createEditProfileAction(formData));
    } catch (error) {
      console.log(error);
    }
  };

  const deleteAvatar = async (avatarId: string) => {
    try {
      const response = await dispatch(
        deleteAvatarAction({avatar_id: avatarId}),
      );
      if (response) {
        setProfileForm(prev => ({
          ...prev,
          avatar: prev.avatar.filter(img => img._id !== avatarId),
        }));
        fetchProfile();
      } else {
        showToastMessage(response?.message || 'Failed to delete avatar');
      }
    } catch (error) {
      console.log('Error deleting avatar:', error);
    }
  };
  const methodReplaceImage = () => {
    props.navigation.navigate('ImageController', {
      mediaType: 'photo',
      onSuccess: (res: any) => {
        if (res?.path) {
          const formData = new FormData();

          formData.append('avatar', {
            uri: res.path.startsWith('file://')
              ? res.path
              : `file://${res.path}`,
            type: 'image/jpeg',
            name: 'avatar1.jpg',
          });

          // If your backend uses index-based replacement:
          formData.append('is_first_avatar', 1);

          // Or, if backend uses avatar_id for replacement:
          // formData.append('replace_avatar_id', avatarId);

          dispatch(createEditProfileAction(formData)).then(() => {
            // update local state immediately for smooth UI

            fetchProfile(); // refresh from backend
          });
        }
      },
    });
  };

  return (
    <Background>
      <ScrollView
        bounces={false}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scroll,
          {paddingBottom: tabBarHeight + 160},
        ]}>
        <ImageBackground
          source={imagePath.profile_background}
          style={styles.header}>
          <TouchableOpacity
            style={styles.headerContainer}
            onPress={() => props.navigation.navigate('Settings')}>
            <Image source={imagePath.settings} />
          </TouchableOpacity>
          <LinearGradient
            colors={['#20244B00', '#20244B00', '#034F8D']}
            start={{x: 0.2, y: 0.2}}
            end={{x: 0.2, y: 1.0}}
            style={styles.gradientOverlay}>
            <View style={styles.headerSection}>
              <ImageLoadView source={getAvatarSource()} style={styles.avatar} />

              <TouchableOpacity
                style={styles.edit_icon_view}
                onPress={() => props.navigation.navigate('EditProfile')}>
                <Image
                  source={imagePath.edit_pen_icon}
                  style={styles.edit_icon_style}
                />
              </TouchableOpacity>
            </View>
            <View style={styles.headerContent}>
              <Text style={styles.name}>{profileForm?.username}</Text>
              <Text style={styles.ageGender}>
                {profileForm?.age ? `${profileForm?.age} | ` : ''}
                {profileForm?.gender}
              </Text>
              <View style={styles.socialIcons}>
                {profileForm?.instagram && (
                  <TouchableOpacity
                    onPress={() => openLink(profileForm?.instagram)}>
                    <Image
                      source={imagePath.instagram_icon}
                      style={styles.social_icons}
                    />
                  </TouchableOpacity>
                )}
                {profileForm?.facebook && (
                  <TouchableOpacity
                    onPress={() => openLink(profileForm?.facebook)}>
                    <Image source={imagePath.facebook} />
                  </TouchableOpacity>
                )}
                {profileForm?.twitter && (
                  <TouchableOpacity
                    onPress={() => openLink(profileForm?.twitter)}>
                    <Image source={imagePath.twitter} />
                  </TouchableOpacity>
                )}
              </View>
              <Text style={styles.bio}>{profileForm?.bio}</Text>
            </View>
          </LinearGradient>
        </ImageBackground>

        <LinearGradient
          colors={['#20244B00', '#20244B00', '#034F8D']}
          start={{x: 0.5, y: 1.0}}
          end={{x: 0.5, y: 0.0}}>
          <View style={styles.LinearGradient}>
            {/* Photos Section */}
            <Text style={styles.sectionTitle}>{translateText('photos')}</Text>

            <View style={styles.photosSection}>
              {profileForm?.avatar.map((img, i) => (
                <View key={i} style={styles.addPhotoBox}>
                  <ImageLoadView
                    source={{uri: IMAGE_URL + img.avatar_url}}
                    style={styles.photo}
                    resizeMode="contain"
                  />

                  {i !== 0 ? (
                    <TouchableOpacity
                      style={styles.deleteIcon}
                      onPress={() => deleteAvatar(img?._id)}>
                      <Image
                        source={imagePath.delete_icon1}
                        style={styles.delete_icon}
                      />
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      style={styles.replace_Icon}
                      onPress={() => methodReplaceImage()}>
                      <Image
                        source={imagePath.replace_icon}
                        style={styles.replaceIcon}
                      />
                    </TouchableOpacity>
                  )}
                </View>
              ))}

              {profileForm?.avatar.length <= 4 && (
                <TouchableOpacity
                  style={styles.addPhotoBox}
                  onPress={methodUploadImage}>
                  <Image source={imagePath.add_icon1} />
                </TouchableOpacity>
              )}
            </View>
            {/* Tags Sections */}
            <View style={styles.tagsSection}>
              <Text style={styles.sectionTitle}>
                {translateText('gaming_platforms')}
              </Text>
              <TouchableOpacity
                hitSlop={12}
                style={styles.editbtn}
                onPress={() => handlePush({name: 'GamingPreferences'})}>
                <Image
                  source={imagePath.edit_pen_icon}
                  style={styles.editIcon}
                />
              </TouchableOpacity>
            </View>
            {profileForm?.gaming_platform?.length ? (
              <View style={styles.tagRow}>
                {profileForm?.gaming_platform.map((platform, index) => (
                  <Text key={index} style={styles.tag}>
                    {platform.name}
                  </Text>
                ))}
              </View>
            ) : (
              <GamingBoxShimmer boxNumber={3} />
            )}
            <Text style={styles.sectionTitle}>
              {translateText('game_genres')}
            </Text>
            {profileForm?.game_genre?.length ? (
              <View style={styles.tagRow}>
                {profileForm?.game_genre.map((genre, index) => (
                  <Text key={index} style={styles.tag}>
                    {genre.name}
                  </Text>
                ))}
              </View>
            ) : (
              <GamingBoxShimmer boxNumber={5} />
            )}
            <Text style={styles.sectionTitle}>
              {translateText('favorite_games')}
            </Text>
            {profileForm?.favourite_game?.length ? (
              <View style={styles.tagRow}>
                {profileForm?.favourite_game.map((game, index) => (
                  <Text key={index} style={styles.tag}>
                    {game.name}
                  </Text>
                ))}
              </View>
            ) : (
              <GamingBoxShimmer boxNumber={3} />
            )}
            <Text style={styles.sectionTitle}>
              {translateText('playing_style')}
            </Text>
            {profileForm?.playing_style?.length ? (
              <View style={styles.tagRow}>
                {profileForm?.playing_style.map((style, index) => (
                  <Text key={index} style={styles.tag}>
                    {style.name}
                  </Text>
                ))}
              </View>
            ) : (
              <GamingBoxShimmer boxNumber={4} />
            )}
            <Text style={styles.sectionTitle}>
              {translateText('gaming_schedule')}
            </Text>
            {profileForm?.gaming_schedule?.length ? (
              <View style={styles.tagRow}>
                {profileForm?.gaming_schedule.map((schedule, index) => (
                  <Text key={index} style={styles.tag}>
                    {schedule.name}
                  </Text>
                ))}
              </View>
            ) : (
              <GamingBoxShimmer boxNumber={3} />
            )}

            {/* Social Links Section */}
            {userData?.discord ||
            userData?.twitch ||
            userData?.youtube ||
            userData?.other_streaming_link ? (
              <>
                <Text style={styles.sectionTitle}>
                  {translateText('streaming_links')}
                </Text>

                <View style={styles.tagRow}>
                  {[
                    {
                      label: 'https/twitch',
                      icon: imagePath.twitch_icon,
                      link: userData?.twitch,
                      show: userData?.twitch && userData.twitch.length > 0,
                    },
                    {
                      label: 'https/discord',
                      icon: imagePath.discord_icon,
                      link: userData?.discord,
                      show: userData?.discord && userData.discord.length > 0,
                    },
                    {
                      label: 'https/youtube',
                      icon: imagePath.youtube_icon,
                      link: userData?.youtube,
                      show: userData?.youtube && userData.youtube.length > 0,
                    },
                    {
                      label: 'https/other',
                      icon: imagePath.pin_icon,
                      link: userData?.other_streaming_link,
                      show:
                        userData?.other_streaming_link &&
                        userData.other_streaming_link.length > 0,
                    },
                  ]
                    .filter(item => item.show) // Filter out items that shouldn't be shown
                    .map((item, index) => (
                      <TouchableOpacity
                        key={index}
                        style={styles.linkButton}
                        onPress={() => openLink(item.link)}>
                        <Image source={item.icon} style={styles.socialIcon} />
                        <Text style={styles.linkLabel}>{item.label}</Text>
                      </TouchableOpacity>
                    ))}
                </View>
              </>
            ) : (
              <></>
            )}
            {/* Settings Section */}
            <Text style={styles.sectionTitle}>{translateText('settings')}</Text>
            <View style={styles.account_section_view}>
              <TouchableOpacity
                activeOpacity={0.8}
                style={styles.account_section_sub_view}
                onPress={() => props.navigation.navigate('Subscription')}>
                <Image
                  source={imagePath.subscription_icon}
                  resizeMode={'contain'}
                  style={styles.account_section_images_style}
                />
                <View style={styles.account_section_text_container_view}>
                  <Text style={styles.account_section_text_style}>
                    {translateText('Subscription')}
                  </Text>
                  <Image
                    source={imagePath.right_arrow}
                    resizeMode={'contain'}
                    style={styles.arrow_image}
                  />
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={1}
                style={styles.account_section_sub_view}
                onPress={() => {
                  const updatedStatus = !profileForm.notification_status;

                  handleProfileUpdate({
                    notification_status: updatedStatus,
                  }).then((res: any) => {
                    if (res) {
                      setProfileForm(prev => ({
                        ...prev,
                        notification_status: updatedStatus,
                      }));
                    }
                  });
                }}>
                <Image
                  source={imagePath.notification_icon}
                  resizeMode={'contain'}
                  style={styles.account_section_images_style}
                />
                <View style={styles.account_section_text_container_view}>
                  <Text style={styles.account_section_text_style}>
                    {translateText('notifications')}
                  </Text>
                  <Image
                    source={
                      profileForm?.notification_status
                        ? imagePath.toggle_on
                        : imagePath.toggle_off
                    }
                    resizeMode={'contain'}
                    style={styles.toggle}
                  />
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={1}
                style={styles.account_section_sub_view}
                onPress={() => {
                  const updatedGhostUser = !profileForm.is_ghost_user;
                  setProfileForm(prev => ({
                    ...prev,
                    is_ghost_user: updatedGhostUser,
                  }));
                  handleProfileUpdate({is_ghost_user: updatedGhostUser});
                }}>
                <Image
                  source={imagePath.guest_icon}
                  resizeMode={'contain'}
                  style={styles.account_section_images_style}
                />
                <View style={styles.account_section_text_container_view}>
                  <Text style={styles.account_section_text_style}>
                    {translateText('profile_visibility')}
                  </Text>
                  <Image
                    source={
                      profileForm?.is_ghost_user
                        ? imagePath.toggle_on
                        : imagePath.toggle_off
                    }
                    resizeMode={'contain'}
                    style={styles.toggle}
                  />
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={1}
                style={styles.account_section_sub_view}
                onPress={() => {
                  const updatedVoiceChat = !profileForm.is_voice_chat;
                  setProfileForm(prev => ({
                    ...prev,
                    is_voice_chat: updatedVoiceChat,
                  }));
                  handleProfileUpdate({is_voice_chat: updatedVoiceChat});
                }}>
                <Image
                  source={imagePath.mic_icon}
                  resizeMode={'contain'}
                  style={styles.account_section_images_style}
                />
                <View style={styles.account_section_text_container_view}>
                  <Text style={styles.account_section_text_style}>
                    {translateText('voice_chat_preference')}
                  </Text>
                  <Image
                    source={
                      profileForm?.is_voice_chat
                        ? imagePath.toggle_on
                        : imagePath.toggle_off
                    }
                    resizeMode={'contain'}
                    style={styles.toggle}
                  />
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.8}
                style={styles.account_section_sub_view}
                onPress={() => setShowLogoutModal(true)}>
                <Image
                  source={imagePath.log_out}
                  resizeMode={'contain'}
                  style={styles.account_section_images_style}
                />
                <View style={styles.account_section_text_container_view}>
                  <Text style={styles.account_section_text_style}>
                    {translateText('Logout')}
                  </Text>
                  <Image
                    source={imagePath.right_arrow}
                    resizeMode={'contain'}
                    style={styles.arrow_image}
                  />
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </LinearGradient>
      </ScrollView>

      <CustomAlert
        visible={showLogoutModal}
        onConfirm={() => {
          setShowLogoutModal(false);
          setTimeout(() => {
            const dic = {...DEVICE_INFO};
            dispatch(loading(true));
            dispatch(logoutAction(dic));
          }, 100);
        }}
        onCancel={() => setShowLogoutModal(false)}
        message={translateText('are_you_sure_you_want_to_log')}
        confirmText={translateText('yes')}
        cancelText={translateText('no')}
      />
      {/* <View style={styles.bannerAds}>
      </View> */}
      {!userData?.is_premium ? (
        <BannerAds adsStyle={[styles.ad_style, {bottom: tabBarHeight + 40}]} />
      ) : (
        <></>
      )}
    </Background>
  );
};

export default Profile;
