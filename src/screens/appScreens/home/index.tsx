// Home.tsx
import {useIsFocused} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  AppState,
  DeviceEventEmitter,
  FlatList,
  Platform,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {
  Background,
  BannerAds,
  GoogleSearchLocation,
  HomeShimmer,
  Shimmer,
  SwipeCard,
  TabButtonShimmer,
} from '../../../components';
import {
  getGamingGenre,
  getNotificationCount,
  homePageAction,
  likeDislikeAction,
  notificationReadAction,
} from '../../../redux/actions/appSessionAction';
import {
  profileAction,
  updateFcmToken,
} from '../../../redux/actions/userSessionAction';
import {isNetworkAvailable} from '../../../redux/apis/network';
import {buttonLoading} from '../../../redux/reducer/loadingReducer';
import {setLocation} from '../../../redux/reducer/locationReducer';
import {
  resetRefresh,
  triggerRefresh,
} from '../../../redux/reducer/refreshReducer';
import {Colors} from '../../../theme';
import {
  socketConnectionCheck,
  socketCustomDisconnect,
  socketEmit,
  socketEvent,
  socketIsConnected,
} from '../../../utils/socket';
import {showToastMessage} from '../../../utils/toast';
import HomeHeader from './homeHeader';
import styles from './styles';

import {useBottomTabBarHeight} from '@react-navigation/bottom-tabs';
import PushNotificationConfig from '../../../components/pushNotificationConfig';
import {translateText} from '../../../utils/language';
import {setInitialTab} from '../../../redux/reducer/tabReducer';

