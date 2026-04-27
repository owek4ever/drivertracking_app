/**
 * Booking Card Component
 * Displays booking summary: ref, addresses, customer, distance, status badge
 * Tap action navigates to BookingDetailScreen
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Booking, BookingStatus } from '../types';

interface BookingCardProps {
  booking: Booking;
  onPress: (bookingId: number) => void;
}

export default function BookingCard({ booking, onPress }: BookingCardProps) {
  // Get status badge color
  const getStatusColor = (status: BookingStatus) => {
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

  // Format date time
  const formatDateTime = (dateStr: string | null) => {
    if (!dateStr) return 'Not scheduled';
    try {
      return new Date(dateStr).toLocaleString();
    } catch {
      return dateStr;
    }
  };

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onPress(booking.id)}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <Text style={styles.ref}>{booking.ref}</Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(booking.status) }]}>
          <Text style={styles.statusText}>{booking.status.replace('_', ' ')}</Text>
        </View>
      </View>
      
      <View style={styles.details}>
        <View style={styles.row}>
          <Text style={styles.label}>From:</Text>
          <Text style={styles.value} numberOfLines={1}>{booking.departure_address}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>To:</Text>
          <Text style={styles.value} numberOfLines={1}>{booking.arriving_address}</Text>
        </View>
      </View>
      
      <View style={styles.footer}>
        <Text style={styles.dateTime}>
          {formatDateTime(booking.pickup_datetime)}
        </Text>
        <Text style={styles.distance}>{booking.distance || '--'} km</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  ref: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
    textTransform: 'capitalize',
  },
  details: {
    marginBottom: 8,
  },
  row: {
    marginBottom: 6,
  },
  label: {
    fontSize: 12,
    color: '#8E8E93',
    marginBottom: 2,
  },
  value: {
    fontSize: 14,
    color: '#000000',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
  },
  dateTime: {
    fontSize: 14,
    color: '#8E8E93',
  },
  distance: {
    fontSize: 14,
    fontWeight: '600',
    color: '#007AFF',
  },
});