/* eslint-disable react-hooks/exhaustive-deps */
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  AppState,
  DeviceEventEmitter,
  FlatList,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useDispatch } from 'react-redux';
import { Background, CustomAlert, ReportModal } from '../../../components';
import ImageLoadView from '../../../components/imageLoadView';
import AddMusicFile from '../../../permissions/addMusicFile';
import { checkMicroPhonePermission } from '../../../permissions/appPermissions';
import { chatMediaUploadAction } from '../../../redux/actions/appSessionAction';
import { reportUserAction } from '../../../redux/actions/userSessionAction';
import { IMAGE_URL, kInternetError } from '../../../redux/apis/commonValue';
import { isNetworkAvailable } from '../../../redux/apis/network';
import { loading } from '../../../redux/reducer/loadingReducer';
import { triggerChatList } from '../../../redux/reducer/refreshReducer';
import { Colors } from '../../../theme';
import imagePath from '../../../theme/imagePath';
import { translateText } from '../../../utils/language';
import {
  socketConnectionCheck,
  socketCustomDisconnect,
  socketEmit,
  socketEvent,
  socketIsConnected,
  socketReconnect,
} from '../../../utils/socket';
import { showToastMessage } from '../../../utils/toast';
import AudioRecorderComponent, {
  AudioRecorderRef,
} from './AudioRecorderComponent';
import FileViewer from './fileViewer';
import ReceiveComponent from './receiveComponent';
import SendComponent from './sendComponent';
import styles from './styles';

// Interface for each chat message
interface ChatMessage {
  id: string;
  user_id?: string;
  message_id?: string;
  other_user_id?: string;
  message?: string;
  message_type: string;
  timestamp: string;
  message_unread_count: number;
  conversation_id?: string;
  deleted_for?: string;
  raw: {
    sender_details: {avatar: string[]; username: string};
    receiver_details: {avatar: string[]; username: string};
  };
  thumb?: string;
}

// Interface for sectioned messages
interface SectionedMessage {
  type: 'message' | 'date';
  data: ChatMessage | string;
  id: string;
}

// Pagination variables
let messageData: ChatMessage[] = [];

interface FileData {
  message: string;
}

const PagingLoader: React.FC<{isLoadingMore: boolean}> = ({isLoadingMore}) => {
  if (!isLoadingMore) {
    return null;
  }

  return (
    <View style={styles.pagingLoaderContainer}>
      <ActivityIndicator size="large" color={Colors.primary.APP_THEME} />
      <Text style={styles.loadingText}>Loading more messages...</Text>
    </View>
  );
};

