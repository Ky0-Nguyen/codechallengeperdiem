import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withDelay,
  runOnJS,
} from 'react-native-reanimated';

interface ConfettiPieceProps {
  color: string;
  delay: number;
  onAnimationComplete?: () => void;
}

const ConfettiPiece: React.FC<ConfettiPieceProps> = ({ color, delay, onAnimationComplete }) => {
  const translateY = useSharedValue(-100);
  const translateX = useSharedValue(0);
  const rotation = useSharedValue(0);
  const scale = useSharedValue(0);

  useEffect(() => {
    const startAnimation = () => {
      translateY.value = withDelay(
        delay,
        withSequence(
          withSpring(400, { damping: 8, stiffness: 100 }),
          withSpring(450, { damping: 12, stiffness: 80 })
        )
      );

      translateX.value = withDelay(
        delay,
        withSpring(Math.random() * 200 - 100, { damping: 8, stiffness: 100 })
      );

      rotation.value = withDelay(
        delay,
        withSpring(Math.random() * 360, { damping: 8, stiffness: 100 })
      );

      scale.value = withDelay(
        delay,
        withSequence(
          withSpring(1, { damping: 8, stiffness: 100 }),
          withSpring(0, { damping: 8, stiffness: 100 }, () => {
            if (onAnimationComplete) {
              runOnJS(onAnimationComplete)();
            }
          })
        )
      );
    };

    startAnimation();
  }, [delay, onAnimationComplete]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: translateY.value },
      { translateX: translateX.value },
      { rotate: `${rotation.value}deg` },
      { scale: scale.value },
    ],
  }));

  return (
    <Animated.View
      style={[
        styles.confettiPiece,
        { backgroundColor: color },
        animatedStyle,
      ]}
    />
  );
};

interface ConfettiAnimationProps {
  visible: boolean;
  onComplete?: () => void;
}

const ConfettiAnimation: React.FC<ConfettiAnimationProps> = ({ visible, onComplete }) => {
  const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD'];
  const pieces = Array.from({ length: 20 }, (_, i) => i);

  if (!visible) return null;

  return (
    <View style={styles.container} pointerEvents="none">
      {pieces.map((piece) => (
        <ConfettiPiece
          key={piece}
          color={colors[piece % colors.length]}
          delay={piece * 50}
          onAnimationComplete={piece === pieces.length - 1 ? onComplete : undefined}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
  },
  confettiPiece: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
    top: 0,
    left: '50%',
  },
});

export default ConfettiAnimation;
