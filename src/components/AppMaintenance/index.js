import React, {useState, useEffect, useRef} from 'react';
import {
  Platform,
  View,
  Text,
  Linking,
  Dimensions,
  Alert,
  Image,
  StyleSheet,
  AppState,
} from 'react-native';
import CompareVersions from './CompareVersions';
import deviceInfoModule from 'react-native-device-info';
import imagePath from '../../theme/imagePath';
import Colors from '../../theme/colors';
import {get, Publicget} from '../../redux/apis/apiHelper';
import {USER_SESSION_API} from '../../redux/apis/endpoints';
import fonts from '../../theme/fonts';
import {JSON_HEADER} from '../../redux/apis/commonValue';

const titleAlert = (title, message, onOk) => {
  Alert.alert(title, message, [{text: 'OK', onPress: onOk}], {
    cancelable: false,
  });
};

const titleConfirm = (title, message, onConfirm) => {
  Alert.alert(
    title,
    message,
    [
      {text: 'Update Now', onPress: () => onConfirm(true)},
      {text: 'Later', style: 'cancel', onPress: () => onConfirm(false)},
    ],
    {cancelable: false},
  );
};

const AppMaintenance = () => {
  const [isMaintenance, setIsMaintenance] = useState(false);
  const appState = useRef(AppState.currentState);
  const lastCallTime = useRef(0);

  const fetchAppSettingsSafe = () => {
    fetchAppSettings();
    // const now = Date.now();
    // // Throttle API calls to once every 5 seconds
    // if (now - lastCallTime.current > 5000) {
    //   lastCallTime.current = now;
    //   fetchAppSettings();
    // }
  };

  useEffect(() => {
  
    fetchAppSettingsSafe()
    // Initial check after 2 seconds
    // const timer = setTimeout(fetchAppSettingsSafe, 2000);

    const subscription = AppState.addEventListener('change', nextAppState => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        fetchAppSettingsSafe();
      }
      appState.current = nextAppState;
    });

    return () => {
      // clearTimeout(timer);
      subscription.remove();
    };
  }, []);

  const fetchAppSettings = async () => {
    try {
      const response = await Publicget({
        url: USER_SESSION_API.version_control,
        header: JSON_HEADER,
      });

      if (response?.success === true) {
        const data = response.data;

        const currentAppVersion = deviceInfoModule.getVersion();

        const isAndroid = Platform.OS === 'android';

        const maintenance = isAndroid
          ? data.android_maintenance
          : data.ios_maintenance;
        const serverVersion = isAndroid
          ? data.android_version
          : data.ios_version;
        const forceUpdate = isAndroid
          ? data.android_force_update
          : data.ios_force_update;
        const appLink = isAndroid ? data.android_app_link : data.ios_app_link;
        const updateMessage =
          data.update_message || 'A new version of the app is available.';

        // Maintenance mode
        setIsMaintenance(maintenance === true || maintenance === 'true');

        // Version check
        if (
          CompareVersions(String(serverVersion), String(currentAppVersion)) ===
          1
        ) {
          if (forceUpdate === true || forceUpdate === 'true') {
            titleAlert('Update Required', updateMessage, () => {
              Linking.openURL(appLink).catch(err =>
                console.error('Failed to open store link', err),
              );
            });
          } else {
            titleConfirm('Update Available', updateMessage, shouldUpdate => {
              if (shouldUpdate) {
                Linking.openURL(appLink).catch(err =>
                  console.error('Failed to open store link', err),
                );
              }
            });
          }
        }
      }
    } catch (error) {
      console.error('App version check failed:', error);
    }
  };

  if (!isMaintenance) return null;

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Image
          style={styles.image}
          resizeMode="contain"
          source={imagePath.maintenance}
        />
        <Text style={styles.title}>
          We're undergoing a bit of Scheduled Maintenance
        </Text>
        <Text style={styles.message}>
          Sorry for the inconvenience. We'll be back and running as fast as
          possible.
        </Text>
      </View>
    </View>
  );
};

export default React.memo(AppMaintenance);

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Colors.secondary.HARP,
    zIndex: 9999,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  image: {
    width: Dimensions.get('window').width - 40,
    height: Dimensions.get('window').width - 120,
    marginBottom: 30,
  },
  title: {
    fontSize: fonts.SIZE_18,
    color: Colors.primary.BLACK,
    textAlign: 'center',
    fontFamily: fonts.Poppins_SemiBold,
    marginBottom: 20,
  },
  message: {
    fontSize: fonts.SIZE_14,
    color: Colors.primary.BLACK,
    textAlign: 'center',
    fontFamily: fonts.Poppins_Medium,
  },
});
