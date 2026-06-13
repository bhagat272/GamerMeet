import React, {useMemo} from 'react';
import {
  Text,
  StyleSheet,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
} from 'react-native';
import {Colors, Fonts} from '../theme';
import {Flow} from 'react-native-animated-spinkit';
import LinearGradient from 'react-native-linear-gradient';

interface AppButtonProps extends TouchableOpacityProps {
  isLoading?: boolean;
  onPress: () => void;
  disabled?: boolean;
  buttonStyle?: object;
  title?: string;
  textStyle?: object;
  color?: string;
  linearColor?: string;
  linearColorEnd?: string;
}

const AppButton: React.FC<AppButtonProps> = React.memo(
  ({
    isLoading = false,
    onPress,
    disabled,
    buttonStyle,
    title,
    textStyle,
    color,
    linearColor,
    linearColorEnd,
  }) => {
    const gradientColors = useMemo(
      () =>
        linearColor
          ? linearColorEnd
            ? [linearColor, linearColorEnd]
            : [linearColor, linearColor]
          : [Colors.primary.GRADIENT1, Colors.primary.APP_THEME],
      [linearColor, linearColorEnd],
    );

    return (
      <TouchableOpacity
        disabled={disabled || isLoading}
        activeOpacity={0.8}
        onPress={onPress}
        style={styles.touch_style}>
        <LinearGradient
          colors={gradientColors}
          start={{x: 0.2, y: 1}}
          end={{x: 1, y: 0}}
          style={[styles.btn_style, buttonStyle]}>
          <View
            // eslint-disable-next-line react-native/no-inline-styles
            style={{
              position: 'absolute',
              alignSelf: 'center',

              zIndex: 2,
              justifyContent: 'center',
            }}>
            {isLoading ? (
              <Flow color={color ?? Colors.primary.WHITE} size={40} />
            ) : (
              <Text style={[styles.title_style, textStyle]}>{title}</Text>
            )}
          </View>
        </LinearGradient>
      </TouchableOpacity>
    );
  },
);

export default AppButton;

const styles = StyleSheet.create({
  btn_style: {
    height: 60,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    // overflow: 'visible',
  },
  title_style: {
    fontSize: Fonts.SIZE_16,
    fontFamily: Fonts.Poppins_SemiBold,
    textAlign: 'center',
    color: Colors.primary.WHITE,
  },
  touch_style: {
    width: '90%',
    alignSelf: 'center',
    marginVertical: 5,
    marginBottom: 20,
  },
});
