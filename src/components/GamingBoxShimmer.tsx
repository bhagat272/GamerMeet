import React, {useEffect, useRef} from 'react';
import {View, StyleSheet, Animated, Dimensions} from 'react-native';
import {Colors} from '../theme';

type Props = {
  boxNumber?: number;
};

const {width} = Dimensions.get('window');

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
        style={[styles.shimmerOverlay, {transform: [{translateX}]}]}
      />
    </View>
  );
};

const GamingBoxShimmer = ({boxNumber = 3}: Props) => {
  return (
    <View style={styles.container}>
      {Array.from({length: boxNumber}).map((_, index) => (
        <ShimmerPlaceholder key={index} style={styles.shimmerChip} />
      ))}
    </View>
  );
};

export default GamingBoxShimmer;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    paddingVertical: 8,
  },
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
  shimmerChip: {
    width: 75,
    height: 38,
    borderRadius: 6,
  },
});
