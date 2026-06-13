import {Dimensions, StyleSheet} from 'react-native';
import {hasNotch} from 'react-native-device-info';
import {Colors, Fonts} from '../../../theme';

const ScreenWidth = Dimensions.get('window').width;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: hasNotch() ? 70 : 50,
    paddingHorizontal: 22,
  },
  background: {
    flex: 1,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.primary.WHITE,
    marginBottom: 4,
    fontFamily: Fonts.Poppins_SemiBold,
  },
  title: {
    fontSize: 22,
    fontFamily: Fonts.Poppins_SemiBold,
    color: Colors.primary.WHITE,
  },
  label: {
    fontSize: 16,
    color: Colors.primary.WHITE,
    marginVertical: 12,
    fontFamily: Fonts.Poppins_Regular,
  },
  helper: {
    fontSize: 16,
    color: '#ccc',
    marginBottom: 26,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  imageSlot: {
    width: (ScreenWidth - 12 ) / 4,
    height: 175,
    borderWidth: 1.4,
    borderStyle: 'dashed',
    margin: 5,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    borderColor: Colors.primary.WHITE,
    backgroundColor: Colors.primary.APP_THEME_2,
  },
  imageSet: {
    width: (ScreenWidth  - 12 ) / 4,
    height: 175,
    margin: 5,
    borderRadius: 10,
  },
  AddIcon: {
    height: 32,
    width: 32,
    borderRadius: 2,
  },

  image: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
    resizeMode: 'cover',
  },
  button: {
    width: '100%',
    marginTop: 32,
    paddingHorizontal: 7,
  },
  buttonText: {
    color: Colors.primary.WHITE,
    fontSize: 16,
    fontFamily: Fonts.Poppins_Regular,
    textAlign: 'center',
  },
});

export default styles;
