import {Platform, StyleSheet} from 'react-native';
import {hasNotch} from 'react-native-device-info';
import {Colors, Fonts} from '../../../theme';
import fonts from '../../../theme/fonts';

const styles = StyleSheet.create({
  background: {
    paddingTop: hasNotch() ? 70 : 50,
    justifyContent: 'space-around',
  },
  content: {
    flex: 1,
    paddingHorizontal: 22,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.primary.WHITE,
    marginBottom: 4,
    fontFamily: Fonts.Poppins_SemiBold,
    paddingHorizontal: 22,
  },
  title: {
    fontSize: 22,
    fontFamily: Fonts.Poppins_SemiBold,
    color: Colors.primary.WHITE,
    paddingHorizontal: 22,
  },
  label: {
    fontSize: 18,
    color: Colors.primary.WHITE,
    marginVertical: 12,
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
    width: 100,
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
    width: 100,
    height: 175,
    borderWidth: 1.4,

    margin: 5,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    borderColor: Colors.primary.WHITE,
    backgroundColor: Colors.primary.APP_THEME_2,
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
    marginTop: 12,
  },
  buttonText: {
    color: Colors.primary.WHITE,
    fontSize: 16,
    fontFamily: Fonts.Poppins_Regular,
    textAlign: 'center',
  },
  input: {
    borderBottomWidth: 1.4,
    borderColor: Colors.secondary.HEADER_BOTTOM_COLOR,
    color: Colors.primary.WHITE,
    fontSize: 16,
    marginBottom: 16,
    paddingVertical: Platform.OS === 'ios' ? 10 : 5,
    marginHorizontal: 17,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  genderText: {
    fontFamily: Fonts.Poppins_Regular,
    color: Colors.secondary.LIGHT_GREY,
    fontSize: Fonts.SIZE_14,
    marginBottom: 6,
    marginLeft: 2,
  },
  genderText2: {
    color: Colors.primary.WHITE,
    fontSize: Fonts.SIZE_14,
    fontFamily: Fonts.Poppins_Regular,
     marginLeft: 3.5,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 10,
  },
  chip: {
    backgroundColor: Colors.secondary.CHIP_COLOR,
    paddingHorizontal: 17,
    paddingVertical: 13,
    borderRadius: 6,
    marginBottom: 8,
  },
  chipSelected: {
    backgroundColor: '#E74C1B',
  },
  chipText: {
    color: '#fff',
    fontSize: 13,
  },
  chipTextSelected: {
    color: '#fff',
  },
  arrow: {
    tintColor: Colors.primary.WHITE,
    width: 18,
    height: 18,
    transform: [{rotate: '90deg'}],
    // marginTop: 12,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: -7,
    marginLeft: 26,
    fontFamily: fonts.Poppins_Medium,
  },
  errorBorder: {
    borderColor: 'red',
    borderWidth: 1,
  },
  label_text: {
    fontFamily: Fonts.Poppins_Regular,
    fontSize: Fonts.SIZE_14,
    color: Colors.secondary.GREY,
    marginBottom: 1,
    marginStart: '5%',
  },
});

export default styles;
