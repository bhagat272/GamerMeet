import {StyleSheet} from 'react-native';
import {Colors} from '../../../theme';
import fonts from '../../../theme/fonts';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  user_image: {
    height: 114,
    width: 114,
    borderRadius: 114 / 2,
    overflow: 'hidden',
    alignSelf: 'center',
    marginBottom: 40,
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
  profile_image_style: {
    height: 114,
    width: 114,
    borderRadius: 114 / 2,
    overflow: 'hidden',
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
});

export default styles;
