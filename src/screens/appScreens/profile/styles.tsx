import {Dimensions, Platform, StyleSheet} from 'react-native';
import {hasNotch} from 'react-native-device-info';
import {Colors, Fonts} from '../../../theme';
import fonts from '../../../theme/fonts';

const ScreenWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 52,
  },
  header: {
    paddingTop: hasNotch() ? 60 : 50,
  },
  gradientOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  headerContainer: {
    alignSelf: 'flex-end',
    marginEnd: 15,
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: 20,
    position: 'relative',
    width: 100,
    height: 100,
    borderRadius: 50,
    alignSelf: 'center',
  },
  headerContent: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: '#075292',
  },
  edit_icon: {
    width: 16,
    height: 16,
  },
  name: {
    fontSize: 20,
    fontFamily: fonts.Poppins_Regular,
    color: Colors.primary.WHITE,
    textTransform: 'capitalize',
  },
  ageGender: {
    color: Colors.secondary.LIGHT_ORANGE,
    marginBottom: 10,
    textAlign: 'center',
    fontFamily: fonts.Poppins_Medium,
  },
  socialIcons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    paddingHorizontal: 16,
    gap: 10,
  },
  bio: {
    color: Colors.primary.WHITE,
    textAlign: 'center',
    paddingHorizontal: 16,
    fontFamily: fonts.Poppins_SemiBold,
  },
  sectionTitle: {
    fontSize: 16,
    color: Colors.primary.WHITE,
    marginVertical: 16,
    fontFamily: fonts.Poppins_Medium,
    marginHorizontal: 2,
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
  },
  deleteIcon: {
    position: 'absolute',
    top: 6,
    right: 8,

    borderRadius: 30,
    padding: 4,
    backgroundColor: Colors.secondary.PURPLE,
  },
  replace_Icon: {
    position: 'absolute',
    top: 6,
    right: 8,

    borderRadius: 30,
    padding: 8,
    backgroundColor: Colors.secondary.PURPLE,
  },
  addPhotoBox: {
    width: (ScreenWidth - 68) / 3,
    height: 175,
    borderRadius: 8,
    marginHorizontal: 6,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#88BBFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    backgroundColor: Colors.secondary.PHOTO_BOX,
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 10,
    paddingStart: 1,
  },
  tag: {
    backgroundColor: Colors.secondary.CHIP_COLOR,

    borderRadius: 6,
    color: Colors.primary.WHITE,
    fontSize: 12,
    padding: 12,
  },

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
  socialIcon: {
    tintColor: Colors.primary.WHITE,
  },
  otherItem: {
    color: Colors.primary.WHITE,
    fontSize: 14,
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
    //   backgroundColor: Colors.primary.BLACK,
    // borderRadius: 999,
    // padding: 6,
    // position: 'absolute',
    // zIndex: 5,
    // borderWidth: 2,
    // borderColor: '#075292',
    // right: 54,
    position: 'absolute',
    bottom: 0,
    backgroundColor: Colors.primary.BLACK,
    borderRadius: 49,
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#075292',
    right: 0,
    zIndex: 5,
  },

  edit_icon_style: {
    height: 16,
    width: 16,
  },
  editIcon: {
    height: 22,
    width: 22,
  },
  account_text: {
    fontFamily: Fonts.Poppins_Bold,
    fontSize: Fonts.SIZE_16,
    color: Colors.secondary.MIRAGE,
    marginHorizontal: 20,
    marginTop: 25,
    marginBottom: 5,
  },
  tagsSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  editbtn: {
    alignItems: 'center',
    justifyContent: 'center',
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
  toggle: {
    width: 44,
    height: 24,
  },
  LinearGradient: {
    paddingHorizontal: 16,
  },
  social_icons: {
    width: 18,
    height: 18,
  },
  topGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 100,
    zIndex: 1,
  },
  replaceIcon: {
    width: 13,
    height: 13,
  },
  delete_icon: {
    width: 20,
    height: 20,
  },
  ad_style: {
    position: 'absolute',
  },
});

export default styles;
