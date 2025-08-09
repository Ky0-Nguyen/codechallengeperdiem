/**
 * @author Nguyễn Tuấn
 * @created 2024-12-19
 * @component ScaleInView
 */

import React, { useEffect, useRef } from 'react';
import { ViewStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withSpring,
  Easing,
} from 'react-native-reanimated';
import { ANIMATION_CONSTANTS } from '../../core/constants';

interface ScaleInViewProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  scale?: number;
  useSpring?: boolean;
  style?: ViewStyle;
}

const ScaleInView: React.FC<ScaleInViewProps> = ({
  children,
  delay = 0,
  duration = ANIMATION_CONSTANTS.DURATION.NORMAL,
  scale = 0.8,
  useSpring = false,
  style,
}) => {
  const scaleValue = useSharedValue(scale);
  const opacity = useSharedValue(0);

  useEffect(() => {
    opacity.value = withDelay(
      delay,
      withTiming(1, {
        duration: duration * 0.6,
        easing: Easing.out(Easing.cubic),
      })
    );

    if (useSpring) {
      scaleValue.value = withDelay(
        delay,
        withSpring(1, {
          damping: 15,
          stiffness: 150,
        })
      );
    } else {
      scaleValue.value = withDelay(
        delay,
        withTiming(1, {
          duration,
          easing: Easing.out(Easing.back(1.2)),
        })
      );
    }
  }, [delay, duration, scale, useSpring]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scaleValue.value }],
  }));

  return (
    <Animated.View style={[animatedStyle, style]}>
      {children}
    </Animated.View>
  );
};

export default ScaleInView; 