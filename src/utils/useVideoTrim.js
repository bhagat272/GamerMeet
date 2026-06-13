import { useState } from 'react';
import { NativeEventEmitter, NativeModules, Platform } from 'react-native';

let videoTrimModule = null;
let eventEmitter = null;

export const useVideoTrim = () => {
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState(null);
  const [isInitializing, setIsInitializing] = useState(false);

  const initializeVideoTrim = async () => {
    if (videoTrimModule !== null || isInitializing) {return;}

    setIsInitializing(true);

    try {
      // Lazy load the module only when needed
      const VideoTrim = await import('react-native-video-trim');
      videoTrimModule = VideoTrim;

      // Only setup event emitter on iOS
      if (Platform.OS === 'ios') {
        eventEmitter = new NativeEventEmitter(NativeModules.VideoTrim);
      }

      setIsReady(true);
      setError(null);
    } catch (err) {
      console.log('Video trim initialization failed:', err);
      setError(err);
      setIsReady(false);
    } finally {
      setIsInitializing(false);
    }
  };

  const showEditor = async (path, options) => {
    if (!videoTrimModule || error) {
      throw new Error('Video trim not available on this device');
    }

    if (!videoTrimModule.showEditor) {
      throw new Error('Video trim editor not available');
    }

    return videoTrimModule.showEditor(path, options);
  };

  const isValidFile = async path => {
    if (!videoTrimModule || error) {
      return true; // Assume valid if trim not available
    }

    if (!videoTrimModule.isValidFile) {
      return true;
    }

    return videoTrimModule.isValidFile(path);
  };

  const cleanFiles = async () => {
    if (!videoTrimModule || error) {return;}

    if (videoTrimModule.cleanFiles) {
      return videoTrimModule.cleanFiles();
    }
  };

  const listFiles = async () => {
    if (!videoTrimModule || error) {return [];}

    if (videoTrimModule.listFiles) {
      return videoTrimModule.listFiles();
    }
    return [];
  };

  return {
    isReady,
    error,
    isInitializing,
    initializeVideoTrim,
    showEditor,
    isValidFile,
    cleanFiles,
    listFiles,
    eventEmitter,
  };
};
