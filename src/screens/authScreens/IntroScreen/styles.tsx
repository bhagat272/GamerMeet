import {StyleSheet} from 'react-native';
import {hasNotch} from 'react-native-device-info';
import {Colors} from '../../../theme';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  logo_image: {
    height: 118,
    width: 227,
    alignSelf: 'center',
    marginBottom: 85,
    marginTop: hasNotch() ? 100 : 50,
  },
  intro_icon: {
    height: 238,
    width: 300,
    alignSelf: 'center',
  },
  buttonText: {
    color: Colors.primary.BLACK,
  },
  button_container: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  button_one: {
    marginBottom: -12,
  },
  button_two: {
    marginBottom: 12,
  },
});

export default styles;
