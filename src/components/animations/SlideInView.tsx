/**
 * @author Nguyễn Tuấn
 * @created 2024-12-19
 * @component SlideInView
 */

import React, { useEffect, useRef } from 'react';
import { ViewStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  Easing,
} from 'react-native-reanimated';
import { ANIMATION_CONSTANTS } from '../../core/constants';

type SlideDirection = 'left' | 'right' | 'top' | 'bottom';

interface SlideInViewProps {
  children: React.ReactNode;
  direction?: SlideDirection;
  delay?: number;
  duration?: number;
  distance?: number;
  style?: ViewStyle;
}

const SlideInView: React.FC<SlideInViewProps> = ({
  children,
  direction = 'bottom',
  delay = 0,
  duration = ANIMATION_CONSTANTS.DURATION.NORMAL,
  distance = 50,
  style,
}) => {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const opacity = useSharedValue(0);

  useEffect(() => {
    // Set initial position based on direction
    switch (direction) {
      case 'left':
        translateX.value = -distance;
        break;
      case 'right':
        translateX.value = distance;
        break;
      case 'top':
        translateY.value = -distance;
        break;
      case 'bottom':
        translateY.value = distance;
        break;
    }

    // Animate to final position
    const animationConfig = {
      duration,
      easing: Easing.out(Easing.cubic),
    };

    opacity.value = withDelay(
      delay,
      withTiming(1, animationConfig)
    );

    translateX.value = withDelay(
      delay,
      withTiming(0, animationConfig)
    );

    translateY.value = withDelay(
      delay,
      withTiming(0, animationConfig)
    );
  }, [direction, delay, duration, distance]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
    ],
  }));

  return (
    <Animated.View style={[animatedStyle, style]}>
      {children}
    </Animated.View>
  );
};

export default SlideInView; 