import {Platform, StyleSheet} from 'react-native';
import {Colors, Fonts} from '../../../theme';
import fonts from '../../../theme/fonts';
import {hasNotch} from 'react-native-device-info';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: hasNotch() ? 54 : 30,
  },
  header: {
    fontSize: 16,
    color: Colors.primary.WHITE,
    fontFamily: Fonts.Poppins_Regular,
    marginStart: 20,
    marginVertical: 12,
  },
  itemContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    paddingHorizontal: 16,
    // ...Platform.select({
    //   ios: {
    //     shadowColor: Colors.primary.APP_THEME,
    //     shadowOffset: {
    //       width: -1,
    //       height: -4,
    //     },
    //     shadowOpacity: 0.4,
    //     shadowRadius: 13,
    //     elevation: 10,
    //   },
    // }),
  },
  shimmercard: {
    justifyContent: 'center',
    alignItems: 'center',
    
  },
  tabRow: {
    flexDirection: 'row',
    paddingVertical: 10,
    gap: 8, // spacing between buttons,
    marginBottom: 20,
  },
  shimmerTab: {
    flexDirection: 'row',
    gap: 8, // spacing between buttons,
    marginBottom: 20,
    paddingStart: 19,
    paddingVertical: 10,
  },
  tabScroll: {
    marginStart: 20,
    paddingEnd: 38,
  },
  tabButton: {
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginEnd: 12,
    height: 38,
    backgroundColor: Colors.secondary.CHIP_COLOR,
  },
  selectedTab: {
    backgroundColor: Colors.secondary.ORANGE,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginEnd: 12,
    height: 38,
  },
  tabText: {
    color: Colors.primary.WHITE,
    fontSize: 14,
    fontFamily: fonts.Poppins_Medium,
  },
  activity_loader: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  footer_container: {
    height: 121,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    color: Colors.primary.WHITE,
    fontFamily: fonts.Poppins_Medium,
  },
  bannerAds: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 120 : 110,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  ad_style: {
    position: 'absolute',
  },
});
export default styles;
