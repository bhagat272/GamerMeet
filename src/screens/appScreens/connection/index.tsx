/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useRef, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
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
  BrowseProfileShimmer,
  CustomAlert,
  ProfileCard,
} from '../../../components';
import {handlePush} from '../../../navigation/navigationService';
import {
  likeDislikeAction,
  mutualConnectionAction,
  pendingInterestAction,
  pendingRequestAction,
} from '../../../redux/actions/appSessionAction';
import {IMAGE_URL} from '../../../redux/apis/commonValue';
import {
  resetRefresh,
  triggerRefresh,
} from '../../../redux/reducer/refreshReducer';
import {Colors} from '../../../theme';
import imagePath from '../../../theme/imagePath';
import {socketConnectionCheck} from '../../../utils/socket';
import {showToastMessage} from '../../../utils/toast';
import styles from './styles';
import {translateText} from '../../../utils/language';
import {useFocusEffect, useIsFocused} from '@react-navigation/native';
import {setInitialTab} from '../../../redux/reducer/tabReducer';
import {useBottomTabBarHeight} from '@react-navigation/bottom-tabs';

type TabType = 'mutual' | 'interest' | 'request';

const TABS = [
  {
    title: translateText('mutual_connections'),
    type: 'mutual',
    color: Colors.primary.APP_THEME,
  },
  {
    title: translateText('pending_interests'),
    type: 'interest',
    color: Colors.primary.APP_THEME,
  },
  {
    title: translateText('pending_request'),
    type: 'request',
    color: Colors.primary.APP_THEME,
  },
];

interface UserData {
  _id: string;
  username: string;
  age: number;
  avatar: Array<{avatar_url: string}>;
  match_percentage: number;
}

interface PendingRequestData {
  _id: string;
  from_user_id: {
    _id: string;
    username: string;
    age: number;
    avatar: Array<{avatar_url: string}>;
  };
  match_percentage: number;
}

