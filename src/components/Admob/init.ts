// eslint-disable-next-line quotes
import mobileAds from 'react-native-google-mobile-ads';
export const initApp = () => {
  mobileAds()
    .initialize()
    .then(adapterStatuses => {
      console.log('adapterStatuses', adapterStatuses);
    });
};
