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
import axios from 'axios';
import { getApiConfig } from '../config/api';
import { loginScreenStyles } from '../styles';
import FadeInView from '../components/animations/FadeInView';
import ScaleInView from '../components/animations/ScaleInView';
import AnimatedButton from '../components/animations/AnimatedButton';
import PulseView from '../components/animations/PulseView';

interface LoginScreenProps {
  onLoginSuccess: () => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      // TODO: Implement Google Sign-In
      console.log('Google Sign-In pressed');
      Alert.alert('Info', 'Google Sign-In will be implemented');
    } catch (error) {
      Alert.alert('Error', 'Failed to sign in with Google');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailSignIn = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }

    setIsLoading(true);
    try {
      const API_CONFIG = getApiConfig();
      
      // Use axios for API call
      const response = await axios.post(API_CONFIG.ENDPOINTS.AUTH, {
        email,
        password,
      }, {
        baseURL: API_CONFIG.BASE_URL,
        headers: API_CONFIG.HEADERS,
        auth: API_CONFIG.CREDENTIALS,
      });

      if (response.status === 200) {
        onLoginSuccess();
      } else {
        Alert.alert('Error', 'Invalid credentials');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      if (error.response?.status === 401) {
        Alert.alert('Error', 'Invalid credentials');
      } else {
        Alert.alert('Error', 'Failed to sign in. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = () => {
    setEmail('user@tryperdiem.com');
    setPassword('password');
    // Auto-login with demo credentials
    setTimeout(() => {
      onLoginSuccess();
    }, 500);
  };

  return (
    <KeyboardAvoidingView
      style={loginScreenStyles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={loginScreenStyles.scrollContainer}>
        <View style={loginScreenStyles.content}>
          <FadeInView delay={200}>
            <Text style={loginScreenStyles.title}>Welcome Back</Text>
          </FadeInView>
          
          <FadeInView delay={400}>
            <Text style={loginScreenStyles.subtitle}>Sign in to continue</Text>
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
              style={[loginScreenStyles.signInButton, isLoading && loginScreenStyles.disabledButton]}
              onPress={handleEmailSignIn}
              disabled={isLoading}
            >
              <Text style={loginScreenStyles.signInButtonText}>
                {isLoading ? 'Signing in...' : 'Sign In'}
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
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};



export default LoginScreen; 