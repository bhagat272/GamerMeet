import React, {useEffect, useRef} from 'react';
import {
  Animated,
  Dimensions,
  PixelRatio,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import {Colors} from '../theme';

const {width} = Dimensions.get('window');
const scale = width / 375;
const normalize = (size: number) =>
  Math.round(PixelRatio.roundToNearestPixel(size * scale));

const ShimmerPlaceholder = ({style}: {style: any}) => {
  const shimmerValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(shimmerValue, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      }),
    ).start();
  }, [shimmerValue]);

  const translateX = shimmerValue.interpolate({
    inputRange: [0, 1],
    outputRange: [-width, width],
  });

  return (
    <View style={[style, styles.shimmerBackground]}>
      <Animated.View
        style={[
          styles.shimmerOverlay,
          {
            transform: [{translateX}],
          },
        ]}
      />
    </View>
  );
};

interface BrowseProfileShimmerProps {
  showActionButtons?: boolean;
}

const BrowseProfileShimmer = ({
  showActionButtons = true,
}: BrowseProfileShimmerProps) => (
  <View style={styles.card}>
    {/* Top Row */}
    <View style={styles.cardTop}>
      {/* Avatar */}
      <View style={styles.avatarContainer}>
        <ShimmerPlaceholder style={styles.avatar} />
      </View>

      {/* Info */}
      <View style={styles.infoContainer}>
        {/* Name */}
        <ShimmerPlaceholder style={styles.name} />

        {/* Info Row */}
        <View style={styles.infoRow}>
          <ShimmerPlaceholder style={styles.iconPlaceholder} />
          <ShimmerPlaceholder style={styles.infoTextPlaceholder} />
          <ShimmerPlaceholder style={styles.iconPlaceholder} />
          <ShimmerPlaceholder style={styles.infoTextPlaceholder} />
        </View>

        {/* Actions / Tags */}
        {showActionButtons ? (
          <View style={styles.actionRow}>
            <ShimmerPlaceholder style={styles.actionCircle} />
            <ShimmerPlaceholder style={styles.actionCircle} />
          </View>
        ) : (
          <View style={styles.tagsRow}>
            <ShimmerPlaceholder style={styles.tag} />
            <ShimmerPlaceholder style={styles.tag} />
          </View>
        )}
      </View>
    </View>

    {/* Tags */}
    {showActionButtons && (
      <View style={styles.tagsRow}>
        <ShimmerPlaceholder style={styles.tag} />
        <ShimmerPlaceholder style={styles.tag} />
      </View>
    )}
  </View>
);

interface ShimmerProps {
  count?: number;
  showActionButtons?: boolean;
}

/**
 * Profile Shimmer List
 */
const ProfileShimmer: React.FC<ShimmerProps> = ({
  count = 1,
  showActionButtons = true,
}) => {
  const shimmerArray = Array.from({length: count});

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      {shimmerArray.map((_, index) => (
        <BrowseProfileShimmer
          key={`shimmer-${index}`}
          showActionButtons={showActionButtons}
        />
      ))}
    </ScrollView>
  );
};

export default ProfileShimmer;

/**
 * Styles
 */
const styles = StyleSheet.create({
  shimmerBackground: {
    backgroundColor: Colors.primary.APP_THEME_2,
    overflow: 'hidden',
  },
  shimmerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: '100%',
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.6)',
    opacity: 0.4,
  },
  card: {
    borderRadius: normalize(20),
    padding: normalize(12),
    marginBottom: normalize(20),
    backgroundColor: Colors.primary.APP_THEME_2,
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: normalize(100),
    height: normalize(100),
    borderRadius: normalize(8),
  },
  infoContainer: {
    marginLeft: normalize(12),
    justifyContent: 'center',
    flex: 1,
  },
  name: {
    width: normalize(120),
    height: normalize(20),
    borderRadius: normalize(4),
    marginBottom: normalize(6),
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: normalize(6),
  },
  iconPlaceholder: {
    width: normalize(14),
    height: normalize(16),
    marginRight: normalize(4),
    borderRadius: 3,
  },
  infoTextPlaceholder: {
    width: normalize(40),
    height: normalize(16),
    borderRadius: normalize(4),
    marginRight: normalize(10),
  },
  actionRow: {
    flexDirection: 'row',
    marginTop: normalize(10),
    gap: normalize(20),
  },
  actionCircle: {
    width: normalize(40),
    height: normalize(40),
    borderRadius: normalize(22.5),
  },
  tagsRow: {
    flexDirection: 'row',
    gap: normalize(10),
    marginTop: normalize(12),
  },
  tag: {
    width: normalize(100),
    height: normalize(30),
    borderRadius: normalize(4),
  },
});
