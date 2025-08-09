/**
 * @author Nguyễn Tuấn
 * @created 2024-12-19
 * @component AnimatedButton
 */

import React, { useEffect, useRef } from 'react';
import { TouchableOpacity, Text, ViewStyle, TextStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  Easing,
} from 'react-native-reanimated';
import { ANIMATION_CONSTANTS } from '../../core/constants';

interface AnimatedButtonProps {
  title: string;
  onPress: () => void;
  style?: ViewStyle;
  textStyle?: TextStyle;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
}

const AnimatedButton: React.FC<AnimatedButtonProps> = ({
  title,
  onPress,
  style,
  textStyle,
  disabled = false,
  variant = 'primary',
  size = 'medium',
}) => {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const handlePressIn = () => {
    if (!disabled) {
      scale.value = withTiming(0.95, {
        duration: ANIMATION_CONSTANTS.DURATION.FAST,
        easing: Easing.out(Easing.cubic),
      });
    }
  };

  const handlePressOut = () => {
    if (!disabled) {
      scale.value = withSequence(
        withTiming(1.05, {
          duration: ANIMATION_CONSTANTS.DURATION.FAST,
          easing: Easing.out(Easing.cubic),
        }),
        withTiming(1, {
          duration: ANIMATION_CONSTANTS.DURATION.FAST,
          easing: Easing.out(Easing.cubic),
        })
      );
    }
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={[animatedStyle]}>
      <TouchableOpacity
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled}
        style={[
          {
            paddingHorizontal: size === 'small' ? 16 : size === 'large' ? 32 : 24,
            paddingVertical: size === 'small' ? 8 : size === 'large' ? 16 : 12,
            borderRadius: 8,
            alignItems: 'center',
            justifyContent: 'center',
            opacity: disabled ? 0.6 : 1,
          },
          style,
        ]}
        activeOpacity={0.8}
      >
        <Text
          style={[
            {
              fontSize: size === 'small' ? 14 : size === 'large' ? 18 : 16,
              fontWeight: '600',
              textAlign: 'center',
            },
            textStyle,
          ]}
        >
          {title}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

export default AnimatedButton; 