const Connection = (props: any) => {
  const [selectedTab, setSelectedTab] = useState<TabType>('mutual');
  const dispatch = useDispatch();
  const refreshSource = useRef<'external' | 'internal'>('external');

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isFetchingMore, setIsFetchingMore] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false); // New state for refresh
  const [mutualData, setMutualData] = useState<UserData[]>([]);
  const [interestData, setInterestData] = useState<UserData[]>([]);
  // const [isInitialFetch, setIsInitialFetch] = useState<boolean>(true);
  const [requestData, setRequestData] = useState<PendingRequestData[]>([]);
  const {userData} = useSelector((state: any) => state.session);
  const tabBarHeight = useBottomTabBarHeight();

  const [loadedTabs, setLoadedTabs] = useState<Record<TabType, boolean>>({
    mutual: false,
    interest: false,
    request: false,
  });
  const [pages, setPages] = useState<Record<TabType, number>>({
    mutual: 1,
    interest: 1,
    request: 1,
  });
  const [totalPages, setTotalPages] = useState<Record<TabType, number>>({
    mutual: 1,
    interest: 1,
    request: 1,
  });
  const refreshFlag = useSelector((state: any) => state.refresh.refreshFlag);

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmType, setConfirmType] = useState<'unmatch' | 'withdraw' | null>(
    null,
  );
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const {initialTab} = useSelector(
    (state: any) => state?.initialTab || {initialTab: null},
  );

  const tabsScrollRef = useRef<ScrollView>(null);
  const [tabLayouts, setTabLayouts] = useState<
    Record<string, {x: number; width: number}>
  >({});

  useEffect(() => {
    if (initialTab && initialTab !== selectedTab) {
      console.log(
        '🔄 Redux signal: Switching to tab:',
        initialTab,
        'and fetching...',
      );
      setSelectedTab(initialTab as TabType);
      fetchData(initialTab as TabType, 1, false); // Auto-fetch

      dispatch(setInitialTab(null));
    }
  }, [initialTab, selectedTab]); // Re-runs when signal changes

  useEffect(() => {
    if (tabLayouts[selectedTab]) {
      scrollToTab(selectedTab);
    }
  }, [selectedTab, tabLayouts]);

  useEffect(() => {
    if (globalThis?.userData) {
      socketConnectionCheck();
    }
  }, []);

  // Format data from API response
  const formatData = (apiData: any, tab: TabType): any => {
    if (!apiData) {
      return [];
    }

    if (tab === 'interest') {
      return apiData.map((item: any) => ({
        _id: item.to_user_id?._id || item._id,
        username: item.to_user_id?.username || 'Unknown',
        age: item.to_user_id?.age || 0,
        avatar: item.to_user_id?.avatar || [],
        match_percentage: item.match_percentage || 0,
      }));
    } else if (tab === 'request') {
      return apiData.map((item: any) => ({
        _id: item._id,
        from_user_id: {
          _id: item.from_user_id?._id || '',
          username: item.from_user_id?.username || 'Unknown',
          age: item.from_user_id?.age || 0,
          avatar: item.from_user_id?.avatar || [],
        },
        match_percentage: item.match_percentage || 0,
      }));
    }
    // For mutual connections
    return apiData.map((item: any) => {
      // const isFromSelf = item.from_user_id?.id === userData.id;
      // const otherUser = isFromSelf ? item.to_user_id : item.from_user_id;

      return {
        _id: item?._id || item._id,
        username: item?.username || 'Unknown',
        age: item?.age || 0,
        avatar: item?.avatar || [],
        match_percentage: item.match_percentage || 0,
      };
    });
  };

  // Fetch data based on tab and page
  const fetchData = (tab: TabType, page = 1, isLoadMore = false) => {
    if (isLoadMore) {
      setIsFetchingMore(true);
    } else if (!isRefreshing) {
      // Only set loading if not refreshing
      setIsLoading(true);
    }

    let action;
    switch (tab) {
      case 'mutual':
        action = mutualConnectionAction;
        break;
      case 'interest':
        action = pendingInterestAction;
        break;
      case 'request':
        action = pendingRequestAction;
        break;
    }

    dispatch(action({page}))
      .then((res: any) => {
        // setIsInitialFetch(false);

        if (res?.success) {
          const apiData = res.data?.result || res.data?.data || [];
          const formattedData = formatData(apiData, tab);
          const totalPage = res.data?.totalPages || 1;

          switch (tab) {
            case 'mutual':
              setMutualData(prev =>
                isLoadMore ? [...prev, ...formattedData] : formattedData,
              );
              setTotalPages(prev => ({...prev, mutual: totalPage}));
              setPages(prev => ({...prev, mutual: page}));
              break;
            case 'interest':
              setInterestData(prev =>
                isLoadMore ? [...prev, ...formattedData] : formattedData,
              );
              setTotalPages(prev => ({...prev, interest: totalPage}));
              setPages(prev => ({...prev, interest: page}));
              break;
            case 'request':
              setRequestData(prev =>
                isLoadMore ? [...prev, ...formattedData] : formattedData,
              );
              setTotalPages(prev => ({...prev, request: totalPage}));
              setPages(prev => ({...prev, request: page}));
              break;
          }
          setLoadedTabs(prev => ({...prev, [tab]: true}));
        }
        setIsLoading(false);
        setIsFetchingMore(false);
        setIsRefreshing(false); // Reset refresh state
      })
      .catch((error: any) => {
        console.error(
          `Error fetching ${tab} data:`,
          error.response?.data || error,
        );
        setIsLoading(false);
        setIsFetchingMore(false);
        setIsRefreshing(false); // Reset refresh state on error
      })
      .finally(() => {
        setIsLoading(false);
        setIsFetchingMore(false);
        setIsRefreshing(false);
      });
  };

  // Handle refresh
  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchData(selectedTab, 1, false);
    // setPages(prev => ({...prev, [selectedTab]: 1}));
  };

  const handleReaction = (
    id: string,
    reactionType: string,
    tab: TabType,
    currentItem?: UserData,
  ) => {
    let action = likeDislikeAction;
    let payload;

    if (['like', 'dislike', 'unmatch', 'withdraw'].includes(reactionType)) {
      payload = {
        other_user_id: id,
        reaction: reactionType,
        check_withdraw: '1',
      };
    } else {
      console.error('Invalid reaction type:', reactionType);
      return;
    }

    dispatch(action(payload))
      .then((response: any) => {
        console.log(
          '------------>action response',
          response?.data?.current_status,
        );

        if (response?.success) {
          // ✅ Optimistic update: if LIKE creates a mutual connection
          if (reactionType === 'like' && response) {
            const newMutual: UserData = {
              _id: id,
              username: currentItem?.username || 'Unknown',
              age: currentItem?.age || 0,
              avatar: currentItem?.avatar || [],
              match_percentage: currentItem?.match_percentage || 0,
            };

            // Add new mutual if not already there
            setMutualData(prev => {
              const exists = prev.some(user => user._id === newMutual._id);
              return exists ? prev : [newMutual, ...prev];
            });

            // 🔥 Remove the user from pending tabs since they’re now mutual
            setInterestData(prev =>
              prev.filter(item => item._id !== newMutual._id),
            );
            setRequestData(prev =>
              prev.filter(item => item.from_user_id._id !== newMutual._id),
            );
          }

          if (response?.data?.current_status === false) {
            showToastMessage(
              response?.data?.message ?? 'User has withdrawn the request',
              'danger',
            );
          }

          // Mark as internal refresh and trigger
          refreshSource.current = 'internal';
          dispatch(triggerRefresh());

          // Handle removal for dislike / withdraw / unmatch
          switch (tab) {
            case 'mutual':
              setMutualData(prev => prev.filter(item => item._id !== id));
              break;
            case 'interest':
              setInterestData(prev => prev.filter(item => item._id !== id));
              break;
            case 'request':
              setRequestData(prev =>
                prev.filter(item => item.from_user_id._id !== id),
              );
              break;
          }
        } else {
          console.log(`${reactionType} failed:`, response?.data?.message);
        }
      })
      .catch((error: any) => {
        console.log(`Error performing ${reactionType}:`, error);
      });
  };

  useEffect(() => {
    if (!loadedTabs[selectedTab]) {
      fetchData(selectedTab, 1, false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTab, loadedTabs]);

  useEffect(() => {
    if (refreshFlag) {
      dispatch(resetRefresh());
      if (refreshSource.current === 'external') {
        fetchData('mutual', 1, false);
        fetchData(selectedTab, 1, false);
      }
      // Reset the source for next refresh
      refreshSource.current = 'external';
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshFlag, dispatch, selectedTab]);

  const handleTabLayout = (tabType: TabType, event: any) => {
    const {x, width} = event.nativeEvent.layout;
    setTabLayouts(prev => ({...prev, [tabType]: {x, width}}));
  };
  const scrollToTab = (tabType: TabType) => {
    if (tabsScrollRef.current && tabLayouts[tabType]) {
      const {x, width} = tabLayouts[tabType];
      // Center the tab in the ScrollView
      tabsScrollRef.current.scrollTo({
        x: x - 300 / 2 + width / 2, // 300 = approximate viewport width, adjust if needed
        animated: true,
      });
    }
  };
  // Handle tab change
  const handleTabChange = (tab: TabType) => {
    setSelectedTab(tab);
    scrollToTab(tab);
    if (!loadedTabs[tab]) {
      fetchData(tab, 1, false);
    }
  };

  // Handle load more for pagination
  const handleLoadMore = () => {
    if (
      pages[selectedTab] < totalPages[selectedTab] &&
      !isFetchingMore &&
      !isRefreshing
    ) {
      fetchData(selectedTab, pages[selectedTab] + 1, true);
    }
  };

  // Get current tab data
  const getCurrentData = () => {
    switch (selectedTab) {
      case 'mutual':
        return mutualData;
      case 'interest':
        return interestData;
      case 'request':
        return requestData.map((item, index) => ({
          _id: item.from_user_id._id, // Use request ID
          username: item.from_user_id?.username || 'Unknown',
          age: item.from_user_id?.age || 0,
          avatar: item.from_user_id?.avatar || [],
          match_percentage: item.match_percentage || 0,
          key: `${item._id}-${index}`, // Ensure unique key
        }));
      default:
        return [];
    }
  };

  const currentData = getCurrentData();
  const showEmptyState =
    !isLoading && !isRefreshing && currentData.length === 0;
  const showShimmer = isLoading && !isRefreshing;

  const renderCard = ({item}: {item: UserData & {key?: string}}) => (
    <ProfileCard
      disableActions={userData?.is_ghost_user}
      onCardPress={() =>
        handlePush({
          name: 'GamerDetail',
          params: {
            gamerId: item?._id,
            check_withdraw: selectedTab === 'request' ? '1' : '1',
            connectionType:
              selectedTab === 'mutual'
                ? 'mutual'
                : selectedTab === 'interest'
                ? 'interest'
                : 'swipe',
          },
        })
      }
      name={
        item?.username.length > 10
          ? item?.username.substring(0, 10) + '...'
          : item?.username
      }
      age={item?.age}
      percentage={item?.match_percentage}
      profileImage={
        item?.avatar.length > 0
          ? {
              uri:
                IMAGE_URL +
                (typeof item?.avatar[0] === 'string'
                  ? item?.avatar[0]
                  : item?.avatar[0].avatar_url),
            }
          : imagePath.user_icon
      }
      cardType={
        selectedTab === 'mutual'
          ? 'match'
          : selectedTab === 'interest'
          ? 'interest'
          : 'swipe'
      }
      onMessagePress={() => {
        props.navigation.navigate('ChatScreen', {
          other_user_id: item._id,
          userData: item,
        });
      }}
      onUnmatchPress={() => {
        setSelectedUserId(item?._id);
        setConfirmType('unmatch');
        setShowConfirmModal(true);
      }}
      onWithdrawPress={() => {
        setSelectedUserId(item._id);
        setConfirmType('withdraw');
        setShowConfirmModal(true);
      }}
      onLikePress={() => handleReaction(item._id, 'like', selectedTab, item)}
      onDislikePress={() => handleReaction(item._id, 'dislike', selectedTab)}
    />
  );

  const renderFooter = () => {
    if (isFetchingMore) {
      return (
        <View style={styles.footerContainer}>
          <ActivityIndicator size="small" color={Colors.primary.APP_THEME} />
        </View>
      );
    }
    return <View style={styles.defaultFooter} />;
  };

  return (
    <Background>
      <View style={styles.container}>
        <Text style={styles.header}>
          {translateText("let's_turn_your_matches_into")}
        </Text>

        {/* Scrollable Tab Buttons */}
        <View style={styles.tabRow}>
          <ScrollView
            ref={tabsScrollRef}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.tabRowContainer}>
            {TABS.map(tab => (
              <TouchableOpacity
                key={tab.type}
                onLayout={e => handleTabLayout(tab.type as TabType, e)}
                onPress={() => handleTabChange(tab.type as TabType)}
                style={[
                  styles.tabButton,
                  {
                    backgroundColor:
                      selectedTab === tab.type
                        ? tab.color
                        : Colors.secondary.CHIP_COLOR,
                  },
                ]}>
                <Text style={styles.tabText}>{tab.title}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {showShimmer && (
          <View style={styles.listContainer}>
            <BrowseProfileShimmer count={10} showActionButtons={false} />
          </View>
        )}

        {/* Card List - only show when not loading */}
        {!showShimmer && (
          <FlatList
            data={getCurrentData()}
            renderItem={renderCard}
            keyExtractor={item => item._id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={[
              styles.listContainer,
              {paddingBottom: tabBarHeight + 40},
            ]}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>
                  No{' '}
                  {selectedTab === 'mutual'
                    ? 'mutuals'
                    : selectedTab === 'interest'
                    ? 'pending interests'
                    : 'pending requests'}{' '}
                  found
                </Text>
              </View>
            }
            ListFooterComponent={renderFooter}
            refreshControl={
              <RefreshControl
                refreshing={isRefreshing}
                onRefresh={handleRefresh}
                colors={[Colors.primary.APP_THEME]}
                tintColor={Colors.primary.APP_THEME}
              />
            }
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.5}
          />
        )}
        <CustomAlert
          visible={showConfirmModal}
          onConfirm={() => {
            if (selectedUserId && confirmType) {
              handleReaction(selectedUserId, confirmType, selectedTab);
            }
            setShowConfirmModal(false);
            setConfirmType(null);
            setSelectedUserId(null);
          }}
          onCancel={() => {
            setShowConfirmModal(false);
            setConfirmType(null);
            setSelectedUserId(null);
          }}
          message={
            confirmType === 'unmatch'
              ? translateText('are_you_sure_you_want_to_unmatch')
              : translateText('are_you_sure_you_want_to_withdraw')
          }
          confirmText={translateText('yes')}
          cancelText={translateText('no')}
        />
      </View>
      {!userData?.is_premium ? (
        <BannerAds adsStyle={[styles.ad_style, {bottom: tabBarHeight + 40}]} />
      ) : (
        <></>
      )}
    </Background>
  );
};

export default Connection;
