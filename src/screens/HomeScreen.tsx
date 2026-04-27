/**
 * Home Screen
 * Displays driver info, vehicle status, task schedule, active booking, and mileage
 * Uber-style design: black/white high contrast, pill buttons, whisper shadows
 */

import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import MileageDisplay from '../components/MileageDisplay';
import EmergencyContacts from '../components/EmergencyContacts';
import VehicleStatusBars from '../components/VehicleStatusBars';
import TaskSchedule from '../components/TaskSchedule';
import { useDashboard } from '../hooks/useDashboard';
import { useTheme } from '../context/ThemeContext';
import { Booking } from '../types';

interface HomeScreenProps {
  // Props for standalone usage (will use dashboard hook internally)
}

export default function HomeScreen() {
  const navigation = useNavigation<any>();
  const { theme, isDark, toggleTheme } = useTheme();
  const {
    driverInfo,
    vehicleInfo,
    activeBooking,
    pendingBookings,
    mileage,
    loading,
    error,
    isAuthenticated,
    refetch,
  } = useDashboard();

  const [refreshing, setRefreshing] = useState(false);

  // Theme colors
  const colors = {
    background: isDark ? '#000000' : '#F2F2F7',
    card: isDark ? '#1C1C1E' : '#FFFFFF',
    text: isDark ? '#FFFFFF' : '#000000',
    textSecondary: isDark ? '#8E8E93' : '#8E8E93',
    border: isDark ? '#38383A' : '#E5E5EA',
    accent: '#000000',
    accentText: '#FFFFFF',
  };

  useEffect(() => {
    // Set up header with theme toggle
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          style={styles.themeToggle}
          onPress={toggleTheme}
          activeOpacity={0.7}
        >
          <Text style={styles.themeToggleText}>{isDark ? '☀️' : '🌙'}</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation, toggleTheme, isDark]);

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
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.accent} />
          <Text style={[styles.loadingText, { color: colors.textSecondary }]}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!isAuthenticated) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: '#FF3B30' }]}>Session expired</Text>
          <Text style={[styles.errorHint, { color: colors.textSecondary }]}>Please log in again</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[colors.accent]}
            tintColor={colors.accent}
          />
        }
      >
        {/* Welcome Card - Uber Black */}
        <View style={[styles.welcomeCard, { backgroundColor: colors.accent }]}>
          <Text style={[styles.welcomeText, { color: colors.accentText }]}>
            Welcome, {driverInfo ? `${driverInfo.firstname}` : 'Driver'}
          </Text>
          <Text style={[styles.subtitle, { color: colors.accentText }]}>
            {activeBooking ? 'You have an active booking' : 'Ready to start your day'}
          </Text>
        </View>

        {/* Active Booking Card */}
        {activeBooking ? (
          <TouchableOpacity
            style={[styles.statusCard, { backgroundColor: colors.card }]}
            onPress={() => handleNavigateToBookingDetail(activeBooking.id)}
            activeOpacity={0.7}
          >
            <View style={styles.cardHeader}>
              <Text style={[styles.cardTitle, { color: colors.textSecondary }]}>Active Booking</Text>
              <View style={styles.inProgressBadge}>
                <Text style={styles.inProgressText}>In Progress</Text>
              </View>
            </View>
            <Text style={[styles.bookingRef, { color: colors.text }]}>{activeBooking.ref}</Text>
            <View style={styles.routeInfo}>
              <View style={styles.routePoint}>
                <Text style={[styles.routeLabel, { color: colors.textSecondary }]}>From:</Text>
                <Text style={[styles.routeAddress, { color: colors.text }]} numberOfLines={1}>
                  {activeBooking.departure_address}
                </Text>
              </View>
              <View style={styles.routePoint}>
                <Text style={[styles.routeLabel, { color: colors.textSecondary }]}>To:</Text>
                <Text style={[styles.routeAddress, { color: colors.text }]} numberOfLines={1}>
                  {activeBooking.arriving_address}
                </Text>
              </View>
            </View>
            <View style={[styles.bookingFooter, { borderTopColor: colors.border }]}>
              <Text style={styles.tripDistance}>
                {activeBooking.distance ? `${activeBooking.distance} km` : '--'}
              </Text>
              <Text style={styles.viewDetails}>View Details →</Text>
            </View>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.statusCard, { backgroundColor: colors.card }]}
            onPress={handleNavigateToBookings}
            activeOpacity={0.7}
          >
            <View style={styles.cardHeader}>
              <Text style={[styles.cardTitle, { color: colors.textSecondary }]}>Current Status</Text>
            </View>
            <Text style={[styles.statusText, { color: colors.text }]}>No active booking</Text>
            <Text style={[styles.statusHint, { color: colors.textSecondary }]}>
              {pendingBookings.length > 0
                ? `You have ${pendingBookings.length} pending booking${pendingBookings.length > 1 ? 's' : ''}`
                : 'Go to Bookings to start a new mission'}
            </Text>
            {pendingBookings.length > 0 && (
              <View style={[styles.startPrompt, { borderTopColor: colors.border }]}>
                <Text style={styles.startPromptText}>Tap to view pending bookings</Text>
              </View>
            )}
          </TouchableOpacity>
        )}

        {/* Vehicle Card */}
        <View style={[styles.vehicleCard, { backgroundColor: colors.card }]}>
          <Text style={[styles.cardTitle, { color: colors.textSecondary }]}>Vehicle</Text>
          {vehicleInfo ? (
            <>
              <Text style={[styles.vehicleText, { color: colors.text }]}>
                {vehicleInfo.maker} {vehicleInfo.model}
              </Text>
              <Text style={[styles.vehiclePlate, { color: colors.textSecondary }]}>
                {vehicleInfo.license_plate}
              </Text>
            </>
          ) : (
            <>
              <Text style={[styles.vehicleText, { color: colors.text }]}>Not assigned</Text>
              <Text style={[styles.vehicleHint, { color: colors.textSecondary }]}>
                Contact dispatch for vehicle assignment
              </Text>
            </>
          )}
        </View>

        {/* Vehicle Status Bars - Mileage + Fuel */}
        <VehicleStatusBars mileage={mileage} vehicleInfo={vehicleInfo} />

        {/* Task Schedule - Upcoming Bookings */}
        <TaskSchedule
          bookings={pendingBookings}
          onBookingPress={handleNavigateToBookingDetail}
        />

        {/* Emergency Contacts */}
        <EmergencyContacts
          dispatchPhone="1234567890"
          customerPhone={activeBooking?.customer?.phone || pendingBookings[0]?.customer?.phone}
          managerPhone="0987654321"
        />

        {/* Mileage Display (Legacy) */}
        <MileageDisplay mileage={mileage} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    marginBottom: 4,
  },
  errorHint: {
    fontSize: 14,
  },
  themeToggle: {
    marginRight: 16,
    padding: 8,
    borderRadius: 999,
    backgroundColor: '#EFEFEF',
  },
  themeToggleText: {
    fontSize: 20,
  },
  welcomeCard: {
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 14,
    opacity: 0.8,
    marginTop: 4,
  },
  statusCard: {
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    shadowColor: 'rgba(0, 0, 0, 0.12)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 16,
    elevation: 2,
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
  },
  inProgressBadge: {
    backgroundColor: '#000000',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  inProgressText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  statusText: {
    fontSize: 18,
    fontWeight: '600',
  },
  statusHint: {
    fontSize: 14,
    marginTop: 4,
  },
  startPrompt: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
  },
  startPromptText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
  },
  bookingRef: {
    fontSize: 20,
    fontWeight: 'bold',
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
    marginBottom: 2,
  },
  routeAddress: {
    fontSize: 14,
  },
  bookingFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
  },
  tripDistance: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
  },
  viewDetails: {
    fontSize: 14,
    color: '#000000',
    fontWeight: '500',
  },
  vehicleCard: {
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    shadowColor: 'rgba(0, 0, 0, 0.12)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 16,
    elevation: 2,
  },
  vehicleText: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 4,
  },
  vehiclePlate: {
    fontSize: 14,
    marginTop: 2,
  },
  vehicleHint: {
    fontSize: 14,
    marginTop: 4,
  },
});