const ChatScreen = (props: any) => {
  const {
    other_user_id: paramOtherUserId,
    userData: paramUserData,
    chatData: chatData,

    chatId,
  } = props.route.params || {};

  // 🧠 If we come from a push notification or another source, we might only have chatData
  const [userData, setUserData] = useState<any>(paramUserData || {});
  const [other_user_id, setOtherUserId] = useState<string | null>(
    paramOtherUserId || null,
  );
  const recorderRef = useRef<AudioRecorderRef>(null);

  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMoreMessages, setHasMoreMessages] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  // const [showActionMenu, setShowActionMenu] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmAction, setConfirmAction] = useState<'block' | 'delete' | null>(
    null,
  );
  const appState = useRef(AppState.currentState);
  const flatListRef = useRef<FlatList<SectionedMessage> | null>(null);
  const [message, setMessage] = useState<string>('');
  const [chatHistoryData, setChatHistoryData] = useState<ChatMessage[]>([]);
  const [sectionedData, setSectionedData] = useState<SectionedMessage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isBlocked, setIsBlocked] = useState<boolean>(false);
  const [showMediaType, setShowMediaType] = useState<boolean>(false);
  const [showMediaFile, setShowMediaFile] = useState<boolean>(false);
  const [fileData, setFileData] = useState<FileData | null>(null);
  const [showRecorder, setShowRecorder] = useState(false);
  const [isVoiceChat, setIsVoiceChat] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  // const chatData = useSelector((state: any) => state.chat.chatData);
  const [fileType, setFileType] = useState<'video' | 'image' | 'audio' | null>(
    null,
  );
  const isFocus = useIsFocused();
  const [activeChatId, setActiveChatId] = useState<string | null>(
    chatId || null,
  );
  const isMounted = useRef(false);
  useEffect(() => {
    // if (Platform.OS === 'android') {
    //   AvoidSoftInput.setEnabled(true);
    //   AvoidSoftInput.setAvoidOffset(0);
    //   AvoidSoftInput.setEasing('easeInOut');
    //   AvoidSoftInput.setShowAnimationDuration(200);
    //   AvoidSoftInput.setHideAnimationDuration(200);
    // }

    return () => {
      // if (Platform.OS === 'android') {
      //   AvoidSoftInput.setEnabled(false);
      // }
      leaveRommMsgReq();
      // socketEmit(
      //   socketEvent.mute_chat,

      //   {
      //     user_id: global?.userData?.id,
      //     chat_id: activeChatId,
      //     isMuted: false,
      //   },
      //   (resP: any) => {
      //     // showToastMessage('join room');
      //     console.log('resPonse of mute-== go back ========>', resP);
      //   },
      // );
    };
  }, []);
  useEffect(() => {
    // 🟡 Handle case when opening from push notification
    if (chatData && Object.keys(userData).length === 0) {
      setUserData({
        id: chatData.id,
        username: chatData.other_user_name || 'Unknown',
        avatar: chatData.other_user_image || [],
        conversation_id: chatData.conversation_id || null,
      });

      setOtherUserId(chatData.id);
    }
  }, [chatData]);

  useEffect(() => {
    // When ChatScreen opens
    dispatch(triggerChatList());
  }, []);
  useEffect(() => {
    // if (!activeChatId) {
    // If we don't have a chatId, fetch it first
    console.log('======chatData from redirection', chatData);
    setIsLoading(true);
    socketEmit(
      'create-conversation',
      {
        user_id: global?.userData?.id,
        other_user_id: other_user_id || chatData?.id,
      },
      (res: any) => {
        setIsLoading(false);
        if (res?.success && res?.data?.conversation_id) {
          setActiveChatId(res.data.conversation_id);
          userData.conversation_id = res.data.conversation_id;
          methodGetAllChat(1, 20, res.data.conversation_id);

          socketEmit(
            socketEvent.join_room,
            res.data.conversation_id,
            (response: any) => {
              // showToastMessage('join room');
              console.log('join room- succesffullt--->', response);
            },
          );
        }
      },
    );
  }, []);

  useEffect(() => {
    setIsLoading(true);
    const appStateManage = AppState.addEventListener('change', nextAppState => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        socketEmit(
          'create-conversation',
          {
            user_id: global?.userData?.id,
            other_user_id: other_user_id || chatData?.id,
          },
          (res: any) => {
            setIsLoading(false);
            if (res?.success && res?.data?.conversation_id) {
              setActiveChatId(res.data.conversation_id);
              userData.conversation_id = res.data.conversation_id; // optional: keep in userData too
              methodGetAllChat(1, 20, res.data.conversation_id);
              socketEmit(
                socketEvent.join_room,
                res.data.conversation_id,
                (response: any) => {
                  // showToastMessage('join room');
                  console.log(response, 'join room---->');
                },
              );
              console.log('sdsdfsdfsfdsdfd', 'join room---->');
            }
          },
        );
      }
      appState.current = nextAppState;
    });
    return () => {
      appStateManage.remove();
    };
  }, []);

  const handleReportUser = async (reason: string, details: string) => {
    try {
      const payload = {
        reported_user: other_user_id,
        reason,
        details,
      };
      const res: any = await dispatch(reportUserAction(payload));
      if (res?.success) {
        showToastMessage('User reported successfully', 'success');
        setShowReportModal(false);
      } else {
        showToastMessage(res?.message || 'Failed to report user', 'danger');
      }
    } catch (err) {
      console.log('Error reporting user:', err);
      showToastMessage('Error reporting user', 'danger');
    }
  };

  // Function to format date for display
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    // Check if date is today
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    }

    // Check if date is yesterday
    if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    }

    // Check if date is within the last 7 days
    const daysDiff = Math.floor(
      (today.getTime() - date.getTime()) / (1000 * 60 * 60 * 24),
    );
    if (daysDiff < 7) {
      return date.toLocaleDateString('en-US', {weekday: 'long'});
    }

    // Return full date for older messages
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Function to check if two dates are different days
  const isDifferentDay = (date1: string, date2: string): boolean => {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    return d1.toDateString() !== d2.toDateString();
  };

  // Function to section messages by date
  const sectionMessagesByDate = (
    messages: ChatMessage[],
  ): SectionedMessage[] => {
    if (messages.length === 0) {
      return [];
    }

    const sectioned: SectionedMessage[] = [];

    // Add first date header
    sectioned.push({
      type: 'date',
      data: formatDate(messages[0].timestamp),
      id: `date-${messages[0].timestamp}`,
    });

    // Add first message
    sectioned.push({
      type: 'message',
      data: messages[0],
      id: messages[0].id,
    });

    // Process remaining messages
    for (let i = 1; i < messages.length; i++) {
      const currentMessage = messages[i];
      const previousMessage = messages[i - 1];

      // Check if we need to add a date header
      if (isDifferentDay(currentMessage.timestamp, previousMessage.timestamp)) {
        sectioned.push({
          type: 'date',
          data: formatDate(currentMessage.timestamp),
          id: `date-${currentMessage.timestamp}`,
        });
      }

      // Add the message
      sectioned.push({
        type: 'message',
        data: currentMessage,
        id: currentMessage.id,
      });
    }

    return sectioned;
  };

  const normalizeChats = (chats: any[]): ChatMessage[] => {
    return chats.map((chat, index) => ({
      id: chat?._id || `server-${Date.now()}-${index}`,
      user_id: chat?.sender_id?._id || chat.sender_id,
      message_id: chat?._id,
      other_user_id: other_user_id,
      message: chat?.content,
      message_type: chat?.message_type,
      timestamp: chat?.timestamp,
      message_unread_count: chat?.is_read ? 0 : 1,
      conversation_id: chat?.conversation_id || userData?.conversation_id,
      raw: {
        sender_details: chat?.sender_details || {
          avatar: chat?.sender_id?.avatar || [],
          username: chat?.sender_id?.username || 'Unknown',
        },
        receiver_details: chat?.receiver_details || {
          avatar: chat?.receiver_id?.avatar || [],
          username: chat?.receiver_id?.username || 'Unknown',
        },
      },
      thumbnail: chat?.message_type === 'video' ? chat.thumbnail : undefined,
    }));
  };

  // Toggle audio recorder
  const methodToggleRecorder = async () => {
    if (showRecorder) {
      // Close recorder if already open
      setShowRecorder(false);
    } else {
      // Request microphone permission and open recorder
      const hasPermission = await checkMicroPhonePermission();
      if (hasPermission) {
        setShowRecorder(true);
        setShowMediaType(false); // close media view if open
      }
    }
  };

  const methodToggleMediaType = () => {
    setShowMediaType(prev => {
      if (!prev) {
        if (recorderRef.current) {
          recorderRef.current.stopIfRecording();
        }
        setShowRecorder(false);
      }
      return !prev;
    });
  };

  useEffect(() => {
    if (global?.userData) {
      socketConnectionCheck();
    }
  }, []);

  useEffect(() => {
    setIsLoading(true);
    methodGetAllChat(1, 20);
    const receiveMsgListener = DeviceEventEmitter.addListener(
      socketEvent.recieve_message,
      (res: any) => {
        console.log('recieve----------> ', res);
        if (res?.message) {
          methodReceiveMessage(res.message);
        }
      },
    );

    const blockUserListener = DeviceEventEmitter.addListener(
      'user_blocked',
      () => {},
    );

    return () => {
      receiveMsgListener.remove();
      blockUserListener.remove();
      messageData = [];
      setChatHistoryData([]);
      setSectionedData([]);
    };
  }, [other_user_id]);

  useEffect(() => {
    const newSectionedData = sectionMessagesByDate(chatHistoryData);
    setSectionedData(newSectionedData);
  }, [chatHistoryData]);

  useFocusEffect(
    React.useCallback(() => {
      // Screen comes into focus
      isMounted.current = true;

      // Ensure socket connected
      if (!socketIsConnected()) {
        socketReconnect();
      } else if (globalThis?.userData) {
        socketConnectionCheck();
      }

      const handleAppStateChange = (nextAppState: any) => {
        if (
          appState.current.match(/inactive|background/) &&
          nextAppState === 'active'
        ) {
          // App comes to foreground
          if (!socketIsConnected()) {
            socketReconnect();
          } else if (globalThis?.userData) {
            socketConnectionCheck();
          }
          methodGetAllChat(1, 20);
        }

        if (nextAppState.match(/inactive|background/)) {
          // App goes to background
          if (isMounted.current && socketIsConnected()) {
            leaveRommMsgReq();
          }
        }

        appState.current = nextAppState;
      };

      const subscription = AppState.addEventListener(
        'change',
        handleAppStateChange,
      );

      return () => {
        // Screen goes out of focus

        // if (isMounted.current && socketIsConnected()) {
        //   leaveRommMsgReq();
        // }
        isMounted.current = false;

        subscription.remove();
      };
    }, []),
  );

  const leaveRommMsgReq = async () => {
    console.log('LEAVE===ROOM= 1====>');

    const isConnected = await isNetworkAvailable();
    const isSocketConnected = socketIsConnected();
    if (isConnected) {
      if (!isSocketConnected) {
        socketCustomDisconnect();
        socketConnectionCheck();
      }

      let chat_id = chatData?.conversation_id || activeChatId;

      socketEmit(socketEvent.leave_room, chat_id, async (response: any) => {
        console.log('LEAVE===ROOM===2==>', response);

        if (response) {
          showToastMessage('Leave room', 'info');
          // console.log('LEAVE===ROOM=====>', response);
        }
      });
    } else {
      if (!isConnected) {
        showToastMessage(kInternetError);
      }
    }
  };

  const scrollToTop = (): void => {
    if (flatListRef.current) {
      flatListRef.current.scrollToOffset({animated: true, offset: 0});
    }
  };

  const methodReceiveMessage = (newMessage: any): void => {
    console.log('--=-=-=-=-=-=', newMessage, '--==-=-==-=-=-=-=-');
    const normalizedMessage = normalizeChats([newMessage])[0];
    const hasDuplicate = messageData.findIndex(
      d => d.id === normalizedMessage.id,
    );
    if (
      hasDuplicate === -1 &&
      normalizedMessage.user_id === other_user_id &&
      (normalizedMessage.conversation_id === userData?.conversation_id ||
        !userData?.conversation_id)
    ) {
      messageData = [normalizedMessage, ...messageData];
      setChatHistoryData(prev => [normalizedMessage, ...prev]);
      if (normalizedMessage?.conversation_id && !userData.conversation_id) {
        userData.conversation_id = normalizedMessage.conversation_id;
      }
      scrollToTop();
    }
    console.log(
      '-----methodreceive-normalize data-------->',
      normalizedMessage,
    );

    socketEmit(
      'update-read-status',
      {
        message_id: normalizedMessage?.message_id,
        conversation_id:
          normalizedMessage.conversation_id || userData?.conversation_id,
        user_id: global?.userData?.id,
      },
      (res: any) => {
        console.log('update read status====>', res);
      },
    );
  };

  const methodGetAllChat = (
    page: number = 1,
    limit: number = 20,
    conversationId: string | null = activeChatId,
  ): void => {
    if (!conversationId) {
      console.warn('No conversationId');
      setIsLoading(false);
      setIsLoadingMore(false);
      return;
    }

    const payload = {
      conversation_id: conversationId,
      user_id: global?.userData?.id,
      other_user_id: other_user_id,
      page,
      limit,
    };

    socketEmit(socketEvent.getConversationList, payload, (res: any) => {
      // Reset loading states
      setIsLoading(false);
      setIsLoadingMore(false);
      console.log('====================================');
      console.log(res);
      console.log('====================================');
      if (res?.success && res?.data?.messages) {
        const newMessages = normalizeChats(res.data.messages);
        setIsBlocked(res?.data?.isBlockedByMe);
        setIsVoiceChat(!!res?.data?.is_voice_chat);
        // Check if we have more messages to load
        if (newMessages.length < limit) {
          setHasMoreMessages(false);
        } else {
          setHasMoreMessages(true);
        }

        if (page === 1) {
          // First page - replace all messages
          messageData = [...newMessages];
          setCurrentPage(1);
        } else {
          // Subsequent pages - append messages (older messages)
          messageData = [...messageData, ...newMessages];
          setCurrentPage(page);
        }

        setChatHistoryData([...messageData]);

        // Update message IDs for pagination tracking
        if (messageData.length > 0) {
        }

        if (page === 1) {
          scrollToTop();
        }
      } else {
        console.warn('❌ get-conversation returned no messages:', res?.message);
        setHasMoreMessages(false);
      }
    });
  };

  const methodSendMessage = ({data}: {data: any}): void => {
    // socketInit();
    setMessage('');

    const dic = {
      sender_id: global?.userData?.id,
      receiver_id: other_user_id,
      content: data?.msg || '',
      message_type: data?.msgType,
      is_blocked_by_me: false,
      is_blocked_by_other: false,
    };
    console.log('sendmessage_emit payload:', dic);
    socketEmit(socketEvent.send_message, dic, (res: any) => {
      console.log('send-message--succes_log', res);
      if (res?.success) {
        // Update conversation_id if not set
        if (!userData.conversation_id && res.data.chatId) {
          setActiveChatId(userData.conversation_id);
          userData.conversation_id = res.data.chatId;
        }
        // Fetch latest chats
        methodGetAllChat(1, 20, userData.conversation_id);
      } else {
        console.warn('❌ Send message failed:', res?.message);
      }
    });
  };

  const methodBlockUser = (): void => {
    const payload = {
      blocked_user_id: other_user_id,
      blocked_by_user_id: global?.userData?.id,
      status: isBlocked ? 0 : 1, // toggle
    };

    socketEmit('block-user', payload, (res: any) => {
      console.log('block-user emit response:', res);

      if (res?.success) {
        const blocked = res.data?.block_status === 1;
        setIsBlocked(blocked);

        showToastMessage(res.message, 'success');
      } else {
        showToastMessage(
          res?.message || 'Failed to block/unblock user',
          'danger',
        );
      }
    });
  };

  useEffect(() => {
    // Event sent to blocked user
    const blockListener = DeviceEventEmitter.addListener(
      'block-user',
      (data: any) => {
        console.log('📌 You were blocked/unblocked:', data);
        // If current user was blocked, update state
        if (data?.blocked_by?._id === other_user_id) {
          setIsBlocked(data?.block === true);
          showToastMessage(
            data.block
              ? 'You were blocked by this user.'
              : 'You were unblocked.',
            'info',
          );
        }
      },
    );

    // Event sent to the blocking user
    const blockSuccessListener = DeviceEventEmitter.addListener(
      'block-user-success',
      (data: any) => {
        console.log('✅ Block/unblock success:', data);
        if (data?.status === 1) {
          setIsBlocked(true);
          showToastMessage('User blocked successfully.', 'success');
        } else {
          setIsBlocked(false);
          showToastMessage('User unblocked successfully.', 'success');
        }
      },
    );

    return () => {
      blockListener.remove();
      blockSuccessListener.remove();
    };
  }, [other_user_id]);

  const methodDeleteChat = (): void => {
    const dic = {
      user_id: global?.userData?.id,
      other_user_id: other_user_id,
      conversation_id: activeChatId,
    };
    socketEmit(socketEvent.delete_conversation, dic, (data: any) => {
      console.log(data, 'delete data');
      if (data?.success) {
        messageData = [];
        setChatHistoryData([]);
        setSectionedData([]);
        setCurrentPage(1);
        setHasMoreMessages(true);
      }
    });
  };

  const methodUploadImage = (type: string) => {
    Keyboard.dismiss();
    if (type === 'music') {
      AddMusicFile((res: any) => {
        setShowMediaType(false);
        if (res?.uri) {
          methodUploadMediaApi(res?.uri, type);
        }
      });
    } else {
      props.navigation.navigate('ImageController', {
        mediaType: type,
        onSuccess: (res: any) => {
          setShowMediaType(false);
          if (res?.path) {
            methodUploadMediaApi(res?.path, type);
          }
        },
      });
    }
  };

  const methodUploadMediaApi = (path: string, type: string) => {
    const formData = new FormData();
    formData.append('media_file', {
      uri: path,
      type:
        type === 'photo'
          ? 'image/jpeg'
          : type === 'video'
          ? 'video/mp4'
          : 'audio/mpeg',
      name:
        type === 'photo'
          ? `image_${Math.floor(Date.now() / 1000)}.jpeg`
          : type === 'video'
          ? `video_${Math.floor(Date.now() / 1000)}.mp4`
          : `audio_${Math.floor(Date.now() / 1000)}.mp3`,
    });
    console.log('formData:', JSON.stringify(formData));

    setTimeout(() => {
      dispatch(loading(true));
      dispatch(chatMediaUploadAction(formData)).then((response: any) => {
        dispatch(loading(false));
        if (response) {
          const dic = {
            msg: response.data.fileName,
            msgType:
              type === 'photo' ? 'image' : type === 'video' ? 'video' : 'audio',
            thumb: response?.data?.media_thumb || '',
          };
          methodSendMessage({data: dic});
        }
      });
    }, 500);
  };

  const onScrollPage = (): void => {
    if (!isLoadingMore && hasMoreMessages && chatHistoryData.length > 0) {
      const nextPage = currentPage + 1;
      setIsLoadingMore(true);
      methodGetAllChat(nextPage, 20);
    }
  };

  const methodFileViewer = (
    type: 'video' | 'image' | 'audio',
    data: FileData,
  ) => {
    setFileType(type);
    setFileData(data);
    setShowMediaFile(true);
  };
  // const buildMediaUrl = (path: string | string[]) => {
  //   if (!path) {
  //     return '';
  //   }

  //   // If avatar is an array, take the first value
  //   const avatarPath = Array.isArray(path) ? path[0] : path;

  //   if (avatarPath?.startsWith('/')) {
  //     return `${IMAGE_URL}${avatarPath}`;
  //   }
  //   return `${IMAGE_URL}/${avatarPath}`;
  // };
  const buildMediaUrl = (avatar: any): string => {
    if (!avatar) {
      return '';
    }

    try {
      // 🟩 CASE 1: Array input
      if (Array.isArray(avatar)) {
        if (avatar.length === 0) {
          return '';
        }

        const first = avatar[0];

        // If it's an object → { avatar_url: '/uploads/...jpg' }
        if (first && typeof first === 'object') {
          const path = first?.avatar_url ?? first?.url ?? '';
          if (typeof path === 'string' && path.trim() !== '') {
            return path.startsWith('http') ? path : `${IMAGE_URL}${path}`;
          }
        }

        // If it's a string → ['/uploads/...jpg']
        if (typeof first === 'string' && first.trim() !== '') {
          return first.startsWith('http') ? first : `${IMAGE_URL}${first}`;
        }

        return '';
      }

      // 🟩 CASE 2: Single string path
      if (typeof avatar === 'string' && avatar.trim() !== '') {
        return avatar.startsWith('http') ? avatar : `${IMAGE_URL}${avatar}`;
      }

      // 🟩 CASE 3: Single object { avatar_url: '/uploads/...jpg' }
      if (typeof avatar === 'object' && avatar !== null) {
        const path = avatar?.avatar_url ?? avatar?.url ?? '';
        if (typeof path === 'string' && path.trim() !== '') {
          return path.startsWith('http') ? path : `${IMAGE_URL}${path}`;
        }
      }

      return '';
    } catch (e) {
      console.warn('⚠️ buildMediaUrl error:', e);
      return '';
    }
  };

  const renderItem = ({item}: {item: SectionedMessage}): JSX.Element => {
    const chatItem = item.data as ChatMessage;

    return (
      <View>
        {chatItem.user_id === globalThis?.userData?.id ? (
          <SendComponent
            item={chatItem}
            cb={(type: 'image' | 'video' | 'audio') =>
              methodFileViewer(type, {message: chatItem?.message})
            }
          />
        ) : (
          <ReceiveComponent
            item={chatItem}
            cb={(type: 'image' | 'video' | 'audio') =>
              methodFileViewer(type, {message: chatItem.message})
            }
          />
        )}
      </View>
    );
  };

  // eslint-disable-next-line react/no-unstable-nested-components
  const InitialLoader: React.FC = () => {
    if (!isLoading || chatHistoryData.length > 0) {
      return null;
    }

    return (
      <View style={styles.initialLoaderContainer}>
        <ActivityIndicator size={'large'} color={Colors.primary.APP_THEME} />
        <Text style={styles.loadingText}>
          {translateText('loading_messages...')}
        </Text>
      </View>
    );
  };

  const methodMediaTypeView = () => {
    return (
      <View style={styles.media_view}>
        {[
          {type: 'photo', icon: imagePath.image_icon, label: 'Image'},
          {type: 'video', icon: imagePath.video_icon, label: 'Video'},
          // {type: 'music', icon: imagePath.music_icon, label: 'Music'},
        ].map(item => (
          <TouchableOpacity
            key={item.type}
            onPress={() => methodUploadImage(item.type)}
            style={styles.media_sub_view}>
            <Image
              source={item.icon}
              resizeMode="contain"
              style={styles.media_icon}
            />
            <Text style={styles.media_text}>{item.label}</Text>
          </TouchableOpacity>
        ))}
        <TouchableOpacity
          style={styles.view_cancel_icon}
          onPress={() => setShowMediaType(false)}>
          <Image
            source={imagePath.cross_icon}
            resizeMode="contain"
            style={styles.cancel_icon}
          />
        </TouchableOpacity>
      </View>
    );
  };

  const [height, setHeight] = useState<number>(0);
  useEffect(() => {
    if (Platform.OS == 'android') {
      Keyboard.addListener('keyboardDidShow', nativeEvent => {
        console.log('keyboardDidShow===', nativeEvent.endCoordinates.height);
        setHeight(nativeEvent.endCoordinates.height);
      });
      Keyboard.addListener('keyboardDidHide', nativeEvent => {
        console.log('keyboardDidHide===', nativeEvent.endCoordinates.height);

        setHeight(nativeEvent.endCoordinates.height);
      });
    }
  }, []);

  return (
    <Background>
      <View style={{...styles.container, marginBottom: height}}>
        <View>
          <View style={styles.header_view}>
            <TouchableOpacity
              onPress={() => props.navigation.goBack()}
              activeOpacity={0.6}>
              <Image
                style={styles.chat_back}
                source={imagePath.goBackImgpng}
                resizeMode={'contain'}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.view_flex}
              onPress={() =>
                props.navigation.navigate('GamerDetail', {
                  gamerId: other_user_id,
                  connectionType: 'other',
                })
              }>
              {userData?.avatar || userData?.profile_picture ? (
                <ImageLoadView
                  style={styles.profile_pic}
                  source={{
                    uri: buildMediaUrl(userData?.avatar),
                  }}
                  resizeMode={'cover'}
                />
              ) : (
                <ImageLoadView
                  style={styles.profile_pic}
                  source={imagePath.user_icon}
                  resizeMode={'cover'}
                />
              )}
              <Text numberOfLines={1} style={styles.person_name}>
                {userData?.username || 'Unknown'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              hitSlop={10}
              activeOpacity={0.8}
              onPress={() => {
                setShowMediaType(false);
                setShowRecorder(false);
                if (recorderRef.current) {
                  recorderRef.current.stopIfRecording();
                }
                props.navigation.navigate('MoreOptions', {
                  status: isBlocked ? 'Unblock user' : 'Block User',
                  cb: (data: string) => {
                    if (data === 'block') {
                      setConfirmAction('block');
                      setTimeout(() => setShowConfirm(true), 300);
                    } else if (data === 'delete') {
                      setConfirmAction('delete');
                      setTimeout(() => setShowConfirm(true), 300);
                    } else if (data === 'report') {
                      setTimeout(() => setShowReportModal(true), 300);
                    }
                  },
                  other_user_id,
                });
              }}>
              <Image
                style={styles.more_pic}
                source={imagePath.dot_icon}
                resizeMode={'contain'}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.line} />
        </View>

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : null}
          // eslint-disable-next-line react-native/no-inline-styles
          style={{flex: 1}}>
          {isLoading && chatHistoryData.length === 0 ? (
            <InitialLoader />
          ) : (
            <FlatList
              ref={flatListRef}
              inverted
              data={sectionedData}
              renderItem={renderItem}
              keyExtractor={item => item.id}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps={'handled'}
              onEndReached={onScrollPage}
              onEndReachedThreshold={0.1}
              ListFooterComponent={
                <PagingLoader isLoadingMore={isLoadingMore} />
              }
              // eslint-disable-next-line react-native/no-inline-styles
              contentContainerStyle={{
                paddingBottom: 16,
                flexGrow: 1,
              }}
            />
          )}

          {showRecorder && (
            <AudioRecorderComponent
              ref={recorderRef}
              visible={showRecorder} // Pass visible prop
              onClose={result => {
                setShowRecorder(false);
                if (result && result.filePath) {
                  methodUploadMediaApi(result.filePath, 'music');
                }
              }}
            />
          )}
          {showMediaType ? methodMediaTypeView() : null}
          <View
            // eslint-disable-next-line react-native/no-inline-styles
            style={{
              ...styles.footer_view,
              display: isBlocked ? 'none' : 'flex',
            }}>
            <View style={styles.textInput_view}>
              <TouchableOpacity hitSlop={5} onPress={methodToggleMediaType}>
                <Image
                  source={imagePath.add_icon_small}
                  resizeMode="contain"
                  style={styles.attachment_icon}
                />
              </TouchableOpacity>
              <TextInput
                style={styles.textInput_style}
                placeholder={'Send a message...'}
                multiline
                keyboardType={'default'}
                underlineColorAndroid="transparent"
                value={message}
                placeholderTextColor="#BABFC7"
                onChangeText={setMessage}
              />
              {isVoiceChat && (
                <TouchableOpacity onPress={methodToggleRecorder}>
                  <Image
                    source={imagePath.mic_icon_small}
                    resizeMode="contain"
                    style={styles.mic}
                  />
                </TouchableOpacity>
              )}
            </View>
            <TouchableOpacity
              activeOpacity={0.6}
              onPress={() => {
                if (message.trim()) {
                  const dic = {msg: message.trim(), msgType: 'TEXT'};
                  methodSendMessage({data: dic});
                }
              }}
              style={[
                // eslint-disable-next-line react-native/no-inline-styles
                {display: message.trim() ? 'flex' : 'none'},
                // eslint-disable-next-line react-native/no-inline-styles
                {
                  backgroundColor: 'red',
                  width: 50,
                  borderRadius: 33,
                  marginStart: 12,
                  height: 50,
                  justifyContent: 'center',
                  alignItems: 'center',
                },
              ]}>
              <Image
                source={imagePath.share_icon}
                resizeMode="contain"
                style={styles.send_icon}
              />
            </TouchableOpacity>
          </View>
          <ReportModal
            visible={showReportModal}
            onClose={() => setShowReportModal(false)}
            onSubmit={handleReportUser}
          />
          <CustomAlert
            visible={showConfirm}
            message={
              confirmAction === 'block'
                ? isBlocked
                  ? translateText('are_you_sure_you_want_to_unblock')
                  : translateText('are_you_sure_you_want_to_block')
                : translateText('are_you_sure_you_want_to_delete_chat')
            }
            confirmText={translateText('yes')}
            cancelText={translateText('no')}
            onConfirm={() => {
              setShowConfirm(false);
              if (confirmAction === 'block') {
                methodBlockUser();
              } else if (confirmAction === 'delete') {
                methodDeleteChat();
              }
              setConfirmAction(null);
            }}
            onCancel={() => {
              setShowConfirm(false);
              setConfirmAction(null);
            }}
          />
          <View
            // eslint-disable-next-line react-native/no-inline-styles
            style={{
              ...styles.block_user_view,
              display: isBlocked ? 'flex' : 'none',
            }}>
            <Text style={styles.block_user_text}>
              You have blocked this user
            </Text>
          </View>
          {showMediaFile && fileData && fileType && (
            <FileViewer
              visible={showMediaFile}
              fileData={fileData}
              fileType={fileType}
              onClose={() => setShowMediaFile(false)}
            />
          )}
        </KeyboardAvoidingView>
      </View>
    </Background>
  );
};

export default ChatScreen;
