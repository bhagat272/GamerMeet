import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  ImageBackground,
  Linking,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {Fold} from 'react-native-animated-spinkit';
import LinearGradient from 'react-native-linear-gradient';
import {useDispatch, useSelector} from 'react-redux';
import {
  Background,
  CustomAlert,
  FullScreenImage,
  GamingBoxShimmer,
  ImageLoadView,
  ReportModal,
} from '../../../components';
import {
  gamerDetailAction,
  likeDislikeAction,
} from '../../../redux/actions/appSessionAction';
import {IMAGE_URL} from '../../../redux/apis/commonValue';
import {Colors} from '../../../theme';
import imagePath from '../../../theme/imagePath';
import {translateText} from '../../../utils/language';
import {showToastMessage} from '../../../utils/toast';
import styles from './styles';
import {triggerRefresh} from '../../../redux/reducer/refreshReducer';
import {socketEmit} from '../../../utils/socket';
import {reportUserAction} from '../../../redux/actions/userSessionAction';

const GamerDetail = (props: any) => {
  const [showActionMenu, setShowActionMenu] = useState(false);
  const [gamerData, setGamerData] = useState<any>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isImageViewerVisible, setIsImageViewerVisible] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const {width} = Dimensions.get('window');
  const dispatch = useDispatch();
  const [chatId, setChatId] = useState('');
  const gamerDetailId = props?.route?.params?.gamerId;
  const checkwithdraw = props?.route?.params?.check_withdraw;
  const connectionType = props?.route?.params?.connectionType || 'swipe';
  const {userData} = useSelector((state: any) => state.session);
  const [showReport, setShowReport] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmType, setConfirmType] = useState<'unmatch' | 'withdraw' | null>(
    null,
  );
  const [isBlocked, setIsBlocked] = useState<boolean>(false);

  const disableActions = userData?.is_ghost_user || false;
  const [showBlockConfirmModal, setShowBlockConfirmModal] = useState(false);
  const {latitude, longitude} = useSelector((state: any) => state.location);

  const showMessage = () => {
    showToastMessage(translateText('you_must_unhide_your_profile'), 'warning');
  };
  const openLink = (url: string) => {
    if (!url) {
      return;
    }
    if (!url.startsWith('http')) {
      url = 'https://' + url;
    }
    Linking.openURL(url).catch(() =>
      showToastMessage(translateText('could_not_open_link'), 'danger'),
    );
  };

  useEffect(() => {
    if (!gamerDetailId) {
      showToastMessage(translateText('something_went_wrong'), 'danger');
      setIsLoading(false);
      return;
    }
    fetchGamerDetails(gamerDetailId);

    socketEmit(
      'get-conversation-id',
      {
        user_id: global?.userData?.id,
        other_user_id: gamerDetailId,
      },
      (res: any) => {
        setChatId(res?.data?.conversation_id);
        console.log(
          chatId,
          'res->>>>>to get conversationId',
          res?.data?.conversation_id,
        );
      },
    );

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gamerDetailId]);

  const fetchGamerDetails = async (gamerId: string) => {
    setIsLoading(true);
    let json = {
      user_id: gamerId,
      latitude: latitude || userData?.latitude?.toString(),
      longitude: longitude || userData?.longitude?.toString(),
    };
    dispatch(gamerDetailAction(json))
      .then((response: any) => {
        console.log('response of gamer detailss===>', response);

        if (response?.data?.[0]) {
          setGamerData(response.data[0]);
          setIsBlocked(response.data[0].isBlockedByMe || false);
        } else {
          showToastMessage(translateText('no_gamer_data_found'), 'danger');
        }
      })
      .catch((error: any) => {
        console.log('Error fetching gamer details:', error);
        showToastMessage(
          translateText('error_loading_gamer_details'),
          'danger',
        );
      })
      .finally(() => setIsLoading(false));
  };
  const handleReaction = (otherUserId: string, reactionType: string) => {
    const dic = {
      other_user_id: otherUserId,
      reaction: reactionType,
      check_withdraw: checkwithdraw,
    };
    dispatch(likeDislikeAction(dic))
      .then((response: any) => {
        if (response) {
          props.navigation.goBack();
          dispatch(triggerRefresh()); // <--- trigger list refresh
        }
      })
      .catch((error: any) => {
        console.log('Error handling reaction:', error);
      });
  };

  const hasSocialMediaLinks =
    !!gamerData?.instagram?.trim() ||
    !!gamerData?.facebook?.trim() ||
    !!gamerData?.x_link?.trim();
  console.log('hasSocialMediaLinks:', hasSocialMediaLinks);

  const hasStreamingLinks =
    !!gamerData?.twitch?.trim() ||
    !!gamerData?.discord?.trim() ||
    !!gamerData?.youtube?.trim() ||
    !!gamerData?.other_streaming_link?.trim() ||
    !!gamerData?.other_url?.trim();

  const handleReport = (reason: string, details: string) => {
    const payload = {
      reported_user: gamerDetailId,
      reason: reason,
      details: details,
    };

    dispatch(reportUserAction(payload))
      .then((response: any) => {
        if (response?.success) {
          showToastMessage(
            translateText('user_reported_successfully'),
            'success',
          );
          setShowReport(false);
        } else {
          showToastMessage(
            response?.message || 'Failed to report user',
            'danger',
          );
        }
      })
      .catch((error: any) => {
        console.log('Error reporting user:', error);
        showToastMessage('Error while reporting user', 'danger');
      });
  };

  const handleBlockUser = (): void => {
    const status = isBlocked ? 0 : 1; // 1 = block, 0 = unblock

    const payload = {
      blocked_user_id: gamerDetailId,
      blocked_by_user_id: userData?.id,
      status: status,
    };

    socketEmit('block-user', payload, (res: any) => {
      console.log('block-user emit response:', res);
      setShowActionMenu(false);
      if (res?.success) {
        setIsBlocked(status === 1);
        showToastMessage(
          status === 1
            ? res.message || 'User blocked successfully'
            : res.message || 'User unblocked successfully',
          'success',
        );
      } else {
        showToastMessage(
          res?.message || 'Failed to block/unblock user',
          'danger',
        );
      }
    });
  };

  if (isLoading) {
    return (
      <Background>
        <Text>.</Text>
      </Background>
    );
  }
  console.log(
    'hasStreamingLinks:=>',
    hasStreamingLinks,
    'hasSocialMediaLinks:=>',
    hasSocialMediaLinks,
    'gamerData.isMutual:=>',
    gamerData?.isMutual,
  );

  console.log(
    'isMutual value:',
    gamerData?.isMutual,
    'type:',
    typeof gamerData?.isMutual,
  );

  return (
    <Background>
      <ScrollView
        bounces={false}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
        removeClippedSubviews={false}>
        <ImageBackground
          source={imagePath.profile_background}
          style={styles.header}>
          <View style={styles.topHeader}>
            <TouchableOpacity
              style={styles.headerContainer}
              onPress={() => props.navigation.goBack()}>
              <Image source={imagePath.back_icon} />
            </TouchableOpacity>
            {connectionType === 'other' && (
              <TouchableOpacity
                onPress={() => setShowActionMenu(prev => !prev)}>
                <Image source={imagePath.dot_icon} style={styles.dot_icon} />
              </TouchableOpacity>
            )}
          </View>
          <LinearGradient
            colors={['#20244B00', '#20244B00', '#034F8D']}
            start={{x: 0.2, y: 0.2}}
            end={{x: 0.2, y: 1.0}}
            style={styles.gradientOverlay}>
            <View style={styles.headerSection}>
              <View style={styles.centerContainer}>
                {connectionType === 'swipe' && (
                  <TouchableOpacity
                    onPress={() =>
                      disableActions
                        ? showMessage()
                        : handleReaction(gamerDetailId, 'dislike')
                    }>
                    <Image
                      source={imagePath.cross_icon}
                      style={[
                        styles.icon,
                        disableActions && styles.disabledActionRow,
                      ]}
                    />
                  </TouchableOpacity>
                )}

                <View>
                  <ImageLoadView
                    source={
                      gamerData?.avatar?.[0]
                        ? {
                            uri: IMAGE_URL + gamerData?.avatar[0].avatar_url,
                          }
                        : imagePath.user_icon
                    }
                    style={styles.avatar}
                  />
                  {gamerData?.is_online && <View style={styles.active} />}
                </View>
                {connectionType === 'swipe' && (
                  <TouchableOpacity
                    onPress={() =>
                      disableActions
                        ? showMessage()
                        : handleReaction(gamerDetailId, 'like')
                    }>
                    <Image
                      source={imagePath.like_icon}
                      style={[
                        styles.icon,
                        disableActions && styles.disabledActionRow,
                      ]}
                    />
                  </TouchableOpacity>
                )}
              </View>
              <View style={styles.namerow}>
                <Text style={styles.name}>
                  {gamerData?.username || 'Unknown User'}{' '}
                </Text>
                {gamerData?.is_premium && (
                  <Image
                    source={imagePath.premium_badge}
                    style={styles.premium_badge}
                  />
                )}
              </View>

              <Text style={styles.ageGender}>
                {gamerData?.age} | {gamerData?.gender?.name} |
                {' ' + gamerData?.distance + ' ' + 'Miles'} |{' '}
                {gamerData?.match_percentage + '%'}
              </Text>
              {/* Social Media Icons */}
              {gamerData?.isMutual && hasSocialMediaLinks && (
                <View style={styles.socialIcons}>
                  {gamerData?.instagram?.trim() && (
                    <TouchableOpacity
                      onPress={() => openLink(gamerData.instagram)}>
                      <Image
                        source={imagePath.instagram_icon}
                        style={styles.socialIcon}
                      />
                    </TouchableOpacity>
                  )}
                  {gamerData?.facebook?.trim() && (
                    <TouchableOpacity
                      onPress={() => openLink(gamerData.facebook)}>
                      <Image
                        source={imagePath.facebook}
                        style={styles.socialIcon}
                      />
                    </TouchableOpacity>
                  )}
                  {gamerData?.x_link?.trim() && (
                    <TouchableOpacity
                      onPress={() => openLink(gamerData.x_link)}>
                      <Image
                        source={imagePath.twitter}
                        style={styles.socialIcon}
                      />
                    </TouchableOpacity>
                  )}
                </View>
              )}
              <View style={styles.belowButtonContainer}>
                {connectionType === 'mutual' && (
                  <TouchableOpacity
                    onPress={() =>
                      disableActions
                        ? showMessage()
                        : props.navigation.navigate('ChatScreen', {
                            other_user_id: gamerDetailId,
                            userData: gamerData,
                            chatId: chatId,
                          })
                    }
                    style={[
                      styles.belowButton,
                      {backgroundColor: Colors.secondary.TAG_BG},
                      disableActions && styles.disabledActionRow,
                    ]}>
                    <Image
                      source={imagePath.message_icon}
                      style={styles.message_icon}
                    />
                    <Text style={styles.belowButtonText}>
                      {translateText('message')}
                    </Text>
                  </TouchableOpacity>
                )}

                {(connectionType === 'interest' ||
                  connectionType === 'mutual') && (
                  <TouchableOpacity
                    style={[
                      styles.belowButton,
                      disableActions && styles.disabledActionRow,
                    ]}
                    onPress={() => {
                      if (disableActions) {
                        showMessage();
                      } else {
                        setConfirmType(
                          connectionType === 'mutual' ? 'unmatch' : 'withdraw',
                        );
                        setShowConfirmModal(true);
                      }
                    }}>
                    <Image source={imagePath.pin_icon} />
                    <Text style={styles.belowButtonText}>
                      {connectionType === 'mutual'
                        ? translateText('unmatch')
                        : translateText('withdraw_interest')}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
              <Text style={styles.bio}>{gamerData?.bio}</Text>
            </View>
          </LinearGradient>
        </ImageBackground>

        <LinearGradient
          colors={['#20244B00', '#20244B00', '#034F8D']}
          start={{x: 0.5, y: 1.0}}
          end={{x: 0.5, y: 0.0}}>
          <View style={styles.photos}>
            <Text style={styles.sectionTitle}>{translateText('photos')}</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.photosScrollContainer}>
              {gamerData?.avatar?.length
                ? gamerData.avatar.map((img: any, i: number) => (
                    <TouchableOpacity
                      key={`photo-${i}`}
                      onPress={() => {
                        setCurrentImageIndex(i);
                        setIsImageViewerVisible(true);
                      }}>
                      <View style={styles.photoBox}>
                        <ImageLoadView
                          source={{uri: IMAGE_URL + img?.avatar_url}}
                          placeholderSource={imagePath.user_icon}
                          style={styles.photo}
                          resizeMode="contain"
                        />
                      </View>
                    </TouchableOpacity>
                  ))
                : [1, 2, 3, 4, 5].map((_, index) => (
                    <View
                      key={`placeholder-${index}`}
                      style={styles.addPhotoBox}>
                      <Fold color={Colors.secondary.MONSOON} size={30} />
                    </View>
                  ))}
            </ScrollView>

            <Text style={styles.sectionTitle}>
              {translateText('gaming_platforms')}
            </Text>
            {gamerData?.gaming_platform?.length ? (
              <View style={styles.tagRow}>
                {gamerData?.gaming_platform?.map(
                  (platform: any, index: number) => (
                    <Text key={index} style={styles.tag}>
                      {platform?.name}
                    </Text>
                  ),
                )}
              </View>
            ) : (
              <GamingBoxShimmer boxNumber={5} />
            )}
            <Text style={styles.sectionTitle}>
              {translateText('game_genres')}
            </Text>
            {gamerData?.game_genre?.length ? (
              <View style={styles.tagRow}>
                {gamerData?.game_genre?.map((genre: any, index: number) => (
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
            {gamerData?.favourite_game?.length ? (
              <View style={styles.tagRow}>
                {gamerData?.favourite_game?.map((game: any, index: number) => (
                  <Text key={index} style={styles.tag}>
                    {game?.name}
                  </Text>
                ))}
              </View>
            ) : (
              <GamingBoxShimmer boxNumber={5} />
            )}
            <Text style={styles.sectionTitle}>
              {translateText('playing_style')}
            </Text>
            {gamerData?.playing_style ? (
              <View style={styles.tagRow}>
                {gamerData?.playing_style?.map((style: any, index: number) => (
                  <Text key={index} style={styles.tag}>
                    {style.name}
                  </Text>
                ))}
              </View>
            ) : (
              <GamingBoxShimmer boxNumber={5} />
            )}
            <Text style={styles.sectionTitle}>
              {translateText('gaming_schedule')}
            </Text>
            {gamerData?.gaming_schedule?.length ? (
              <View style={styles.tagRow}>
                {gamerData?.gaming_schedule?.map(
                  (schedule: any, index: number) => (
                    <Text key={index} style={styles.tag}>
                      {schedule.name}
                    </Text>
                  ),
                )}
              </View>
            ) : (
              <GamingBoxShimmer boxNumber={5} />
            )}

            {gamerData?.isMutual && hasStreamingLinks && (
              <>
                <Text style={styles.sectionTitle}>
                  {translateText('streaming_links')}
                </Text>
                <View style={styles.tagRow}>
                  {[
                    {
                      label: gamerData?.twitch,
                      icon: imagePath.twitch_icon,
                      name: 'https/twitch',
                      show: !!gamerData?.twitch?.trim(),
                    },
                    {
                      label: gamerData?.discord,
                      icon: imagePath.discord_icon,
                      name: 'https/discord',
                      show: !!gamerData?.discord?.trim(),
                    },
                    {
                      label: gamerData?.youtube,
                      icon: imagePath.youtube_icon,
                      name: 'https/youtube',
                      show: !!gamerData?.youtube?.trim(),
                    },
                    {
                      label: gamerData?.other_streaming_link,
                      icon: imagePath.pin_icon,
                      name: 'https/other',
                      show: !!gamerData?.other_streaming_link?.trim(),
                    },
                  ]
                    .filter(item => item.show)
                    .map((item, index) => (
                      <TouchableOpacity
                        key={index}
                        style={styles.linkButton}
                        onPress={() => openLink(item.label)}>
                        <Image source={item.icon} style={styles.linkIcon} />
                        <Text style={styles.linkLabel}>{item.name}</Text>
                      </TouchableOpacity>
                    ))}
                </View>
              </>
            )}
            {gamerData?.isMutual && hasSocialMediaLinks && (
              <>
                <Text style={styles.sectionTitle}>
                  {translateText('social_media_links')}
                </Text>
                <View style={styles.tagRow}>
                  {[
                    {
                      label: gamerData?.instagram,
                      icon: imagePath.instagram_icon,
                      name: 'https/instagram',
                      show: !!gamerData?.instagram?.trim(),
                    },
                    {
                      label: gamerData?.facebook,
                      icon: imagePath.facebook,
                      name: 'https/facebook',
                      show: !!gamerData?.facebook?.trim(),
                    },
                    {
                      label: gamerData?.x_link,
                      icon: imagePath.twitter,
                      name: 'https/twitter(X)',
                      show: !!gamerData?.x_link?.trim(),
                    },
                    {
                      label: gamerData?.threads,
                      icon: imagePath.threads_icon,
                      name: 'https/threads',
                      show: !!gamerData?.threads?.trim(),
                    },
                    {
                      label: gamerData?.other_url,
                      icon: imagePath.pin_icon,
                      name: 'https/other',
                      show: !!gamerData?.other_url?.trim(),
                    },
                  ]
                    .filter(item => item.show)
                    .map((item, index) => (
                      <TouchableOpacity
                        key={index}
                        style={styles.linkButton}
                        onPress={() => openLink(item.label)}>
                        <Image source={item.icon} style={styles.linkIcon} />
                        <Text style={styles.linkLabel}>{item.name}</Text>
                      </TouchableOpacity>
                    ))}
                </View>
              </>
            )}
          </View>
        </LinearGradient>
      </ScrollView>
      {showActionMenu && (
        <Pressable
          style={styles.menuOverlay}
          onPress={() => setShowActionMenu(false)}>
          <Pressable
            style={styles.menuContainer}
            onPress={e => e.stopPropagation()}>
            <TouchableOpacity
              onPress={() => {
                setShowActionMenu(false);
                setShowReport(true);
                // handle report logic
              }}
              style={styles.menuOption}>
              <Text style={styles.menuOptionText}>
                {translateText('report')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setShowActionMenu(false);
                setShowBlockConfirmModal(true);
              }}
              style={styles.menuOption_seconf}>
              <Text style={styles.menuOptionText}>
                {' '}
                {isBlocked ? translateText('unblock') : translateText('Block')}
              </Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      )}
      <CustomAlert
        visible={showConfirmModal}
        onConfirm={() => {
          if (confirmType) {
            // Treat both as "dislike" for API
            handleReaction(gamerDetailId, confirmType);
          }
          setShowConfirmModal(false);
          setConfirmType(null);
        }}
        onCancel={() => {
          setShowConfirmModal(false);
          setConfirmType(null);
        }}
        message={
          confirmType === 'unmatch'
            ? translateText('are_you_sure_you_want_to_unmatch')
            : translateText('are_you_sure_you_want_to_withdraw')
        }
        confirmText={translateText('yes')}
        cancelText={translateText('no')}
      />

      <Modal
        animationType="fade"
        visible={isImageViewerVisible}
        transparent={true}
        onRequestClose={() => setIsImageViewerVisible(false)}>
        <View style={styles.modal_view}>
          {/* Close Button */}
          <TouchableOpacity
            style={styles.image_viewer}
            onPress={() => setIsImageViewerVisible(false)}>
            <Image source={imagePath.cancel} style={styles.cross_icon} />
          </TouchableOpacity>

          {/* Fullscreen Scrollable Images */}
          <FlatList
            data={gamerData?.avatar || []}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            initialScrollIndex={currentImageIndex}
            getItemLayout={(_, index) => ({
              length: width,
              offset: width * index,
              index,
            })}
            keyExtractor={(_, index) => `full-${index}`}
            renderItem={({item}) => (
              <View style={styles.image_view}>
                <FullScreenImage
                  uri={IMAGE_URL + item?.avatar_url}
                  containerStyle={styles.image_view}
                  imageStyle={styles.modal_image}
                  loaderSize={'large'}
                />
              </View>
            )}
          />
        </View>
      </Modal>
      <ReportModal
        visible={showReport}
        onClose={() => setShowReport(false)}
        onSubmit={(reason: string, details: string) =>
          handleReport(reason, details)
        }
      />
      <CustomAlert
        visible={showBlockConfirmModal}
        onConfirm={() => {
          handleBlockUser();
          setShowBlockConfirmModal(false);
        }}
        onCancel={() => setShowBlockConfirmModal(false)}
        message={
          isBlocked
            ? translateText('are_you_sure_you_want_to_unblock')
            : translateText('are_you_sure_you_want_to_block')
        }
        confirmText={translateText('yes')}
        cancelText={translateText('no')}
      />
    </Background>
  );
};

export default GamerDetail;
