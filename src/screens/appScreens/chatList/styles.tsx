import {Dimensions, StyleSheet} from 'react-native';
import {hasNotch} from 'react-native-device-info';
import Colors from '../../../theme/colors';
import fonts from '../../../theme/fonts';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: hasNotch() ? 70 : 50,
  },
  header: {
    height: 50,
  },
  inputView: {
    height: 48,
    borderWidth: 1,
    marginBottom: 10,
    borderRadius: 12,
    marginHorizontal: 20,
    paddingHorizontal: 15,
    alignItems: 'center',
    flexDirection: 'row',
    borderColor: Colors.secondary.MONSOON,
    // marginTop: hasNotch() ? 55 : 40,
  },
  headerText: {
    color: Colors.primary.WHITE,
    fontSize: 16,
    fontFamily: fonts.Poppins_Medium,
    marginBottom: 20,
    paddingHorizontal: 22,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 55,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: Colors.secondary.CHIP_COLOR,
    marginHorizontal: 15,
    backgroundColor: Colors.secondary.SEARCH_INPUT,
  },
  searchInput: {
    flex: 1,
    color: Colors.primary.WHITE,
  },
  filterIcon: {
    width: 20,
    height: 20,
  },
  searchIcon: {
    width: 14,
    height: 14,
    marginEnd: 5,
  },
  textInput: {
    fontFamily: fonts.Poppins_Regular,
    fontSize: fonts.SIZE_16,
    color: Colors.primary.BLACK,
    flex: 1,
  },
  search_img: {
    height: 16,
    width: 16,
    marginRight: 9,
  },
  renderView: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 16,
  },
  listImg: {
    height: 54,
    width: 54,
    borderRadius: 16,
    overflow: 'hidden',
  },
  nameText: {
    fontFamily: fonts.Poppins_Medium,
    fontSize: fonts.SIZE_16,
    color: Colors.primary.WHITE,
  },
  chatText: {
    fontFamily: fonts.Poppins_Medium,
    fontSize: fonts.SIZE_12,
    marginTop: 4,
  },
  timeText: {
    // fontFamily: fonts.Poppins_Regular,
    // fontSize: fonts.SIZE_12,
    // color: Colors.primary.BLACK,
    // textAlign: 'right',
    fontFamily: fonts.Poppins_Medium,
    fontSize: fonts.SIZE_12,
    color: Colors.primary.WHITE,
    opacity: 0.7,
    textAlign: 'right',
  },
  chatCountView: {
    backgroundColor: Colors.primary.APP_THEME,
    alignSelf: 'flex-end',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 50,
    marginTop: 4,
  },
  chatCountText: {
    fontFamily: fonts.Poppins_Medium,
    fontSize: fonts.SIZE_14,
    color: Colors.primary.WHITE,
    textAlign: 'right',
  },
  lineView: {
    marginLeft: 54,
    marginTop: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.secondary.WATER,
  },
  view_empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  empty_text: {
    fontFamily: fonts.Poppins_Medium,
    fontSize: fonts.SIZE_14,
    color: Colors.primary.WHITE,
  },
  cancelIcon: {
    height: 20,
    width: 20,
    tintColor: Colors.secondary.MONSOON,
  },
  bg_img: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height + 90,
    flex: 1,
    paddingTop: hasNotch() ? 110 : 90,
  },
  Archived_img: {
    height: 28,
    width: 28,
  },
  Archived_text: {
    fontFamily: fonts.Poppins_Medium,
    fontSize: fonts.SIZE_16,
    color: Colors.primary.WHITE,
    marginLeft: 9,
  },
  Archived_view: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 20,
  },
  dot_view: {
    backgroundColor: Colors.secondary.LIGHT_ORANGE,
    height: 10,
    width: 10,
    borderRadius: 10 / 2,
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
  itemContainer: {
    marginBottom: 12,
  },
  cross_icon: {
    width: 20,
    height: 20,
    marginEnd: 5,
  },
  // Add these to your styles
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: Colors.secondary.RED,
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
  },
  retryButton: {
    backgroundColor: Colors.primary.APP_THEME,
    padding: 12,
    borderRadius: 8,
    alignSelf: 'center',
    marginTop: 16,
  },
  retryButtonText: {
    color: Colors.primary.WHITE,
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    color: Colors.secondary.GREY,
    fontSize: 16,
    textAlign: 'center',
  },
  ad_style: {
    position: 'absolute',
  },
});
export default styles;
