import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, TouchableOpacity } from 'react-native';

interface HistoryBooking {
  id: number;
  ref: string;
  status: string;
  departure_address: string;
  arriving_address: string;
  pickup_datetime: string;
  dropoff_datetime: string;
  distance: string;
}

type FilterType = 'all' | 'done' | 'cancelled';

export default function HistoryScreen() {
  const [filter, setFilter] = useState<FilterType>('all');

  // Placeholder data - will be replaced with API data
  const allBookings: HistoryBooking[] = [];

  const filteredBookings = allBookings.filter((booking) => {
    if (filter === 'all') return true;
    return booking.status === filter;
  });

  const renderFilterButton = (type: FilterType, label: string) => (
    <TouchableOpacity
      style={[styles.filterButton, filter === type && styles.filterButtonActive]}
      onPress={() => setFilter(type)}
    >
      <Text style={[styles.filterText, filter === type && styles.filterTextActive]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyIcon}>📜</Text>
      <Text style={styles.emptyTitle}>No Booking History</Text>
      <Text style={styles.emptyText}>
        Completed and cancelled bookings will appear here.
      </Text>
    </View>
  );

  const renderBookingItem = ({ item }: { item: HistoryBooking }) => (
    <View style={styles.bookingCard}>
      <View style={styles.bookingHeader}>
        <Text style={styles.bookingRef}>{item.ref}</Text>
        <View style={[styles.statusBadge, item.status === 'done' ? styles.status_done : styles.status_cancelled]}>
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
          {item.dropoff_datetime
            ? `Completed: ${new Date(item.dropoff_datetime).toLocaleDateString()}`
            : item.pickup_datetime
            ? `Pickup: ${new Date(item.pickup_datetime).toLocaleDateString()}`
            : '--'}
        </Text>
        <Text style={styles.distance}>{item.distance || '--'} km</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.filterContainer}>
        {renderFilterButton('all', 'All')}
        {renderFilterButton('done', 'Done')}
        {renderFilterButton('cancelled', 'Cancelled')}
      </View>
      <FlatList
        data={filteredBookings}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderBookingItem}
        ListEmptyComponent={renderEmptyState}
        contentContainerStyle={filteredBookings.length === 0 ? styles.emptyList : styles.list}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  filterContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  filterButtonActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  filterText: {
    fontSize: 14,
    color: '#000000',
  },
  filterTextActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  list: {
    paddingHorizontal: 16,
    paddingBottom: 16,
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