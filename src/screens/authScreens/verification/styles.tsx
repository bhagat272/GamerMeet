import {Dimensions, StyleSheet} from 'react-native';
import {Colors, Fonts} from '../../../theme';
import {hasNotch} from 'react-native-device-info';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary.BLACK,
  },
  logo_image: {
    height: 118,
    width: 227,
    alignSelf: 'center',
    marginBottom: 75,
    marginTop: hasNotch() ? 100 : 50,
  },
  welcome_text: {
    fontFamily: Fonts.Poppins_Bold,
    fontSize: Fonts.SIZE_28,
    color: Colors.primary.WHITE,
    marginBottom: 10,
    marginHorizontal: 20,
  },
  enter_details_text: {
    // textAlign: 'center',
    fontFamily: Fonts.Poppins_Regular,
    fontSize: Fonts.SIZE_14,
    color: Colors.primary.WHITE,
    marginHorizontal: 20,
    marginBottom: 50,
  },

  otp_text_box: {
    width: Dimensions.get('window').width,
    padding: 0,
  },
  otp_text_input: {
    height: 64,
    width: 50,
    // borderRadius: 16,
    borderBottomWidth: 1,
    borderColor: Colors.secondary.NEW_GRAY,
    // backgroundColor: Colors.secondary.OFF_WHITE,
    fontFamily: Fonts.Poppins_Regular,
    color: Colors.primary.WHITE,
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: Fonts.SIZE_24,
    textAlign: 'center',
    marginHorizontal: 4,
  },

  resend_text: {
    textAlign: 'center',
    alignSelf: 'center',
    marginTop: 50,
    fontFamily: Fonts.Poppins_Medium,
    fontSize: Fonts.SIZE_14,
    color: Colors.primary.WHITE,
  },
  loader: {
    marginTop: 50,
  },
});

export default styles;
