import React from 'react';
import {
  GestureResponderEvent,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { Flow } from 'react-native-animated-spinkit';
import { Colors, Fonts } from '../../../theme';
import imagePath from '../../../theme/imagePath';

interface HomeHeaderProps {
  userName: string;
  location: string;
  onLocationPress: (event: GestureResponderEvent) => void;
  onNotificationPress?: () => void;
  loadingLocation?: boolean;
  notificationCount?:string | number;
}

const HomeHeader = ({
  userName,
  location,
  onLocationPress,
  onNotificationPress,
  notificationCount,
  loadingLocation = false, // default false
}: HomeHeaderProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.leftContent}>
        <Text style={styles.welcomeText} numberOfLines={1} ellipsizeMode="tail">
          Hello, <Text style={styles.boldText}>{userName} 👋</Text>
        </Text>

        <TouchableOpacity style={styles.locationRow} onPress={onLocationPress}>
          {loadingLocation ? (
            <>
              <Text style={styles.locationText}>Please wait</Text>
              <View>
                <Flow
                  color={Colors.primary.WHITE}
                  size={30}
                  style={styles.loader}
                />
              </View>
            </>
          ) : (
            <>
              <Text
                style={styles.locationText}
                numberOfLines={1}
                ellipsizeMode="tail">
                {location}
              </Text>
              <Image source={imagePath.right_arrow} style={styles.downArrow} />
            </>
          )}
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={onNotificationPress} style={styles.bellButton}>
        <Image
          source={imagePath.bell_icon} // Replace with your notification bell icon
          style={styles.bellIcon}
        />
        {notificationCount > 0 && (
          <View style={styles.notificationBadge}>
            <Text style={styles.notificationText}>{notificationCount}</Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default HomeHeader;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  welcomeText: {
    fontSize: 18,
    color: Colors.primary.WHITE,
    fontFamily: Fonts.Poppins_SemiBold,
  },
  boldText: {
    fontFamily: Fonts.Poppins_SemiBold,
    textTransform: 'capitalize',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  locationText: {
    fontSize: 14,
    color: Colors.primary.WHITE,
    marginRight: 4,
    fontFamily: Fonts.Poppins_Regular,
  },
  downArrow: {
    width: 20,
    height: 20,
    tintColor: Colors.primary.WHITE,
    transform: [{rotate: '90deg'}],
    alignSelf: 'center',
  },
  bellButton: {},

  bellIcon: {
    width: 40,
    height: 40,
  },
  leftContent: {
    flex: 1,
    marginRight: 10,
  },
  loader: {
    marginTop: 6,
  },
  notificationBadge: {
    position: 'absolute',
    right: -6,
    top: -3,
    backgroundColor: 'red',
    borderRadius: 10,
    width: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
});
