import {Platform, StyleSheet} from 'react-native';
import {Colors, Fonts} from '../../../theme';
import {hasNotch} from 'react-native-device-info';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: hasNotch() ? 70 : 50,
  },
  header: {
    fontSize: 16,
    color: Colors.primary.WHITE,
    fontFamily: Fonts.Poppins_Medium,
    marginStart: 12,
    marginVertical: 12,
    paddingHorizontal: 6,
  },
  tabRow: {
    flexDirection: 'row',

    paddingVertical: 10,
    gap: 8, // spacing between buttons,
    marginBottom: 20,
  },
  tabRowContainer: {
    marginStart: 19,
    paddingEnd: 38,
  },
  tabButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 8,
    // alignItems: 'center',
    // justifyContent: 'center',
    marginEnd: 12,
    borderColor: '#31417d',
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderBottomWidth: 1,
  },
  tabText: {
    color: Colors.primary.WHITE,
    fontSize: 14,
    fontFamily: Fonts.Poppins_Medium,
  },
  listContainer: {
    paddingBottom: 100,
    paddingHorizontal: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  emptyText: {
    color: Colors.primary.WHITE,
    fontSize: 16,
  },
  defaultFooter: {
    height: 60,
  },
  footerContainer: {
    height: 60,
  },
  disabledActionRow: {
    opacity: 0.4,
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
