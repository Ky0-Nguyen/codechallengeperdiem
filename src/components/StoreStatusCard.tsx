import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { observer } from 'mobx-react-lite';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withRepeat,
  withSequence,
  interpolate,
} from 'react-native-reanimated';
import PulseView from './animations/PulseView';
import { COLORS } from '../core/theme';

interface StoreStatusCardProps {
  isOpen: boolean;
  message: string;
  nextOpenTime?: string;
}

const StoreStatusCard: React.FC<StoreStatusCardProps> = observer(({
  isOpen,
  message,
  nextOpenTime,
}) => {
  const rotation = useSharedValue(0);
  const scale = useSharedValue(1);

  useEffect(() => {
    // Animate the status light
    if (isOpen) {
      rotation.value = withRepeat(
        withSequence(
          withSpring(5, { damping: 8, stiffness: 100 }),
          withSpring(-5, { damping: 8, stiffness: 100 }),
          withSpring(0, { damping: 8, stiffness: 100 })
        ),
        -1,
        true
      );
    } else {
      rotation.value = withSpring(0);
    }

    // Pulse animation for the card
    scale.value = withRepeat(
      withSequence(
        withSpring(1.02, { damping: 8, stiffness: 100 }),
        withSpring(1, { damping: 8, stiffness: 100 })
      ),
      -1,
      true
    );
  }, [isOpen]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { rotate: `${rotation.value}deg` },
    ],
  }));

  const statusLightStyle = useAnimatedStyle(() => ({
    backgroundColor: isOpen ? '#4CAF50' : '#F44336',
    transform: [
      { scale: interpolate(scale.value, [1, 1.02], [1, 1.1]) },
    ],
  }));

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <PulseView duration={3000} scale={1.02}>
        <View style={styles.content}>
          <View style={styles.statusSection}>
            <Animated.View style={[styles.statusLight, statusLightStyle]} />
            <View style={styles.textSection}>
              <Text style={styles.statusText}>{message}</Text>
              {nextOpenTime && !isOpen && (
                <Text style={styles.nextOpenText}>
                  Opens at {nextOpenTime}
                </Text>
              )}
            </View>
          </View>
          
          <View style={styles.iconSection}>
            <Text style={styles.icon}>
              {isOpen ? '🟢' : '🔴'}
            </Text>
          </View>
        </View>
      </PulseView>
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 20,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statusSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  statusLight: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  textSection: {
    flex: 1,
  },
  statusText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 2,
  },
  nextOpenText: {
    fontSize: 12,
    color: COLORS.TEXT_SECONDARY,
    fontStyle: 'italic',
  },
  iconSection: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 20,
  },
});

export default StoreStatusCard;
