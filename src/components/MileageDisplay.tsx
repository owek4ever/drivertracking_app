/**
 * Mileage Display Component
 * Shows current vehicle odometer reading from inspection records
 * Mileage is read-only from database - never collected from user
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MileageRecord } from '../types';

interface MileageDisplayProps {
  mileage: MileageRecord | null;
  vehicleId?: number;
}

// Service interval for progress bar (5000 miles)
const SERVICE_INTERVAL = 5000;

export default function MileageDisplay({ mileage }: MileageDisplayProps) {
  // Format number with thousands separator
  const formatMileage = (value: number | null): string => {
    if (value === null || value === undefined) {
      return '--';
    }
    return value.toLocaleString('en-US');
  };

  // Get current mileage (meter_out from inspection)
  const currentMileage = mileage?.meter_out ?? null;

  // Calculate progress percentage relative to service interval
  const calculateProgress = (): number => {
    if (currentMileage === null) return 0;
    // Show progress as percentage of service interval (capped at 100%)
    const progress = (currentMileage % SERVICE_INTERVAL) / SERVICE_INTERVAL;
    return Math.min(progress * 100, 100);
  };

  // Get next service milestone
  const getNextService = (): string => {
    if (currentMileage === null) return '--';
    const nextService = Math.ceil(currentMileage / SERVICE_INTERVAL) * SERVICE_INTERVAL;
    return formatMileage(nextService);
  };

  if (!mileage || currentMileage === null) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.cardTitle}>Mileage</Text>
        </View>
        <View style={styles.noDataContainer}>
          <Text style={styles.noDataText}>No mileage data</Text>
          <Text style={styles.noDataHint}>Mileage records will appear here</Text>
        </View>
      </View>
    );
  }

  const progressPercent = calculateProgress();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.cardTitle}>Mileage</Text>
        {mileage.date && (
          <Text style={styles.dateText}>
            Last update: {new Date(mileage.date).toLocaleDateString()}
          </Text>
        )}
      </View>
      
      <View style={styles.odometerContainer}>
        <Text style={styles.odometerLabel}>Current Odometer</Text>
        <Text style={styles.odometerValue}>{formatMileage(currentMileage)} mi</Text>
      </View>

      <View style={styles.progressContainer}>
        <View style={styles.progressBarBackground}>
          <View style={[styles.progressBarFill, { width: `${progressPercent}%` }]} />
        </View>
        <View style={styles.progressLabels}>
          <Text style={styles.progressLabel}>0</Text>
          <Text style={styles.progressLabel}>{SERVICE_INTERVAL.toLocaleString()}</Text>
        </View>
      </View>

      <View style={styles.serviceInfo}>
        <Text style={styles.serviceLabel}>Next service:</Text>
        <Text style={styles.serviceValue}>{getNextService()} mi</Text>
      </View>
    </View>
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
  cardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8E8E93',
  },
  dateText: {
    fontSize: 12,
    color: '#8E8E93',
  },
  noDataContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  noDataText: {
    fontSize: 16,
    color: '#000000',
    fontWeight: '600',
  },
  noDataHint: {
    fontSize: 14,
    color: '#8E8E93',
    marginTop: 4,
  },
  odometerContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  odometerLabel: {
    fontSize: 12,
    color: '#8E8E93',
    marginBottom: 4,
  },
  odometerValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#000000',
  },
  progressContainer: {
    marginBottom: 12,
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: '#E5E5EA',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#007AFF',
    borderRadius: 4,
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  progressLabel: {
    fontSize: 10,
    color: '#8E8E93',
  },
  serviceInfo: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
  },
  serviceLabel: {
    fontSize: 14,
    color: '#8E8E93',
  },
  serviceValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#34C759',
    marginLeft: 4,
  },
});