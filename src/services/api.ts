/**
 * API Service Layer
 * Base API configuration and fetch wrapper
 * Uses /custom/drivertracking/ endpoints
 * Uses DOLAPIKEY header for Dolibarr REST API authentication
 */

import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
import { ApiResponse, DashboardData, Booking, MileageRecord } from '../types';
import { navigate } from '@react-navigation/native';

// Storage keys
const AUTH_TOKEN_KEY = 'auth_token';
const SERVER_URL_KEY = 'server_url';

/**
 * Get the Dolibarr server URL
 * Must be configured at login (e.g., https://yourserver.com)
 */
export async function getServerUrl(): Promise<string | null> {
  try {
    const url = await AsyncStorage.getItem(SERVER_URL_KEY);
    return url;
  } catch (error) {
    console.error('Error getting server URL:', error);
    return null;
  }
}

/**
 * Set the Dolibarr server URL
 * Called after successful login
 */
export async function setServerUrl(url: string): Promise<void> {
  try {
    // Remove trailing slash if present
    const cleanUrl = url.replace(/\/$/, '');
    await AsyncStorage.setItem(SERVER_URL_KEY, cleanUrl);
  } catch (error) {
    console.error('Error setting server URL:', error);
    throw error;
  }
}

/**
 * Get the full API base URL (server + endpoint path)
 */
async function getApiBaseUrl(): Promise<string> {
  const serverUrl = await getServerUrl();
  if (!serverUrl) {
    throw new Error('Server URL not configured. Please log in again.');
  }
  return `${serverUrl}/custom/drivertracking`;
}

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
 * Clear all auth data (logout)
 */
export async function clearAllAuth(): Promise<void> {
  await clearAuthToken();
  await AsyncStorage.removeItem(SERVER_URL_KEY);
}

/**
 * Handle session expiration (401 response)
 * Clears token and prompts user to re-login
 */
export async function handleSessionExpired(): Promise<void> {
  await clearAllAuth();
  Alert.alert(
    'Session Expired',
    'Your session has expired. Please log in again.',
    [
      {
        text: 'OK',
        onPress: () => {
          try {
            navigate('Login' as never);
          } catch (e) {
            console.error('Navigation to Login failed:', e);
          }
        },
      },
    ]
  );
}

/**
 * Handle network error
 */
export function handleNetworkError(error?: string): void {
  Alert.alert(
    'Connection Error',
    error || 'Cannot connect to server. Check your connection.'
  );
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
 * Make an authenticated API request using DOLAPIKEY
 */
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const baseUrl = await getApiBaseUrl();
  const url = `${baseUrl}${endpoint}`;
  
  const token = await getAuthToken();
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };
  
  if (token) {
    // Dolibarr REST API uses DOLAPIKEY header, not Authorization: Bearer
    headers['DOLAPIKEY'] = token;
  }
  
  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    // Handle 401 Unauthorized - session expired
    if (response.status === 401) {
      await handleSessionExpired();
      return {
        success: false,
        error: 'Session expired',
      };
    }

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
    handleNetworkError(message);

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
 * Get dashboard data
 * GET /custom/drivertracking/api_driver.php
 * Returns driver info, active booking, vehicle info, pending bookings
 */
