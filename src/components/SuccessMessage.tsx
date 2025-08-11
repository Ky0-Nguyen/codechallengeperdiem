import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withDelay,
  runOnJS,
} from 'react-native-reanimated';
import SuccessAnimation from './animations/SuccessAnimation';
import { COLORS } from '../core/theme';

interface SuccessMessageProps {
  visible: boolean;
  message: string;
  onComplete?: () => void;
}

const SuccessMessage: React.FC<SuccessMessageProps> = ({
  visible,
  message,
  onComplete,
}) => {
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      scale.value = withSequence(
        withSpring(1.2, { damping: 8, stiffness: 100 }),
        withSpring(1, { damping: 8, stiffness: 100 })
      );
      opacity.value = withSpring(1, { damping: 8, stiffness: 100 });

      // Auto hide after 3 seconds
      const timer = setTimeout(() => {
        scale.value = withSpring(0, { damping: 8, stiffness: 100 });
        opacity.value = withSpring(0, { damping: 8, stiffness: 100 }, (finished) => {
          if (finished && onComplete) {
            runOnJS(onComplete)();
          }
        });
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [visible, onComplete]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  if (!visible) return null;

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <View style={styles.content}>
        <SuccessAnimation size={40} color={COLORS.SUCCESS} />
        <Text style={styles.message}>{message}</Text>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 100,
    left: 20,
    right: 20,
    zIndex: 1000,
  },
  content: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  message: {
    marginLeft: 12,
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.TEXT_PRIMARY,
    flex: 1,
  },
});

export default SuccessMessage;
