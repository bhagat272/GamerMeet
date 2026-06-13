import {AppState, DeviceEventEmitter} from 'react-native';
import io, {Socket} from 'socket.io-client';
import {DEVICE_INFO, getDeviceUniqueId, socketInstance} from './helper';
import {SOCKET_URL} from '../redux/apis/commonValue';
import {showToastMessage} from './toast';

interface SocketEventType {
  send_message: string;
  getConversationList: string;
  getchats: string;
  delete_chat: string;
  clear_group_chat: string;
  user_block_unblock: string;
  read_message: string;
  seenGroupMessage: string;
  notification_enable: string;
  reaction_update: string;
  join_room: string;
  room_joined: string;
  recieve_message: string;
  refresh_chat_list: string;
  delete_conversation: string;
  update_read_status_success: string;
  leave_room: string;
  mute_chat: string;
  room_left: string;
}

export const socketEvent: SocketEventType = {
  send_message: 'send-message',
  getConversationList: 'get-conversation',
  getchats: 'get-chat-list',
  delete_chat: 'delete-chat',
  clear_group_chat: 'clear_group_chat',
  user_block_unblock: 'block-user',
  read_message: 'update-read-status',
  seenGroupMessage: 'seenGroupMessage',
  notification_enable: 'notification_enable',
  reaction_update: 'reaction-update',
  join_room: 'join-room',
  room_joined: 'room-joined',
  recieve_message: 'receive-message',
  refresh_chat_list: 'refresh-chat-list',
  delete_conversation: 'delete-conversation',
  update_read_status_success: 'update-read-status-success',
  leave_room: 'leave-room',
  mute_chat: 'mute-chat',
  room_left: 'room-left',
};

export const socketConnectionCheck = (): void => {
  if (socketInstance?.socket) {
    socketInstance.socket.connect();
  } else {
    socketInit();
  }
};

export const socketInit = async (): Promise<void> => {
  const uniqueId: string = await getDeviceUniqueId();
  socketInstance.socket = io(SOCKET_URL, {
    forceNew: true,
    reconnection: true,
    // Set the number of reconnection attempts (Infinity or a high number if desired)
    reconnectionAttempts: Infinity,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 3000,
    // transports: ['websocket'],
    transports: ['websocket', 'polling'],
    upgrade: false,
    autoConnect: true,
    // upgrade: false,

    timeout: 30000,
    // query: {
    //   user_id: global?.userData?.id,
    //   device_type: DEVICE_INFO.device_type,
    //   device_unique_id: uniqueId,
    //   firebase_token: DEVICE_INFO.firebase_token,
    // },
    query: {
      user_id: String(global?.userData?.id || ''),
      device_type: String(DEVICE_INFO.firebase_device_type || ''),
      device_unique_id: String(uniqueId || ''),
      firebase_token: String(DEVICE_INFO.firebase_token || ''),
    },
  });

  // Event listener for a successful connection.
  socketInstance.socket.on('connect', (data: any) => {
    console.log('-------------Socket connected--🚀🚀🚀-----', data);
  });

  // Optional: Listen for reconnection attempts to log the number of attempts.
  socketInstance.socket.on('reconnect_attempt', (attempt: number) => {
    console.log(`-------------Socket reconnect attempt ${attempt}-------`);
  });

  // Optional: Listen for errors during reconnection.
  socketInstance.socket.on('reconnect_error', (error: any) => {
    console.log('-------------Socket reconnect error-------', error);
  });

  socketInstance.socket.on(socketEvent.room_left, (response: any) => {
    DeviceEventEmitter.emit(socketEvent.room_left, response);
    console.log('-------ROOM-LEFT-----', response);
  });

  // Optional: Listen for a failure to reconnect after all attempts.
  socketInstance.socket.on('reconnect_failed', () => {
    console.log('-------------Socket reconnect failed-------');
  });

  // Handle disconnection events.
  socketInstance.socket.on('disconnect', (data: any) => {
    console.log(
      '-------------Socket disconnect-------',
      socketInstance?.isCustomDisconnect,
      data,
    );
    // If not a custom disconnect, you can either rely on built-in reconnection or force reconnect.
    if (socketInstance?.isCustomDisconnect) {
      console.log('-------------Socket attempting manual reconnect-------');
      socketInstance.socket.connect();
    }
  });

  // Listen for connection errors.
  socketInstance.socket.on('connect_error', (error: any) => {
    console.log('-------------connect_error-------', error);
  });

  socketInstance.socket.on('error', (data: any) => {
    console.log('-------------error-------', data);
  });

  // Listen for custom events and emit them via DeviceEventEmitter.
  socketInstance.socket.on(socketEvent.recieve_message, (response: any) => {
    console.log('receive_message------111---', response);
    DeviceEventEmitter.emit(socketEvent.recieve_message, response);
  });

  socketInstance.socket.on('user_blocked', (response: any) => {
    DeviceEventEmitter.emit('user_blocked', response);
  });
  socketInstance.socket.on('reaction-update', (response: any) => {
    console.log('--------listener for upadate-------->', response);
    DeviceEventEmitter.emit('reaction-update', response);
  });
  socketInstance.socket.on(socketEvent.refresh_chat_list, (response: any) => {
    console.log('refresh_chat_list response--------,', response);
    DeviceEventEmitter.emit(socketEvent.refresh_chat_list, response);
  });
  // socketInstance.socket.on(socketEvent.read_message, (response: any) => {
  //   console.log('read message response--------,', response);
  //   DeviceEventEmitter.emit(socketEvent.read_message, response);
  // });
  socketInstance.socket.on(
    socketEvent.update_read_status_success,
    (response: any) => {
      console.log('rupdate_read_status_success response--------,', response);
      DeviceEventEmitter.emit(socketEvent.update_read_status_success, response);
    },
  );
  socketInstance.socket.on(socketEvent.join_room, (response: any) => {
    console.log('👥 joined-room:', response);
    DeviceEventEmitter.emit(socketEvent.join_room, response);
  });
  socketInstance.socket.on(socketEvent.room_joined, (response: any) => {
    console.log('👥 room-joined:', response);
    DeviceEventEmitter.emit(socketEvent.room_joined, response);
  });
};

export const socketReconnect = (): void => {
  if (socketInstance.socket && !socketInstance.socket.connected) {
    socketInstance.socket.connect();
  }
};

export const socketCustomDisconnect = (): void => {
  socketInstance.isCustomDisconnect = true;
  if (socketInstance.socket) {
    socketInstance.socket.disconnect();
  }
};
export const socketCustomLogoutDisconnect = (): void => {
  socketInstance.isCustomDisconnect = true;
  if (socketInstance.socket) {
    socketInstance.socket.disconnect();
    socketInstance.socket = null;
  }
};

export const socketIsConnected = (): boolean | undefined => {
  return socketInstance.socket?.connected;
};

export const socketEmit = (
  name: string,
  request: any,
  cb?: (response: any) => void,
  p0?: (err: any) => void,
): void => {
  // console.log('socketEmit-Request--->', name, '----', request);
  if (!socketIsConnected()) {
    socketCustomDisconnect();
    socketConnectionCheck();
  }
  socketInstance?.socket?.emit(name, request, cb);
};
