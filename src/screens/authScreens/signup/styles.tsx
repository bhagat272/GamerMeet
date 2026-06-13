import {StyleSheet} from 'react-native';
import {Colors, Fonts} from '../../../theme';
import {hasNotch} from 'react-native-device-info';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  logo_image: {
    height: 126,
    width: 126,
    alignSelf: 'center',
    marginBottom: 25,
    marginTop: hasNotch() ? 100 : 50,
  },
  welcome_text: {
    fontFamily: Fonts.Poppins_SemiBold,
    fontSize: Fonts.SIZE_28,
    color: Colors.primary.WHITE,
    // textAlign: 'center',
    // alignSelf: 'center',
    marginHorizontal: 20,
    marginTop: hasNotch() ? 100 : 50,
    marginBottom: 40,
  },
  enter_details_text: {
    textAlign: 'center',
    fontFamily: Fonts.Poppins_Regular,
    fontSize: Fonts.SIZE_14,
    color: Colors.primary.BLACK,
    marginBottom: 50,
    opacity: 0.7,
  },
  password_icon_style: {
    width: 25,
    height: 25,
  },

  dont_have_acc_text: {
    fontFamily: Fonts.Poppins_Regular,
    fontSize: Fonts.SIZE_14,
    color: Colors.primary.WHITE,
    textAlign: 'center',
    alignSelf: 'center',
    marginBottom: 20,
  },
  sign_up_text: {
    fontFamily: Fonts.Poppins_SemiBold,
    fontSize: Fonts.SIZE_14,
    color: Colors.primary.APP_THEME,
    textDecorationLine: 'underline',
  },

  privacy_policy_touchable_text: {
    fontFamily: Fonts.Poppins_Regular,
    fontSize: Fonts.SIZE_14,
    color: Colors.secondary.MONSOON,
    textDecorationLine: 'underline',
  },
  privacy_policy_text: {
    fontFamily: Fonts.Poppins_Regular,
    fontSize: Fonts.SIZE_14,
    color: Colors.secondary.MONSOON,
    // textAlign: 'center',
    // alignSelf: 'center',
    // marginBottom: 40,
  },

  check_image: {height: 25, width: 25},
  check_view: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
    flexWrap: 'wrap',
  },
  uncheckTouch: {
    marginRight: 5,
    alignSelf: 'flex-start',
  },
  below_text: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    flex: 1,
  },
});

export default styles;
