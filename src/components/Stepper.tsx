import React from 'react';
import {Image, Platform, StyleSheet, View, ViewStyle} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {Colors} from '../theme';
import imagePath from '../theme/imagePath';

interface StepperProps {
  currentStep?: number;
  style?: ViewStyle | ViewStyle[];
}

const Stepper: React.FC<StepperProps> = ({currentStep = 0, style}) => {
  const totalSteps = 3;

  return (
    <View style={[styles.container, style]}>
      {Array.from({length: totalSteps}).map((_, index) => {
        const isCompleted = index < currentStep;
        const isCurrent = index === currentStep;

        return (
          <React.Fragment key={index}>
            <View
              style={[
                styles.circle,
                isCompleted ? styles.circleCompleted : styles.circleEmpty,
                isCurrent && !isCompleted && styles.circleCurrent,
              ]}>
              {isCompleted ? (
                <Image
                  source={imagePath.check_circle_fill}
                  style={styles.checkIcon}
                />
              ) : (
                <View style={styles.innerCircle} />
              )}
            </View>

            {index !== totalSteps - 1 && (
              <View style={styles.lineWrapper}>
                {currentStep > index + 1 ? (
                  <View style={styles.lineSolid} />
                ) : currentStep > index ? (
                  <LinearGradient
                    colors={[Colors.primary.APP_THEME, '#3671A1']}
                    start={{x: 0, y: 0}}
                    end={{x: 1, y: 0}}
                    style={styles.line}
                  />
                ) : (
                  <View style={styles.lineInactive} />
                )}
              </View>
            )}
          </React.Fragment>
        );
      })}
    </View>
  );
};

export default Stepper;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 26,
    justifyContent: 'center',
  },
  lineWrapper: {
    marginHorizontal: -3,
    alignItems: 'center',
    justifyContent: 'center',
  },

  circle: {
    width: 22,
    height: 22,
    borderRadius: 12,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  circleCompleted: {
    backgroundColor: Colors.secondary.ORANGE,
    borderColor: Colors.secondary.ORANGE,
  },
  circleEmpty: {
    backgroundColor: '#08335C',
    borderColor: 'rgba(255,255,255,0.3)',
  },
  circleCurrent: {
    // borderColor: Colors.secondary.ORANGE,
  },
  innerCircle: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },

  checkIcon: {
    width: 22,
    height: 22,
    resizeMode: 'contain',
    zIndex: 100,
  },
  line: {
    width: 133,
    height: 4,
    // borderRadius: 2,
  },
  lineInactive: {
    width: 144,
    height: 4,
    backgroundColor: '#3671A1',
    opacity: 0.3,
    borderRadius: 2,
  },
  lineSolid: {
    width: 144,
    height: 4,
    backgroundColor: Colors.primary.APP_THEME,
    borderRadius: 2,
  },
});
