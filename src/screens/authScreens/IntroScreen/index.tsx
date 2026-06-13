import React from 'react';
import { Image, View } from 'react-native';
import { AppButton, Background } from '../../../components';
import { Colors } from '../../../theme';
import imagePath from '../../../theme/imagePath';
import styles from './styles';

const Intro = (props: any) => {
  return (
    <Background backgroundImage={imagePath.intro_image}>
      <View style={styles.container}>
        <Image
          source={imagePath.logo}
          resizeMode={'contain'}
          style={styles.logo_image}
        />
        <Image
          source={imagePath.intro_icon}
          resizeMode={'contain'}
          style={styles.intro_icon}
        />

        <View style={styles.button_container}>
          <AppButton
            title="Log in"
            onPress={() => props.navigation.navigate('Login')}
            buttonStyle={styles.button_one}
          />
          <AppButton
            title="Sign Up"
            linearColor={Colors.primary.WHITE}
            linearColorEnd={Colors.primary.WHITE}
            onPress={() =>
              props.navigation.navigate('Signup', {
                isIntro: true,
              })
            }
            textStyle={styles.buttonText}
            buttonStyle={styles.button_two}
          />
        </View>
      </View>
    </Background>
  );
};

export default Intro;
