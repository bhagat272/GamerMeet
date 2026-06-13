import {
  View,
  StyleSheet,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  Text,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {hasNotch} from 'react-native-device-info';
import {Colors, Fonts} from '../../../theme';
import {AppHeader, Background} from '../../../components';
import imagePath from '../../../theme/imagePath';
import WebView from 'react-native-webview';
import {
  ABOUT_US,
  PRIVACY_POLICY,
  TERMS_AND_CONDITIONS,
} from '../../../redux/apis/commonValue';

const CmsScreen = (props: any) => {
  const {title} = props?.route?.params ? props?.route?.params : '';
  const [isLoading, setIsLoading] = useState(true);

  return (
    <Background>
      <View style={styles.container}>
        <View style={styles.profile_info_view}>
          <TouchableOpacity
            style={styles.image_container_view}
            onPress={() => props.navigation.goBack()}>
            <Image source={imagePath.back_icon} style={styles.back} />
          </TouchableOpacity>
          <View style={styles.profile_name_email_view}>
            <Text style={styles.user_name_text}>{title}</Text>
          </View>
        </View>
        {/* <Image
          resizeMode="contain"
          style={styles.logo}
          source={imagePath.logo}
        /> */}

        {isLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors.primary.WHITE} />
          </View>
        )}

        <WebView
          style={styles.webview}
          source={{
            uri:
              title === 'About Us'
                ? ABOUT_US
                : title === 'Terms & Conditions'
                ? TERMS_AND_CONDITIONS
                : PRIVACY_POLICY,
          }}
          onLoadEnd={() => setIsLoading(false)}
          onLoadStart={() => setIsLoading(true)}
          startInLoadingState={false} // We're handling loading manually
          javaScriptEnabled={true}
          originWhitelist={['*']}
          automaticallyAdjustContentInsets={false}
          domStorageEnabled={true}
          scrollEnabled={true}
          scalesPageToFit={true}
          mixedContentMode="always"
          overScrollMode="never"
          allowsFullscreenVideo={false}
          allowsLinkPreview={false}
          injectedJavaScriptBeforeContentLoaded={`
            window.addEventListener('DOMContentLoaded', function() {
              var style = document.createElement('style');
              style.innerHTML = \`
                body {
                  background-color: transparent !important;
                  color: ${Colors.primary.WHITE} !important;
                }
                html {
                  background-color: transparent !important;
                }
                * {
                  color: ${Colors.primary.WHITE} !important;
                }
              \`;
              document.head.appendChild(style);
            });
            true;
          `}
          injectedJavaScript={`
            (function() {
              function applyStyles() {
                document.body.style.backgroundColor = 'transparent';
                document.body.style.color = '${Colors.primary.WHITE}';
                
                var allElements = document.querySelectorAll('*');
                for (var i = 0; i < allElements.length; i++) {
                  allElements[i].style.backgroundColor = 'transparent';
                  allElements[i].style.color = '${Colors.primary.WHITE}';
                }
              }
              
              applyStyles();
              
              // Reapply styles periodically to catch dynamically loaded content
              setInterval(applyStyles, 200);
            })();
            
            true;
          `}
          contentMode={'mobile'}
          containerStyle={styles.webview}
          androidLayerType="software" // Important for Android transparency
        />
      </View>
    </Background>
  );
};

export default CmsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: hasNotch() ? 50 : 40,
    backgroundColor: 'transparent',
  },
  webview: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  logo: {
    height: 100,
    width: 200,
    alignSelf: 'center',
  },
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    zIndex: 1,
  },
  profile_info_view: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',

    borderBottomColor: Colors.secondary.HEADER_BOTTOM_COLOR,
    borderBottomWidth: 1,
    marginBottom: 30,
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
  back: {
    width: 24,
    height: 24,
  },
  image_container_view: {
    height: 70,
    width: 70,

    justifyContent: 'center',
    alignItems: 'center',
  },
});
