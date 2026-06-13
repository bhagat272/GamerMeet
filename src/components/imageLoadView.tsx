import React, {useEffect, useState} from 'react';
import {ActivityIndicator, StyleSheet, View} from 'react-native';
import FastImage from '@d11/react-native-fast-image';
const ImageLoadView = (props: any) => {
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    let timer = null;

    if (props?.source?.uri) {
      try {
        if (FastImage && typeof FastImage.preload === 'function') {
          FastImage.preload([{uri: props.source.uri}]);
        }

        timer = setTimeout(() => {
          setLoading(false);
        }, 8000);
      } catch (error) {
        console.warn('FastImage preload error:', error);
        setLoading(false);
      }
    } else {
      setLoading(false);
    }

    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [props.source?.uri]);


  const handleLoadStart = () => {
    setHasError(false);
    props.onLoadStart?.();
  };

  const handleLoad = () => {
    setLoading(false);
    props.onLoad?.();
  };

  const handleError = () => {
    setLoading(false);
    setHasError(true);
    props.onError?.();
  };

  return (
    <>
      <FastImage
        {...props}
        onLoadStart={handleLoadStart}
        onLoad={handleLoad}
        onError={handleError}
        resizeMode={props.resizeMode}>
        {loading && (
          <View style={styles.loader}>
            <ActivityIndicator
              size={props.loaderSize || 'small'}
              color={props.loaderColor || '#919191'}
            />
          </View>
        )}
      </FastImage>
    </>
  );
};

export default ImageLoadView;

const styles = StyleSheet.create({
  loader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
