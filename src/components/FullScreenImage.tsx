import React, {useState} from 'react';
import {
  ActivityIndicator,
  Image,
  ImageStyle,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import {Colors} from '../theme';
import {ReactNativeZoomableView} from '@openspacelabs/react-native-zoomable-view';

type Props = {
  uri: string;
  containerStyle?: StyleProp<ViewStyle>;
  imageStyle?: StyleProp<ImageStyle>;
  loaderSize?: 'small' | 'large' | number; // ✅ correct typing
};

const FullScreenImage = ({
  uri,
  containerStyle,
  imageStyle,
  loaderSize = 'small',
}: Props) => {
  const [loading, setLoading] = useState(true);

  return (
    <View style={[styles.center, containerStyle]}>
      {loading && (
        <ActivityIndicator
          color={Colors.primary.APP_THEME}
          style={[styles.loader, imageStyle]}
          size={loaderSize}
        />
      )}
      <ReactNativeZoomableView
        maxZoom={6}
        minZoom={0.5}
        zoomStep={0.5}
        initialZoom={1}
        bindToBorders={true}>
        <Image
          source={{uri}}
          style={imageStyle}
          onLoadStart={() => setLoading(true)}
          onLoadEnd={() => setLoading(false)}
          onError={() => setLoading(false)}
        />
      </ReactNativeZoomableView>
    </View>
  );
};
const styles = StyleSheet.create({
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loader: {
    position: 'absolute',
  },
});
export default FullScreenImage;
