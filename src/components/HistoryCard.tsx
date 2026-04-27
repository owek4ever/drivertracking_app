/**
 * History Card Component
 * Displays a single completed/cancelled booking in the history list
 * Shows: booking ref, pickup → dropoff, date/time, status badge, distance
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Booking } from '../types';

interface HistoryCardProps {
  booking: Booking;
  onPress?: () => void;
}

export default function HistoryCard({ booking, onPress }: HistoryCardProps) {
  const isDone = booking.status === 'done';
  const isCancelled = booking.status === 'cancelled';

  const formatDate = (dateStr: string | null): string => {
    if (!dateStr) return '--';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatTime = (dateStr: string | null): string => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDistance = (distance: string | null): string => {
    if (!distance) return '--';
    // Format as thousands separator if it's a number
    const num = parseFloat(distance);
    if (!isNaN(num)) {
      return num.toLocaleString('en-US');
    }
    return distance;
  };

  const displayDate = isDone && booking.dropoff_datetime
    ? `Completed: ${formatDate(booking.dropoff_datetime)}`
    : booking.pickup_datetime
    ? `Pickup: ${formatDate(booking.pickup_datetime)}`
    : '--';

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <Text style={styles.bookingRef}>{booking.ref}</Text>
        <View
          style={[
            styles.statusBadge,
            isDone ? styles.status_done : styles.status_cancelled,
          ]}
        >
          <Text style={styles.statusText}>
            {isDone ? 'Done' : isCancelled ? 'Cancelled' : booking.status}
          </Text>
        </View>
      </View>

      <View style={styles.routeContainer}>
        <View style={styles.routePoint}>
          <Text style={styles.routeLabel}>From:</Text>
          <Text style={styles.routeAddress} numberOfLines={2}>
            {booking.departure_address || '--'}
          </Text>
        </View>
        <View style={styles.routePoint}>
          <Text style={styles.routeLabel}>To:</Text>
          <Text style={styles.routeAddress} numberOfLines={2}>
            {booking.arriving_address || '--'}
          </Text>
        </View>
      </View>

      <View style={styles.footer}>
        <View style={styles.dateTimeContainer}>
          <Text style={styles.dateTime}>{displayDate}</Text>
          {booking.dropoff_datetime && isDone && (
            <Text style={styles.time}>{formatTime(booking.dropoff_datetime)}</Text>
          )}
        </View>
        <View style={styles.distanceContainer}>
          <Text style={styles.distanceLabel}>Distance:</Text>
          <Text style={styles.distanceValue}>{formatDistance(booking.distance)} mi</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
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
  bookingRef: {
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
  status_done: {
    backgroundColor: '#34C759', // Green for done
  },
  status_cancelled: {
    backgroundColor: '#FF3B30', // Red for cancelled
  },
  routeContainer: {
    marginBottom: 12,
  },
  routePoint: {
    marginBottom: 8,
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
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
  },
  dateTimeContainer: {
    flex: 1,
  },
  dateTime: {
    fontSize: 14,
    color: '#8E8E93',
  },
  time: {
    fontSize: 12,
    color: '#8E8E93',
    marginTop: 2,
  },
  distanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  distanceLabel: {
    fontSize: 12,
    color: '#8E8E93',
    marginRight: 4,
  },
  distanceValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#007AFF',
  },
});