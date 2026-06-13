import React, {useState} from 'react';
import {Image, ScrollView, Text, TouchableOpacity, View} from 'react-native';
// import  * as ImagePicker
// import Stepper from '../components/Stepper';
import {AppButton, Background, Stepper} from '../../../components';
import imagePath from '../../../theme/imagePath';
import styles from './styles';
import {showToastMessage} from '../../../utils/toast';
import { translateText } from '../../../utils/language';

const MAX_IMAGES = 5;

const ProfileSetup = (props: any) => {
  const [images, setImages] = useState<string[]>(Array(MAX_IMAGES).fill(''));

  const methodUploadImage = (index: number) => {
    props.navigation.navigate('ImageController', {
      mediaType: 'photo',
      onSuccess: (res: any) => {
        if (res?.path) {
          setImages(prev => {
            const updated = [...prev];
            updated[index] = res.path;
            return updated;
          });
        }
      },
    });
  };

  const handleContinue = () => {
    const selectedImages = images.filter(img => img !== '');

    if (!images[0]) {
      showToastMessage(translateText('please_upload_the_first_image'), 'danger');
      return;
    }

    if (selectedImages.length < 1) {
      showToastMessage(translateText('please_upload_at_least_1_image'), 'danger');
      return;
    }

    props.navigation.navigate('ProfileSetupTwo', {
      profileImages: selectedImages,
    });
  };

  return (
    <Background>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          <Text style={styles.subtitle}>
            {translateText('lets_get_started')}
          </Text>
          <Text style={styles.title}>
            {translateText('set_up_your_profile')}
          </Text>
          <Stepper currentStep={1} />
          <Text style={styles.label}>
            {translateText('add_some_pictures_of_yourself')}
          </Text>
          <Text style={styles.helper}>
            {translateText('upload_up_to_5_of_your_best')}
          </Text>

          <View style={styles.grid}>
            {images.map((imgUri, index) => (
              <TouchableOpacity
                onPress={() => methodUploadImage(index)}
                key={index}
                style={imgUri ? styles.imageSet : styles.imageSlot}>
                {imgUri ? (
                  <Image source={{uri: imgUri}} style={styles.image} />
                ) : (
                  <Image
                    source={imagePath.add_photo_icon}
                    style={styles.AddIcon}
                  />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>
        <AppButton
          title="Continue"
          onPress={handleContinue}
          buttonStyle={styles.button}
        />
      </ScrollView>
    </Background>
  );
};

export default ProfileSetup;
