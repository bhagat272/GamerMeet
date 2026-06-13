import React from 'react';
import styles from './styles';
import {Image, Text, TouchableOpacity, View} from 'react-native';
import {ImageLoadView} from '../../../components';
import {IMAGE_URL} from '../../../redux/apis/commonValue';
import imagePath from '../../../theme/imagePath';
import {ProfileData} from './index';
import {showToastMessage} from '../../../utils/toast';
import {translateText} from '../../../utils/language';

const ExploreCard = React.memo(
  ({
    item,
    handlePush,
    handleReaction,
    disableActions = false,
  }: {
    item: ProfileData;
    handlePush: any;
    handleReaction: any;
    disableActions: boolean;
  }) => {
    const showMessage = () => {
      showToastMessage(
        translateText('you_must_unhide_your_profile'),
        'warning',
      );
    };

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() =>
          handlePush({
            name: 'GamerDetail',
            params: {gamerId: item?._id, check_withdraw: '0'},
          })
        }>
        <View style={styles.cardTop}>
          <View style={styles.avatarContainer}>
            <ImageLoadView
              source={
                item?.avatar.length > 0
                  ? {uri: IMAGE_URL + item.avatar[0]?.avatar_url}
                  : imagePath.user_icon
              }
              style={styles.avatar}
            />
            {item.is_online && <View style={styles.onlineIndicator} />}
          </View>

          <View style={styles.infoContainer}>
            <Text style={styles.name}>
              {item?.username.length > 10
                ? item?.username.substring(0, 10) + '...'
                : item?.username}{' '}
              <Text style={styles.exclamatoryMark}>|</Text> {item?.age}
            </Text>

            <View style={styles.infoRow}>
              <Image source={imagePath.gps_icon} style={styles.icon} />
              <Text style={styles.infoText}>{' ' + item.distance} mi</Text>
              <Image source={imagePath.verfied_icon} style={styles.icon} />
              <Text style={styles.infoText}>
                {' ' + item.match_percentage}%
              </Text>
            </View>

            <View style={styles.actionRow}>
              <TouchableOpacity
                style={styles.actionCircle}
                onPress={() =>
                  disableActions
                    ? showMessage()
                    : handleReaction(item._id, 'dislike')
                }>
                <Image
                  source={imagePath.cross_icon}
                  style={[
                    styles.actionIcon,
                    disableActions && styles.disableddisLikeActionRow,
                  ]}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.actionCircle,
                  styles.likeButton,
                  disableActions && styles.disabledActionRow,
                ]}
                onPress={() =>
                  disableActions
                    ? showMessage()
                    : handleReaction(item._id, 'like')
                }>
                <Image source={imagePath.like_icon} style={styles.actionIcon} />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.tagsRow}>
          {item?.game_genre?.slice(0, 2).map((game, index) => (
            <Text key={index} style={styles.tag}>
              {game?.name.length > 15
                ? game?.name.substring(0, 15) + '...'
                : game?.name}
            </Text>
          ))}
          {item?.game_genre?.length > 2 && (
            <Text style={styles.tag}>
              +{item.game_genre.length - 2} {translateText('more')}
            </Text>
          )}
        </View>
      </TouchableOpacity>
    );
  },
);

export default ExploreCard;
