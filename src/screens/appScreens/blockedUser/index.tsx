import React, {useEffect, useState, useCallback} from 'react';
import {
  FlatList,
  Image,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import imagePath from '../../../theme/imagePath';
import styles from './styles';
import BlockedCard from './BlockedCard';
import {Background, CustomAlert} from '../../../components';
import {translateText} from '../../../utils/language';
import {useDispatch, useSelector} from 'react-redux';
import {blockedUsersListAction} from '../../../redux/actions/userSessionAction';
import {IMAGE_URL} from '../../../redux/apis/commonValue';
import {socketEmit} from '../../../utils/socket';
import {Colors} from '../../../theme';
import {loading} from '../../../redux/reducer/loadingReducer';

interface BlockedUser {
  _id: string;
  username: string;
  email: string;
  avatar: string[];
}

const BlockedUser = (props: any) => {
  const dispatch = useDispatch();
  const {userData} = useSelector((state: any) => state.session);

  // Pagination + Refresh States
  const [blockedUsers, setBlockedUsers] = useState<BlockedUser[]>([]);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  // Modal states
  const [showBlockConfirmModal, setShowBlockConfirmModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  useEffect(() => {
    fetchBlockedUser(1, true);
    dispatch(loading(true));
  }, []);

  const fetchBlockedUser = (pageNumber: number, isRefresh = false) => {
    if (loadingMore && !isRefresh) {
      return;
    }

    if (!isRefresh) {
      setLoadingMore(true);
    }

    dispatch(
      blockedUsersListAction({
        page: pageNumber,
        limit: 10,
      }),
    )
      .then((res: any) => {
        dispatch(loading(false));
        if (res?.success) {
          const fetchedUsers = res.data?.blockedUsers || [];

          setBlockedUsers(prev =>
            isRefresh ? fetchedUsers : [...prev, ...fetchedUsers],
          );

          setPage(res.data.currentPage);
          setTotalPages(res.data.totalPages);
        }
      })
      .finally(() => {
        setLoadingMore(false);
        setRefreshing(false);
      });
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setPage(1);
    fetchBlockedUser(1, true);
  }, []);

  const loadMore = () => {
    if (!loadingMore && page < totalPages) {
      fetchBlockedUser(page + 1);
    }
  };

  const handleUnblock = (id: string) => {
    socketEmit(
      'block-user',
      {
        blocked_user_id: id,
        blocked_by_user_id: userData?.id,
        status: 0,
      },
      () => {
        setBlockedUsers(prev => prev.filter(u => u._id !== id));
      },
    );
  };

  const buildAvatarUrl = (avatarArray: string[]) => {
    if (!avatarArray?.[0]) {
      return null;
    }
    const path = avatarArray[0];
    return path.startsWith('http') ? path : `${IMAGE_URL}${path}`;
  };

  const renderFooter = () => {
    if (!loadingMore) {
      return null;
    }
    return (
      <ActivityIndicator
        style={styles.loader}
        color={Colors.primary.APP_THEME}
      />
    );
  };

  return (
    <Background>
      <SafeAreaView style={styles.container}>
        <View style={styles.profile_info_view}>
          <TouchableOpacity
            style={styles.image_container_view}
            onPress={() => props.navigation.goBack()}>
            <Image source={imagePath.back_icon} style={styles.back} />
          </TouchableOpacity>
          <View style={styles.profile_name_email_view}>
            <Text style={styles.user_name_text}>
              {translateText('blocked_users')}
            </Text>
          </View>
        </View>

        <FlatList
          data={blockedUsers}
          keyExtractor={item => item._id}
          renderItem={({item}) => (
            <BlockedCard
              name={item.username}
              avatar={buildAvatarUrl(item.avatar)}
              onUnblock={() => {
                setSelectedUserId(item._id);
                setShowBlockConfirmModal(true);
              }}
            />
          )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.list,
            blockedUsers.length === 0 && styles.emptyListContainer,
          ]}
          ListFooterComponent={renderFooter}
          onEndReached={loadMore}
          onEndReachedThreshold={0.25}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[Colors.primary.APP_THEME]}
              tintColor={Colors.primary.APP_THEME}
            />
          }
          ListEmptyComponent={
            !loadingMore && !refreshing ? (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>
                  {translateText('no_blocked_users')}
                </Text>
              </View>
            ) : null
          }
        />

        <CustomAlert
          visible={showBlockConfirmModal}
          onConfirm={() => {
            if (selectedUserId) {
              handleUnblock(selectedUserId);
            }
            setShowBlockConfirmModal(false);
          }}
          onCancel={() => setShowBlockConfirmModal(false)}
          message={translateText('are_you_sure_you_want_to_unblock')}
          confirmText={translateText('yes')}
          cancelText={translateText('no')}
        />
      </SafeAreaView>
    </Background>
  );
};

export default BlockedUser;
