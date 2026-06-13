/* eslint-disable react-hooks/exhaustive-deps */
import React, {useCallback, useEffect, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  RefreshControl,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {
  Background,
  BannerAds,
  BrowseProfileShimmer,
  FilterModal,
} from '../../../components';
import {handlePush} from '../../../navigation/navigationService';
import {
  browseGamerAction,
  likeDislikeAction,
} from '../../../redux/actions/appSessionAction';
import {buttonLoading, loading} from '../../../redux/reducer/loadingReducer';
import {
  resetRefresh,
  triggerRefresh,
} from '../../../redux/reducer/refreshReducer';
import {Colors} from '../../../theme';
import imagePath from '../../../theme/imagePath';
import {showToastMessage} from '../../../utils/toast';
import ExploreCard from './exploreCard';
import styles from './styles';
import {translateText} from '../../../utils/language';
import {useBottomTabBarHeight} from '@react-navigation/bottom-tabs';

export interface ProfileData {
  _id: string;
  username: string;
  age: number;
  distance: number;
  match_percentage: number;
  game_genre: Array<{name: string}>;
  avatar: Array<{avatar_url: string}>;
  is_online?: boolean;
}

let searchTimeOut: ReturnType<typeof setTimeout> | null = null;

const Explore = () => {
  const dispatch = useDispatch();
  const [search, setSearch] = useState<string>('');
  const [isFilterVisible, setFilterVisible] = useState<boolean>(false);
  const [profiles, setProfiles] = useState<ProfileData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [isFetchingMore, setIsFetchingMore] = useState<boolean>(false);
  const [filters, setFilters] = useState({});
  const [filterLoading, setFilterLoading] = useState<boolean>(false);
  const [searchLoading, setSearchLoading] = useState<boolean>(false);
  const [isInitialFetch, setIsInitialFetch] = useState<boolean>(true);
  const {userData} = useSelector((state: any) => state.session);
  const {latitude, longitude} = useSelector((state: any) => state.location);
  const refreshFlag = useSelector((state: any) => state.refresh.refreshFlag);
  const tabBarHeight = useBottomTabBarHeight();

  const fetchProfiles = async (
    newPage = 1,
    isLoadMore = false,
    query?: string,
  ) => {
    console.log(
      'fetchProfiles: Called with page:',
      newPage,
      'isLoadMore:',
      isLoadMore,
    );
    if (isLoadMore) {
      setIsFetchingMore(true);
    } else {
      setIsLoading(true);
    }

    try {
      const payload = {
        page: newPage,
        latitude: latitude || userData?.latitude?.toString(),
        longitude: longitude || userData?.longitude?.toString(),
        ...(search.length > 0 && {
          search: typeof query === 'string' ? query : search,
        }),
        ...filters,
      };
      dispatch(buttonLoading(true));

      const response = await dispatch(browseGamerAction(payload));

      const newData = response?.data?.result || [];
      const totalPage = response?.data?.totalPages || 1;

      if (isLoadMore) {
        setProfiles(prev => [...prev, ...newData]);
      } else {
        setProfiles(newData);
      }

      setTotalPages(totalPage);
      setPage(newPage);
      if (response) {
        dispatch(buttonLoading(false));
      }

      setIsInitialFetch(false);
    } catch (error) {
      console.error('Error fetching profiles:', error);
      showToastMessage('Failed to fetch profiles', 'danger');
      dispatch(buttonLoading(false));
    } finally {
      setIsLoading(false);
      dispatch(loading(false));
      dispatch(buttonLoading(false));

      setIsRefreshing(false);
      setIsFetchingMore(false);

      setSearchLoading(false);
      setTimeout(() => {
        console.log('fetchProfiles: Resetting filterLoading to false');
        setFilterLoading(false);
      }, 1500); // Increased delay for text visibility
    }
  };
  useEffect(() => {
    fetchProfiles(1, false); // first load only
  }, [latitude]);

  const handleSearch = (text: string) => {
    if (search === '' && text === ' ') {
      return;
    }

    setSearch(text);

    if (searchTimeOut) {
      clearTimeout(searchTimeOut);
    }

    if (text.length >= 3 || !text) {
      searchTimeOut = setTimeout(() => {
        dispatch(loading(true));
        fetchProfiles(1, false, text);
      }, 1000);
    }
  };

  useEffect(() => {
    return () => {
      if (searchTimeOut) {
        clearTimeout(searchTimeOut);
      }
    };
  }, []);

  const handleReaction = (otherUserId: string, reactionType: string) => {
    const dic = {
      other_user_id: otherUserId,
      reaction: reactionType,
      check_withdraw: '0',
    };
    dispatch(likeDislikeAction(dic))
      .then((response: any) => {
        if (response?.success) {
          if (response?.data?.current_status === false) {
            showToastMessage(
              response?.data?.message ?? 'User is already in Pending request',
              'danger',
            );
          }
          dispatch(triggerRefresh()); // <--- trigger list refresh
          setProfiles(prevList =>
            prevList.filter(user => user._id !== otherUserId),
          );
          console.log(`${reactionType} successful:`, response?.data?.message);
        } else {
          console.error(`${reactionType} failed:`, response?.data?.message);
        }
      })
      .catch((error: any) => {
        console.log(`Error performing ${reactionType}:`, error);
      });
  };

  useEffect(() => {
    if (refreshFlag) {
      dispatch(resetRefresh());
      fetchProfiles(1, false);
    }
  }, [refreshFlag]);

  useEffect(() => {
    if (!isInitialFetch) {
      fetchProfiles(1, false);
    }
  }, [filters]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchProfiles(1);
  };

  const handleLoadMore = () => {
    if (page < totalPages && !isFetchingMore) {
      fetchProfiles(page + 1, true);
    }
  };

  const renderProfileCard = useCallback(
    ({item}: {item: ProfileData}) => (
      <ExploreCard
        item={item}
        disableActions={userData?.is_ghost_user}
        handlePush={handlePush}
        handleReaction={handleReaction}
      />
    ),
    [handlePush, handleReaction],
  );

  const renderEmptyComponent = () => {
    if ((isLoading && isInitialFetch) || filterLoading || searchLoading) {
      return <BrowseProfileShimmer count={4} />;
    }
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>
          {translateText('no_profiles_found')}
        </Text>
      </View>
    );
  };

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
      <View style={styles.overlay}>
        <Text style={styles.headerText}>
          {translateText('browse_through_profiles_to')}
        </Text>

        <View style={styles.searchContainer}>
          <Image source={imagePath.search_icon} style={styles.searchIcon} />
          <TextInput
            placeholder={translateText('search')}
            placeholderTextColor={Colors.secondary.GREY}
            value={search}
            onChangeText={value => {
              handleSearch(value);
            }}
            style={styles.searchInput}
          />

          {search !== '' && (
            //clearbutton
            <TouchableOpacity hitSlop={7} onPress={() => handleSearch('')}>
              <Image
                source={imagePath.close_circle_line}
                style={styles.cross_icon}
              />
            </TouchableOpacity>
          )}

          <TouchableOpacity
            hitSlop={7}
            onPress={() => setFilterVisible(true)}
            disabled={isInitialFetch}>
            <Image source={imagePath.Filter_icon} style={styles.filterIcon} />
          </TouchableOpacity>
        </View>

        <FilterModal
          visible={isFilterVisible}
          onClose={() => setFilterVisible(false)}
          onApply={(filterData: any) => {
            console.log('onApply: Applied Filters:', filterData);
            console.log('onApply: Setting filterLoading to true');
            setFilterLoading(true);
            setFilters(filterData);
            dispatch(loading(true));
            setFilterVisible(false);
          }}
          onReset={() => {
            console.log('Filters Reset');
            setFilters({});
            dispatch(loading(true));
            setFilterVisible(false);
          }}
          filterLoading={filterLoading}
        />
        {searchLoading && (
          <ActivityIndicator
            size="small"
            color={Colors.primary.APP_THEME}
            style={styles.searchLoader}
          />
        )}
        <FlatList
          data={profiles}
          renderItem={renderProfileCard}
          keyExtractor={item => item._id}
          contentContainerStyle={[
            styles.listContent,
            {paddingBottom: tabBarHeight + 40},
          ]}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={renderEmptyComponent}
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
          initialNumToRender={8}
          maxToRenderPerBatch={10}
          windowSize={5}
          removeClippedSubviews={true}
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

export default Explore;
