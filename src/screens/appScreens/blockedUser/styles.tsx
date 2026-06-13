import {StyleSheet} from 'react-native';
import {Colors, Fonts} from '../../../theme';
import {hasNotch} from 'react-native-device-info';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: hasNotch() ? 14 : 40,
  },
  header: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 20,
    alignItems: 'center',
  },
  backIcon: {
    fontSize: 20,
    color: Colors.primary.WHITE,
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 18,
    color: Colors.primary.WHITE,
    fontFamily: Fonts.Poppins_SemiBold,
  },
  list: {
    flex: 1,
    paddingHorizontal: 0,
  },

  profile_info_view: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',

    borderBottomColor: Colors.secondary.HEADER_BOTTOM_COLOR,
    borderBottomWidth: 1,
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
  emptyListContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  emptyText: {
    fontSize: 16,
    color: Colors.secondary.GREY,
    textAlign: 'center',
  },
  loader: {
    marginVertical: 12,
  },
});

export default styles;