import {
  getMessaging,
  AuthorizationStatus,
} from '@react-native-firebase/messaging';
import {DEVICE_INFO} from '../../../utils/helper';
import DeviceInfo from 'react-native-device-info';
import {
  getFCMToken,
  requestAndroidNotificationPermission,
} from '../../../utils/notificationPermissions';
import {setOtherUserInfo} from '../../../redux/reducer/chatReducer';
type NotificationPayload = {
  type?: string;
  id?: string;
  other_user_name?: string;
  other_user_image?: string;
  conversation_id?: string;
  isBlockedByMe?: boolean;
  isBlockedByOther?: boolean;
  bookingId?: string;
  senderId?: string;
  timestamp?: string;
  data?: {
    id?: string;
    other_user_name?: string;
    other_user_image?: string;
    conversation_id?: string;
    isBlockedByMe?: boolean;
    isBlockedByOther?: boolean;
  };
};
const Home = (props: any) => {
  const tabBarHeight = useBottomTabBarHeight();

  const dispatch = useDispatch();
  const [userList, setUserList] = useState<any[]>([]);
  const [selectedTab, setSelectedTab] = useState<string[]>(['all']);
  // const combinedData = [{type: 'tabs'} as any, ...userList];
  const [isRefresh, setRefresh] = useState<boolean>(false);
  const isFocus = useIsFocused();
  const {userData} = useSelector((state: any) => state.session);
  const {address, latitude, longitude, isFirstLoad} = useSelector(
    (state: any) => state.location,
  ); // Get location from Redux
  const [locationModalVisible, setLocationModalVisible] = useState(false);
  const [isLoading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [isFetchingMore, setFetchingMore] = useState<boolean>(false);
  const [isFirstFetch, setIsFirstFetch] = useState<boolean>(true);
  const refreshFlag = useSelector((state: any) => state.refresh.refreshFlag);
  const [gamingGenreOptions, setGamingGenreOptions] = useState([
    {_id: 'all', name: 'All'},
  ]);
  const [notificationCount, setNotificationCount] = useState<number>(0);
  const messaging = getMessaging();

  // const [deviceInfoReady, setDeviceInfoReady] = useState(false);

  // useEffect(() => {
  //   (async () => {
  //     if (Platform.OS === 'android') {
  //       await requestAndroidNotificationPermission();
  //     }

  //     let dic = {...DEVICE_INFO};
  //     dic.device_unique_id = await DeviceInfo.getUniqueId();
  //     dic.firebase_token = (await getFCMToken()) || 'simulator';

  //     Object.assign(DEVICE_INFO, dic);
  //     setDeviceInfoReady(true);
  //   })();
  // }, []);

  // useEffect(() => {
  //   if (deviceInfoReady) {
  //     dispatch(updateFcmToken(DEVICE_INFO));
  //   }
  // }, [deviceInfoReady]);

  useEffect(() => {
    //Notification Firebase
    if (Platform.OS === 'ios') {
      requestUserPermission();
    } else {
      createNotificationListeners();
    }
  }, []);

  const requestUserPermission = async () => {
    const authStatus = await messaging.requestPermission();

    const enabled =
      authStatus === AuthorizationStatus.AUTHORIZED ||
      authStatus === AuthorizationStatus.PROVISIONAL;

    // console.log('listener permission', enabled);

    if (enabled) {
      createNotificationListeners();
    }
  };
  const createNotificationListeners = async () => {
    // When the application is in foreground
    messaging.onMessage(async (remoteMessage: any) => {
      if (remoteMessage) {
        // redirectToScreen(remoteMessage);
        methodUpdateNotificationCount();
      }
    });

    // When the application is running, but in the background
    messaging.onNotificationOpenedApp(async (remoteMessage: any) => {
      if (remoteMessage) {
        redirectToScreen(remoteMessage);
      }
    });

    messaging.setBackgroundMessageHandler(async (remoteMessage: any) => {
      // console.log('Message handled in the background!', remoteMessage);
      if (remoteMessage) {
        redirectToScreen(remoteMessage);
      }
    });

    // // notification app kill
    // await messaging
    //   .getInitialNotification()
    //   .then(async (remoteMessage: any) => {
    //     // console.log('Message handled in the kill!', remoteMessage);
    //     if (remoteMessage) {
    //       redirectToScreen(remoteMessage);
    //       // methodNavigateOnNotification(remoteMessage);
    //     }
    //   });
    await messaging
      .getInitialNotification()
      .then(async (remoteMessage: any) => {
        if (remoteMessage && remoteMessage?.data) {
          // ✅ Only navigate if the app was opened by tapping a notification
          if (remoteMessage?.notification || remoteMessage?.data?.type) {
            console.log('📱 App opened via push notification');
            redirectToScreen(remoteMessage);
          }
        } else {
          console.log('🟢 App opened manually — skip redirect');
        }
      });
  };

  const redirectToScreen = (notification: any) => {
    console.log('Received Notification:', notification);

    let payload: NotificationPayload = {};

    try {
      if (notification?.data?.payload) {
        payload = JSON.parse(notification.data.payload);
      }
    } catch (e) {
      console.log('❌ Error parsing notification payload:', e);
    }

    const type = payload?.type;
    console.log('Notification type:', type);

    const chatData = {
      id: payload?.data?.id,
      other_user_name: payload?.data?.other_user_name,
      other_user_image: payload?.data?.other_user_image,
      conversation_id: payload?.data?.conversation_id,
      isBlockedByMe: payload?.data?.isBlockedByMe,
      isBlockedByOther: payload?.data?.isBlockedByOther,
    };
    dispatch(setOtherUserInfo(chatData));
    switch (type) {
      case 'like_request':
        dispatch(setInitialTab('request'));
        props.navigation.navigate('BottomTab', {
          screen: 'Connection',
        });
        break;
      case 'mutual_request':
        dispatch(setInitialTab('mutual'));
        props.navigation.navigate('BottomTab', {
          screen: 'Connection',
        });
        break;

      case 'BROADCAST':
        props.navigation.navigate('Notification');
        break;

      case 'chat_message':
        props.navigation.navigate('ChatScreen', {
          chatData: chatData,
        });
        break;

      default:
        props.navigation.navigate('Notification');
        break;
    }
  };

  const methodChatSocketConnect = async () => {
    const isConnected = await isNetworkAvailable();
    const isSocketConnected = socketIsConnected();
    if (isConnected && !isSocketConnected) {
      // socketCustomDisconnect();
      socketConnectionCheck();
    }
  };

  const methodUpdateNotificationCount = async () => {
    const res = await dispatch(getNotificationCount({}));
    if (res) {
      setNotificationCount(res);
    }
  };

  useEffect(() => {
    methodUpdateNotificationCount();
  }, []);

  useEffect(() => {
    // Listen to room-joined event
    console.log('test log =====>');
    const sub = DeviceEventEmitter.addListener(
      socketEvent.room_joined,
      data => {
        console.log('🎉 Joined room successfully:', data);
      },
    );

    const dic = {
      chatId: userData?.id,
    };
    // Emit join-room
    socketEmit(socketEvent.join_room, dic, (res: any) => {
      console.log(res, 'join room---->');
    });
    // // Emit join-room
    // socketEmit(socketEvent.join_room, {chatId: dic}, (res: any) => {
    //   console.log(res, 'join room---->');
    // });

    return () => {
      sub.remove();
    };
  }, []);

  useEffect(() => {
    methodChatSocketConnect();
    AppState.addEventListener('change', state => {
      if (state === 'inactive' || state === 'background') {
        console.log('state------>', state);
        if (socketIsConnected()) {
          socketCustomDisconnect();
        }
      }
    });
  }, []);
  useEffect(() => {
    if (refreshFlag) {
      getHomePageData(1, false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshFlag]);

  useEffect(() => {
    dispatch(profileAction());
    setIsFirstFetch(true);
    getHomePageData(1, false);
    fetchGamingGenre();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTab, latitude, longitude]); // Depend on Redux location

  const getHomePageData = (newPage = 1, isLoadMore = false) => {
    if (isLoadMore) {
      setFetchingMore(true);
    } else if (!isFirstLoad) {
      setLoading(true);
    }

    const selectedGenre = selectedTab.includes('all') ? ['all'] : selectedTab;
    dispatch(buttonLoading(true));
    console.log('======location====>', latitude, longitude);

    dispatch(
      homePageAction({
        game_genre: selectedGenre,
        latitude: latitude || userData?.latitude?.toString(),
        longitude: longitude || userData?.longitude?.toString(),
        page: newPage,
      }),
    ).then((res: any) => {
      dispatch(resetRefresh());

      dispatch(buttonLoading(false));

      const newData = Array.isArray(res?.data?.result) ? res?.data?.result : [];

      if (isLoadMore) {
        setUserList(prev => [...prev, ...newData]);
      } else {
        setUserList(newData);
      }

      setTotalPages(res?.data?.totalPages || 1);
      setPage(newPage);
      setLoading(false);
      setRefresh(false);
      setFetchingMore(false);
      setIsFirstFetch(false);
    });
  };

  const handleReaction = (otherUserId: string, reactionType: string) => {
    const dic = {
      other_user_id: otherUserId,
      reaction: reactionType,
      check_withdraw: '0',
    };
    dispatch(likeDislikeAction(dic)).then((response: any) => {
      if (response) {
        if (response?.data?.current_status === false) {
          showToastMessage(
            response?.data?.message ?? 'User is already in Pending request',
            'danger',
          );
        }
        dispatch(triggerRefresh()); // <--- trigger list refresh

        setUserList(prevList =>
          prevList.filter(user => user._id !== otherUserId),
        );

        console.log(response, '-------> like or dislike successful');
      }
    });
  };

  const fetchGamingGenre = async () => {
    try {
      const response = await dispatch(getGamingGenre({}));
      if (response?.data) {
        setGamingGenreOptions([
          {_id: 'all', name: 'All'},
          ...response.data.map((item: {_id: string; name: string}) => ({
            _id: item._id,
            name: item.name,
          })),
        ]);
      }
    } catch (error) {
      console.error('Error fetching gaming genre:', error);
    }
  };

  const renderStickyTabs = () => (
    <View style={styles.tabRow}>
      <ScrollView
        horizontal={true}
        contentContainerStyle={styles.tabScroll}
        showsHorizontalScrollIndicator={false}>
        {gamingGenreOptions?.map((tab: any, index: number) => (
          <TouchableOpacity
            key={index}
            onPress={() => {
              if (tab._id === 'all') {
                setSelectedTab(['all']);
              } else {
                setSelectedTab(prev => {
                  const isSelected = prev.includes(tab._id);
                  const newSelected = isSelected
                    ? prev.filter(id => id !== tab._id)
                    : [...prev.filter(id => id !== 'all'), tab._id];

                  return newSelected.length === 0 ? ['all'] : newSelected;
                });
              }
            }}
            style={[
              styles.tabButton,
              selectedTab.includes(tab._id) && styles.selectedTab,
            ]}>
            <Text style={styles.tabText}>{tab?.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const renderListHeader = () => (
    <>
      {renderStickyTabs()}
      {userList.length === 0 && !isLoading && renderEmptyComponent()}
    </>
  );

  const userAdress =
    address.length > 23 ? address.substring(0, 24) + '...' : address;

  const renderEmptyComponent = () =>
    !isLoading ? (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>
          {translateText('no_profiles_found')}
        </Text>
      </View>
    ) : null;

  const renderFooterComponent = () =>
    isFetchingMore ? (
      <View style={styles.activity_loader}>
        <ActivityIndicator size="small" color={Colors.primary.APP_THEME} />
      </View>
    ) : (
      <View style={styles.footer_container} />
    );

  const handleOnEndReached = () => {
    if (page < totalPages && !isFetchingMore) {
      getHomePageData(page + 1, true);
    }
  };

  const savedAddress =
    userData?.address?.length > 23
      ? userData?.address.substring(0, 24) + '...'
      : userData?.address;

  return (
    <Background>
      <View
        style={styles.container}
        // pointerEvents={buttonLoader ? 'none' : 'auto'}
      >
        <View>
          <HomeHeader
            userName={userData?.username}
            location={userAdress || savedAddress}
            loadingLocation={isFirstFetch}
            onLocationPress={() => {
              console.log('Location tapped');
              setLocationModalVisible(true);
            }}
            onNotificationPress={() => {
              console.log('Notification tapped');
              dispatch(notificationReadAction({})).then((res: any) => {
                if (res) {
                  setNotificationCount(0);
                }
              });
              props.navigation.navigate('Notification');
            }}
            notificationCount={notificationCount}
          />
          <Text style={styles.header}>
            {translateText('browse_through_profiles_to')}
          </Text>
        </View>

        {isFirstFetch && isLoading ? (
          <>
            <View style={styles.shimmerTab}>
              <TabButtonShimmer
                boxNumber={5}
                baseWidth={60}
                widthIncrement={20}
              />
            </View>

            <View style={styles.shimmercard}>
              <FlatList
                data={[1, 2, 3, 4, 5]}
                numColumns={2}
                renderItem={() => {
                  return <HomeShimmer count={5} />;
                }}
              />
            </View>
          </>
        ) : (
          <>
            {/* {isLoading && !isRefresh && (
              <View style={styles.activity_loader}>
                <ActivityIndicator
                  size="small"
                  color={Colors.primary.APP_THEME}
                />
              </View>
            )} */}

            <FlatList
              data={userList}
              numColumns={2}
              keyExtractor={(item, index) => item.id ?? `tabs-${index}`}
              renderItem={({item}) => {
                // if (item.type === 'tabs') {
                //   return (
                //     <>
                //       {renderStickyTabs()}
                //       {userList.length === 0 &&
                //         !isLoading &&
                //         renderEmptyComponent()}
                //     </>
                //   );
                // }

                return (
                  <View style={styles.card}>
                    <SwipeCard
                      profileImages={item?.avatar}
                      disableActions={userData?.is_ghost_user}
                      onExpandPress={() =>
                        props.navigation.navigate('GamerDetail', {
                          gamerId: item?._id,
                          check_withdraw: '0',
                        })
                      }
                      avatarImage={item?.avatar}
                      name={item?.username}
                      age={item?.age}
                      distance={item?.distance + ' miles'}
                      percentage={item?.match_percentage}
                      tags={item?.game_genre}
                      onLikePress={() => handleReaction(item?._id, 'like')}
                      onDislikePress={() =>
                        handleReaction(item?._id, 'dislike')
                      }
                    />
                  </View>
                );
              }}
              refreshControl={
                <RefreshControl
                  refreshing={isRefresh}
                  onRefresh={() => {
                    setRefresh(true);
                    getHomePageData(1, false);
                  }}
                  colors={[Colors.primary.APP_THEME]}
                  tintColor={Colors.primary.APP_THEME}
                />
              }
              showsVerticalScrollIndicator={false}
              stickyHeaderHiddenOnScroll={true}
              ListHeaderComponent={renderListHeader}
              stickyHeaderIndices={[0]}
              contentContainerStyle={[
                styles.itemContainer,
                {paddingBottom: tabBarHeight + 40},
              ]}
              ListFooterComponent={renderFooterComponent}
              onEndReached={handleOnEndReached}
              onEndReachedThreshold={0.5}
              ListEmptyComponent={renderEmptyComponent}
            />
          </>
        )}
      </View>
      <GoogleSearchLocation
        visible={locationModalVisible}
        onCancel={() => {
          setLocationModalVisible(false);
        }}
        onSubmit={(res: any) => {
          setLocationModalVisible(false);
          dispatch(
            setLocation({
              address: res?.address,
              latitude: res?.latitude.toString(),
              longitude: res?.longitude.toString(),
              isFirstLoad: false,
            }),
          ); // Save to Redux
        }}
        autoFetchCurrentLocation={isFirstLoad} // Only fetch current location on first load
      />
      {!userData?.is_premium ? (
        <BannerAds adsStyle={[styles.ad_style, {bottom: tabBarHeight + 40}]} />
      ) : (
        <></>
      )}

      {Platform.OS == 'android' ? (
        <PushNotificationConfig
          onPress={(res: any) => {
            console.log(res, 'push notification log');
            redirectToScreen(res);
          }}
        />
      ) : (
        <View />
      )}
      {!userData?.is_premium ? (
        <BannerAds adsStyle={[styles.ad_style, {bottom: tabBarHeight + 40}]} />
      ) : (
        <></>
      )}
    </Background>
  );
};

export default Home;
