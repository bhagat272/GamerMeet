import moment from 'moment';
import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useDispatch} from 'react-redux';
import {Background, ImageLoadView} from '../../../components';
import {
  notificationListAction,
  notificationReadAction,
} from '../../../redux/actions/appSessionAction';
import {IMAGE_URL} from '../../../redux/apis/commonValue';
import {Colors, Fonts} from '../../../theme';
import imagePath from '../../../theme/imagePath';
import styles from './styles';
import {setInitialTab} from '../../../redux/reducer/tabReducer';
import {translateText} from '../../../utils/language';
import {CommonActions} from '@react-navigation/native';

interface NotificationData {
  _id: string;
  notification_type: string;
  subject: string;
  description: string;
  createdAt: string;
  sender: {
    _id: string;
    avatar: string[];
    username: string;
  };
  isRead: boolean;
}

interface UserNotification {
  id: string;
  icon: any;
  title: string;
  time: string;
  onPress?: () => void;
}

interface NotificationItemProps {
  item: UserNotification & {isRead?: boolean};
}

const NotificationItem: React.FC<NotificationItemProps> = ({item}) => (
  <TouchableOpacity style={styles.mainview} onPress={item.onPress}>
    <ImageLoadView source={item.icon} style={styles.notificationImage} />
    <View style={styles.textview}>
      <Text style={[styles.title, !item.isRead && styles.highlighted]}>
        {item.title}
      </Text>
      <Text
        style={[styles.time, !item.isRead && {color: Colors.primary.WHITE}]}>
        {item.time}
      </Text>
    </View>
  </TouchableOpacity>
);

const PagingLoader: React.FC = () => (
  <View style={styles.pagingLoaderContainer}>
    <ActivityIndicator color={Colors.primary.APP_THEME} size="small" />
    <Text style={styles.loadingText}>Loading more...</Text>
  </View>
);

interface InitialLoaderProps {
  isLoading: boolean;
  hasData: boolean;
}
const InitialLoader: React.FC<InitialLoaderProps> = ({isLoading, hasData}) => {
  if (!isLoading || hasData) {
    return null;
  }

  return (
    <View style={styles.initialLoaderContainer}>
      <ActivityIndicator color={Colors.primary.APP_THEME} size="small" />
      <Text style={styles.loadingText}>Loading notifications...</Text>
    </View>
  );
};
const EmptyState = () => (
  <View style={styles.emptyComponent}>
    <Text style={styles.emptyText}>No notifications yet</Text>
  </View>
);

const Notification = (props: any) => {
  const dispatch = useDispatch();
  const [notifications, setNotifications] = useState<UserNotification[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchNotifications = async (page: number, isRefresh = false) => {
    if (page > totalPages) {
      return;
    }

    const isInitial = page === 1 && !isRefresh;
    if (isInitial) {
      setIsInitialLoading(true);
    } else {
      setIsLoadingMore(true);
    }

    try {
      const res: any = await dispatch(notificationListAction({page}));
      console.log('Notification fetch response:', res);

      if (res?.success && res?.data?.notifications) {
        const newItems = res.data.notifications.map((n: NotificationData) => ({
          id: n._id,
          notification_type: n.notification_type,
          icon: n.sender?.avatar?.[0]
            ? {uri: IMAGE_URL + n.sender.avatar[0]}
            : imagePath.badge,
          title: n.description || n.subject,
          time: moment.utc(n.createdAt).local().fromNow(),
          isRead: n.isRead, // 👈 Add this
          onPress: () => {
            console.log('Notification pressed - ID:', n._id); // 👈 Log ID
            console.log('Notification type:', n.notification_type);

            let initialTab: string | null = null;
            if (n.notification_type === 'like_request') {
              initialTab = 'request';

              props.navigation.dispatch(CommonActions.goBack());

              // 3️⃣ Then make sure Connection tab becomes active
              setTimeout(() => {
                dispatch(setInitialTab(initialTab));
                props.navigation.navigate('BottomTab', {
                  screen: 'Connection',
                  params: {initialTab},
                });
              }, 100);
            } else if (n.notification_type === 'mutual_request') {
              initialTab = 'mutual';

              props.navigation.dispatch(CommonActions.goBack());

              // 3️⃣ Then make sure Connection tab becomes active
              setTimeout(() => {
                dispatch(setInitialTab(initialTab));
                props.navigation.navigate('BottomTab', {
                  screen: 'Connection',
                  params: {initialTab},
                });
              }, 100);
            }

            dispatch(notificationReadAction({notificationId: n._id})).then(
              (response: any) => {
                if (response) {
                  setNotifications(prev =>
                    prev.map(item =>
                      item.id === n._id ? {...item, isRead: true} : item,
                    ),
                  );
                }
              },
            );
          },
        }));

        setTotalPages(res.data.totalPages || 1);

        if (page === 1) {
          setNotifications(newItems);
          setCurrentPage(1);
        } else {
          setNotifications(prev => [...prev, ...newItems]);
          setCurrentPage(page);
        }
      }
    } catch (error) {
      console.log('Notification fetch error:', error);
    } finally {
      setIsInitialLoading(false);
      setIsLoadingMore(false);
      if (isRefresh) {
        setRefreshing(false);
      }
    }
  };

  useEffect(() => {
    fetchNotifications(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  const handleLoadMore = () => {
    if (currentPage < totalPages && !isLoadingMore) {
      fetchNotifications(currentPage + 1);
    }
  };

  useEffect(() => {
    dispatch(notificationReadAction({}));
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    setCurrentPage(1);
    setTotalPages(1);
    await fetchNotifications(1, true);
  };

  return (
    <Background>
      <View style={styles.profile_info_view}>
        <TouchableOpacity
          style={styles.image_container_view}
          onPress={() => props.navigation.goBack()}>
          <Image source={imagePath.back_icon} style={styles.back} />
        </TouchableOpacity>
        <View style={styles.profile_name_email_view}>
          <Text style={styles.user_name_text}>
            {translateText('notifications')}
          </Text>
        </View>
      </View>

      {/* List */}
      <InitialLoader
        isLoading={isInitialLoading}
        hasData={notifications.length > 0}
      />
      {!isInitialLoading && (
        <FlatList
          data={notifications}
          keyExtractor={item => item.id}
          renderItem={({item}) => <NotificationItem item={item} />}
          contentContainerStyle={styles.containerStyle}
          showsVerticalScrollIndicator={false}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.1}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={[Colors.primary.APP_THEME]}
              tintColor={Colors.primary.APP_THEME}
              title="Refreshing..."
              titleColor={Colors.primary.GREY}
            />
          }
          ListEmptyComponent={<EmptyState />}
          ListFooterComponent={isLoadingMore ? <PagingLoader /> : null}
        />
      )}
    </Background>
  );
};

export default Notification;
