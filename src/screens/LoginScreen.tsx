/**
 * @author Nguyễn Tuấn
 * @created 2024-12-19
 * @screen LoginScreen
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { observer } from 'mobx-react-lite';
import { useStore } from '../contexts/StoreProvider';
import { loginScreenStyles } from '../styles';
import FadeInView from '../components/animations/FadeInView';
import ScaleInView from '../components/animations/ScaleInView';
// import AnimatedButton from '../components/animations/AnimatedButton'; // Not used
import PulseView from '../components/animations/PulseView';

interface LoginScreenProps {
  onLoginSuccess: () => void;
}

const LoginScreen: React.FC<LoginScreenProps> = observer(({ onLoginSuccess }) => {
  const { appStore } = useStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);

  // Use appStore.isLoading for all loading states
  const isLoading = appStore.isLoading;

  const handleGoogleSignIn = async () => {
    try {
      await appStore.signInWithGoogle();
      onLoginSuccess();
    } catch (error: any) {
      console.error('Google sign in error:', error);
      Alert.alert('Error', error.message || 'Failed to sign in with Google');
    }
  };

  const handleEmailAuth = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }

    try {
      if (isSignUp) {
        await appStore.signUpWithEmail(email, password);
        Alert.alert('Success', 'Account created successfully!');
      } else {
        await appStore.signInWithEmail(email, password);
      }
      onLoginSuccess();
    } catch (error: any) {
      console.error('Email auth error:', error);
      Alert.alert('Error', error.message || 'Authentication failed. Please try again.');
    }
  };

  const handleDemoLogin = () => {
    setEmail('user@tryperdiem.com');
    setPassword('password');
    setIsSignUp(false);
  };

  return (
    <KeyboardAvoidingView
      style={loginScreenStyles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={loginScreenStyles.scrollContainer}>
        <View style={loginScreenStyles.content}>
          <FadeInView delay={200}>
            <Text style={loginScreenStyles.title}>
              {isSignUp ? 'Create Account' : 'Welcome Back'}
            </Text>
          </FadeInView>
          
          <FadeInView delay={400}>
            <Text style={loginScreenStyles.subtitle}>
              {isSignUp ? 'Sign up to get started' : 'Sign in to continue'}
            </Text>
          </FadeInView>

          <ScaleInView delay={600} useSpring style={loginScreenStyles.rowInfo}>
            <PulseView duration={2000} scale={1.02}>
              <TouchableOpacity
                style={loginScreenStyles.googleButton}
                onPress={handleGoogleSignIn}
                disabled={isLoading}
              >
                <Text style={loginScreenStyles.googleButtonText}>Sign in with Google</Text>
              </TouchableOpacity>
            </PulseView>
          </ScaleInView>

          <FadeInView delay={800}>
            <View style={loginScreenStyles.divider}>
              <View style={loginScreenStyles.dividerLine} />
              <Text style={loginScreenStyles.dividerText}>or</Text>
              <View style={loginScreenStyles.dividerLine} />
            </View>
          </FadeInView>

          <FadeInView delay={1000} style={loginScreenStyles.rowInfo}>
            <TextInput
              style={loginScreenStyles.input}
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </FadeInView>

          <FadeInView delay={1200} style={loginScreenStyles.rowInfo}>
            <TextInput
              style={loginScreenStyles.input}
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
            />
          </FadeInView>

          <ScaleInView delay={1400} useSpring style={loginScreenStyles.rowInfo}>
            <TouchableOpacity
              style={[
                loginScreenStyles.signInButton,
                isLoading && loginScreenStyles.disabledButton,
              ]}
              onPress={handleEmailAuth}
              disabled={isLoading}
            >
              <Text style={loginScreenStyles.signInButtonText}>
                {isLoading
                  ? isSignUp
                    ? 'Creating Account...'
                    : 'Signing in...'
                  : isSignUp
                  ? 'Sign Up'
                  : 'Sign In'}
              </Text>
            </TouchableOpacity>
          </ScaleInView>

          <FadeInView delay={1600}>
            <TouchableOpacity
              style={loginScreenStyles.demoButton}
              onPress={handleDemoLogin}
              disabled={isLoading}
            >
              <Text style={loginScreenStyles.demoButtonText}>Use Demo Account</Text>
            </TouchableOpacity>
          </FadeInView>

          <FadeInView delay={1800}>
            <TouchableOpacity
              style={loginScreenStyles.switchModeButton}
              onPress={() => setIsSignUp(!isSignUp)}
              disabled={isLoading}
            >
              <Text style={loginScreenStyles.switchModeButtonText}>
                {isSignUp
                  ? 'Already have an account? Sign In'
                  : "Don't have an account? Sign Up"}
              </Text>
            </TouchableOpacity>
          </FadeInView>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
});

export default LoginScreen;