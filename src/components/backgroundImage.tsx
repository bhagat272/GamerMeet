import React, {useMemo} from 'react';
import {
  Image,
  ImageSourcePropType,
  Platform,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import {Edge} from 'react-native-safe-area-context';
import imagePath from '../theme/imagePath';

type BackgroundImageProps = {
  children: React.ReactNode;
  style_gradient?: object;
  backgroundStyle?: object;
  backgroundImage?: ImageSourcePropType; // New prop
};
const BackgroundImage = ({
  children,
  style_gradient,
  backgroundStyle,
  backgroundImage,
}: BackgroundImageProps) => {
  const usePlatformEdges = (): Edge[] => {
    return useMemo(
      () =>
        Platform.OS === 'android'
          ? ['bottom', 'left', 'right']
          : ['left', 'right'],
      [],
    );
  };
  const edges = usePlatformEdges();

  return (
    <View style={{flex: 1}}>
      <StatusBar
        translucent
        backgroundColor="rgba(0, 0, 0, 0)"
        barStyle="light-content"
      />
      <Image
        style={styles.image}
        source={backgroundImage || imagePath.background}
      />
      <View style={[styles.content, backgroundStyle]}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  image: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
});

export default BackgroundImage;
