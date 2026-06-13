import React, {ReactNode} from 'react';
import {View, StyleSheet, TouchableOpacity, ViewStyle} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

interface GrdaientBorderProps {
  type?: 'container' | 'tag';
  children?: ReactNode;
  onPress?: () => void;
  containerStyle?: ViewStyle;
  innerStyle?: ViewStyle;
  isSelected?: boolean; // Add this new prop
}

const GrdaientBorder: React.FC<GrdaientBorderProps> = ({
  type = 'container',
  children,
  onPress = () => {},
  containerStyle = {},
  innerStyle = {},
  isSelected = false, // Default to false
}) => {
  if (type === 'tag') {
    return (
      <LinearGradient
        colors={
          isSelected
            ? ['transparent', 'transparent', 'transparent']
            : ['#474C86', '#7078E6', '#32377D']
        }
        start={{x: 0, y: 0}}
        end={{x: 1, y: 0}}
        style={[styles.gradientBorderTag, containerStyle]}>
        <TouchableOpacity
          style={[styles.tagButton, innerStyle]}
          onPress={onPress}>
          {children}
        </TouchableOpacity>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={
        isSelected
          ? ['transparent', 'transparent', 'transparent']
          : ['#32377D', '#7078E6', '#32377D']
      }
      angle={30}
      useAngle={true}
      style={[styles.gradientBorderContainer, containerStyle]}>
      <View style={[styles.innerContainer, innerStyle]}>{children}</View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradientBorderContainer: {
    borderRadius: 6,
    padding: 1.5,
    marginBottom: 15,
    backgroundColor: 'transparent',
  },
  innerContainer: {
    borderRadius: 6,

    backgroundColor: 'rgba(23, 34, 76, 0.7)',
    overflow: 'hidden',
  },
  gradientBorderTag: {
    padding: 1.5,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginRight: 8,
  },
  tagButton: {
    backgroundColor: '#2B2F77',
    borderRadius: 10,
    paddingVertical: 6,
    paddingHorizontal: 16,
  },
});

export default GrdaientBorder;
