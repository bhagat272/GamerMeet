import React, {
  useState,
  forwardRef,
  useImperativeHandle,
  useEffect,
} from 'react';
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import {AppConstant} from '../../../constants/appconstant';
import {Colors, ImagePath} from '../../../theme';
import imagePath from '../../../theme/imagePath';

const audioRecorderPlayer = new AudioRecorderPlayer();

type AudioRecorderComponentProps = {
  onClose: (
    result: {filePath: string; duration: string; durationMs: number} | false,
  ) => void;
  visible?: boolean;
};

export interface AudioRecorderRef {
  stopIfRecording: () => void;
}

const AudioRecorderComponent = forwardRef<
  AudioRecorderRef,
  AudioRecorderComponentProps
>(({onClose, visible = true}, ref) => {
  const [recording, setRecording] = useState(false);
  const [recordSecs, setRecordSecs] = useState(0);
  const [recordTime, setRecordTime] = useState('00:00');
  const [recordListener, setRecordListener] = useState<any>(null);

  console.log('recordTime------->', recordTime);

  // Clean up when component becomes invisible
  useEffect(() => {
    if (!visible && recording) {
      cleanupRecording();
    }
  }, [visible, recording]);

  const startRecording = async () => {
    try {
      const result = await audioRecorderPlayer.startRecorder();
      console.log('startRecording---', {result});
      setRecording(true);

      const listener = audioRecorderPlayer.addRecordBackListener(e => {
        const position = e.currentPosition;
        setRecordSecs(position);
        const mins = Math.floor(position / 60000);
        const secs = Math.floor((position % 60000) / 1000);
        const formattedTime = `${mins < 10 ? '0' + mins : mins}:${
          secs < 10 ? '0' + secs : secs
        }`;
        setRecordTime(formattedTime);

        // Stop recording after 30 seconds (30000 ms)
        if (position >= 30000) {
          handleAutoStop();
        }
      });

      setRecordListener(listener);
    } catch (error) {
      console.log('Error starting recording:', error);
    }
  };

  const handleAutoStop = () => {
    if (recordListener) {
      audioRecorderPlayer.removeRecordBackListener(recordListener);
      setRecordListener(null);
    }

    Alert.alert(
      AppConstant.appName,
      'Recording limit reached (30 second max). Do you want to Send it?',
      [
        {
          text: 'Discard',
          onPress: () => {
            deleteRecording();
          },
          style: 'cancel',
        },
        {text: 'Send', onPress: () => stopRecording()},
      ],
      {cancelable: false},
    );
  };

  const stopRecording = async () => {
    try {
      if (recordListener) {
        audioRecorderPlayer.removeRecordBackListener(recordListener);
        setRecordListener(null);
      }

      const result = await audioRecorderPlayer.stopRecorder();

      onClose({
        filePath: result,
        duration: recordTime,
        durationMs: recordSecs,
      });

      resetState();
    } catch (error) {
      console.log('Error stopping recording:', error);
      resetState();
    }
  };

  const deleteRecording = async () => {
    try {
      if (recordListener) {
        audioRecorderPlayer.removeRecordBackListener(recordListener);
        setRecordListener(null);
      }

      await audioRecorderPlayer.stopRecorder();
      onClose(false);
      resetState();
    } catch (error) {
      console.log('Error deleting recording:', error);
      resetState();
    }
  };

  const resetState = () => {
    setRecording(false);
    setRecordSecs(0);
    setRecordTime('00:00');
    setRecordListener(null);
  };

  const cleanupRecording = async () => {
    try {
      if (recordListener) {
        audioRecorderPlayer.removeRecordBackListener(recordListener);
        setRecordListener(null);
      }

      if (recording) {
        await audioRecorderPlayer.stopRecorder();
      }
    } catch (e) {
      console.log('Error in cleanup:', e);
    }
    resetState();
  };

  useImperativeHandle(ref, () => ({
    stopIfRecording: cleanupRecording,
  }));

  useEffect(() => {
    return () => {
      cleanupRecording();
    };
  }, []);

  return (
    <View style={styles.container}>
      {recording && (
        <View style={styles.recordingIndicator}>
          <Text style={styles.recordingText}>Recording... {recordTime}</Text>
        </View>
      )}

      <TouchableOpacity
        style={[styles.recordButton, recording ? styles.stop : styles.start]}
        onPress={recording ? stopRecording : startRecording}>
        {recording ? (
          <Image source={imagePath.pause_icon} />
        ) : (
          <Image source={imagePath.play_icon} />
        )}
      </TouchableOpacity>

      <TouchableOpacity
        activeOpacity={0.7}
        onPress={deleteRecording}
        style={styles.deleteButton}>
        <Image
          source={ImagePath.cross_icon}
          resizeMode="contain"
          style={styles.cancel_icon}
        />
      </TouchableOpacity>
    </View>
  );
});

export default AudioRecorderComponent;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingTop: 15,
    backgroundColor: Colors.primary.APP_THEME_2,
    paddingBottom: 20,
  },
  recordButton: {
    backgroundColor: Colors.primary.APP_THEME,
    padding: 18,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
  },
  start: {
    backgroundColor: Colors.primary.APP_THEME,
  },
  stop: {
    backgroundColor: Colors.primary.RED,
  },
  recordingIndicator: {
    marginBottom: 16,
    alignItems: 'center',
  },
  recordingText: {
    color: Colors.primary.RED,
    fontWeight: 'bold',
    marginTop: 4,
  },
  pulseCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.primary.RED,
  },
  deleteButton: {
    position: 'absolute',
    top: 5,
    right: 5,
  },
  cancel_icon: {
    height: 30,
    width: 25,
    marginEnd: 5,
  },
});
