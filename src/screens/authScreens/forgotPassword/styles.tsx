import {StyleSheet} from 'react-native';
import {Colors, Fonts} from '../../../theme';
import {hasNotch} from 'react-native-device-info';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  logo_image: {
    height: 118,
    width: 227,
    alignSelf: 'center',
    marginBottom: 80,
    marginTop: hasNotch() ? 100 : 50,
  },
  welcome_text: {
    fontFamily: Fonts.Poppins_SemiBold,
    fontSize: Fonts.SIZE_28,
    color: Colors.primary.WHITE,
    // textAlign: 'center',
    // alignSelf: 'center',
    marginBottom: 10,
    marginHorizontal: 20,
  },
  enter_details_text: {
    // textAlign: 'center',
    fontFamily: Fonts.Poppins_Regular,
    fontSize: Fonts.SIZE_16,
    color: Colors.primary.WHITE,
    marginBottom: 50,
    marginHorizontal: 20,
    lineHeight: 24,
  },
  buttonStyle: {
    marginBottom: 10,
  },
});

export default styles;
