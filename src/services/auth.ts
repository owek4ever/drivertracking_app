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
  console.log('=== LOGIN FUNCTION STARTED ===');
  console.log('Server URL:', credentials.serverUrl);
  console.log('Username:', credentials.username);
  
  try {
    // First, store the server URL (needed for all API calls)
    await setServerUrl(credentials.serverUrl);
    console.log('Server URL saved');

    // Dolibarr REST API login: /api/index.php/login
    let baseUrl: string;
    try {
      baseUrl = await getDolibarrApiUrl();
      console.log('Base URL:', baseUrl);
    } catch (urlError) {
      console.error('Failed to get API base URL:', urlError);
      return {
        success: false,
        error: `Failed to build API URL: ${urlError instanceof Error ? urlError.message : 'Unknown error'}`,
      };
    }
    
    const loginUrl = `${baseUrl}/login`;

    // Dolibarr REST API expects credentials as query parameters, not JSON body
    const loginUrlWithParams = `${loginUrl}?login=${encodeURIComponent(credentials.username)}&password=${encodeURIComponent(credentials.password)}`;
    console.log('Attempting login to:', loginUrlWithParams);

    const response = await fetch(loginUrlWithParams, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      // No body needed - credentials are in query params
    });
    
    console.log('Response status:', response.status);

    const contentType = response.headers.get('content-type');
    console.log('Response content-type:', contentType);
    
    let data: { token?: string; error?: string; success?: boolean; message?: string; [key: string]: unknown } = {};
    let responseText = '';
    
    try {
      responseText = await response.text();
      console.log('Raw response text:', responseText);
      console.log('Response length:', responseText.length);
      console.log('Content-Type header:', contentType);
      
      // Try to parse as JSON regardless of Content-Type header
      // Some servers return JSON with wrong content-type
      try {
        data = JSON.parse(responseText);
        console.log('Parsed data keys:', Object.keys(data));
        console.log('Full parsed data:', JSON.stringify(data, null, 2));
      } catch (parseError) {
        // Not valid JSON
        console.error('Response is not valid JSON. Content-Type:', contentType);
        console.error('Response text preview:', responseText.substring(0, 500));
        return {
          success: false,
          error: 'Server error: Check if REST API module is enabled and URL is correct',
        };
      }
    } catch (error) {
      console.error('Failed to read response:', error);
      return {
        success: false,
        error: 'Failed to read server response. Check server URL configuration.',
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
    const dataKeys = Object.keys(data);
    const errorMessage = data.error || data.message || 
      (data.success === false ? 'Login failed - check credentials' : null) ||
      (dataKeys.length === 0 ? 'Empty response from server' : null);
    
    // Build detailed error message for debugging
    const detailedError = errorMessage || `Login failed (HTTP ${response.status})`;
    const debugInfo = `\n\nDebug info:\nKeys: ${dataKeys.join(', ') || 'none'}\nData: ${JSON.stringify(data).substring(0, 200)}`;
    
    console.log('Login error details:', detailedError, 'Response data:', data);
    
    return {
      success: false,
      error: detailedError + debugInfo,
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