import React from 'react';
import { View, Text, StyleSheet, Modal } from 'react-native';
import { observer } from 'mobx-react-lite';
import LoadingSpinner from './animations/LoadingSpinner';
import FadeInView from './animations/FadeInView';
import { COLORS } from '../core/theme';

interface LoadingOverlayProps {
  visible: boolean;
  message?: string;
  showSpinner?: boolean;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = observer(({
  visible,
  message = 'Loading...',
  showSpinner = true,
}) => {
  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
    >
      <View style={styles.overlay}>
        <FadeInView delay={100}>
          <View style={styles.container}>
            {showSpinner && (
              <LoadingSpinner 
                size={48} 
                color={COLORS.PRIMARY} 
                style={styles.spinner}
              />
            )}
            <Text style={styles.message}>{message}</Text>
            <Text style={styles.subtitle}>Please wait</Text>
          </View>
        </FadeInView>
      </View>
    </Modal>
  );
});

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    minWidth: 200,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  spinner: {
    marginBottom: 16,
  },
  message: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.TEXT_PRIMARY,
    textAlign: 'center',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.TEXT_SECONDARY,
    textAlign: 'center',
  },
});

export default LoadingOverlay;
