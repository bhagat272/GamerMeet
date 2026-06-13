import {StyleSheet, Platform} from 'react-native';
import Colors from '../../../theme/colors';
import fonts from '../../../theme/fonts';
import {hasNotch} from 'react-native-device-info';
import {Fonts} from '../../../theme';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: hasNotch() ? 20 : 10,
  },

  chat_back: {
    height: 24,
    width: 24,
  },
  profile_pic: {
    height: 44,
    width: 44,
    borderRadius: 44,
  },
  person_name: {
    fontSize: fonts.SIZE_18,
    fontFamily: fonts.Poppins_SemiBold,
    color: Colors.primary.WHITE,
    marginLeft: 20,
    maxWidth: '60%',
  },
  more_pic: {
    height: 24,
    width: 24,
  },
  header_view: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    height: Platform.OS == 'ios' ? 100 : 85,
    paddingTop: 40,
    marginBottom: 10,
  },
  line: {
    height: 1,
    backgroundColor: Colors.secondary.HEADER_BOTTOM_COLOR,
    width: '100%',
  },
  tool_pic: {
    height: 25,
    width: 25,
  },
  view_flex: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 20,
  },
  footer_view: {
    backgroundColor: Colors.primary.APP_THEME_2,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingBottom: 25,
    paddingTop: 20,
  },
  camera_pic: {
    height: 18,
  },
  textInput_view: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 13,
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 5,
    paddingHorizontal: 5,
    borderColor: Colors.secondary.DUNE,
    paddingVertical: Platform.OS == 'ios' ? 16 : 2,
    maxHeight: 130,
    backgroundColor: 'rgba(10, 11, 30, 0.86)',
  },
  textInput_style: {
    flex: 1,
    marginHorizontal: 10,
    fontFamily: fonts.Poppins_Light,
    fontSize: 15,
    color: Colors.primary.WHITE,
  },
  send_icon: {
    height: 21.51,
    width: 21.51,
  },
  toolTip_icon: {
    width: 15,
    height: 15,
  },
  toolTipContent_View: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 5,
    paddingVertical: 3,
  },
  // view_render:{
  //   marginTop:20
  // }

  block_user_view: {
    height: 60,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },

  block_user_text: {
    fontFamily: fonts.Poppins_SemiBold,
    fontSize: fonts.SIZE_14,
    color: Colors.primary.RED,
  },
  attachment_icon: {
    width: 20,
    height: 15,
    marginStart: 6,
  },
  mic: {
    width: 40,
    height: 23,
  },
  media_icon: {
    height: 25,
    width: 25,
    tintColor: Colors.primary.WHITE,
    marginBottom: 3,
  },
  media_view: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: Colors.primary.APP_THEME_2,
  },
  media_text: {
    fontFamily: fonts.Poppins_SemiBold,
    fontSize: fonts.SIZE_14,
    color: Colors.primary.WHITE,
  },
  media_sub_view: {
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 15,
  },
  view_cancel_icon: {
    position: 'absolute',
    right: 5,
    top: 5,
  },
  cancel_icon: {
    height: 30,
    width: 25,
    marginEnd: 5,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)', // optional dim
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Date header styles
  dateHeaderContainer: {
    alignItems: 'center',
    marginVertical: 16,
  },
  dateHeader: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 12,
  },
  dateHeaderText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },

  // Existing styles you should have
  pagingLoaderContainer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  initialLoaderContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginLeft: 10,
    fontSize: 14,
    color: '#666',
  },
  menuOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'transparent', // optional blur
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    zIndex: 99,
  },
  menuOptionText: {
    fontSize: 14,
    color: Colors.secondary.MIRAGE,
    fontFamily: Fonts.Poppins_Medium,
  },
  dot_icon: {
    width: 24,
    height: 24,
  },
  
});

export default styles;
