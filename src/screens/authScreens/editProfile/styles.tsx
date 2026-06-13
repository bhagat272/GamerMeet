import {Platform, StyleSheet} from 'react-native';
import {Colors, Fonts} from '../../../theme';
import fonts from '../../../theme/fonts';
import {hasNotch} from 'react-native-device-info';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingBottom: 40,
    paddingTop: 42,
  },
  profile_view: {
    width: '100%',
    marginTop: hasNotch() ? 50 : 40,
    flexDirection: 'row',
    alignItems: 'center',

    marginBottom: 30,
  },
  profile_name_email_view: {
    flex: 1,
    marginHorizontal: 1,
  },

  image_containerView: {
    height: 70,
    width: 70,

    justifyContent: 'center',
    alignItems: 'center',
  },
  back: {
    width: 24,
    height: 24,
  },
  profile_name_email_views: {
    flex: 1,
    marginHorizontal: 1,
  },
  user_name_text: {
    fontFamily: Fonts.Poppins_SemiBold,
    fontSize: Fonts.SIZE_18,
    color: Colors.primary.WHITE,
  },

  user_image: {
    height: 114,
    width: 114,
    borderRadius: 114 / 2,
    overflow: 'hidden',
    alignSelf: 'center',
    marginBottom: 40,
  },
  headerImage: {
    width: '100%',
    height: 270,
    flex: 1,
  },

  view_input: {
    height: 70,
    width: '90%',
    alignSelf: 'center',
    backgroundColor: Colors.secondary.OFF_WHITE,
    borderRadius: 16,
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
    // justifyContent: 'space-between',
    flexDirection: 'row',
    marginTop: 5,
  },
  text_input: {
    fontFamily: fonts.Poppins_Regular,
    fontSize: fonts.SIZE_15,
    color: Colors.secondary.DUNE,
    // paddingHorizontal: 0,
    marginLeft: 10,
  },
  error_message_text: {
    color: 'red',
    marginHorizontal: 25,
    fontFamily: fonts.Poppins_Medium,
    fontSize: fonts.SIZE_12,
    marginTop: -15,
    marginBottom: 20,
  },
  image_container_view: {
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },

  user_profile: {
    height: 150,
    width: 150,
    borderRadius: 114,
    overflow: 'hidden',
    position: 'relative',
    bottom: 82,
    alignSelf: 'center',
    borderWidth: 4.6,
    borderColor: '#32377D',
  },
  edit_icon: {
    height: 12,
    width: 12,
    marginRight: 10,
  },
  add_photo_view: {
    width: 112,
    height: 32,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.secondary.IRON,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: 15,
  },
  add_photo_text: {
    fontFamily: fonts.Poppins_Medium,
    fontSize: fonts.SIZE_14,
    color: Colors.primary.WHITE,
  },
  delete_icon_view: {
    position: 'absolute',
    right: 10,
    top: 5,
  },

  //
  profileImageWrapper: {
    alignSelf: 'center',
    position: 'relative',
    marginTop: 20,
    marginBottom: 30,
  },
  profile_image_style: {
    height: 134,
    width: 134,
    borderRadius: 134 / 2,
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: '#32377D',
  },

  genderText: {
    color: Colors.primary.WHITE,
    fontSize: Fonts.SIZE_14,
    marginBottom: 12,
    fontFamily: fonts.Poppins_Regular,
    marginStart: 2.3,
  },
  genderText2: {
    color: Colors.secondary.LIGHT_GREY,
    fontSize: Fonts.SIZE_14,
    marginStart: 2,
    fontFamily: fonts.Poppins_Regular,
    marginBottom: 12,
  },
  count_text: {
    color: Colors.secondary.GREY,
    fontSize: 11,
    fontFamily: fonts.Poppins_Medium,
    alignSelf: 'flex-end',
    marginRight: 22,
  },

  subtitle: {
    fontSize: 16,
    color: Colors.primary.WHITE,
    marginVertical: 20,
    fontFamily: Fonts.Poppins_SemiBold,
    paddingStart: '4.6%',
  },

  chipSelected: {
    tintColor: Colors.primary.APP_THEME,
  },
  input: {
    borderBottomWidth: 1.4,
    borderColor: Colors.secondary.HEADER_BOTTOM_COLOR,
    color: Colors.primary.WHITE,
    fontSize: 16,
    marginBottom: 16,
    paddingVertical: 10,
    marginHorizontal: 17,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  arrow: {
    tintColor: Colors.primary.WHITE,
    width: 18,
    height: 18,
    transform: [{rotate: '90deg'}],
  },
  edit_icon_view: {
    position: 'absolute',
    bottom: 10,
    right: 0,
    backgroundColor: '#32377D',
    borderRadius: 999,
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#32377D',
  },
  edit_icon_style: {
    height: 18,
    width: 18,
    tintColor: 'white',
  },
  twitter: {
    tintColor: Colors.primary.APP_THEME,
    width: 17,
    height: 17,
  },
  name_input: {
    marginTop: 32,
  },
  label_text: {
    fontFamily: Fonts.Poppins_Regular,
    fontSize: Fonts.SIZE_14,
    color: Colors.secondary.GREY,
    marginBottom: 1,
    marginStart: '4.8%',
  },
  change_Text: {
    fontSize: Fonts.SIZE_15,
    color: Colors.primary.APP_THEME,
    fontStyle: 'italic',
    marginRight: 6,
  },
  //floating button
  // buttonStyle: {
  //   position: 'absolute',
  //   bottom: 0, // Distance from bottom
  //   left: 0,
  //   right: 0,
  //   alignItems: 'center',
  //   zIndex: 1000, // Ensure it stays on top
  // },
  change_icon: {
    height: 19,
    width: 60,
    tintColor: Colors.primary.APP_THEME,
    marginRight: 7,
  },
});

export default styles;
