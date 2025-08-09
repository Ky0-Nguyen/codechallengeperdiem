/**
 * @author Nguyễn Tuấn
 * @created 2024-12-19
 * @component LoadingScreen
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import FadeInView from './animations/FadeInView';
import ScaleInView from './animations/ScaleInView';
import LoadingSpinner from './animations/LoadingSpinner';
import PulseView from './animations/PulseView';
import { COLORS, TYPOGRAPHY, SPACING } from '../core/theme';

interface LoadingScreenProps {
  message?: string;
  showSpinner?: boolean;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({
  message = 'Loading...',
  showSpinner = true,
}) => {
  return (
    <View style={styles.container}>
      <FadeInView delay={200}>
        <ScaleInView delay={400} useSpring>
          <View style={styles.content}>
            {showSpinner && (
              <PulseView duration={2000} scale={1.1}>
                <LoadingSpinner size={48} color={COLORS.PRIMARY} />
              </PulseView>
            )}
            
            <FadeInView delay={600}>
              <Text style={styles.message}>{message}</Text>
            </FadeInView>
            
            <FadeInView delay={800}>
              <Text style={styles.subtitle}>Please wait while we prepare your experience</Text>
            </FadeInView>
          </View>
        </ScaleInView>
      </FadeInView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    padding: SPACING.XL,
  },
  message: {
    fontSize: TYPOGRAPHY.FONT_SIZE.TITLE,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT.BOLD,
    color: COLORS.TEXT_PRIMARY,
    marginTop: SPACING.LG,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: TYPOGRAPHY.FONT_SIZE.MD,
    color: COLORS.TEXT_SECONDARY,
    marginTop: SPACING.SM,
    textAlign: 'center',
    maxWidth: 250,
  },
});

export default LoadingScreen; 