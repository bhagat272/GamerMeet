import {StyleSheet} from 'react-native';
import {Fonts, Colors} from '../../../theme';
import {hasNotch} from 'react-native-device-info';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  back: {
    width: 24,
    height: 24,
  },
  logo_image: {
    height: 126,
    width: 126,
    alignSelf: 'center',
    marginBottom: 25,
    marginTop: 50,
  },
  welcome_text: {
    fontFamily: Fonts.Poppins_SemiBold,
    fontSize: Fonts.SIZE_24,
    color: Colors.primary.WHITE,
    textAlign: 'center',
    alignSelf: 'center',
    marginBottom: 10,
  },
  enter_details_text: {
    // textAlign: 'center',
    fontFamily: Fonts.Poppins_Medium,
    fontSize: Fonts.SIZE_18,
    color: Colors.secondary.GREY,
    marginBottom: 50,
    marginHorizontal: 20,
    marginTop: 20,
  },
  image_container_view: {
    height: 70,
    width: 70,

    justifyContent: 'center',
    alignItems: 'center',
  },
  user_image_style: {
    height: 60,
    width: 60,
    borderRadius: 12,
  },
  profile_info_view: {
    width: '100%',
    marginTop: hasNotch() ? 50 : 40,
    flexDirection: 'row',
    alignItems: 'center',

    borderBottomColor: Colors.secondary.HEADER_BOTTOM_COLOR,
    borderBottomWidth: 1,
    marginBottom: 30,
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

  edit_icon_view: {
    height: 38,
    width: 38,
    backgroundColor: Colors.primary.WHITE,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  edit_icon_style: {
    height: 13,
    width: 13,
  },

  account_text: {
    fontFamily: Fonts.Poppins_Bold,
    fontSize: Fonts.SIZE_16,
    color: Colors.secondary.MIRAGE,
    marginHorizontal: 20,
    marginTop: 25,
    marginBottom: 5,
  },

  account_section_view: {
    backgroundColor: Colors.secondary.WATER,
    width: '90%',
    borderRadius: 16,
    alignSelf: 'center',
  },

  account_section_images_style: {
    height: 28,
    width: 28,
    marginLeft: 10,
  },

  account_section_sub_view: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    height: 53,
  },

  account_section_text_container_view: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    flex: 1,
    marginLeft: 10,
    minHeight: 53,
    borderColor: Colors.secondary.GAINSBORO,
  },

  account_section_text_style: {
    fontFamily: Fonts.Poppins_Light,
    fontSize: Fonts.SIZE_16,
    color: Colors.secondary.MIRAGE,
    flex: 1,
  },
  arrow_image: {
    height: 18,
    width: 18,
    marginRight: 10,
  },
  toggle_image: {
    width: 42,
    height: 24,
    marginRight: 10,
  },
  lock_icon: {
    width: 25,
    height: 25,
  },
  eye_icon: {
    tintColor: Colors.secondary.GREY,
  },
});

export default styles;
