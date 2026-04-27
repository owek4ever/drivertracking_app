import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList } from 'react-native';

interface Booking {
  id: number;
  ref: string;
  status: string;
  departure_address: string;
  arriving_address: string;
  pickup_datetime: string;
  distance: string;
}

export default function BookingsScreen() {
  // Placeholder data - will be replaced with API data
  const bookings: Booking[] = [];

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyIcon}>📋</Text>
      <Text style={styles.emptyTitle}>No Active Bookings</Text>
      <Text style={styles.emptyText}>
        You have no pending or in-progress bookings at the moment.
      </Text>
    </View>
  );

  const renderBookingItem = ({ item }: { item: Booking }) => (
    <View style={styles.bookingCard}>
      <View style={styles.bookingHeader}>
        <Text style={styles.bookingRef}>{item.ref}</Text>
        <View style={[styles.statusBadge, styles[`status_${item.status}`] || styles.status_confirmed]}>
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
      </View>
      <View style={styles.bookingDetails}>
        <Text style={styles.label}>From:</Text>
        <Text style={styles.value}>{item.departure_address}</Text>
      </View>
      <View style={styles.bookingDetails}>
        <Text style={styles.label}>To:</Text>
        <Text style={styles.value}>{item.arriving_address}</Text>
      </View>
      <View style={styles.bookingFooter}>
        <Text style={styles.dateTime}>
          {item.pickup_datetime ? new Date(item.pickup_datetime).toLocaleString() : 'Not scheduled'}
        </Text>
        <Text style={styles.distance}>{item.distance || '--'} km</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={bookings}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderBookingItem}
        ListEmptyComponent={renderEmptyState}
        contentContainerStyle={bookings.length === 0 ? styles.emptyList : styles.list}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  list: {
    padding: 16,
  },
  emptyList: {
    flex: 1,
    justifyContent: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    padding: 40,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: '#8E8E93',
    textAlign: 'center',
  },
  bookingCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  bookingHeader: {
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
  },
  status_confirmed: {
    backgroundColor: '#34C759',
  },
  status_in_progress: {
    backgroundColor: '#007AFF',
  },
  status_done: {
    backgroundColor: '#8E8E93',
  },
  status_cancelled: {
    backgroundColor: '#FF3B30',
  },
  bookingDetails: {
    marginBottom: 8,
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
  bookingFooter: {
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