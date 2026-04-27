/**
 * Home Screen
 * Displays driver info, vehicle info, active booking, and mileage
 */

import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import MileageDisplay from '../components/MileageDisplay';
import EmergencyContacts from '../components/EmergencyContacts';
import { useDashboard } from '../hooks/useDashboard';
import { Booking } from '../types';

interface HomeScreenProps {
  // Props for standalone usage (will use dashboard hook internally)
}

export default function HomeScreen() {
  const navigation = useNavigation<any>();
  const {
    driverInfo,
    vehicleInfo,
    activeBooking,
    pendingBookings,
    loading,
    error,
    isAuthenticated,
    refetch,
  } = useDashboard();

  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  const handleNavigateToBookings = () => {
    navigation.navigate('Bookings');
  };

  const handleNavigateToBookingDetail = (bookingId: number) => {
    navigation.navigate('Bookings', {
      screen: 'BookingDetail',
      params: { bookingId },
    });
  };

  // Format date time
  const formatDateTime = (dateStr: string | null) => {
    if (!dateStr) return 'Not scheduled';
    try {
      return new Date(dateStr).toLocaleString();
    } catch {
      return dateStr;
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!isAuthenticated) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Session expired</Text>
          <Text style={styles.errorHint}>Please log in again</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={['#007AFF']}
            tintColor="#007AFF"
          />
        }
      >
        {/* Welcome Card */}
        <View style={styles.welcomeCard}>
          <Text style={styles.welcomeText}>
            Welcome, {driverInfo ? `${driverInfo.firstname}` : 'Driver'}
          </Text>
          <Text style={styles.subtitle}>
            {activeBooking ? 'You have an active booking' : 'Ready to start your day'}
          </Text>
        </View>

        {/* Active Booking Card */}
        {activeBooking ? (
          <TouchableOpacity
            style={styles.statusCard}
            onPress={() => handleNavigateToBookingDetail(activeBooking.id)}
            activeOpacity={0.7}
          >
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Active Booking</Text>
              <View style={styles.inProgressBadge}>
                <Text style={styles.inProgressText}>In Progress</Text>
              </View>
            </View>
            <Text style={styles.bookingRef}>{activeBooking.ref}</Text>
            <View style={styles.routeInfo}>
              <View style={styles.routePoint}>
                <Text style={styles.routeLabel}>From:</Text>
                <Text style={styles.routeAddress} numberOfLines={1}>
                  {activeBooking.departure_address}
                </Text>
              </View>
              <View style={styles.routePoint}>
                <Text style={styles.routeLabel}>To:</Text>
                <Text style={styles.routeAddress} numberOfLines={1}>
                  {activeBooking.arriving_address}
                </Text>
              </View>
            </View>
            <View style={styles.bookingFooter}>
              <Text style={styles.tripDistance}>
                {activeBooking.distance ? `${activeBooking.distance} km` : '--'}
              </Text>
              <Text style={styles.viewDetails}>View Details →</Text>
            </View>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.statusCard}
            onPress={handleNavigateToBookings}
            activeOpacity={0.7}
          >
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Current Status</Text>
            </View>
            <Text style={styles.statusText}>No active booking</Text>
            <Text style={styles.statusHint}>
              {pendingBookings.length > 0
                ? `You have ${pendingBookings.length} pending booking${pendingBookings.length > 1 ? 's' : ''}`
                : 'Go to Bookings to start a new mission'}
            </Text>
            {pendingBookings.length > 0 && (
              <View style={styles.startPrompt}>
                <Text style={styles.startPromptText}>Tap to view pending bookings</Text>
              </View>
            )}
          </TouchableOpacity>
        )}

        {/* Vehicle Card */}
        <View style={styles.vehicleCard}>
          <Text style={styles.cardTitle}>Vehicle</Text>
          {vehicleInfo ? (
            <>
              <Text style={styles.vehicleText}>
                {vehicleInfo.maker} {vehicleInfo.model}
              </Text>
              <Text style={styles.vehiclePlate}>{vehicleInfo.license_plate}</Text>
            </>
          ) : (
            <>
              <Text style={styles.vehicleText}>Not assigned</Text>
              <Text style={styles.vehicleHint}>Contact dispatch for vehicle assignment</Text>
            </>
          )}
        </View>

        {/* Emergency Contacts */}
        <EmergencyContacts
          dispatchPhone="1234567890"
          customerPhone={activeBooking?.customer?.phone || pendingBookings[0]?.customer?.phone}
          managerPhone="0987654321"
        />

        {/* Mileage Display */}
        <MileageDisplay mileage={null} />
      </ScrollView>
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
  content: {
    padding: 16,
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
    fontWeight: '600',
    color: '#FF3B30',
    marginBottom: 4,
  },
  errorHint: {
    fontSize: 14,
    color: '#8E8E93',
  },
  welcomeCard: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  subtitle: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.8,
    marginTop: 4,
  },
  statusCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8E8E93',
  },
  inProgressBadge: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  inProgressText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  statusText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
  },
  statusHint: {
    fontSize: 14,
    color: '#8E8E93',
    marginTop: 4,
  },
  startPrompt: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
  },
  startPromptText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#007AFF',
  },
  bookingRef: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 12,
  },
  routeInfo: {
    marginBottom: 12,
  },
  routePoint: {
    marginBottom: 6,
  },
  routeLabel: {
    fontSize: 12,
    color: '#8E8E93',
    marginBottom: 2,
  },
  routeAddress: {
    fontSize: 14,
    color: '#000000',
  },
  bookingFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
  },
  tripDistance: {
    fontSize: 18,
    fontWeight: '600',
    color: '#007AFF',
  },
  viewDetails: {
    fontSize: 14,
    color: '#007AFF',
  },
  vehicleCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  vehicleText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    marginTop: 4,
  },
  vehiclePlate: {
    fontSize: 14,
    color: '#8E8E93',
    marginTop: 2,
  },
  vehicleHint: {
    fontSize: 14,
    color: '#8E8E93',
    marginTop: 4,
  },
});