export async function getDashboard(): Promise<ApiResponse<DashboardData>> {
  try {
    const token = await getAuthToken();
    
    if (!token) {
      return {
        success: false,
        error: 'Not authenticated',
      };
    }
    
    const baseUrl = await getApiBaseUrl();
    const response = await fetch(`${baseUrl}/api_driver.php`, {
      method: 'GET',
      headers: {
        // Dolibarr REST API uses DOLAPIKEY header
        'DOLAPIKEY': token,
        'Content-Type': 'application/json',
      },
    });
    
    if (response.status === 401) {
      await handleSessionExpired();
      return {
        success: false,
        error: 'Session expired',
      };
    }
    
    const data = await response.json();
    
    if (!response.ok) {
      return {
        success: false,
        error: data.error || 'Failed to fetch dashboard',
      };
    }
    
    return {
      success: true,
      data: data as DashboardData,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Network error';
    console.error('getDashboard error:', message);
    return {
      success: false,
      error: message,
    };
  }
}

/**
 * Get bookings filtered by status
 * GET /api/index.php/flotte/bookings?status=confirmed
 */
export async function getBookings(status?: string): Promise<ApiResponse<Booking[]>> {
  try {
    const token = await getAuthToken();
    
    if (!token) {
      return {
        success: false,
        error: 'Not authenticated',
      };
    }
    
    let endpoint = '/api/index.php/flotte/bookings';
    if (status) {
      endpoint += `?status=${status}`;
    }
    
    const baseUrl = await getApiBaseUrl();
    const response = await fetch(`${baseUrl}${endpoint}`, {
      method: 'GET',
      headers: {
        'DOLAPIKEY': token,
        'Content-Type': 'application/json',
      },
    });

    if (response.status === 401) {
      await handleSessionExpired();
      return {
        success: false,
        error: 'Session expired',
      };
    }

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.error || 'Failed to fetch bookings',
      };
    }

    return {
      success: true,
      data: Array.isArray(data) ? data : [],
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Network error';
    console.error('getBookings error:', message);
    handleNetworkError(message);
    return {
      success: false,
      error: message,
    };
  }
}

/**
 * Start a booking (set status to in_progress)
 * POST /custom/drivertracking/ajax_start_booking.php
 * Backend auto-captures timestamp - no manual time entry
 */
