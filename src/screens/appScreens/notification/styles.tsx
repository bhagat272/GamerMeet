import {StyleSheet} from 'react-native';
import {Colors, Fonts} from '../../../theme';
import {hasNotch} from 'react-native-device-info';
import fonts from '../../../theme/fonts';

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  headerview: {
    flexDirection: 'row',
    marginTop: 30,
    marginHorizontal: 18,
    alignItems: 'center',
    gap: 20,
  },
  titleText: {
    fontSize: 18,
    color: Colors.primary.WHITE,
    fontFamily: fonts.Poppins_Medium,
  },
  backIcon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  line: {
    width: '100%',
    marginTop: 20,
    height: 2,
    resizeMode: 'contain',
  },
  mainview: {
    flexDirection: 'row',
    gap: 16,
    marginHorizontal: 18,
    marginTop: 30,
    alignItems: 'flex-start',
  },

  textview: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    color: Colors.primary.WHITE,
    fontFamily: fonts.Poppins_Regular,
    lineHeight: 20,
  },
  highlighted: {
    fontFamily: Fonts.Poppins_SemiBold,
    color: Colors.primary.WHITE,
  },
  time: {
    fontSize: 12,
    color: Colors.secondary.GREY,
    fontFamily: fonts.Poppins_Medium,
    marginTop: 4,
  },
  profile_info_view: {
    width: '100%',
    marginTop: hasNotch() ? 50 : 40,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomColor: Colors.secondary.HEADER_BOTTOM_COLOR,
    borderBottomWidth: 1,
    marginBottom: 0,
  },
  image_container_view: {
    height: 70,
    width: 70,

    justifyContent: 'center',
    alignItems: 'center',
  },
  back: {
    width: 24,
    height: 24,
  },
  profile_name_email_view: {
    flex: 1,
    marginHorizontal: 1,
  },
  user_name_text: {
    fontFamily: Fonts.Poppins_SemiBold,
    fontSize: Fonts.SIZE_18,
    color: Colors.primary.WHITE,
  },
  notificationImage: {
    width: 52,
    height: 52,
    borderRadius: 25,
    marginRight: 10,
  },
  containerStyle: {
    paddingBottom: 30,
  },
  emptyComponent: {
    alignItems: 'center',
    marginTop: 40,
  },
  pagingLoaderContainer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 8,
    fontSize: 14,
    color: Colors.primary.GREY,
    textAlign: 'center',
  },
  initialLoaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: Colors.primary.GREY,
    textAlign: 'center',
    marginTop: 8,
  },
});

export default styles;
