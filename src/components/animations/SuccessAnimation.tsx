/**
 * @author Nguyễn Tuấn
 * @created 2024-12-19
 * @component SuccessAnimation
 */

import React, { useEffect, useRef } from 'react';
import { View, ViewStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withDelay,
  Easing,
} from 'react-native-reanimated';
import { COLORS } from '../../core/theme';

interface SuccessAnimationProps {
  size?: number;
  color?: string;
  style?: ViewStyle;
}

const SuccessAnimation: React.FC<SuccessAnimationProps> = ({
  size = 60,
  color = COLORS.SUCCESS,
  style,
}) => {
  const scale = useSharedValue(0);
  const checkmarkOpacity = useSharedValue(0);
  const checkmarkScale = useSharedValue(0);

  useEffect(() => {
    // Animate circle scale
    scale.value = withSequence(
      withTiming(1.2, {
        duration: 300,
        easing: Easing.out(Easing.cubic),
      }),
      withTiming(1, {
        duration: 200,
        easing: Easing.out(Easing.cubic),
      })
    );

    // Animate checkmark
    checkmarkOpacity.value = withDelay(
      400,
      withTiming(1, {
        duration: 200,
        easing: Easing.out(Easing.cubic),
      })
    );

    checkmarkScale.value = withDelay(
      400,
      withSequence(
        withTiming(1.2, {
          duration: 150,
          easing: Easing.out(Easing.cubic),
        }),
        withTiming(1, {
          duration: 150,
          easing: Easing.out(Easing.cubic),
        })
      )
    );
  }, []);

  const circleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const checkmarkStyle = useAnimatedStyle(() => ({
    opacity: checkmarkOpacity.value,
    transform: [{ scale: checkmarkScale.value }],
  }));

  return (
    <Animated.View style={[circleStyle, style]}>
      <View
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: color,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Animated.View style={checkmarkStyle}>
          <View
            style={{
              width: size * 0.4,
              height: size * 0.25,
              borderLeftWidth: 3,
              borderBottomWidth: 3,
              borderColor: 'white',
              transform: [{ rotate: '-45deg' }],
            }}
          />
        </Animated.View>
      </View>
    </Animated.View>
  );
};

export default SuccessAnimation; 