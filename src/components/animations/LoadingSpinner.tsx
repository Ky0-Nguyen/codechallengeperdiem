/**
 * @author Nguyễn Tuấn
 * @created 2024-12-19
 * @component LoadingSpinner
 */

import React, { useEffect, useRef } from 'react';
import { View, ViewStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { COLORS } from '../../core/theme';

interface LoadingSpinnerProps {
  size?: number;
  color?: string;
  style?: ViewStyle;
  duration?: number;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 24,
  color = COLORS.PRIMARY,
  style,
  duration = 1000,
}) => {
  const rotation = useSharedValue(0);

  useEffect(() => {
    rotation.value = withRepeat(
      withTiming(360, {
        duration,
        easing: Easing.linear,
      }),
      -1, // Infinite repeat
      false
    );
  }, [duration]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  return (
    <Animated.View
      style={[
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          borderWidth: 2,
          borderColor: color,
          borderTopColor: 'transparent',
        },
        animatedStyle,
        style,
      ]}
    />
  );
};

export default LoadingSpinner; 