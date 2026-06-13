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
    paddingBottom: 16,
  },
  subtitle2: {
    fontSize: 16,
    color: Colors.primary.WHITE,
    fontFamily: Fonts.Poppins_SemiBold,
    paddingHorizontal: 22,
    marginVertical: 15,
  },
  subHeader: {
    fontSize: 14,
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
    borderBottomWidth: 1,
    borderColor: '#ccc',
    color: Colors.primary.WHITE,
    fontSize: 16,
    marginBottom: 16,
    paddingVertical: Platform.OS === 'ios' ? 10 : 5,
    marginHorizontal: 17,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  genderText: {
    color: Colors.secondary.MONSOON,
    fontSize: 16,
    marginBottom: 12,
  },
  genderText2: {
    color: Colors.primary.WHITE,
    fontSize: 16,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 10,
  },
  chip: {
    backgroundColor: '#362B70',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    marginBottom: 8,
  },
  chipSelected: {
    tintColor: Colors.primary.APP_THEME,
  },
  chipText: {
    color: '#fff',
    fontSize: 13,
  },
  chipTextSelected: {
    color: '#fff',
  },
  twitter: {
    tintColor: Colors.primary.APP_THEME,
    width: 17,
    height: 17,
  },
  arrow: {
    tintColor: Colors.primary.WHITE,
    width: 18,
    height: 18,
    transform: [{rotate: '90deg'}],
    marginTop: 12,
  },
  account_section_view: {
    width: '100%',
    borderRadius: 16,
    alignSelf: 'center',
  },

  account_section_images_style: {
    height: 41,
    width: 40,
  },

  account_section_sub_view: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    height: 53,
    marginBottom: 40,
  },

  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  count_text: {
    color: Colors.secondary.GREY,
    fontSize: 11,
    fontFamily: fonts.Poppins_Medium,
    alignSelf: 'flex-end',
    marginRight: 22,
  },
  micIcon: {
    width: 40,
    height: 40,
  },

  account_section_text_container_view: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  account_section_text_style: {
    fontFamily: Fonts.Poppins_Regular,
    fontSize: Fonts.SIZE_16,
    color: Colors.primary.WHITE,
  },

  voice_text: {
    fontSize: Fonts.SIZE_14,
    color: Colors.primary.WHITE,
    marginTop: 2,
    fontStyle: 'italic',
  },

  toggle: {
    width: 44,
    height: 24,
    marginLeft: 10,
  },
  skipTest: {
    fontFamily: Fonts.Poppins_Regular,
    fontSize: Fonts.SIZE_16,
    color: Colors.primary.WHITE,
  },
  skipButton: {
    width: '100%',
    paddingHorizontal: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
});

export default styles;
