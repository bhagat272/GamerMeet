import React, { useEffect, useMemo } from 'react';
import { Platform, StatusBar, StyleSheet, Text, TextInput } from 'react-native';
import FlashMessage from 'react-native-flash-message';
import { Provider } from 'react-redux';
import { AppMaintenance, LoaderView } from './src/components';

import Routes from './src/navigation/navigationStack';
import store from './src/redux/store';

import DeviceInfo from 'react-native-device-info';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Edge, SafeAreaView } from 'react-native-safe-area-context';
import { DEVICE_INFO } from './src/utils/helper';
import {
  getFCMToken,
  requestAndroidNotificationPermission,
} from './src/utils/notificationPermissions';

function App() {
  useEffect(() => {
    // Disable font scaling for Text components
    if ((Text as any).defaultProps == null) {
      (Text as any).defaultProps = {};
    }
    (Text as any).defaultProps.allowFontScaling = false;

    // Disable font scaling for TextInput components
    if ((TextInput as any).defaultProps == null) {
      (TextInput as any).defaultProps = {};
    }
    (TextInput as any).defaultProps.allowFontScaling = false;
  }, []);
  useEffect(() => {
    (async () => {
      if (Platform.OS === 'android') {
        requestAndroidNotificationPermission();
      }
      let dic = {...DEVICE_INFO};

      let device = await DeviceInfo.getUniqueId();
      dic.device_unique_id = device;
      let token: any = await getFCMToken();
      dic.firebase_token = token;
      console.log(token, 'fcm--token APP.TSX----');
      // if (!token) {
      //   dic.firebase_token = 'simulator';
      // } else {
      //   dic.firebase_token = token;
      // }
      
      Object.assign(DEVICE_INFO, dic);
    })();
  }, []);

  const usePlatformEdges = (): Edge[] => {
    return useMemo(
      () =>
        Platform.OS === 'android'
          ? ['left', 'right', 'bottom']
          : ['left', 'right'],
      [],
    );
  };
  const edges = usePlatformEdges();

  return (
    <SafeAreaView style={styles.flex_one} edges={edges}>
      <Provider store={store}>
        <GestureHandlerRootView style={styles.flex_one}>
          <Routes />
          <AppMaintenance />
        </GestureHandlerRootView>
        <FlashMessage
          duration={3000}
          position="top"
          icon={'auto'}
          floating={true}
          animated={true}
          style={styles.flash}
        />
        <LoaderView />
      </Provider>
    </SafeAreaView>
  );
}

export default App;

const styles = StyleSheet.create({
  flex_one: {
    flex: 1,
  },
  flash: {
    marginTop:
      Platform.OS === 'android' && StatusBar.currentHeight
        ? StatusBar.currentHeight + 10
        : 0,
  },
});