export async function startBooking(bookingId: number): Promise<ApiResponse<{ success: boolean; message?: string }>> {
  if (!validateBookingId(bookingId)) {
    console.error('Invalid booking ID:', bookingId);
    return {
      success: false,
      error: 'Invalid booking ID',
    };
  }
  
  try {
    const token = await getAuthToken();
    
    if (!token) {
      return {
        success: false,
        error: 'Not authenticated',
      };
    }
    
    const baseUrl = await getApiBaseUrl();
    const response = await fetch(`${baseUrl}/ajax_start_booking.php`, {
      method: 'POST',
      headers: {
        'DOLAPIKEY': token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ booking_id: bookingId }),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      return {
        success: false,
        error: data.error || 'Failed to start booking',
      };
    }
    
    return {
      success: true,
      data: data,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Network error';
    console.error('startBooking error:', message);
    return {
      success: false,
      error: message,
    };
  }
}

/**
 * Update booking status (complete/cancel/undo)
 * POST /custom/drivertracking/ajax_update_booking.php
 * Actions: "complete", "cancel", "undo"
 */
export async function updateBookingStatus(
  bookingId: number,
  action: 'complete' | 'cancel' | 'undo'
): Promise<ApiResponse<{ success: boolean; message?: string }>> {
  if (!validateBookingId(bookingId)) {
    console.error('Invalid booking ID:', bookingId);
    return {
      success: false,
      error: 'Invalid booking ID',
    };
  }
  
  try {
    const token = await getAuthToken();
    
    if (!token) {
      return {
        success: false,
        error: 'Not authenticated',
      };
    }
    
    const baseUrl = await getApiBaseUrl();
    const response = await fetch(`${baseUrl}/ajax_update_booking.php`, {
      method: 'POST',
      headers: {
        'DOLAPIKEY': token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        booking_id: bookingId,
        action: action,
      }),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      return {
        success: false,
        error: data.error || 'Failed to update booking status',
      };
    }
    
    return {
      success: true,
      data: data,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Network error';
    console.error('updateBookingStatus error:', message);
    return {
      success: false,
      error: message,
    };
  }
}

/**
 * Validate booking ID is numeric (security - T-01-04)
 */
export function validateBookingId(id: number | string): boolean {
  const numId = typeof id === 'string' ? parseInt(id, 10) : id;
  return !isNaN(numId) && numId > 0;
}

/**
 * Get mileage data for a vehicle from inspection records
 * GET /api/index.php/flotte/inspections?fk_vehicle={id}
 * Returns: meter_out, meter_in, inspection date from llx_flotte_inspection
 * Note: Mileage is read-only from database - never collected from user
 */
export async function getMileage(vehicleId?: number): Promise<ApiResponse<MileageRecord | null>> {
  try {
    const token = await getAuthToken();
    
    if (!token) {
      return {
        success: false,
        error: 'Not authenticated',
      };
    }
    
    let endpoint = '/api/index.php/flotte/inspections';
    if (vehicleId) {
      endpoint += `?fk_vehicle=${vehicleId}&sortfield=date&sortorder=DESC&limit=1`;
    } else {
      endpoint += '?sortfield=date&sortorder=DESC&limit=1';
    }
    
    const baseUrl = await getApiBaseUrl();
    const response = await fetch(`${baseUrl}${endpoint}`, {
      method: 'GET',
      headers: {
        'DOLAPIKEY': token,
        'Content-Type': 'application/json',
      },
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      return {
        success: false,
        error: data.error || 'Failed to fetch mileage',
      };
    }
    
    const inspections = Array.isArray(data) ? data : [];
    const latestRecord = inspections.length > 0 ? inspections[0] : null;
    
    return {
      success: true,
      data: latestRecord,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Network error';
    console.error('getMileage error:', message);
    return {
      success: false,
      error: message,
    };
  }
}

/**
 * Get booking history (completed and cancelled bookings)
 * GET /api/index.php/flotte/bookings?status=done,cancelled
 * Filter by status: 'all' | 'done' | 'cancelled'
 * Returns: reverse chronological order (newest first)
 */
export async function getHistory(
  filter: 'all' | 'done' | 'cancelled' = 'all'
): Promise<ApiResponse<Booking[]>> {
  try {
    const token = await getAuthToken();
    
    if (!token) {
      return {
        success: false,
        error: 'Not authenticated',
      };
    }
    
    let endpoint = '/api/index.php/flotte/bookings?sortfield=dropoff_datetime&sortorder=DESC';
    
    if (filter === 'done') {
      endpoint += '&status=done';
    } else if (filter === 'cancelled') {
      endpoint += '&status=cancelled';
    }
    
    const baseUrl = await getApiBaseUrl();
    const response = await fetch(`${baseUrl}${endpoint}`, {
      method: 'GET',
      headers: {
        'DOLAPIKEY': token,
        'Content-Type': 'application/json',
      },
    });

    if (response.status === 401) {
      await handleSessionExpired();
      return {
        success: false,
        error: 'Session expired',
      };
    }

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.error || 'Failed to fetch history',
      };
    }

    let bookings: Booking[] = Array.isArray(data) ? data : [];

    if (filter === 'all') {
      bookings = bookings.filter(
        (b: Booking) => b.status === 'done' || b.status === 'cancelled'
      );
    } else if (filter === 'done') {
      bookings = bookings.filter((b: Booking) => b.status === 'done');
    } else if (filter === 'cancelled') {
      bookings = bookings.filter((b: Booking) => b.status === 'cancelled');
    }

    return {
      success: true,
      data: bookings,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Network error';
    console.error('getHistory error:', message);
    handleNetworkError(message);
    return {
      success: false,
      error: message,
    };
  }
}

export default {
  getServerUrl,
  setServerUrl,
  getAuthToken,
  setAuthToken,
  clearAuthToken,
  clearAllAuth,
  handleSessionExpired,
  handleNetworkError,
  apiGet,
  apiPost,
  apiPut,
  validateBookingId,
  getDashboard,
  getBookings,
  startBooking,
  updateBookingStatus,
  getMileage,
  getHistory,
};