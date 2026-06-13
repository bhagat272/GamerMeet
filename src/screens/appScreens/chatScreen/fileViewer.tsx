import React, {useState, useEffect} from 'react';
import {
  Modal,
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Platform,
  StatusBar,
} from 'react-native';
import Video from 'react-native-video';
import Sound from 'react-native-sound';
import {IMAGE_URL} from '../../../redux/apis/commonValue';
import {ImageLoadView} from '../../../components';
import imagePath from '../../../theme/imagePath';
import {Colors} from '../../../theme';
import {ReactNativeZoomableView} from '@openspacelabs/react-native-zoomable-view';

interface FileData {
  message: string;
}

interface FileViewerProps {
  visible: boolean;
  fileData: FileData;
  fileType: 'video' | 'image' | 'audio';
  onClose: () => void;
}

const FileViewer: React.FC<FileViewerProps> = ({
  visible,
  fileData,
  fileType,
  onClose,
}) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [sound, setSound] = useState<Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  // For video loading
  const handleMediaLoad = () => {
    setLoading(false);
  };

  // Initialize Sound when fileType is 'audio'
  // Initialize Sound when fileType is 'audio'
  useEffect(() => {
    if (fileType === 'audio') {
      const audioUrl = buildMediaUrl(fileData.message);
      console.log('Loading audio from:', audioUrl);

      const audio = new Sound(audioUrl, '', error => {
        if (error) {
          console.log('Failed to load audio', error);
          setLoading(false);
          return;
        }
        console.log('Audio loaded successfully');
        setLoading(false);
      });
      setSound(audio);

      return () => {
        audio.release();
        setSound(null);
      };
    }
  }, [fileType, fileData]);

  const togglePlayPause = () => {
    if (sound) {
      if (isPlaying) {
        sound.pause();
        setIsPlaying(false);
      } else {
        sound.play(success => {
          if (!success) {
            console.log('Audio playback failed');
          }
          setIsPlaying(false);
        });
        setIsPlaying(true);
      }
    }
  };
  const buildMediaUrl = (path: string) => {
    if (!path) {
      return '';
    }
    // Avoid double slashes
    if (path.startsWith('http')) {
      return path;
    }
    if (path.startsWith('/')) {
      return `${IMAGE_URL}${path}`;
    }
    return `${IMAGE_URL}/${path}`;
  };
  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={false}
      onRequestClose={onClose}>
      <View style={styles.container}>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Image
            source={imagePath.cancel}
            resizeMode="contain"
            style={styles.cancel_style}
          />
        </TouchableOpacity>

        {fileType === 'video' && (
          <View style={styles.mediaContainer}>
            <Video
              source={{uri: buildMediaUrl(fileData.message)}} // ✅ use helper
              style={styles.media}
              controls
              resizeMode="contain"
              onLoad={handleMediaLoad}
            />
            {loading && (
              <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color={Colors.primary.WHITE} />
              </View>
            )}
          </View>
        )}
        {fileType === 'image' && (
          <View style={styles.zoom}>
            <ReactNativeZoomableView
              style={styles.flex_one}
              maxZoom={6}
              minZoom={1}
              zoomStep={1}
              initialZoom={1}
              bindToBorders={true}
              contentWidth={300}
              contentHeight={300}>
              <ImageLoadView
                source={{uri: buildMediaUrl(fileData.message)}}
                style={styles.image_load}
                resizeMode="contain"
              />
            </ReactNativeZoomableView>
          </View>
        )}

        {fileType === 'audio' && (
          <View style={styles.audioContainer}>
            {loading ? (
              <ActivityIndicator size="large" color={Colors.primary.WHITE} />
            ) : (
              <View style={styles.playButton}>
                <TouchableOpacity onPress={togglePlayPause}>
                  <Image
                    source={
                      isPlaying ? imagePath.pause_button : imagePath.playbutton
                    }
                    resizeMode="contain"
                    style={styles.img_play}
                  />
                </TouchableOpacity>
                <Image
                  source={imagePath.sound_waves}
                  style={styles.img_wave}
                  resizeMode="contain"
                />
              </View>
            )}
          </View>
        )}
      </View>
    </Modal>
  );
};

export default FileViewer;
const topMargin =
  Platform.OS === 'android' ? StatusBar.currentHeight || 40 : 10;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mediaContainer: {
    width: '100%',
    height: '100%',
  },
  media: {
    width: '100%',
    height: '100%',
  },
  audioContainer: {
    width: '100%',
    height: 300, // Fixed height for audio controls
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  playButton: {
    paddingHorizontal: 10,
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  playButtonText: {
    color: 'black',
    fontSize: 16,
  },
  closeButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? topMargin + 42 : topMargin - 37,
    right: 5,

    zIndex: 1,
    borderRadius: 20,
    padding: 10,
  },
  loaderContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  img_play: {
    height: 35,
    width: 35,
    tintColor: Colors.primary.WHITE,
  },
  img_wave: {
    height: 150,
    width: 150,
    marginHorizontal: 20,
    tintColor: Colors.primary.WHITE,
  },
  cancel_style: {
    height: 30,
    width: 30,
    tintColor: Colors.primary.WHITE,
  },
  zoom: {
    flex: 1,
    width: '100%',
    backgroundColor: Colors.primary.BLACK,
  },
  image_load: {
    width: '100%',
    height: '100%',
  },
  flex_one: {
    flex: 1,
  },
});
