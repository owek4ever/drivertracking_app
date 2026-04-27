/**
 * TypeScript interfaces for Driver Tracking App
 * Based on Dolibarr Flotte module database schema
 */

// Booking status enum
export type BookingStatus = 'confirmed' | 'in_progress' | 'done' | 'cancelled';

// Booking interface - represents a transport mission/booking
export interface Booking {
  id: number;
  ref: string;
  status: BookingStatus;
  fk_driver: number | null;
  fk_vehicle: number | null;
  fk_customer: number | null;
  departure_address: string;
  arriving_address: string;
  pickup_datetime: string | null;
  dropoff_datetime: string | null;
  distance: string | null; // Distance in kilometers
  eta: string | null;
  // Optional coordinates
  departure_lat?: number;
  departure_lon?: number;
  arriving_lat?: number;
  arriving_lon?: number;
}

// Driver interface - driver profile
export interface Driver {
  id: number;
  firstname: string;
  lastname: string;
  phone: string;
  email: string;
  license_info: string | null;
  license_number?: string;
  license_expiry?: string;
  driver_image: string | null;
  fk_vehicle: number | null;
  fk_user: number | null;
}

// Vehicle interface - fleet vehicle
export interface Vehicle {
  id: number;
  maker: string;
  model: string;
  license_plate: string;
  engine_type: string | null;
  color: string | null;
  year: number | null;
  vin: string | null;
  initial_mileage: number | null;
  horsepower?: number;
  in_service: boolean;
}

// Customer interface - client/customer
export interface Customer {
  id: number;
  firstname: string;
  lastname: string;
  phone: string;
  company_name: string | null;
}

// Mileage record interface - from llx_flotte_inspection
export interface MileageRecord {
  id?: number;
  fk_vehicle: number;
  meter_out: number | null;
  meter_in: number | null;
  fuel_out: number | null;
  fuel_in: number | null;
  date: string;
}

// Fuel record interface - from llx_flotte_fuel
export interface FuelRecord {
  id?: number;
  fk_vehicle: number;
  qty: number;
  cost_unit: number;
  date: string;
}

// Dashboard data from /api_driver.php
export interface DashboardData {
  driver: Driver | null;
  vehicle: Vehicle | null;
  active_bookings: Booking[];
  pending_bookings: Booking[];
  completed_bookings: Booking[];
  mileage: MileageRecord | null;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Auth token response
export interface AuthTokenResponse {
  token: string;
  expires_at: string;
  driver_id: number;
}

// Booking status update request
export interface BookingStatusUpdate {
  booking_id: number;
  status: BookingStatus;
  notes?: string;
}

// Start booking request
export interface StartBookingRequest {
  booking_id: number;
}

// Update booking request
export interface UpdateBookingRequest {
  booking_id: number;
  status: BookingStatus;
}