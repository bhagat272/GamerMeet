import React from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
} from 'react-native';
import moment from 'moment';
import Colors from '../../../theme/colors';
import fonts from '../../../theme/fonts';
import ImageLoadView from '../../../components/imageLoadView';
import {IMAGE_URL} from '../../../redux/apis/commonValue';
import imagePath from '../../../theme/imagePath';

interface ReceiveComponentProps {
  item: {
    id: string;
    user_id: string;
    message: string;
    message_type: string;
    timestamp: string;
    raw: {receiver_details: {avatar: string[]; username: string}};
    deleted_by?: any;
    thumbnail?: string;
  };
  cb: (type: 'image' | 'video' | 'audio') => void;
}
const buildMediaUrl = (path: string) => {
  if (!path) {
    return '';
  }
  // Avoid double slashes
  if (path?.startsWith('http')) {
    return path;
  }
  if (path?.startsWith('/')) {
    return `${IMAGE_URL}${path}`;
  }
  return `${IMAGE_URL}/${path}`;
};

const ReceiveComponent: React.FC<ReceiveComponentProps> = ({item, cb}) => {
  // if (item.deleted_by === global?.userData?.id) {
  //   return null;
  // }

  // const avatarUri = item.raw?.receiver_details?.avatar?.[0]
  //   ? `${IMAGE_URL}${item.raw.receiver_details.avatar[0]}`
  //   : undefined;
  if (item?.message == '' || item?.message == null) {
    return null;
  }
  return (
    <View style={styles.container}>
      <View style={styles.messageRow}>
        {/* {avatarUri ? (
          <ImageLoadView
            source={{uri: avatarUri}}
            style={styles.avatar}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarText}>
              {item.raw?.receiver_details?.username
                ?.substring(0, 1)
                ?.toUpperCase() || 'U'}
            </Text>
          </View>
        )} */}
        <View>
          <View style={styles.messageContainer}>
            {item.message_type === 'TEXT' && (
              <Text style={styles.textMessage}>{item.message}</Text>
            )}
            {item.message_type === 'image' && (
              <TouchableOpacity onPress={() => cb('image')}>
                <ImageLoadView
                  source={{uri: buildMediaUrl(item.message)}}
                  style={styles.mediaStyle}
                  resizeMode="cover"
                />
              </TouchableOpacity>
            )}
            {item.message_type === 'video' && (
              <View>
                <ImageLoadView
                  source={{uri: buildMediaUrl(item.thumbnail || '')}}
                  style={styles.mediaStyle}
                  resizeMode="cover"
                />
                <TouchableOpacity
                  onPress={() => cb('video')}
                  style={styles.playButton}>
                  <Image
                    source={imagePath.playbutton}
                    style={styles.playIcon}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
              </View>
            )}
            {item.message_type === 'audio' && (
              <View style={styles.audioContainer}>
                <Image
                  source={imagePath.sound_waves}
                  style={styles.audioIcon}
                  resizeMode="cover"
                />
                <TouchableOpacity
                  onPress={() => cb('audio')}
                  style={styles.audioPlayButton}>
                  <Image
                    source={imagePath.playbutton}
                    style={styles.audioPlayIcon}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
              </View>
            )}
            <Text style={styles.timestamp}>
              <Text style={styles.timestamp}>
                {moment
                  .utc(item.timestamp)
                  .local()
                  .fromNow()
                  .replace('a few seconds ago', 'few sec ago')
                  .replace('a minute ago', 'a min ago')
                  .replace(/(\d+) minutes? ago/, '$1 mins ago')}
              </Text>
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignSelf: 'flex-start',
    marginHorizontal: 16,
    marginVertical: 8,
  },
  messageRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
  },

  textMessage: {
    fontFamily: fonts.Poppins_Regular,
    fontSize: fonts.SIZE_14,
    color: Colors.primary.WHITE,
  },
  mediaStyle: {
    width: 160,
    height: 160,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    borderBottomLeftRadius: 16,
  },
  playButton: {
    position: 'absolute',
    alignSelf: 'center',
    top: '40%',
  },
  playIcon: {
    width: 32,
    height: 32,
    tintColor: Colors.primary.WHITE,
  },
  audioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  audioIcon: {
    width: 48,
    height: 48,
    tintColor: Colors.primary.BLACK,
  },
  audioPlayButton: {
    position: 'absolute',
    alignSelf: 'center',
    left: 14,
  },
  audioPlayIcon: {
    width: 20,
    height: 20,
    tintColor: Colors.primary.WHITE,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginLeft: 8,
  },
  avatarPlaceholder: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.primary.APP_THEME,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  avatarText: {
    fontFamily: fonts.Poppins_SemiBold,
    fontSize: fonts.SIZE_16,
    color: Colors.primary.WHITE,
  },
  messageContainer: {
    backgroundColor: Colors.primary.APP_THEME_2, // dark bluish
    padding: 12,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    borderBottomRightRadius: 16,
    borderBottomLeftRadius: 1,
    maxWidth: Dimensions.get('screen').width * 0.7,
  },
  timestamp: {
    fontFamily: fonts.Poppins_Regular,
    fontSize: fonts.SIZE_12,
    color: Colors.primary.GREY,
    marginTop: 4,
    textAlign: 'right',
  },
});

export default ReceiveComponent;
