import React, {FC, useRef} from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import {Swipeable} from 'react-native-gesture-handler';
import {Colors} from '../theme';
import fonts from '../theme/fonts';
import imagePath from '../theme/imagePath';
import ImageLoadView from './imageLoadView';

interface Props {
  id: string;
  name: string;
  message: string;
  time: string;
  avatar: any;
  onPress?: () => void;
  onDeletePress?: (closeSwipe?: () => void) => void;
  // onDeletePress?: () => void;
  containerStyle?: ViewStyle;
  unreadCount?: number;
  isOnline?: boolean;
}

const MessageCard: FC<Props> = ({
  id,
  name,
  message,
  time,
  avatar,
  onPress,
  onDeletePress,
  containerStyle = {},
  unreadCount = 1,
  isOnline = false,
}) => {
  const swipeableRef: any = useRef(null);

  const renderRightActions = () => (
    <TouchableOpacity
      onPress={() => onDeletePress?.(() => swipeableRef.current?.close())}
      style={styles.archiveWrapper}>
      <Image source={imagePath.delete_icon2} style={styles.archiveIcon} />
    </TouchableOpacity>
  );

  return (
    <View style={[styles.cardWrapper, containerStyle]}>
      <Swipeable
        ref={swipeableRef}
        renderRightActions={renderRightActions}
        overshootRight={false}>
        <TouchableOpacity onPress={onPress} style={styles.container}>
          {/* Avatar with online dot */}
          <View style={styles.avatarWrapper}>
            <ImageLoadView source={avatar} style={styles.avatar} />
            {isOnline && <View style={styles.onlineDot} />}
          </View>

          {/* Message Content */}
          <View style={styles.textContainer}>
            <Text numberOfLines={1} style={styles.name}>
              {name}
            </Text>
            <Text numberOfLines={1} style={styles.message}>
              {message}
            </Text>
          </View>

          {/* Time + Unread Badge */}
          <View style={styles.rightSection}>
            <Text style={styles.time}>{time}</Text>
            {unreadCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{unreadCount}</Text>
              </View>
            )}
          </View>
        </TouchableOpacity>
      </Swipeable>
    </View>
  );
};

export default MessageCard;

const styles = StyleSheet.create({
  cardWrapper: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 20,
    backgroundColor: 'transparent',
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.primary.GREY,
  },
  avatarWrapper: {
    position: 'relative',
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
  },
  onlineDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.secondary.GREEN,
    position: 'absolute',
    bottom: 2,
    right: 2,
  },
  textContainer: {
    flex: 1,
    marginLeft: 12,
  },
  name: {
    fontSize: fonts.SIZE_16,
    fontFamily: fonts.Poppins_SemiBold,
    color: Colors.primary.WHITE,
  },
  message: {
    fontSize: fonts.SIZE_13,
    fontFamily: fonts.Poppins_Medium,
    color: Colors.primary.WHITE,
    marginTop: 8,
  },
  rightSection: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  time: {
    fontSize: fonts.SIZE_12,
    color: Colors.primary.WHITE,
    fontFamily: fonts.Poppins_Medium,
    marginBottom: 4,
  },
  badge: {
    backgroundColor: Colors.primary.RED,
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    alignSelf: 'flex-end',
    top: 3,
  },
  badgeText: {
    color: Colors.primary.WHITE,
    fontSize: fonts.SIZE_10,
    fontFamily: fonts.Poppins_SemiBold,
  },
  archiveWrapper: {
    backgroundColor: Colors.primary.RED,
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    height: '100%',
  },
  archiveIcon: {
    width: 28,
    height: 28,
  },
});
