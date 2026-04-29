/**
 * Authentication Service
 * Login, logout, token validation for Driver Tracking App
 * Uses expo-secure-store for secure token storage
 */

import * as SecureStore from 'expo-secure-store';
import { apiGet, apiPost, setAuthToken, clearAuthToken, getAuthToken, getServerUrl, setServerUrl, clearAllAuth, ApiError } from './api';
import { AuthTokenResponse, ApiResponse, Driver } from '../types';

// Storage keys
const DRIVER_INFO_KEY = 'driver_info';

/**
 * Login credentials interface
 */
export interface LoginCredentials {
  username: string;
  password: string;
  serverUrl: string; // e.g., https://yourserver.com
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
 * Get the Dolibarr API base URL (not Flotte-specific)
 */
async function getDolibarrApiUrl(): Promise<string> {
  const serverUrl = await getServerUrl();
  if (!serverUrl) {
    throw new Error('Server URL not configured');
  }
  return `${serverUrl}/api/index.php`;
}

/**
 * Perform login with username, password, and server URL
 * POST to /api/index.php/login (Dolibarr REST API)
 * 
 * @param credentials - username, password, and server URL
 */
export async function login(credentials: LoginCredentials): Promise<LoginResponse> {
  try {
    // First, store the server URL (needed for all API calls)
    await setServerUrl(credentials.serverUrl);

    // Dolibarr REST API login: /api/index.php/login
    const baseUrl = await getDolibarrApiUrl();
    const loginUrl = `${baseUrl}/login`;
    
    console.log('Attempting login to:', loginUrl);

    const response = await fetch(loginUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        login: credentials.username,
        password: credentials.password,
      }),
    });
    
    console.log('Response status:', response.status);

    const contentType = response.headers.get('content-type');
    console.log('Response content-type:', contentType);
    
    let data: { token?: string; error?: string; success?: boolean; message?: string } = {};
    
    try {
      const responseText = await response.text();
      console.log('Raw response:', responseText.substring(0, 1000));
      
      if (contentType && contentType.includes('application/json')) {
        data = JSON.parse(responseText);
        console.log('Parsed data:', JSON.stringify(data, null, 2));
      } else {
        // If not JSON, server might be returning HTML error page
        console.error('Server returned non-JSON response');
        return {
          success: false,
          error: 'Server error: Check if REST API module is enabled and URL is correct',
        };
      }
    } catch (parseError) {
      console.error('Failed to parse response:', parseError);
      return {
        success: false,
        error: 'Invalid server response. Check server URL configuration.',
      };
    }

    if (data.token) {
      await setAuthToken(data.token);
      return {
        success: true,
        token: data.token,
      };
    }

    // Handle various error response formats from Dolibarr
    // Dolibarr may return HTTP 200 with success: false and error message
    const errorMessage = data.error || data.message || 
      (data.success === false ? 'Login failed - check credentials' : null) ||
      (Object.keys(data).length === 0 ? 'Empty response from server' : null) ||
      `Login failed (HTTP ${response.status})`;
    
    console.log('Login error details:', errorMessage, 'Response data:', data);
    
    return {
      success: false,
      error: errorMessage,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Login failed';
    console.error('Login error:', message);
    return {
      success: false,
      error: `Connection error: ${message}. Check server URL and network.`,
    };
  }
}

/**
 * Perform logout - clear stored credentials
 */
export async function logout(): Promise<void> {
  try {
    // Clear all auth data (token + server URL)
    await clearAllAuth();
    
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