/**
 * Task Schedule Component
 * Displays upcoming/pending bookings on HomeScreen
 * Uber-style design: black/white, pill buttons, high contrast
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { Booking } from '../types';

interface TaskScheduleProps {
  bookings: Booking[];
  onBookingPress?: (bookingId: number) => void;
}

export default function TaskSchedule({ bookings, onBookingPress }: TaskScheduleProps) {
  // Sort by scheduled date/pickup time and take first 5
  const sortedBookings = [...bookings]
    .sort((a, b) => {
      const dateA = a.scheduled_date || a.pickup_datetime || '';
      const dateB = b.scheduled_date || b.pickup_datetime || '';
      return new Date(dateA).getTime() - new Date(dateB).getTime();
    })
    .slice(0, 5);

  const formatDateTime = (dateStr: string | null) => {
    if (!dateStr) return 'Not scheduled';
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
      });
    } catch {
      return dateStr;
    }
  };

  const getCustomerName = (booking: Booking): string => {
    if (booking.customer) {
      return `${booking.customer.firstname} ${booking.customer.lastname}`;
    }
    return 'Unknown Customer';
  };

  const renderBookingItem = ({ item }: { item: Booking }) => (
    <TouchableOpacity
      style={styles.bookingItem}
      onPress={() => onBookingPress?.(item.id)}
      activeOpacity={0.7}
    >
      <View style={styles.bookingTimeContainer}>
        <Text style={styles.bookingTime}>
          {formatDateTime(item.scheduled_date || item.pickup_datetime)}
        </Text>
      </View>
      <View style={styles.bookingDetails}>
        <Text style={styles.customerName} numberOfLines={1}>
          {getCustomerName(item)}
        </Text>
        <Text style={styles.bookingRef}>{item.ref}</Text>
        <Text style={styles.destination} numberOfLines={1}>
          → {item.arriving_address}
        </Text>
      </View>
      <View style={styles.arrowContainer}>
        <Text style={styles.arrow}>→</Text>
      </View>
    </TouchableOpacity>
  );

  if (sortedBookings.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Upcoming Tasks</Text>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No pending tasks</Text>
          <Text style={styles.emptyHint}>Your schedule is clear</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Upcoming Tasks</Text>
      <FlatList
        data={sortedBookings}
        renderItem={renderBookingItem}
        keyExtractor={(item) => item.id.toString()}
        scrollEnabled={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    shadowColor: 'rgba(0, 0, 0, 0.12)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 16,
    elevation: 2,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 12,
  },
  bookingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  bookingTimeContainer: {
    backgroundColor: '#000000',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 12,
  },
  bookingTime: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  bookingDetails: {
    flex: 1,
  },
  customerName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
  },
  bookingRef: {
    fontSize: 12,
    color: '#8E8E93',
    marginTop: 2,
  },
  destination: {
    fontSize: 12,
    color: '#4B4B4B',
    marginTop: 2,
  },
  arrowContainer: {
    width: 32,
    height: 32,
    borderRadius: 999,
    backgroundColor: '#EFEFEF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrow: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000000',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
  },
  emptyHint: {
    fontSize: 14,
    color: '#8E8E93',
    marginTop: 4,
  },
});