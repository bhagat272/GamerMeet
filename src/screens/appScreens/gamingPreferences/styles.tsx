import {Platform, StyleSheet} from 'react-native';
import {hasNotch} from 'react-native-device-info';
import {Colors, Fonts} from '../../../theme';

const styles = StyleSheet.create({
  background: {
    paddingTop: hasNotch() ? 50 : 20,
    justifyContent: 'space-around',
  },
  content: {
    flex: 1,
    paddingHorizontal: 22,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.primary.WHITE,
    marginVertical: 20,
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
    backgroundColor: Colors.primary.APP_THEME,
  },
  chipText: {
    color: Colors.primary.WHITE,
    fontSize: 13,
  },
  chipTextSelected: {
    color: Colors.primary.WHITE,
  },

  profile_info_view: {
    width: '100%',

    flexDirection: 'row',
    alignItems: 'center',

    borderBottomColor: Colors.secondary.HEADER_BOTTOM_COLOR,
    borderBottomWidth: 1,
    marginBottom: 10,
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
});

export default styles;
