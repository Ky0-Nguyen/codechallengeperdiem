import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { observer } from 'mobx-react-lite';
import AnimatedButton from './animations/AnimatedButton';
import { COLORS } from '../core/theme';

interface ErrorRetryButtonProps {
  error: string;
  onRetry: () => void;
  isLoading?: boolean;
  style?: any;
}

const ErrorRetryButton: React.FC<ErrorRetryButtonProps> = observer(({
  error,
  onRetry,
  isLoading = false,
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.errorContainer}>
        <Text style={styles.errorIcon}>⚠️</Text>
        <Text style={styles.errorText}>{error}</Text>
      </View>
      
      <AnimatedButton
        title={isLoading ? "Retrying..." : "Retry"}
        onPress={onRetry}
        disabled={isLoading}
        style={styles.retryButton}
        textStyle={styles.retryButtonText}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#FFF3CD',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FFEAA7',
    marginVertical: 8,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  errorIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  errorText: {
    flex: 1,
    color: '#856404',
    fontSize: 14,
    fontWeight: '500',
  },
  retryButton: {
    backgroundColor: COLORS.PRIMARY,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 6,
  },
  retryButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
});

export default ErrorRetryButton;
