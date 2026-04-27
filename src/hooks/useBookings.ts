/**
 * Bookings Hook
 * Fetches and manages bookings list with optional status filtering
 */

import { useState, useEffect, useCallback } from 'react';
import { getBookings, getHistory, handleSessionExpired, handleNetworkError } from '../services/api';
import { Booking } from '../types';

interface UseBookingsOptions {
  status?: string;
  historyFilter?: 'all' | 'done' | 'cancelled';
  includeHistory?: boolean;
}

interface BookingsState {
  bookings: Booking[];
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

interface UseBookingsReturn extends BookingsState {
  refetch: () => Promise<void>;
}

export function useBookings(
  status?: string,
  options: Omit<UseBookingsOptions, 'status'> = {}
): UseBookingsReturn {
  const { includeHistory = false, historyFilter = 'all' } = options;

  const [state, setState] = useState<BookingsState>({
    bookings: [],
    loading: true,
    error: null,
    isAuthenticated: true,
  });

  const fetchBookings = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      let response;
      if (includeHistory) {
        // Use getHistory for history screen (no status filter = all bookings)
        response = await getHistory(historyFilter);
      } else {
        // Use getBookings for normal bookings with optional status filter
        response = await getBookings(status);
      }

      if (response.success && response.data) {
        setState({
          bookings: response.data,
          loading: false,
          error: null,
          isAuthenticated: true,
        });
      } else if (response.error === 'Session expired' || response.error === 'Not authenticated') {
        setState({
          bookings: [],
          loading: false,
          error: 'Session expired',
          isAuthenticated: false,
        });
      } else {
        setState(prev => ({
          ...prev,
          loading: false,
          error: response.error || 'Failed to load bookings',
          isAuthenticated: true,
        }));
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to load bookings';
      console.error('useBookings error:', message);
      handleNetworkError(message);
      setState(prev => ({
        ...prev,
        loading: false,
        error: message,
        isAuthenticated: true,
      }));
    }
  }, [status, includeHistory, historyFilter]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  return {
    ...state,
    refetch: fetchBookings,
  };
}

export default useBookings;