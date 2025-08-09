import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import LoginScreen from '../screens/LoginScreen';

// Mock the fetch function
global.fetch = jest.fn();

describe('LoginScreen', () => {
  const mockOnLoginSuccess = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    const { getByText, getByPlaceholderText } = render(
      <LoginScreen onLoginSuccess={mockOnLoginSuccess} />
    );

    expect(getByText('Welcome Back')).toBeTruthy();
    expect(getByText('Sign in to continue')).toBeTruthy();
    expect(getByText('Sign in with Google')).toBeTruthy();
    expect(getByPlaceholderText('Email')).toBeTruthy();
    expect(getByPlaceholderText('Password')).toBeTruthy();
    expect(getByText('Sign In')).toBeTruthy();
    expect(getByText('Use Demo Account')).toBeTruthy();
  });

  it('handles email and password input', () => {
    const { getByPlaceholderText } = render(
      <LoginScreen onLoginSuccess={mockOnLoginSuccess} />
    );

    const emailInput = getByPlaceholderText('Email');
    const passwordInput = getByPlaceholderText('Password');

    fireEvent.changeText(emailInput, 'test@example.com');
    fireEvent.changeText(passwordInput, 'password123');

    expect(emailInput.props.value).toBe('test@example.com');
    expect(passwordInput.props.value).toBe('password123');
  });

  it('shows error when trying to sign in without credentials', async () => {
    const { getByText } = render(
      <LoginScreen onLoginSuccess={mockOnLoginSuccess} />
    );

    const signInButton = getByText('Sign In');
    fireEvent.press(signInButton);

    await waitFor(() => {
      expect(mockOnLoginSuccess).not.toHaveBeenCalled();
    });
  });

  it('handles demo login', async () => {
    const { getByText } = render(
      <LoginScreen onLoginSuccess={mockOnLoginSuccess} />
    );

    const demoButton = getByText('Use Demo Account');
    fireEvent.press(demoButton);

    await waitFor(() => {
      expect(mockOnLoginSuccess).toHaveBeenCalled();
    }, { timeout: 1000 });
  });

  it('handles Google sign in', () => {
    const { getByText } = render(
      <LoginScreen onLoginSuccess={mockOnLoginSuccess} />
    );

    const googleButton = getByText('Sign in with Google');
    fireEvent.press(googleButton);

    // Should show info alert about Google Sign-In
    expect(mockOnLoginSuccess).not.toHaveBeenCalled();
  });
}); 