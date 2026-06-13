import React from 'react';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Background } from '../../../components';
import imagePath from '../../../theme/imagePath';
import { translateText } from '../../../utils/language';
import styles from './styles';

const Settings = (props: any) => {
  const dispatch = useDispatch();
  const {userData} = useSelector((state: any) => state.session);
  console.log('userData>>>', userData);

  return (
    <Background>
      <ScrollView bounces={false} showsVerticalScrollIndicator={false}>
        <View style={styles.profile_info_view}>
          <TouchableOpacity
            style={styles.image_container_view}
            onPress={() => props.navigation.goBack()}>
            <Image source={imagePath.back_icon} style={styles.back} />
          </TouchableOpacity>
          <View style={styles.profile_name_email_view}>
            <Text style={styles.user_name_text}>
              {translateText('settings')}
            </Text>
          </View>
        </View>

        <View style={styles.account_section_view}>
          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.account_section_sub_view}
            onPress={() => {
              props.navigation.navigate('CmsScreen', {
                title: 'About Us',
              });
            }}>
            <Image
              source={imagePath.about_icon}
              resizeMode={'contain'}
              style={styles.account_section_images_style}
            />

            <View style={styles.account_section_text_container_view}>
              <Text style={styles.account_section_text_style}>
                {translateText('about_us')}
              </Text>
              <Image
                source={imagePath.right_arrow}
                resizeMode={'contain'}
                style={styles.arrow_image}
              />
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.account_section_sub_view}
            onPress={() => {
              props.navigation.navigate('CmsScreen', {
                title: 'Privacy Policy',
              });
            }}>
            <Image
              source={imagePath.privacy_policy_icon}
              resizeMode={'contain'}
              style={styles.account_section_images_style}
            />

            <View style={styles.account_section_text_container_view}>
              <Text style={styles.account_section_text_style}>
                {translateText('privacy_policy')}
              </Text>
              <Image
                source={imagePath.right_arrow}
                resizeMode={'contain'}
                style={styles.arrow_image}
              />
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.account_section_sub_view}
            onPress={() => {
              props.navigation.navigate('CmsScreen', {
                title: 'Terms & Conditions',
              });
            }}>
            <Image
              source={imagePath.t_c_icon}
              resizeMode={'contain'}
              style={styles.account_section_images_style}
            />

            <View style={styles.account_section_text_container_view}>
              <Text style={styles.account_section_text_style}>
                {translateText('terms_&_conditions')}
              </Text>
              <Image
                source={imagePath.right_arrow}
                resizeMode={'contain'}
                style={styles.arrow_image}
              />
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              props.navigation.navigate('BlockedUser');
            }}
            style={styles.account_section_sub_view}>
            <Image
              source={imagePath.blocked_user}
              resizeMode={'contain'}
              style={styles.account_section_images_style}
            />

            <View style={styles.account_section_text_container_view}>
              <Text style={styles.account_section_text_style}>
                {'Blocked users'}
              </Text>
              <Image
                source={imagePath.right_arrow}
                resizeMode={'contain'}
                style={styles.arrow_image}
              />
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              props.navigation.navigate('ChangePassword');
            }}
            style={styles.account_section_sub_view}>
            <Image
              source={imagePath.change_password}
              resizeMode={'contain'}
              style={styles.account_section_images_style}
            />

            <View style={styles.account_section_text_container_view}>
              <Text style={styles.account_section_text_style}>
                {translateText('change_password')}
              </Text>
              <Image
                source={imagePath.right_arrow}
                resizeMode={'contain'}
                style={styles.arrow_image}
              />
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.account_section_sub_view}
            onPress={() => {
              props.navigation.navigate('DeleteAccount');
            }}>
            <Image
              source={imagePath.delete_account}
              resizeMode={'contain'}
              style={styles.account_section_images_style}
            />

            <View
              style={{
                ...styles.account_section_text_container_view,
                borderBottomWidth: 0,
              }}>
              <Text style={styles.account_section_text_style}>
                {translateText('delete_account')}
              </Text>
              <Image
                source={imagePath.right_arrow}
                resizeMode={'contain'}
                style={styles.arrow_image}
              />
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </Background>
  );
};

export default Settings;
