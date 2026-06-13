import React, {useEffect, useRef} from 'react';
import {
  Animated,
  Dimensions,
  ScrollView,
  StyleSheet,
  View,
  PixelRatio,
} from 'react-native';
import {Colors} from '../theme';

const {width} = Dimensions.get('window');
const scale = width / 375;
const normalize = (size: number) =>
  Math.round(PixelRatio.roundToNearestPixel(size * scale));

const GAP = normalize(12);
export const CARD_WIDTH = (width - GAP * 5) / 2;

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

const SingleShimmerCard = () => (
  <View style={styles.cardContainer}>
    <ShimmerPlaceholder style={styles.imageShimmer} />
    <View style={styles.overlayContainer}>
      <View style={styles.topRow}>
        <ShimmerPlaceholder style={styles.percentageShimmer} />
      </View>

      <View style={styles.bottomContainer}>
        <View style={styles.actionsRow}>
          <ShimmerPlaceholder style={styles.actionButton} />
          <ShimmerPlaceholder style={styles.actionButton} />
        </View>
      </View>
    </View>
  </View>
);

const HomeShimmer = ({count = 1}: {count?: number}) => {
  const shimmerArray = Array.from({length: count});
  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      {shimmerArray.map((_, index) => (
        <SingleShimmerCard key={`shimmer-${index}`} />
      ))}
    </ScrollView>
  );
};

export default HomeShimmer;

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
    backgroundColor: 'rgba(255,255,255,0.5)',
    opacity: 0.3,
  },
  cardContainer: {
    width: CARD_WIDTH,
    height: normalize(214),
    margin: GAP,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: Colors.primary.APP_THEME_2,
  },
  imageShimmer: {
    height: '100%',
    width: '100%',
    borderRadius: 20,
    position: 'absolute',
    top: 0,
    left: 0,
  },
  overlayContainer: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 16,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  percentageShimmer: {
    width: 60,
    height: 20,
    borderRadius: 10,
  },
  shareIconShimmer: {
    width: 37,
    height: 37,
    borderRadius: 61,
  },
  bottomContainer: {
    marginTop: 'auto',
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  avatar: {
    height: 36,
    width: 36,
    borderRadius: 18,
  },
  nameAge: {
    flex: 1,
    height: 16,
    borderRadius: 8,
  },
  distance: {
    width: 60,
    height: 12,
    borderRadius: 6,
  },
  tagRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  tag: {
    height: 26,
    width: 80,
    borderRadius: 5,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: 10,
    paddingVertical: 8,
    borderRadius: 47,
    paddingHorizontal: 12,
    gap: 52,
  },
  actionButton: {
    height: 30,
    width: 30,
    borderRadius: 28,
  },
});
