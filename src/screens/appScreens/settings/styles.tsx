import {StyleSheet} from 'react-native';
import {Colors, Fonts} from '../../../theme';
import fonts from '../../../theme/fonts';
import {hasNotch} from 'react-native-device-info';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary.WHITE,
  },
  image_container_view: {
    height: 70,
    width: 70,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  user_image_style: {
    height: 60,
    width: 60,
    borderRadius: 12,
  },
  back: {
    width: 24,
    height: 24,
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
  user_email_text: {
    fontFamily: Fonts.Poppins_Regular,
    fontSize: Fonts.SIZE_14,
    color: Colors.secondary.STORM_DUST,
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
     width: '90%',
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
    width: '100%',
    height: 53,
  },

  account_section_text_container_view: {
    flexDirection: 'row',
    alignItems: 'center',
    
    flex: 1,
    marginLeft: 15,
    minHeight: 53,
    borderColor: Colors.secondary.GAINSBORO,
  },

  account_section_text_style: {
    fontFamily: Fonts.Poppins_Light,
    fontSize: Fonts.SIZE_16,
    color: Colors.primary.WHITE,
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
});

export default styles;
