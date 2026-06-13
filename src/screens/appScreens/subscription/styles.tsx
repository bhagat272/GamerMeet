import {Dimensions, StyleSheet} from 'react-native';
import Colors from '../../../theme/colors';
import fonts from '../../../theme/fonts';
import {hasNotch} from 'react-native-device-info';
import {Fonts} from '../../../theme';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  heading_text: {
    fontFamily: fonts.Poppins_SemiBold,
    fontSize: fonts.SIZE_18,
    color: Colors.primary.BLACK,
    margin: 20,
  },
  sub_heading_text: {
    fontFamily: fonts.Poppins_Medium,
    fontSize: fonts.SIZE_16,
    color: Colors.secondary.MONSOON,
    marginHorizontal: 20,
    marginBottom: 10,
  },

  flatlist_style: {
    width: Dimensions.get('window').width - 40,
    maxHeight: 200,
    alignSelf: 'center',
  },

  flatlist_content_style: {
    flexGrow: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  render_plan_view: {
    borderRadius: 16,
    maxHeight: 200,
    width: Dimensions.get('window').width / 2 - 30,
    backgroundColor: '#07676B',
  },

  itunes_text: {
    marginHorizontal: 20,
    textAlign: 'center',
    fontFamily: fonts.Poppins_Medium,
    fontSize: fonts.SIZE_13,
    color: Colors.primary.WHITE,
    marginVertical: 20,
  },

  footer_view: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 20,
    marginBottom: 30,
  },

  hyper_links_text: {
    textDecorationLine: 'underline',
    fontFamily: fonts.Poppins_Medium,
    fontSize: fonts.SIZE_12,
    color: Colors.primary.WHITE,
  },
  map_container: {
    alignSelf: 'center',
    // minHeight: 200,
    width: '90%',
  },

  render_map_view: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 60,
    width: Dimensions.get('window').width - 48,
    borderRadius: 16,

    // borderWidth: 1,
    // borderColor: Colors.secondary.HARP,
    paddingHorizontal: 20,
    marginVertical: 10,
  },

  lorem_text: {
    fontFamily: fonts.Poppins_Medium,
    fontSize: fonts.SIZE_14,
    color: Colors.primary.WHITE,
    textAlign: 'center',
  },
  price_text: {
    fontFamily: fonts.Poppins_SemiBold,
    fontSize: fonts.SIZE_18,
    color: Colors.secondary.OFF_WHITE,
    textAlign: 'center',
  },
  activeContainer: {
    backgroundColor: Colors.secondary.ORANGE,
    borderRadius: 30,
    paddingVertical: 3,
    paddingHorizontal: 10,
  },
  activePlan: {
    fontFamily: fonts.Poppins_Medium,
    fontSize: fonts.SIZE_12,
    color: Colors.primary.WHITE,
  },
  featureHead: {
    fontFamily: fonts.Poppins_Medium,
    fontSize: fonts.SIZE_16,
    color: Colors.primary.BLACK,
    marginVertical: 10,
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
  user_name_text: {
    fontFamily: Fonts.Poppins_SemiBold,
    fontSize: Fonts.SIZE_18,
    color: Colors.primary.WHITE,
  },

  profile_name_email_view: {
    flex: 1,
    marginHorizontal: 1,
  },

  featureTextView: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  profile_info_view: {
    width: '100%',
    marginTop: hasNotch() ? 50 : 40,
    flexDirection: 'row',
    alignItems: 'center',

    borderBottomColor: Colors.secondary.HEADER_BOTTOM_COLOR,
    borderBottomWidth: 1,
    marginBottom: 16,
  },

  featureText: {
    fontFamily: fonts.Poppins_Medium,
    fontSize: fonts.SIZE_12,
    color: Colors.secondary.DUNE,
    marginBottom: 8,
    marginLeft: 10,
  },
  monthly_text: {
    fontFamily: fonts.Poppins_Medium,
    fontSize: fonts.SIZE_12,
    color: Colors.secondary.GREY,
  },
  bg_img: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height + 90,
    flex: 1,
  },
  feature_text: {
    fontFamily: fonts.Poppins_Medium,
    fontSize: fonts.SIZE_12,
    color: Colors.primary.WHITE,
    marginHorizontal: 10,
  },
  main_view: {
    // height: 60,
    // width: Dimensions.get('window').width - 40,
    borderRadius: 16,
    backgroundColor: Colors.primary.APP_THEME_2,
    borderWidth: 1.2,

    borderColor: Colors.secondary.HEADER_BOTTOM_COLOR,
    paddingBottom: 10,
    marginVertical: 10,
    paddingHorizontal: 13,
  },
  tick: {
    height: 23,
    width: 23,
    borderRadius: 50,
    position: 'relative',
    marginVertical: -10,
  },
  status_view: {
    position: 'absolute',
    top: 0,
    right: 0,
  },
  active_view: {
    position: 'absolute',
    top: -2,
    left: 30,
  },
  infoBox: {
    backgroundColor: Colors.primary.APP_THEME_2,
    borderRadius: 10,
    padding: 16,
    marginTop: 10,
    marginHorizontal: 15,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: Colors.secondary.HEADER_BOTTOM_COLOR,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoIcon: {
    width: 18,
    height: 18,
    resizeMode: 'contain',
    marginRight: 6,
  },
  infoTitle: {
    color: Colors.primary.WHITE,
    fontSize: 16,
    fontFamily: fonts.Poppins_Medium,
  },
  infoText: {
    color: Colors.primary.WHITE,
    fontSize: 14,
    marginBottom: 4,
    fontFamily: fonts.Poppins_Regular,
  },
  featureListContainer: {
    marginTop: 8,
  },

  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginVertical: 3,
  },

  featureIcon: {
    width: 14,
    height: 14,

    marginTop: 2,
  },
  selectedPlanBorder: {
    borderColor: Colors.secondary.ORANGE,
    borderWidth: 1,
  },
  policyView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 32,
    paddingBottom: 32,
  },

  privacyPolicyText: {
    color: Colors.primary.WHITE,
    fontSize: 16,
    fontFamily: fonts.Poppins_Medium,
    textDecorationLine: 'underline',
  },
});

export default styles;
