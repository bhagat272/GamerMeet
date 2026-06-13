import {useIsFocused} from '@react-navigation/native';
import React, {useEffect, useRef, useState} from 'react';
import {
  ActivityIndicator,
  DeviceEventEmitter,
  FlatList,
  Image,
  RefreshControl,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {Fold} from 'react-native-animated-spinkit';
import {
  Background,
  BannerAds,
  CustomAlert,
  MessageCard,
} from '../../../components';
import {IMAGE_URL} from '../../../redux/apis/commonValue';
import {Colors} from '../../../theme';
import imagePath from '../../../theme/imagePath';
import {translateText} from '../../../utils/language';
import {socketEmit, socketEvent} from '../../../utils/socket';
import {showToastMessage} from '../../../utils/toast';
import styles from './styles';
import {useBottomTabBarHeight} from '@react-navigation/bottom-tabs';
import {useDispatch, useSelector} from 'react-redux';
import {resetChatlist} from '../../../redux/reducer/refreshReducer';
import {socketInstance} from '../../../utils/helper';

interface ChatUser {
  _id: string;
  username: string;
  email: string;
  avatar: any;
  is_online: boolean;
  is_voice_chat: boolean;
}

interface LastMessage {
  sender_id: string;
  receiver_id: string;
  message_type: string;
  duration: null | number;
  content: string;
  timestamp: string;
  read: string[];
  deleted_by: string[];
  _id: string;
}

interface ChatItem {
  _id: string;
  users: ChatUser[];
  isGroup: boolean;
  group_name: null | string;
  group_icon: null | string;
  admin_id: null | string;
  active: boolean;
  deleted: boolean;
  unreadMessagesCount: number;
  lastMessage: LastMessage;
  updatedAt: string;
  timestamp: string;
  isBlockedByMe: boolean;
  isBlockedByOther: boolean;
}

interface ChatListResponse {
  success: boolean;
  data: {
    chats: ChatItem[];
    totalRecords: number;
    currentPage: number;
    totalPages: number;
  };
  message: string;
}

const ChatList = (props: any) => {
  const [chatList, setChatList] = useState<ChatItem[]>([]);
  const [filteredChatList, setFilteredChatList] = useState<ChatItem[]>([]);
  const [search, setSearch] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const isFocus = useIsFocused();
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const {userData} = useSelector((state: any) => state.session);
  const [showAlert, setShowAlert] = useState(false);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);

  const [refreshing, setRefreshing] = useState(false);
  const tabBarHeight = useBottomTabBarHeight();
  const refreshChatList = useSelector(
    (state: any) => state.refresh.refreshChatList,
  );
  const dispatch = useDispatch();
  const closeSwipeRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    const unsubscribe = props.navigation.addListener('focus', () => {
      if (refreshChatList) {
        console.log('🔄 ChatList focused, refreshing...');
        userChatList(true, search, false, true);
        dispatch(resetChatlist());
      }
    });
    return unsubscribe;
  }, [refreshChatList]);

  const userChatList = (
    reset: boolean = false,
    searchText: string = search,
    isRefresh: boolean = false,
    silent: boolean = false,
  ) => {
    if (reset) {
      setPage(1);
      setHasMore(true);

      if (!isRefresh && !silent) {
        setChatList([]);
        setFilteredChatList([]);
      }
    }

    if (!isRefresh && !silent) {
      setLoading(true); // 👈 only set loading when not silent
    }
    if (isRefresh) {
      setRefreshing(true);
    }
    setError(null);

    socketEmit(
      'get-chat-list',
      {
        user_id: global?.userData?.id,
        ...(searchText?.trim() && {search: searchText.trim()}),
        page: reset ? 1 : page,
        limit: 20,
      },
      (res: ChatListResponse) => {
        console.log('------------');

        if (res?.success) {
          const newChats = res.data.chats || [];

          setChatList(prev =>
            reset
              ? newChats
              : [
                  ...prev,
                  ...newChats.filter(c => !prev.some(p => p._id === c._id)),
                ],
          );
          setFilteredChatList(prev =>
            reset
              ? newChats
              : [
                  ...prev,
                  ...newChats.filter(c => !prev.some(p => p._id === c._id)),
                ],
          );

          setHasMore(page < res.data.totalPages);
          if (!reset) {
            setPage(prev => prev + 1);
          }
        } else {
          setError(res?.message || 'Failed to load chats');
          showToastMessage(res?.message || 'Failed to load chats', 'danger');
        }

        if (!silent) {
          setLoading(false);
        }
        setTimeout(() => setRefreshing(false), 300);
      },
    );
  };

  useEffect(() => {
    if (isFocus) {
      // Listen to room-joined event
      console.log('focued ');
      const sub = DeviceEventEmitter.addListener(
        socketEvent.room_joined,
        data => {
          console.log('🎉 Joined room successfully:', data);
        },
      );

      const dic = {
        chatId: globalThis?.userData?.id,
      };
      // Emit join-room
      socketEmit(socketEvent.join_room, {chatId: dic}, (res: any) => {
        console.log(res, 'join room---->');
      });
      return () => {
        sub.remove();
      };
    }
  }, [isFocus]);

  useEffect(() => {
    userChatList();
  }, []);

  useEffect(() => {
    if (!socketInstance?.socket) {
      return;
    }

    const socket = socketInstance.socket;

    // Attach only when focused
    if (isFocus) {
      const handler = (response: any) => {
        console.log('REFRESH CHAT LIST ======', response);
        userChatList(true, search, false, true);
      };

      // Listen via socket directly
      socket.on(socketEvent.refresh_chat_list, handler);

      // Cleanup on blur/unfocus
      return () => {
        socket.off(socketEvent.refresh_chat_list, handler);
        console.log('🔇 Removed refresh-chat-list listener');
      };
    }
  }, [isFocus, search]);

  // useEffect(() => {
  //   const receiveMsgListener = DeviceEventEmitter.addListener(
  //     'receive-message',
  //     (res: {
  //       chatId: string;
  //       message: {
  //         sender_id: string;
  //         receiver_id: string;
  //         message_type: string;
  //         content: string;
  //         thumbnail?: null | string;
  //         timestamp: string;
  //         read: string[];
  //         deleted_by: string[];
  //         is_blocked?: boolean;
  //       };
  //     }) => {
  //       console.log('📩 New message received:', res);

  //       const updateAndSortChats = (chats: ChatItem[]) => {
  //         const chatIndex = chats.findIndex(c => c._id === res.chatId);

  //         let updatedChats: ChatItem[];
  //         if (chatIndex === -1) {
  //           console.log(
  //             'New chat detected – triggering refresh for full details',
  //           );
  //           userChatList(true);
  //           return chats;
  //         } else {
  //           // 🔹 Update existing (as before)
  //           updatedChats = chats.map((chat, i) =>
  //             i === chatIndex
  //               ? {
  //                   ...chat,
  //                   lastMessage: {
  //                     ...res.message,
  //                     _id: res.message.timestamp,
  //                     duration: null,
  //                   },
  //                   unreadMessagesCount:
  //                     res.message.sender_id !== global?.userData?.id
  //                       ? (chat.unreadMessagesCount || 0) + 1
  //                       : chat.unreadMessagesCount,
  //                   updatedAt: res.message.timestamp,
  //                 }
  //               : chat,
  //           );
  //         }

  //         return [...updatedChats].sort(
  //           (a, b) =>
  //             new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
  //         );
  //       };

  //       setChatList(updateAndSortChats);

  //       setFilteredChatList(prevFiltered => {
  //         if (search.trim() === '') {
  //           return updateAndSortChats(prevFiltered);
  //         } else {
  //           const updatedFull = updateAndSortChats(chatList);
  //           const filtered = updatedFull.filter(chat => {
  //             if (!chat.isGroup) {
  //               const otherUser = chat.users.find(
  //                 user => user._id !== global?.userData?.id,
  //               );
  //               return otherUser?.username
  //                 ?.toLowerCase()
  //                 .includes(search.trim().toLowerCase());
  //             }
  //             return chat.group_name
  //               ?.toLowerCase()
  //               .includes(search.trim().toLowerCase());
  //           });
  //           return filtered;
  //         }
  //       });
  //     },
  //   );

  //   return () => {
  //     receiveMsgListener.remove();
  //   };
  // }, [userChatList, search]);

  useEffect(() => {
    const delay = setTimeout(() => {
      const trimmedSearch = search.trim();
      userChatList(true, trimmedSearch, true);
      if (trimmedSearch === '') {
        setFilteredChatList(chatList);
      } else {
        const filtered = chatList.filter(chat => {
          if (!chat.isGroup) {
            const otherUser = chat.users.find(
              user => user._id !== global?.userData?.id,
            );
            return otherUser?.username
              .toLowerCase()
              .includes(trimmedSearch.toLowerCase());
          }
          return chat.group_name
            ?.toLowerCase()
            .includes(trimmedSearch.toLowerCase());
        });
        setFilteredChatList(filtered);
      }
    }, 300);

    return () => clearTimeout(delay);
  }, [search]);

  const getOtherUser = (chat: ChatItem): ChatUser | null => {
    if (chat.isGroup) {
      return null;
    }
    const otherUser = chat.users.find(
      user => user._id !== global?.userData?.id,
    );

    return otherUser || null;
  };

  const getAvatar = (chat: ChatItem) => {
    if (chat.isGroup && chat.group_icon) {
      return {uri: IMAGE_URL + chat.group_icon};
    }

    const otherUser = getOtherUser(chat);

    if (otherUser?.avatar) {
      return {uri: `${IMAGE_URL}${otherUser?.avatar}`};
    }

    return imagePath.user_icon;
  };

  const getName = (chat: ChatItem) => {
    if (chat.isGroup) {
      return chat.group_name || 'Group Chat';
    }

    const otherUser = getOtherUser(chat);
    return otherUser?.username || 'Unknown User';
  };

  const getLastMessage = (chat: ChatItem) => {
    if (!chat.lastMessage) {
      return 'No messages yet';
    }

    if (chat.lastMessage.message_type === 'TEXT') {
      // Uppercase to match your API
      return chat.lastMessage.content;
    } else if (chat.lastMessage.message_type === 'image') {
      return '📷 Image';
    } else if (chat.lastMessage.message_type === 'audio') {
      return '🎤 Voice message';
    } else if (chat.lastMessage.message_type === 'video') {
      return '🎥 Video';
    }

    return 'New message';
  };

  const handleDeleteChat = (
    conversationId: string,
    closeSwipe?: () => void,
  ) => {
    setSelectedChatId(conversationId);
    setShowAlert(true);
    closeSwipeRef.current = closeSwipe || null; // 👈 store reference
  };

  const confirmDeleteChat = () => {
    if (!selectedChatId || !global?.userData?.id) {
      showToastMessage(
        'Cannot delete chat: Missing conversation or user ID',
        'danger',
      );
      setShowAlert(false);
      return;
    }

    socketEmit(
      'delete-chat',
      {
        conversation_id: selectedChatId,
        user_id: global.userData.id,
      },
      (response: {success: boolean; message: string}) => {
        console.log('===DELETE CHAT======', response);
        if (response.success) {
          showToastMessage(
            response.message || 'Chat deleted successfully',
            'success',
          );
          setChatList(prev => prev.filter(chat => chat._id !== selectedChatId));
          setFilteredChatList(prev =>
            prev.filter(chat => chat._id !== selectedChatId),
          );
        } else {
          showToastMessage(
            response.message || 'Failed to delete chat',
            'danger',
          );
        }
        setShowAlert(false);
        setSelectedChatId(null);
      },
    );
  };

  const onRefresh = () => {
    userChatList(true, search, true); // pass reset = true, isRefresh = true
  };

  // const formatTime = (timestamp: string) => {
  //   const messageDate = new Date(timestamp);
  //   const now = new Date();
  //   const diffInHours =
  //     (now.getTime() - messageDate.getTime()) / (1000 * 60 * 60);

  //   if (diffInHours < 24) {
  //     return messageDate.toLocaleTimeString([], {
  //       hour: '2-digit',
  //       minute: '2-digit',
  //     });
  //   } else if (diffInHours < 48) {
  //     return 'Yesterday';
  //   } else {
  //     return messageDate.toLocaleDateString([], {
  //       month: 'short',
  //       day: 'numeric',
  //     });
  //   }
  // };
  const formatTime = (timestamp: string) => {
    const messageDate = new Date(timestamp);
    const now = new Date();
    const diffInSeconds = Math.floor(
      (now.getTime() - messageDate.getTime()) / 1000,
    );
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInSeconds < 60) {
      return 'Just now';
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes} min${diffInMinutes > 1 ? 's' : ''} ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    } else if (diffInDays === 1) {
      return 'Yesterday';
    } else {
      return messageDate.toLocaleDateString([], {
        month: 'short',
        day: 'numeric',
      });
    }
  };

  if (loading && !refreshing && chatList.length === 0) {
    return (
      <Background backgroundStyle={styles.container}>
        <View style={styles.loader}>
          <Fold color={Colors.secondary.MONSOON} size={60} />
        </View>
      </Background>
    );
  }

  if (error) {
    return (
      <Background backgroundStyle={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity
          onPress={() => userChatList(true)}
          style={styles.retryButton}>
          <Text style={styles.retryButtonText}>{translateText('retry')}</Text>
        </TouchableOpacity>
      </Background>
    );
  }

  return (
    <Background backgroundStyle={styles.container}>
      <Text style={styles.headerText}>
        {translateText('connect_and_chat_with_your')}
      </Text>

      <View style={styles.searchContainer}>
        <Image source={imagePath.search_icon} style={styles.searchIcon} />
        <TextInput
          placeholder={translateText('search')}
          placeholderTextColor={Colors.primary.WHITE}
          value={search}
          onChangeText={setSearch}
          style={styles.searchInput}
        />
        {search !== '' && (
          //clearbutton
          <TouchableOpacity hitSlop={7} onPress={() => setSearch('')}>
            <Image
              source={imagePath.close_circle_line}
              style={styles.cross_icon}
            />
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={filteredChatList}
        showsVerticalScrollIndicator={false}
        keyExtractor={item => item._id}
        renderItem={({item}) => {
          const otherUser = getOtherUser(item);

          return (
            <MessageCard
              id={item._id}
              name={getName(item)}
              unreadCount={item.unreadMessagesCount}
              isOnline={getOtherUser(item)?.is_online || false}
              message={getLastMessage(item)}
              time={
                item?.lastMessage
                  ? formatTime(item?.lastMessage?.timestamp)
                  : ''
              }
              avatar={getAvatar(item)}
              onPress={() => {
                socketEmit(
                  'create-conversation',
                  {
                    user_id: global?.userData?.id,
                    other_user_id: item?.users.find(
                      user => user._id !== global?.userData?.id,
                    )?._id,
                  },
                  (res: any) => {
                    console.log('conversation create  response:', res);
                    if (res?.success && res?.data?.conversation_id) {
                      userData.conversation_id = res.data.conversation_id;
                      socketEmit(
                        socketEvent.join_room,
                        {chatId: res.data.conversation_id},
                        (response: any) => {
                          console.log(response, 'join room---->');
                        },
                      );
                    }
                  },
                );
                props.navigation.navigate('ChatScreen', {
                  chatId: item._id,
                  other_user_id: otherUser?._id || '',
                  userData: otherUser || {
                    _id: '',
                    username: 'Unknown User',
                    email: '',
                    avatar: [],
                  },
                  isGroup: item.isGroup,
                  groupName: item.group_name,
                });
              }}
              onDeletePress={closeSwipe =>
                handleDeleteChat(item._id, closeSwipe)
              }
            />
          );
        }}
        contentContainerStyle={[
          styles.itemContainer,
          {paddingBottom: tabBarHeight + 40},
        ]}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {search
                ? translateText('no_conversations_found')
                : translateText('no_conversations_yet')}
            </Text>
          </View>
        }
        onEndReached={() => {
          if (hasMore && !loading) {
            userChatList(false);
          }
        }}
        onEndReachedThreshold={0.5}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[Colors.primary.APP_THEME]}
            tintColor={Colors.primary.APP_THEME}
          />
        }
        ListFooterComponent={
          loading && !refreshing && chatList.length > 0 ? (
            <ActivityIndicator size={'small'} />
          ) : null
        }
      />
      {!userData?.is_premium ? (
        <BannerAds adsStyle={[styles.ad_style, {bottom: tabBarHeight + 40}]} />
      ) : (
        <></>
      )}
      <CustomAlert
        visible={showAlert}
        message={translateText(
          'Are_you_sure_you_want_to_delete_this_conversation?',
        )}
        onCancel={() => {
          setShowAlert(false);
          setSelectedChatId(null);
          closeSwipeRef.current?.();
          closeSwipeRef.current = null;
        }}
        onConfirm={() => {
          confirmDeleteChat();
          closeSwipeRef.current?.();
          closeSwipeRef.current = null;
        }}
        confirmText={translateText('yes')}
        cancelText={translateText('no')}
      />
    </Background>
  );
};

export default ChatList;
