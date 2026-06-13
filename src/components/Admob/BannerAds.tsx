import React, {useState} from 'react';
import {View, Platform, Dimensions, Text, StyleSheet} from 'react-native';
import {
  GAMBannerAd,
  BannerAdSize,
  TestIds,
} from 'react-native-google-mobile-ads';
import Colors from '../../theme/colors';
import {
  AD_MOB_BANNER_IOS,
  AD_MOB_BANNER_ANDROID,
} from '../../redux/apis/commonValue';

const adUnitId = __DEV__
  ? TestIds.BANNER
  : Platform.OS === 'ios'
  ? AD_MOB_BANNER_IOS
  : AD_MOB_BANNER_ANDROID;

interface BannerAdsProps {
  type?: 'box' | 'banner';
  adsStyle?: object;
}

const BannerAds: React.FC<BannerAdsProps> = ({type = 'banner', adsStyle}) => {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  console.log('Ad Unit ID:', adUnitId, '__DEV__:', __DEV__);

  const containerStyle = [
    styles.container,
    adsStyle,
    hasError && styles.hidden,
  ];

  return (
    <View style={containerStyle}>
      <GAMBannerAd
        unitId={adUnitId}
        sizes={
          type === 'box'
            ? [BannerAdSize.MEDIUM_RECTANGLE]
            : [BannerAdSize.ANCHORED_ADAPTIVE_BANNER]
        }
        requestOptions={{requestNonPersonalizedAdsOnly: true}}
        onAdLoaded={() => {
          setHasError(false);
          setIsLoading(false);
        }}
        onAdFailedToLoad={err => {
          setHasError(true);
          console.log(err, 'addddddd error');
        }}
      />

      {isLoading && !hasError && (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Ad Loading...</Text>
        </View>
      )}
    </View>
  );
};

export default BannerAds;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    backgroundColor: Colors.primary.WHITE,
    paddingBottom: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  hidden: {
    width: 0,
    height: 0,
    paddingBottom: 0,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: Dimensions.get('window').width,
  },
  loadingText: {
    color: '#919191',
    fontSize: 12,
  },
});
