import React, {useEffect, useRef} from 'react';
import {Animated, Dimensions, ScrollView, StyleSheet, View} from 'react-native';
import {Colors} from '../theme';

const {width} = Dimensions.get('window');

type Props = {
  boxNumber?: number;
  baseWidth?: number;
  widthIncrement?: number;
};

const TabButtonShimmer = ({
  boxNumber = 3,
  baseWidth = 75,
  widthIncrement = 15,
}: Props) => {
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
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}>
      {[...Array(boxNumber)].map((_, index) => {
        const buttonWidth = baseWidth + index * widthIncrement;

        return (
          <View key={index} style={[styles.shimmerChip, {width: buttonWidth}]}>
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
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 10,
    paddingVertical: 8,
  },
  shimmerChip: {
    height: 38,
    borderRadius: 6,
    backgroundColor: Colors.primary.APP_THEME_2,
    overflow: 'hidden',
    position: 'relative',
  },
  shimmerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: '100%',
    width: 100, // narrow shimmer beam
    backgroundColor: 'rgba(255,255,255,0.5)',
    opacity: 0.3,
    borderRadius: 6,
  },
});

export default TabButtonShimmer;
