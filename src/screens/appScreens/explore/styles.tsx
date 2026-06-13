import {Platform, StyleSheet} from 'react-native';
import {hasNotch} from 'react-native-device-info';
import {Colors, Fonts} from '../../../theme';
import fonts from '../../../theme/fonts';

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: hasNotch() ? 70 : 50,
  },
  headerText: {
    color: Colors.primary.WHITE,
    fontSize: 16,
    fontFamily: fonts.Poppins_Medium,
    marginBottom: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 55,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: Colors.secondary.PURPLE,
    backgroundColor: Colors.secondary.SEARCH_INPUT,
  },
  searchInput: {
    flex: 1,
    color: Colors.primary.WHITE,
    fontSize: fonts.SIZE_14,
    fontFamily: fonts.Poppins_Regular,
    paddingVertical: 0,
    paddingHorizontal: 10,
  },
  filterIcon: {
    width: 20,
    height: 20,
  },
  cross_icon: {
    width: 20,
    height: 20,
    marginEnd: 5,
  },
  searchIcon: {
    width: 14,
    height: 14,
    marginEnd: 5,
  },
  listContent: {
    paddingBottom: 100,
  },
  searchLoader: {
    marginVertical: 20,
  },
  card: {
    borderRadius: 20,
    padding: 12,
    marginBottom: 20,
    borderColor: Colors.secondary.PURPLE,
    borderWidth: 1.5,
    backgroundColor: Colors.primary.APP_THEME_2,
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  onlineIndicator: {
    width: 16,
    height: 16,
    borderRadius: 33,
    backgroundColor: Colors.secondary.GREEN,
    position: 'absolute',
    top: -4,
    left: -4,
    borderWidth: 3,
    borderColor: Colors.primary.BLACK,
  },
  infoContainer: {
    marginLeft: 12,
    justifyContent: 'center',
    flex: 1,
  },
  name: {
    color: Colors.primary.WHITE,
    fontSize: 18,
    textTransform: 'capitalize',
    fontFamily: Fonts.Poppins_Light,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  icon: {
    width: 14,
    height: 16,
    marginLeft: 1,
  },
  infoText: {
    color: 'white',
    fontSize: 14,
    marginEnd: 10,
  },
  actionRow: {
    flexDirection: 'row',
    marginTop: 10,
    gap: 20,
  },
  actionCircle: {
    width: 40,
    height: 40,
    borderRadius: 22.5,
    backgroundColor: '#2b3367',
    justifyContent: 'center',
    alignItems: 'center',
  },
  likeButton: {
    backgroundColor: Colors.secondary.RED,
  },
  actionIcon: {
    width: 40,
    height: 40,
  },
  tagsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 12,
    flexWrap: 'wrap',
  },
  tag: {
    backgroundColor: Colors.secondary.TAG_BG,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
    color: Colors.primary.WHITE,
    fontSize: 14,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    color: Colors.primary.WHITE,
    fontFamily: fonts.Poppins_Medium,
  },
  footerContainer: {
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  defaultFooter: {
    height: 120,
  },
  exclamatoryMark: {
    fontWeight: 'bold',
  },
  clearButton: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  clearIcon: {
    width: 20,
    height: 20,
    tintColor: '#ccc',
  },
  // Add to your styles
  filterButtonActive: {
    backgroundColor: Colors.primary.APP_THEME + '20', // 20% opacity
    borderRadius: 8,
    padding: 4,
  },
  filterBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.secondary.RED,
  },
  resetButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: Colors.primary.APP_THEME,
    borderRadius: 8,
  },
  resetButtonText: {
    color: Colors.primary.WHITE,
    fontSize: 14,
  },
  disabledActionRow: {
    opacity: 0.4,
    tintColor: '#555',
  },
  disableddisLikeActionRow: {
    opacity: 0.4,
  },
  ad_style: {
    position: 'absolute',
  },
});

export default styles;
