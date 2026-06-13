import React from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Colors, Fonts} from '../../../theme';
import {translateText} from '../../../utils/language';
import imagePath from '../../../theme/imagePath';
import {ImageLoadView} from '../../../components';

const BlockedCard = ({name, avatar, onUnblock}: any) => {
  return (
    <View style={styles.container}>
      <View style={styles.profileBox}>
        <ImageLoadView
          source={avatar ? {uri: avatar} : imagePath.user_icon}
          style={styles.avatar}
        />
        <Text style={styles.name}>{name}</Text>
      </View>

      <TouchableOpacity style={styles.unblockBtn} onPress={onUnblock}>
        <Text style={styles.unblockText}>{translateText('unblock')}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default BlockedCard;

const styles = StyleSheet.create({
  container: {
    padding: 12,
    marginHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  profileBox: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 55,
    height: 55,
    borderRadius: 65,
    marginRight: 10,
  },
  name: {
    color: Colors.primary.WHITE,
    fontSize: 14,
    fontFamily: Fonts.Poppins_Medium,
  },
  unblockBtn: {
    backgroundColor: Colors.primary.APP_THEME,
    padding: 7,
    borderRadius: 6,
  },
  unblockText: {
    color: Colors.primary.WHITE,
    fontSize: 14,
    fontFamily: Fonts.Poppins_Medium,
  },
});
