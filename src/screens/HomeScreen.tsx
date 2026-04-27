import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import MileageDisplay from '../components/MileageDisplay';
import { MileageRecord } from '../types';

interface HomeScreenProps {
  mileageData?: MileageRecord | null;
  activeBookingDistance?: string | null;
}

export default function HomeScreen({ mileageData, activeBookingDistance }: HomeScreenProps) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.welcomeCard}>
          <Text style={styles.welcomeText}>Welcome, Driver</Text>
          <Text style={styles.subtitle}>Ready to start your day</Text>
        </View>

        <View style={styles.statusCard}>
          <Text style={styles.cardTitle}>Current Status</Text>
          {activeBookingDistance ? (
            <>
              <Text style={styles.statusText}>Active Booking</Text>
              <Text style={styles.tripDistance}>Trip: {activeBookingDistance} mi</Text>
            </>
          ) : (
            <>
              <Text style={styles.statusText}>No active booking</Text>
              <Text style={styles.statusHint}>Go to Bookings to start a new mission</Text>
            </>
          )}
        </View>

        <View style={styles.vehicleCard}>
          <Text style={styles.cardTitle}>Vehicle</Text>
          <Text style={styles.vehicleText}>Not assigned</Text>
          <Text style={styles.vehicleHint}>Contact dispatch for vehicle assignment</Text>
        </View>

        <MileageDisplay mileage={mileageData || null} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  content: {
    flex: 1,
    padding: 16,
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
  cardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8E8E93',
    marginBottom: 8,
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
  tripDistance: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
    marginTop: 4,
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
  },
  vehicleHint: {
    fontSize: 14,
    color: '#8E8E93',
    marginTop: 4,
  },
});