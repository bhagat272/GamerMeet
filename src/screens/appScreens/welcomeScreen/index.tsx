import React, { useEffect } from 'react';
import { Image, Text, View } from 'react-native';
import { useSelector } from 'react-redux';
import { Background } from '../../../components';
import { handleSetRoot } from '../../../navigation/navigationService';
import imagePath from '../../../theme/imagePath';
import styles from './styles';
import { translateText } from '../../../utils/language';

const WelcomeScreen = () => {
  const {userData} = useSelector((state: any) => state.session);
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (userData) {
        handleSetRoot({name: 'BottomTab'}); 
      } else {
        handleSetRoot({name: 'IntroScreen'});
      }
    }, 2000);

    return () => clearTimeout(timeout);
  }, []);


  return (
    <Background>
      <View style={styles.contentContainer}>
        <Image
          source={imagePath.logo}
          style={styles.logo}
          resizeMode="contain"
        />
        <View>
          <Image
            source={imagePath.game_icon}
            style={styles.centerImage}
            resizeMode="contain"
          />
          <View>
            <Text style={styles.welcomeText}>
              Hello, Welcome {userData?.username || 'User'}
            </Text>
            <Text style={styles.subText}>
              {translateText('your_profile_is_all_set_up!')}
            </Text>
          </View>
        </View>
      </View>
    </Background>
  );
};

export default WelcomeScreen;
