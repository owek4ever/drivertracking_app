/**
 * Vehicle Status Bars Component
 * Displays vehicle mileage and fuel level as progress bars with color coding
 * Uber-style design: black/white, whisper shadows, high contrast
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MileageRecord, Vehicle } from '../types';

interface VehicleStatusBarsProps {
  mileage: MileageRecord | null;
  vehicleInfo: Vehicle | null;
}

const SERVICE_INTERVAL = 5000;

export default function VehicleStatusBars({ mileage, vehicleInfo }: VehicleStatusBarsProps) {
  const currentMileage = mileage?.meter_out ?? null;

  const formatMileage = (value: number | null): string => {
    if (value === null || value === undefined) return '--';
    return value.toLocaleString('en-US');
  };

  const calculateMileageProgress = (): number => {
    if (currentMileage === null) return 0;
    const progress = (currentMileage % SERVICE_INTERVAL) / SERVICE_INTERVAL;
    return Math.min(progress * 100, 100);
  };

  const getFuelColor = (percentage: number | undefined): string => {
    if (percentage === undefined || percentage === null) return '#8E8E93';
    if (percentage > 50) return '#34C759'; // Green
    if (percentage >= 20) return '#FFCC00'; // Yellow
    return '#FF3B30'; // Red
  };

  const getFuelLabel = (percentage: number | undefined): string => {
    if (percentage === undefined || percentage === null) return 'Unknown';
    if (percentage > 50) return 'Good';
    if (percentage >= 20) return 'Medium';
    return 'Low';
  };

  const mileageProgress = calculateMileageProgress();
  const fuelPercentage = vehicleInfo?.fuel_percentage ?? null;
  const fuelColor = getFuelColor(fuelPercentage);
  const fuelLabel = getFuelLabel(fuelPercentage);

  return (
    <View style={styles.container}>
      {/* Mileage Bar */}
      <View style={styles.barSection}>
        <View style={styles.barHeader}>
          <Text style={styles.barLabel}>Mileage</Text>
          <Text style={styles.barValue}>{formatMileage(currentMileage)} mi</Text>
        </View>
        <View style={styles.progressBarBackground}>
          <View style={[styles.progressBarFill, { width: `${mileageProgress}%` }]} />
        </View>
        <View style={styles.barFooter}>
          <Text style={styles.barFooterText}>0</Text>
          <Text style={styles.barFooterText}>{SERVICE_INTERVAL.toLocaleString()} mi</Text>
        </View>
      </View>

      <View style={styles.divider} />

      {/* Fuel Bar */}
      <View style={styles.barSection}>
        <View style={styles.barHeader}>
          <Text style={styles.barLabel}>Fuel Level</Text>
          <View style={styles.fuelValueContainer}>
            <Text style={[styles.barValue, { color: fuelColor }]}>
              {fuelPercentage !== null ? `${fuelPercentage}%` : '--'}
            </Text>
            <Text style={[styles.fuelLabel, { color: fuelColor }]}>{fuelLabel}</Text>
          </View>
        </View>
        <View style={styles.progressBarBackground}>
          <View
            style={[
              styles.progressBarFill,
              { width: `${fuelPercentage ?? 0}%`, backgroundColor: fuelColor },
            ]}
          />
        </View>
        <View style={styles.barFooter}>
          <Text style={styles.barFooterText}>0%</Text>
          <Text style={styles.barFooterText}>100%</Text>
        </View>
      </View>
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
  barSection: {
    marginBottom: 8,
  },
  barHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  barLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
  },
  barValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000000',
  },
  fuelValueContainer: {
    alignItems: 'flex-end',
  },
  fuelLabel: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 2,
  },
  progressBarBackground: {
    height: 12,
    backgroundColor: '#E5E5EA',
    borderRadius: 6,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#000000',
    borderRadius: 6,
  },
  barFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  barFooterText: {
    fontSize: 10,
    color: '#8E8E93',
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E5EA',
    marginVertical: 12,
  },
});