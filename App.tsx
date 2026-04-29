/**
 * Root App Component
 * Handles auth routing: LoginScreen vs Tab Navigator
 */

import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';

// Import screens
import LoginScreen from './src/screens/LoginScreen';
import AppNavigator from './src/navigation/AppNavigator';
import { ThemeProvider } from './src/context/ThemeContext';

// Auth functions
import { isAuthenticated, logout } from './src/services/auth';

type AuthState = 'checking' | 'authenticated' | 'unauthenticated';

export default function App() {
  const [authState, setAuthState] = useState<AuthState>('checking');
  const [loginSuccessTrigger, setLoginSuccessTrigger] = useState(0);

  const checkAuth = useCallback(async () => {
    try {
      const authenticated = await isAuthenticated();
      setAuthState(authenticated ? 'authenticated' : 'unauthenticated');
    } catch (error) {
      console.error('Auth check failed:', error);
      setAuthState('unauthenticated');
    }
  }, []);

  // Check auth on mount
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Handle successful login
  const handleLoginSuccess = useCallback(() => {
    setAuthState('authenticated');
    setLoginSuccessTrigger(prev => prev + 1);
  }, []);

  // Handle logout
  const handleLogout = useCallback(async () => {
    try {
      await logout();
      setAuthState('unauthenticated');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  }, []);

  // Loading state
  if (authState === 'checking') {
    return (
      <SafeAreaProvider>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </SafeAreaProvider>
    );
  }

  // Not authenticated - show login screen
  if (authState === 'unauthenticated') {
    return (
      <SafeAreaProvider>
        <ThemeProvider>
          <LoginScreen onLoginSuccess={handleLoginSuccess} />
        </ThemeProvider>
      </SafeAreaProvider>
    );
  }

  // Authenticated - show main app with navigator
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F2F2F7',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#8E8E93',
  },
});