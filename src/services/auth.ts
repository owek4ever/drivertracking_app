/**
 * Authentication Service
 * Login, logout, token validation for Driver Tracking App
 * Uses expo-secure-store for secure token storage
 */

import * as SecureStore from 'expo-secure-store';
import { apiGet, apiPost, setAuthToken, clearAuthToken, getAuthToken, ApiError } from './api';
import { AuthTokenResponse, ApiResponse, Driver } from '../types';

// Storage keys
const DRIVER_INFO_KEY = 'driver_info';

/**
 * Login credentials interface
 */
export interface LoginCredentials {
  username: string;
  password: string;
}

/**
 * Login response interface
 */
interface LoginResponse {
  success: boolean;
  token?: string;
  driver?: Driver;
  error?: string;
}

/**
 * Perform login with username and password
 * POST to /custom/drivertracking/api/login
 */
export async function login(credentials: LoginCredentials): Promise<LoginResponse> {
  try {
    const response = await apiPost<{ token: string; driver?: Driver }>('/api/login', {
      username: credentials.username,
      password: credentials.password,
    });

    if (response.success && response.data) {
      // Store token securely
      await setAuthToken(response.data.token);
      
      // Store driver info if provided
      if (response.data.driver) {
        await SecureStore.setItemAsync(DRIVER_INFO_KEY, JSON.stringify(response.data.driver));
      }

      return {
        success: true,
        token: response.data.token,
        driver: response.data.driver,
      };
    }

    return {
      success: false,
      error: response.error || 'Login failed',
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Login failed';
    console.error('Login error:', message);
    return {
      success: false,
      error: message,
    };
  }
}

/**
 * Perform logout - clear stored credentials
 */
export async function logout(): Promise<void> {
  try {
    // Clear auth token
    await clearAuthToken();
    
    // Clear driver info
    await SecureStore.deleteItemAsync(DRIVER_INFO_KEY);
    
    console.log('Logged out successfully');
  } catch (error) {
    console.error('Logout error:', error);
    throw error;
  }
}

/**
 * Check if user is authenticated (has valid token)
 */
export async function isAuthenticated(): Promise<boolean> {
  try {
    const token = await getAuthToken();
    if (!token) {
      return false;
    }

    // Optionally validate token with backend
    // For now, just check token exists
    return true;
  } catch (error) {
    console.error('Auth check error:', error);
    return false;
  }
}

/**
 * Get stored driver info
 */
export async function getStoredDriverInfo(): Promise<Driver | null> {
  try {
    const infoJson = await SecureStore.getItemAsync(DRIVER_INFO_KEY);
    if (infoJson) {
      return JSON.parse(infoJson) as Driver;
    }
    return null;
  } catch (error) {
    console.error('Error getting driver info:', error);
    return null;
  }
}

/**
 * Validate current token with backend
 * Returns driver info if token is valid
 */
export async function validateToken(): Promise<ApiResponse<Driver>> {
  try {
    // Call a protected endpoint to validate token
    const response = await apiGet<Driver>('/api/validate');
    return response;
  } catch (error) {
    return {
      success: false,
      error: 'Token validation failed',
    };
  }
}

/**
 * Check if token is about to expire and needs refresh
 * (For future implementation)
 */
export async function isTokenExpiringSoon(): Promise<boolean> {
  // Placeholder for token refresh logic
  return false;
}

export default {
  login,
  logout,
  isAuthenticated,
  getStoredDriverInfo,
  validateToken,
  isTokenExpiringSoon,
};