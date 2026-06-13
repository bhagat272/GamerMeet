import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ImageSourcePropType,
  Dimensions,
  PixelRatio,
} from 'react-native';
import imagePath from '../theme/imagePath';
import fonts from '../theme/fonts';
import {Colors} from '../theme';
import ImageLoadView from './imageLoadView';
import {showToastMessage} from '../utils/toast';

const {width: SCREEN_WIDTH} = Dimensions.get('window');
const scale = SCREEN_WIDTH / 375;
const normalize = (size: number) =>
  Math.round(PixelRatio.roundToNearestPixel(size * scale));

type CardType = 'match' | 'interest' | 'swipe';

interface ProfileCardProps {
  name: string;
  age: number;
  percentage: number;
  profileImage: ImageSourcePropType;
  cardType: CardType;
  onMessagePress?: () => void;
  onUnmatchPress?: () => void;
  onCardPress?: () => void;
  onWithdrawPress?: () => void;
  onLikePress?: () => void;
  onDislikePress?: () => void;
  disableActions?: boolean;
}

const ProfileCard: React.FC<ProfileCardProps> = ({
  name,
  age,
  percentage,
  profileImage,
  cardType,
  onMessagePress,
  onUnmatchPress,
  onWithdrawPress,
  onLikePress,
  onDislikePress,
  onCardPress,
  disableActions = false,
}) => {
  const showMessage = () => {
    showToastMessage(
      'You must unhide your profile to perform this action.',
      'warning',
    );
  };
  return (
    <TouchableOpacity style={styles.container} onPress={onCardPress}>
      <ImageLoadView source={profileImage} style={styles.image} />
      <View style={styles.infoContainer}>
        <Text style={styles.name}>{`${name} | ${age}`}</Text>
        <View style={styles.percentageContainer}>
          <Image source={imagePath.verfied_icon} style={styles.verifiedIcon} />
          <Text style={styles.percentage}>{percentage}%</Text>
        </View>
        <View style={styles.actionContainer}>
          {cardType === 'match' && (
            <>
              <TouchableOpacity
                style={[
                  styles.messageBtn,
                  disableActions && styles.disableddisLikeActionRow,
                ]}
                onPress={disableActions ? showMessage : onMessagePress}>
                <Image
                  source={imagePath.message_icon}
                  style={styles.messageIcon}
                />
                <Text style={styles.messageText}> Message</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.unmatchBtn}
                onPress={disableActions ? showMessage : onUnmatchPress}>
                <Image
                  source={imagePath.pin_icon}
                  style={[
                    styles.unmatchIcon,
                    disableActions && styles.disableddisLikeActionRow,
                  ]}
                />
                <Text
                  style={[
                    styles.unmatchText,
                    disableActions && styles.disableddisLikeActionRow,
                  ]}>
                  {' '}
                  Unmatch
                </Text>
              </TouchableOpacity>
            </>
          )}
          {cardType === 'interest' && (
            <TouchableOpacity
              style={[
                styles.withdrawBtn,
                disableActions && styles.disableddisLikeActionRow,
              ]}
              onPress={disableActions ? showMessage : onWithdrawPress}>
              <Image source={imagePath.pin_icon} style={styles.unmatchIcon} />
              <Text style={styles.unmatchText}> Withdraw Interest</Text>
            </TouchableOpacity>
          )}
        </View>
        {cardType === 'swipe' && (
          <View style={styles.likeDislikeContainer}>
            <TouchableOpacity
              style={[
                styles.dislikeBtn,
                disableActions && styles.disableddisLikeActionRow,
              ]}
              onPress={disableActions ? showMessage : onDislikePress}>
              <Image source={imagePath.cross_icon} style={styles.icon} />
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.likeBtn,
                disableActions && styles.disableddisLikeActionRow,
              ]}
              onPress={disableActions ? showMessage : onLikePress}>
              <Image source={imagePath.like_icon} style={styles.icon} />
            </TouchableOpacity>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default ProfileCard;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderRadius: normalize(12),
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#31417d',
    paddingVertical: normalize(12),
    paddingHorizontal: normalize(12),
    marginBottom: normalize(12),
  },
  image: {
    width: normalize(94),
    height: normalize(97),
    borderRadius: normalize(10),
    resizeMode: 'cover',
  },
  infoContainer: {
    flex: 1,
    marginLeft: normalize(12),
  },
  name: {
    fontSize: normalize(fonts.SIZE_18),
    fontFamily: fonts.Poppins_Medium,
    color: Colors.primary.WHITE,
    textTransform: 'capitalize',
  },
  percentageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: normalize(4),
  },
  verifiedIcon: {
    width: normalize(17),
    height: normalize(17),
    marginRight: normalize(4),
  },
  percentage: {
    color: Colors.primary.WHITE,
    fontSize: normalize(14),
  },
  actionContainer: {
    flexDirection: 'row',
    marginTop: normalize(10),
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: normalize(8),
  },

  messageText: {
    fontSize: normalize(fonts.SIZE_12),
    fontFamily: fonts.Poppins_Medium,
    color: Colors.primary.WHITE,
    flexShrink: 1,
    textAlign: 'center',
  },
  unmatchText: {
    fontSize: normalize(fonts.SIZE_12),
    fontFamily: fonts.Poppins_Medium,
    color: Colors.primary.WHITE,
    flexShrink: 1,
    textAlign: 'center',
  },

  messageIcon: {
    width: normalize(15),
    height: normalize(12.38),
    alignSelf: 'center',
  },
  messageBtn: {
    flex: 1,
    minWidth: normalize(80),
    flexDirection: 'row',
    backgroundColor: '#B75CFF',
    paddingVertical: normalize(6),
    paddingHorizontal: normalize(10),
    borderRadius: normalize(6),
    justifyContent: 'center',
    alignItems: 'center',
  },
  unmatchBtn: {
    flex: 1,
    minWidth: normalize(80),
    backgroundColor: '#313864',
    paddingVertical: normalize(6),
    paddingHorizontal: normalize(10),
    borderRadius: normalize(6),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  withdrawBtn: {
    backgroundColor: '#313864',
    paddingVertical: normalize(6),
    paddingHorizontal: normalize(14),
    borderRadius: normalize(6),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  unmatchIcon: {
    width: normalize(15.75),
    height: normalize(13.5),
  },
  dislikeBtn: {
    backgroundColor: '#222C58',
    width: normalize(44),
    height: normalize(44),
    borderRadius: normalize(22),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: normalize(12),
  },
  likeBtn: {
    width: normalize(44),
    height: normalize(44),
    borderRadius: normalize(53),
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: Colors.secondary.RED,
  },
  icon: {
    width: normalize(42.56),
    height: normalize(42.56),
  },
  likeDislikeContainer: {
    flex: 1,
    flexDirection: 'row',
    alignSelf: 'flex-start',
  },
  disableddisLikeActionRow: {
    opacity: 0.4,
  },
});
