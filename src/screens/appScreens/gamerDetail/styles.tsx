import {Dimensions, Platform, StatusBar, StyleSheet} from 'react-native';
import {Colors, Fonts} from '../../../theme';
import fonts from '../../../theme/fonts';
import {hasNotch} from 'react-native-device-info';

const ScreenWidth = Dimensions.get('window').width;
const {width, height} = Dimensions.get('window');

const topMargin =
  Platform.OS === 'android' ? StatusBar.currentHeight || 40 : 10;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: hasNotch() ? 60 : 50,
  },
  gradientOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  headerContainer: {
    alignSelf: 'flex-start',
    marginStart: 15,
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  topHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: '#075292',
  },
  name: {
    fontSize: 20,

    color: Colors.primary.WHITE,
  },
  ageGender: {
    color: Colors.secondary.LIGHT_ORANGE,
    marginBottom: 10,
    fontFamily: fonts.Poppins_Medium,
    textAlign: 'center',
  },
  socialIcons: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 10,
  },
  belowButtonContainer: {
    flexDirection: 'row',
    gap: 6,
  },
  message_icon: {
    width: 15,
    height: 13.38,
  },
  bio: {
    color: Colors.primary.WHITE,
    textAlign: 'center',
    paddingHorizontal: 16,
    fontFamily: fonts.Poppins_SemiBold,
  },
  belowButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.secondary.CHIP_COLOR,

    borderRadius: 6,
    color: Colors.primary.WHITE,

    padding: 6,
    marginVertical: 5,
  },
  belowButtonText: {
    color: Colors.primary.WHITE,
    textAlign: 'center',
    paddingHorizontal: 6,
    fontFamily: fonts.Poppins_Medium,
    fontSize: 12,
  },
  sectionTitle: {
    fontSize: 16,
    color: Colors.primary.WHITE,
    marginVertical: 10,
    fontFamily: fonts.Poppins_Medium,
    marginHorizontal: 6,
  },
  photosSection: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
  },
  photoBox: {
    position: 'relative',
  },
  photo: {
    width: (ScreenWidth - 68) / 3,
    height: 175,
    borderRadius: 8,
    marginHorizontal: 6,
    backgroundColor: Colors.primary.APP_THEME_2,
  },

  addPhotoBox: {
    width: (ScreenWidth - 68) / 3,
    height: 175,
    borderRadius: 8,
    marginHorizontal: 6,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#666',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 10,
    paddingStart: 1,
  },
  tag: {
    backgroundColor: '#372D75',

    borderRadius: 6,
    color: Colors.primary.WHITE,
    fontSize: 12,
    padding: 12,
  },
  tagPC: {backgroundColor: '#F44336'},
  tagConsole: {backgroundColor: '#3F51B5'},
  tagMobile: {backgroundColor: '#9C27B0'},
  linkButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.secondary.CHIP_COLOR,

    borderRadius: 6,
    color: Colors.primary.WHITE,
    fontSize: 12,
    padding: 12,
    gap: 6,
  },
  linkLabel: {
    color: Colors.primary.WHITE,
    fontSize: 12,
  },
  linkIcon: {
    tintColor: Colors.primary.WHITE,
  },
  socialIcon: {
    tintColor: Colors.primary.WHITE,
  },
  scroll: {
    paddingBottom: 160,
  },
  image_container_view: {
    height: 70,
    width: 70,
    borderRadius: 12,
    backgroundColor: Colors.secondary.IRON,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  user_image_style: {
    height: 60,
    width: 60,
    borderRadius: 12,
  },
  profile_info_view: {
    backgroundColor: Colors.secondary.GLASS,
    minHeight: 110,
    width: '100%',
    marginTop: hasNotch() ? 50 : 40,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  profile_name_email_view: {
    flex: 1,
    marginHorizontal: 20,
  },
  user_name_text: {
    fontFamily: Fonts.Poppins_SemiBold,
    fontSize: Fonts.SIZE_18,
    color: Colors.secondary.MIRAGE,
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
  active: {
    position: 'absolute',
    bottom: 12,
    right: Platform.OS === 'ios' ? 10 : 20,
    backgroundColor: Colors.secondary.GREEN,
    borderRadius: 999,
    padding: 6,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 5,
    borderWidth: 2,
    borderColor: Colors.primary.BLACK,
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
  photosScrollContainer: {
    flexDirection: 'row',
    gap: 1,
    paddingVertical: 6,
  },
  menuContainer: {
    position: 'absolute',
    top: 104,
    right: 22,
    backgroundColor: Colors.primary.WHITE,
    borderRadius: 8,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    zIndex: 100,
  },

  menuOption: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.secondary.GAINSBORO,
  },
  menuOption_seconf: {
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  edit_icon_style: {
    height: 16,
    width: 16,
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
  centerContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  icon: {
    width: 42,
    height: 42,
  },
  photos: {
    paddingStart: 16,
  },
  modal_view: {
    flex: 1,
    backgroundColor: Colors.primary.BLACK,
  },
  image_view: {
    width,
    height,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image_viewer: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? topMargin + 42 : topMargin - 37,
    right: 5,
    zIndex: 1,
    borderRadius: 20,
    padding: 10,
  },
  modal_image: {
    width,
    height,
    resizeMode: 'contain',
  },

  cross_icon: {
    height: 30,
    width: 30,
    tintColor: Colors.primary.WHITE,
  },
  disabledActionRow: {
    opacity: 0.4,
  },
  blockedBanner: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.primary.APP_THEME,
    padding: 12,
    alignItems: 'center',
  },
  blockedText: {
    color: Colors.primary.WHITE,
    fontSize: 14,
    fontFamily: fonts.Poppins_Regular,
  },
  namerow: {
    flex: 1,
    flexDirection: 'row',
    marginVertical: 2,
  },
  premium_badge: {
    width: 22,
    height: 22,
    alignSelf: 'center',
  },
});

export default styles;
