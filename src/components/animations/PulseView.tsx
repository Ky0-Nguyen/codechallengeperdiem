/**
 * @author Nguyễn Tuấn
 * @created 2024-12-19
 * @component PulseView
 */

import React, { useEffect, useRef } from 'react';
import { ViewStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
} from 'react-native-reanimated';
import { ANIMATION_CONSTANTS } from '../../core/constants';

interface PulseViewProps {
  children: React.ReactNode;
  duration?: number;
  scale?: number;
  repeatCount?: number;
  style?: ViewStyle;
  onPress?: () => void;
}

const PulseView: React.FC<PulseViewProps> = ({
  children,
  duration = 1000,
  scale = 1.05,
  repeatCount = -1, // -1 for infinite
  style,
  onPress,
}) => {
  const scaleValue = useSharedValue(1);

  useEffect(() => {
    scaleValue.value = withRepeat(
      withSequence(
        withTiming(scale, {
          duration: duration / 2,
          easing: Easing.out(Easing.cubic),
        }),
        withTiming(1, {
          duration: duration / 2,
          easing: Easing.in(Easing.cubic),
        })
      ),
      repeatCount,
      false
    );
  }, [duration, scale, repeatCount]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scaleValue.value }],
  }));

  return (
    <Animated.View style={[animatedStyle, style]} onTouchEnd={onPress}>
      {children}
    </Animated.View>
  );
};

export default PulseView; 