import {StyleSheet, Dimensions} from 'react-native';
import {hasNotch} from 'react-native-device-info';
import fonts from '../../../theme/fonts';
import {Colors} from '../../../theme';

const {width, height} = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width,
    height,
  },
  contentContainer: {
    flex: 1,
    // paddingTop: hasNotch() ? 20 : 10,
    paddingBottom: 30,
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  logo: {
    width: 220,
    height: 100,
    
  },
  centerImage: {
    width: 280,
    height: 300,
     
  },
  welcomeText: {
    fontSize: 24,
    fontFamily: fonts.Poppins_Bold,
    color: Colors.primary.WHITE,
    marginTop: 40,
    textAlign: 'center',
  },
  subText: {
    fontSize: 16,
    fontFamily: fonts.Poppins_Regular,
    color: Colors.primary.WHITE,
    
    textAlign: 'center',
  },
   
});

export default styles;
