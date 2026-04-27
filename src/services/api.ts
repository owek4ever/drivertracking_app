/**
 * API Service Layer
 * Base API configuration and fetch wrapper
 * Uses /custom/drivertracking/ endpoints
 */

import * as SecureStore from 'expo-secure-store';
import { ApiResponse } from '../types';

// API Base URL - from CONTEXT.md
const API_BASE_URL = '/custom/drivertracking';

// Storage keys
const AUTH_TOKEN_KEY = 'auth_token';

/**
 * Get the stored authentication token
 */
export async function getAuthToken(): Promise<string | null> {
  try {
    const token = await SecureStore.getItemAsync(AUTH_TOKEN_KEY);
    return token;
  } catch (error) {
    console.error('Error getting auth token:', error);
    return null;
  }
}

/**
 * Store the authentication token
 */
export async function setAuthToken(token: string): Promise<void> {
  try {
    await SecureStore.setItemAsync(AUTH_TOKEN_KEY, token);
  } catch (error) {
    console.error('Error setting auth token:', error);
    throw error;
  }
}

/**
 * Clear the authentication token (logout)
 */
export async function clearAuthToken(): Promise<void> {
  try {
    await SecureStore.deleteItemAsync(AUTH_TOKEN_KEY);
  } catch (error) {
    console.error('Error clearing auth token:', error);
    throw error;
  }
}

/**
 * API Error class
 */
export class ApiError extends Error {
  constructor(
    message: string,
    public status: number = 0,
    public code?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * Make an authenticated API request
 */
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  // Get auth token
  const token = await getAuthToken();
  
  // Build headers
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });
    
    // Handle non-JSON responses
    const contentType = response.headers.get('content-type');
    let data: unknown;
    
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }
    
    if (!response.ok) {
      const errorMessage = typeof data === 'object' && data !== null 
        ? (data as Record<string, unknown>).message as string || 'Request failed'
        : 'Request failed';
      
      return {
        success: false,
        error: errorMessage,
      };
    }
    
    return {
      success: true,
      data: data as T,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Network error';
    console.error('API request error:', message);
    
    return {
      success: false,
      error: message,
    };
  }
}

/**
 * GET request wrapper
 */
export async function apiGet<T>(endpoint: string): Promise<ApiResponse<T>> {
  return apiRequest<T>(endpoint, {
    method: 'GET',
  });
}

/**
 * POST request wrapper
 */
export async function apiPost<T>(
  endpoint: string,
  body: unknown
): Promise<ApiResponse<T>> {
  return apiRequest<T>(endpoint, {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

/**
 * PUT request wrapper
 */
export async function apiPut<T>(
  endpoint: string,
  body: unknown
): Promise<ApiResponse<T>> {
  return apiRequest<T>(endpoint, {
    method: 'PUT',
    body: JSON.stringify(body),
  });
}

/**
 * Validate booking ID is numeric (security - T-01-03)
 */
export function validateBookingId(id: number | string): boolean {
  const numId = typeof id === 'string' ? parseInt(id, 10) : id;
  return !isNaN(numId) && numId > 0;
}

export default {
  getAuthToken,
  setAuthToken,
  clearAuthToken,
  apiGet,
  apiPost,
  apiPut,
  validateBookingId,
};