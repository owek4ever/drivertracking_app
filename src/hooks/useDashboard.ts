/**
 * Dashboard Hook
 * Fetches and manages dashboard data: driver info, active booking, vehicle info, mileage
 */

import { useState, useEffect, useCallback } from 'react';
import { getDashboard, getMileage, clearAuthToken } from '../services/api';
import { Driver, Vehicle, Booking, MileageRecord } from '../types';

interface DashboardState {
  driverInfo: Driver | null;
  vehicleInfo: Vehicle | null;
  activeBooking: Booking | null;
  pendingBookings: Booking[];
  completedBookings: Booking[];
  mileage: MileageRecord | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

interface UseDashboardReturn extends DashboardState {
  refetch: () => Promise<void>;
  logout: () => Promise<void>;
}

export function useDashboard(): UseDashboardReturn {
  const [state, setState] = useState<DashboardState>({
    driverInfo: null,
    vehicleInfo: null,
    activeBooking: null,
    pendingBookings: [],
    completedBookings: [],
    mileage: null,
    loading: true,
    error: null,
    isAuthenticated: true,
  });

  const fetchDashboard = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    const response = await getDashboard();

    if (response.success && response.data) {
      const { driver, vehicle, active_bookings, pending_bookings, completed_bookings, mileage } = response.data;
      
      // Find active booking (status = in_progress)
      const active = active_bookings?.find((b: Booking) => b.status === 'in_progress') || null;
      
      // If mileage not provided in dashboard, fetch it separately
      let mileageData = mileage || null;
      if (!mileageData && vehicle) {
        const mileageResponse = await getMileage(vehicle.id);
        if (mileageResponse.success) {
          mileageData = mileageResponse.data;
        }
      }
      
      setState({
        driverInfo: driver || null,
        vehicleInfo: vehicle || null,
        activeBooking: active,
        pendingBookings: pending_bookings || [],
        completedBookings: completed_bookings || [],
        mileage: mileageData,
        loading: false,
        error: null,
        isAuthenticated: true,
      });
    } else if (response.error === 'Session expired' || response.error === 'Not authenticated') {
      setState({
        driverInfo: null,
        vehicleInfo: null,
        activeBooking: null,
        pendingBookings: [],
        completedBookings: [],
        mileage: null,
        loading: false,
        error: 'Session expired',
        isAuthenticated: false,
      });
    } else {
      setState(prev => ({
        ...prev,
        loading: false,
        error: response.error || 'Failed to load dashboard',
        isAuthenticated: true,
      }));
    }
  }, []);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  const logout = useCallback(async () => {
    await clearAuthToken();
    setState({
      driverInfo: null,
      vehicleInfo: null,
      activeBooking: null,
      pendingBookings: [],
      completedBookings: [],
      mileage: null,
      loading: false,
      error: null,
      isAuthenticated: false,
    });
  }, []);

  return {
    ...state,
    refetch: fetchDashboard,
    logout,
  };
}

export default useDashboard;