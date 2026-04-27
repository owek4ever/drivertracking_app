/**
 * Booking Detail Screen
 * Displays full booking information with action buttons based on status
 * Status flow: confirmed → in_progress → done → cancelled
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Linking,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Booking, Customer } from '../types';
import { apiGet, startBooking, updateBookingStatus, validateBookingId } from '../services/api';

// Extend the native stack param list type
type RootStackParamList = {
  BookingDetail: { bookingId: number };
};

interface BookingDetailScreenProps {
  route: { params: { bookingId: number } };
  navigation: any;
}

export default function BookingDetailScreen({ route, navigation }: BookingDetailScreenProps) {
  const { bookingId } = route.params;
  
  const [booking, setBooking] = useState<Booking | null>(null);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const fetchBooking = useCallback(async () => {
    try {
      const token = await import('../services/api').then(m => m.getAuthToken());
      if (!token) {
        Alert.alert('Error', 'Not authenticated');
        return;
      }

      const response = await apiGet<Booking>(`/api/index.php/flotte/bookings/${bookingId}`);
      
      if (response.success && response.data) {
        setBooking(response.data);
        
        // Fetch customer info if available
        if (response.data.fk_customer) {
          const customerResponse = await apiGet<Customer>(
            `/api/index.php/flotte/customers/${response.data.fk_customer}`
          );
          if (customerResponse.success && customerResponse.data) {
            setCustomer(customerResponse.data);
          }
        }
      } else {
        Alert.alert('Error', response.error || 'Failed to load booking');
      }
    } catch (error) {
      console.error('Error fetching booking:', error);
      Alert.alert('Error', 'Failed to load booking details');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [bookingId]);

  // Fetch on mount and focus
  useFocusEffect(
    useCallback(() => {
      fetchBooking();
    }, [fetchBooking])
  );

  const handleRefresh = () => {
    setRefreshing(true);
    fetchBooking();
  };

  // Handle starting a booking (confirmed → in_progress)
  const handleStartBooking = async () => {
    // Validate booking ID (T-01-04)
    if (!validateBookingId(bookingId)) {
      Alert.alert('Error', 'Invalid booking ID');
      return;
    }

    Alert.alert(
      'Start Booking',
      'Are you sure you want to start this booking?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Start',
          onPress: async () => {
            setActionLoading(true);
            const response = await startBooking(bookingId);
            setActionLoading(false);

            if (response.success) {
              Alert.alert('Success', 'Booking started successfully', [
                {
                  text: 'OK',
                  onPress: () => fetchBooking(),
                },
              ]);
            } else {
              Alert.alert('Error', response.error || 'Failed to start booking');
            }
          },
        },
      ]
    );
  };

  // Handle completing or cancelling a booking (in_progress → done/cancelled)
  const handleUpdateStatus = async (action: 'complete' | 'cancel') => {
    // Validate booking ID (T-01-04)
    if (!validateBookingId(bookingId)) {
      Alert.alert('Error', 'Invalid booking ID');
      return;
    }

    const actionText = action === 'complete' ? 'complete' : 'cancel';
    
    Alert.alert(
      `${actionText.charAt(0).toUpperCase() + actionText.slice(1)} Booking`,
      `Are you sure you want to ${actionText} this booking?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: actionText.charAt(0).toUpperCase() + actionText.slice(1),
          onPress: async () => {
            setActionLoading(true);
            const response = await updateBookingStatus(bookingId, action);
            setActionLoading(false);

            if (response.success) {
              Alert.alert('Success', `Booking ${actionText}ed successfully`, [
                {
                  text: 'OK',
                  onPress: () => fetchBooking(),
                },
              ]);
            } else {
              Alert.alert('Error', response.error || `Failed to ${actionText} booking`);
            }
          },
        },
      ]
    );
  };

  // Handle phone call
  const handleCallCustomer = () => {
    if (customer?.phone) {
      Linking.openURL(`tel:${customer.phone}`);
    }
  };

  // Format datetime
  const formatDateTime = (dateStr: string | null) => {
    if (!dateStr) return 'Not scheduled';
    try {
      return new Date(dateStr).toLocaleString();
    } catch {
      return dateStr;
    }
  };

  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return '#34C759';
      case 'in_progress':
        return '#007AFF';
      case 'done':
        return '#8E8E93';
      case 'cancelled':
        return '#FF3B30';
      default:
        return '#8E8E93';
    }
  };

  // Render action buttons based on status
  const renderActionButtons = () => {
    if (!booking) return null;

    // Disable buttons during API call (T-01-06)
    const disabled = actionLoading;

    if (booking.status === 'confirmed') {
      return (
        <TouchableOpacity
          style={[styles.primaryButton, disabled && styles.buttonDisabled]}
          onPress={handleStartBooking}
          disabled={disabled}
        >
          {actionLoading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.primaryButtonText}>Start Booking</Text>
          )}
        </TouchableOpacity>
      );
    }

    if (booking.status === 'in_progress') {
      return (
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.secondaryButton, disabled && styles.buttonDisabled]}
            onPress={() => handleUpdateStatus('cancel')}
            disabled={disabled}
          >
            {actionLoading ? (
              <ActivityIndicator color="#FF3B30" />
            ) : (
              <Text style={styles.secondaryButtonText}>Cancel</Text>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.primaryButton, styles.completeButton, disabled && styles.buttonDisabled]}
            onPress={() => handleUpdateStatus('complete')}
            disabled={disabled}
          >
            {actionLoading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.primaryButtonText}>Complete</Text>
            )}
          </TouchableOpacity>
        </View>
      );
    }

    // done or cancelled - no actions
    return (
      <View style={styles.completedContainer}>
        <Text style={styles.completedText}>
          This booking has been {booking.status === 'done' ? 'completed' : 'cancelled'}.
        </Text>
      </View>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Loading booking...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!booking) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Booking not found</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchBooking}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshing={refreshing}
        onRefresh={handleRefresh}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.bookingRef}>{booking.ref}</Text>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(booking.status) }]}>
            <Text style={styles.statusText}>{booking.status.replace('_', ' ')}</Text>
          </View>
        </View>

        {/* Pickup Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionIcon}>📍</Text>
            <Text style={styles.sectionTitle}>Pickup</Text>
          </View>
          <Text style={styles.address}>{booking.departure_address}</Text>
          <Text style={styles.dateTime}>
            {formatDateTime(booking.pickup_datetime)}
          </Text>
        </View>

        {/* Dropoff Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionIcon}>🏁</Text>
            <Text style={styles.sectionTitle}>Dropoff</Text>
          </View>
          <Text style={styles.address}>{booking.arriving_address}</Text>
          <Text style={styles.dateTime}>
            {formatDateTime(booking.dropoff_datetime)}
          </Text>
        </View>

        {/* Customer Section */}
        {customer && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionIcon}>👤</Text>
              <Text style={styles.sectionTitle}>Customer</Text>
            </View>
            <Text style={styles.customerName}>
              {customer.firstname} {customer.lastname}
              {customer.company_name && ` (${customer.company_name})`}
            </Text>
            {customer.phone && (
              <TouchableOpacity onPress={handleCallCustomer} style={styles.phoneButton}>
                <Text style={styles.phoneText}>📞 {customer.phone}</Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* Distance Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionIcon}>📏</Text>
            <Text style={styles.sectionTitle}>Distance</Text>
          </View>
          <Text style={styles.distance}>
            {booking.distance ? `${booking.distance} km` : 'Not specified'}
          </Text>
        </View>

        {/* ETA Section */}
        {booking.eta && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionIcon}>⏱️</Text>
              <Text style={styles.sectionTitle}>Estimated Arrival</Text>
            </View>
            <Text style={styles.eta}>{booking.eta}</Text>
          </View>
        )}
      </ScrollView>

      {/* Action Buttons */}
      <View style={styles.actionContainer}>
        {renderActionButtons()}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#8E8E93',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: '#FF3B30',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  bookingRef: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    textTransform: 'capitalize',
  },
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8E8E93',
    textTransform: 'uppercase',
  },
  address: {
    fontSize: 16,
    color: '#000000',
    marginBottom: 4,
  },
  dateTime: {
    fontSize: 14,
    color: '#8E8E93',
  },
  customerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 4,
  },
  phoneButton: {
    marginTop: 8,
  },
  phoneText: {
    fontSize: 16,
    color: '#007AFF',
  },
  distance: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  eta: {
    fontSize: 16,
    color: '#000000',
  },
  actionContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
  },
  primaryButton: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FF3B30',
    flex: 1,
    marginRight: 8,
  },
  secondaryButtonText: {
    color: '#FF3B30',
    fontSize: 18,
    fontWeight: '600',
  },
  completeButton: {
    backgroundColor: '#34C759',
    borderColor: '#34C759',
    flex: 1,
    marginLeft: 8,
  },
  buttonRow: {
    flexDirection: 'row',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  completedContainer: {
    backgroundColor: '#F2F2F7',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  completedText: {
    fontSize: 16,
    color: '#8E8E93',
  },
});