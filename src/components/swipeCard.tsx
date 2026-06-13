import React, {useRef, useState} from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  PixelRatio,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewToken,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {IMAGE_URL} from '../redux/apis/commonValue';
import {Colors, Fonts} from '../theme';
import fonts from '../theme/fonts';
import imagePath from '../theme/imagePath';
import ImageLoadView from './imageLoadView';
import {showToastMessage} from '../utils/toast';

const {width} = Dimensions.get('window');

const scale = width / 375;
const normalize = (size: number) =>
  Math.round(PixelRatio.roundToNearestPixel(size * scale));
const GAP = normalize(12);
export const CARD_WIDTH = (width - GAP * 5) / 2;

interface SwipeCardProps {
  profileImages?: any[]; // Now accepts multiple images
  avatarImage: any[];
  name: string;
  age: number;
  distance: string;
  percentage: number;
  tags: TagsValue[];
  onLikePress: () => void;
  onDislikePress: () => void;
  onExpandPress?: () => void;
  disableActions?: boolean;
  isGrid?: boolean;
}
interface TagsValue {
  name: string;
}

const SwipeCard: React.FC<SwipeCardProps> = ({
  profileImages,
  avatarImage,
  name,
  age,
  distance,
  percentage,
  tags,
  onLikePress,
  onDislikePress,
  onExpandPress,
  isGrid = false,
  disableActions = false,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const viewabilityConfig = useRef({viewAreaCoveragePercentThreshold: 50});
  const flatListRef = useRef<FlatList>(null);

  const onViewableItemsChanged = useRef(
    ({viewableItems}: {viewableItems: ViewToken[]}) => {
      if (viewableItems.length > 0) {
        setCurrentIndex(viewableItems[0].index || 0);
      }
    },
  ).current;

  const showMessage = () => {
    showToastMessage(
      'You must unhide your profile to perform this action.',
      'warning',
    );
  };

  return (
    <TouchableOpacity onPress={onExpandPress} style={styles.cardWrapper}>
      <FlatList
        data={profileImages && profileImages.length > 0 ? profileImages : [{}]}
        ref={flatListRef}
        keyExtractor={(item, index) => index.toString()}
        horizontal={!isGrid}
        scrollEnabled={!isGrid}
        pagingEnabled={!isGrid}
        // style={isGrid && {height: 100, width: 100}}
        // contentContainerStyle={isGrid && {height: 100, width: 100}}
        // snapToInterval={width}
        snapToInterval={isGrid ? CARD_WIDTH : width}
        snapToAlignment="center"
        scrollEventThrottle={5}
        decelerationRate={0.9} // or try "normal"
        showsHorizontalScrollIndicator={false}
        renderItem={({item}) => (
          <View
            style={isGrid ? styles.gridImageWrapper : styles.swipeImageWrapper}>
            <ImageLoadView
              source={
                item?.avatar_url?.length > 0
                  ? {uri: IMAGE_URL + item?.avatar_url}
                  : imagePath.user_new_icon
              }
              style={styles.imageBackground}
              loaderSize="large"
              resizeMode="cover"
            />
          </View>
        )}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig.current}
      />
      <LinearGradient
        colors={['rgba(0,0,0,0.8)', 'rgba(0,0,0,0.2)', 'transparent']}
        start={{x: 0, y: 0}}
        end={{x: 0, y: 1}}
        style={styles.topGradient}
      />

      {/* Top badge */}
      {/* <View style={styles.topBadgeRow}>
        {profileImages?.map((_, index) => (
          <View
            key={index}
            style={[
              styles.badgeDot,
              currentIndex === index && styles.activeBadgeDot,
            ]}
          />
        ))}
      </View> */}

      <View style={styles.topRow}>
        <View style={styles.verifiedRow}>
          <Image source={imagePath.verfied_icon} style={styles.verifiedIcon} />
          <Text style={styles.percentageText}>{percentage}%</Text>
        </View>
        {/* <TouchableOpacity onPress={onExpandPress} style={styles.expandBtn}>
          <Image source={imagePath.expand_icon} style={styles.expandIcon} />
        </TouchableOpacity> */}
      </View>

      {/* Bottom content */}
      <View style={styles.bottomOverlay}>
        <View style={styles.bottomCard}>
          {/* <View style={styles.nameRow}>
            <ImageLoadView
              source={
                avatarImage?.length
                  ? {uri: IMAGE_URL + avatarImage[0]?.avatar_url}
                  : imagePath.user_icon
              }
              style={styles.avatar}
              loaderType="fold"
              foldLoaderSize={50}
            />
            <Text style={styles.name}>{`${
              name?.length > 10 ? name.substring(0, 10) + '..' : name
            } | ${age}`}</Text>
            <Text style={styles.distance}>{distance}</Text>
          </View> */}

          {/* <View style={styles.tagRow}>
            {tags?.slice(0, 3).map((tag: TagsValue, index: number) => (
              <Text
                key={index}
                style={styles.tag}
                numberOfLines={1}
                ellipsizeMode="tail">
                {tag?.name.length > 15
                  ? tag.name.substring(0, 15) + '...'
                  : tag.name}
              </Text>
            ))}

            {tags?.length > 2 && (
              <Text style={styles.tag}>+{tags.length - 3} more</Text>
            )}
          </View> */}
          <Text style={styles.name}>{`${
            name?.length > 10 ? name.substring(0, 10) + '..' : name
          } , ${age}`}</Text>
          <View
            style={[
              styles.actionRow,
              disableActions && styles.disabledActionRow,
            ]}>
            <TouchableOpacity
              style={styles.iconCircle}
              onPress={disableActions ? showMessage : onDislikePress}>
              <Image source={imagePath.dislike_icon} style={styles.icon} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.iconCircle}
              onPress={disableActions ? showMessage : onLikePress}>
              <Image source={imagePath.like_icon} style={styles.icon} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardWrapper: {
    // width: '100%',
    width: CARD_WIDTH,
    marginBottom: GAP,
    height: normalize(214),
    borderRadius: normalize(20),
    overflow: 'hidden',
    // marginBottom: normalize(20),
    borderWidth: normalize(2),
    backgroundColor: Colors.primary.APP_THEME_2,
    borderColor: Colors.secondary.CARD_BORDER_COLOR,
    shadowColor: Colors.primary.APP_THEME,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.4,
    shadowRadius: normalize(33),
    elevation: 20,
  },
  // imageBackground: {
  //   width,
  //   height: normalize(600),
  //   resizeMode: 'cover',
  // },
  imageBackground: {
    height: normalize(214),
  },

  topBadgeRow: {
    position: 'absolute',
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 2,
    marginTop: normalize(12),
  },
  topRow: {
    position: 'absolute',
    top: normalize(20),
    left: normalize(16),
    right: normalize(16),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 2,
  },
  verifiedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: normalize(4),
    borderRadius: normalize(10),
  },
  verifiedIcon: {
    width: normalize(24),
    height: normalize(24),
    marginRight: normalize(6),
  },
  percentageText: {
    color: Colors.primary.WHITE,
    fontSize: normalize(16),
    fontFamily: fonts.Poppins_Medium,
  },
  badgeDot: {
    width: normalize(39.46),
    height: normalize(3.51),
    backgroundColor: Colors.secondary.HEADER_BOTTOM_COLOR,
    marginRight: normalize(6),
    borderRadius: normalize(5),
  },
  activeBadgeDot: {
    backgroundColor: Colors.primary.APP_THEME,
  },
  expandBtn: {
    backgroundColor: '#25275799',
    padding: normalize(10),
    borderRadius: normalize(20),
  },
  expandIcon: {
    width: normalize(20),
    height: normalize(20),
    tintColor: Colors.primary.WHITE,
  },
  bottomOverlay: {
    position: 'absolute',
    bottom: 0,
    width: '98%',
    borderRadius: normalize(20),
    alignSelf: 'center',
    marginBottom: normalize(3),
  },
  bottomCard: {
    padding: normalize(13),
    borderRadius: normalize(20),
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: normalize(10),
  },
  avatar: {
    width: normalize(40),
    height: normalize(40),
    borderRadius: normalize(20),
    marginRight: normalize(10),
  },
  name: {
    flex: 1,
    fontSize: normalize(16),
    color: Colors.primary.WHITE,
    fontFamily: Fonts.Poppins_Regular,
    marginHorizontal: normalize(8),
  },
  distance: {
    fontSize: normalize(14),
    color: Colors.primary.WHITE,
    fontFamily: Fonts.Poppins_Regular,
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: normalize(15),
    gap: normalize(8),
    maxWidth: '100%',
  },
  tag: {
    color: Colors.primary.WHITE,
    paddingHorizontal: normalize(12),
    paddingVertical: normalize(6),
    borderRadius: normalize(4),
    fontSize: normalize(13),
    backgroundColor: Colors.secondary.TAG_BG,
    maxWidth: normalize(100),
    overflow: 'hidden',
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: normalize(10),
    backgroundColor: '#252757',
    paddingVertical: normalize(4),
    borderRadius: normalize(47),
    paddingHorizontal: normalize(12),
    gap: normalize(22),
  },
  iconCircle: {
    borderRadius: normalize(30),
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    maxHeight: normalize(32.56),
    maxWidth: normalize(32.56),
    resizeMode: 'contain',
  },
  topGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: normalize(100),
    zIndex: 1,
  },
  disabledActionRow: {
    backgroundColor: '#555',
    opacity: 0.6,
  },
  gridRow: {
    justifyContent: 'space-between',
    paddingHorizontal: GAP,
  },
  gridImageWrapper: {
    width: CARD_WIDTH,
    height: normalize(214),
  },
  swipeImageWrapper: {
    width: CARD_WIDTH,
    height: '100%',
  },
});
export default SwipeCard;
