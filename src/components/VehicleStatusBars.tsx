/**
 * Vehicle Status Bars Component
 * Displays vehicle mileage and fuel level as progress bars with color coding
 * Uber-style design: black/white, whisper shadows, high contrast
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MileageRecord, Vehicle } from '../types';
import { useTheme } from '../context/ThemeContext';

interface VehicleStatusBarsProps {
  mileage: MileageRecord | null;
  vehicleInfo: Vehicle | null;
}

const SERVICE_INTERVAL = 5000;

export default function VehicleStatusBars({ mileage, vehicleInfo }: VehicleStatusBarsProps) {
  const { colors } = useTheme();
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
    if (percentage === undefined || percentage === null) return colors.textMuted;
    if (percentage > 50) return colors.success;
    if (percentage >= 20) return colors.warning;
    return colors.error;
  };

  const getFuelLabel = (percentage: number | undefined): string => {
    if (percentage === undefined || percentage === null) return 'Unknown';
    if (percentage > 50) return 'Good';
    if (percentage >= 20) return 'Medium';
    return 'Low';
  };

  const mileageProgress = calculateMileageProgress();
  const hasMileageData = currentMileage !== null && currentMileage > 0;
  const fuelPercentage = vehicleInfo?.fuel_percentage ?? null;
  const hasFuelData = fuelPercentage !== null && fuelPercentage !== undefined;
  const fuelColor = getFuelColor(fuelPercentage);
  const fuelLabel = getFuelLabel(fuelPercentage);

  return (
    <View style={[styles.container, { backgroundColor: colors.card, shadowColor: colors.text }]}>
      {/* Mileage Bar */}
      <View style={styles.barSection}>
        <View style={styles.barHeader}>
          <Text style={[styles.barLabel, { color: colors.text }]}>Mileage</Text>
          <Text style={[styles.barValue, { color: colors.text }]}>
            {formatMileage(currentMileage)} mi
          </Text>
        </View>
        <View style={[styles.progressBarBackground, { backgroundColor: colors.progressTrack }]}>
          {hasMileageData ? (
            <View
              style={[
                styles.progressBarFill,
                { width: `${mileageProgress}%`, backgroundColor: colors.progressFill },
              ]}
            />
          ) : (
            <View style={styles.emptyIndicator}>
              <Text style={[styles.emptyText, { color: colors.textMuted }]}>No data</Text>
            </View>
          )}
        </View>
        <View style={styles.barFooter}>
          <Text style={[styles.barFooterText, { color: colors.textMuted }]}>0</Text>
          <Text style={[styles.barFooterText, { color: colors.textMuted }]}>
            {SERVICE_INTERVAL.toLocaleString()} mi
          </Text>
        </View>
      </View>

      <View style={[styles.divider, { backgroundColor: colors.divider }]} />

      {/* Fuel Bar */}
      <View style={styles.barSection}>
        <View style={styles.barHeader}>
          <Text style={[styles.barLabel, { color: colors.text }]}>Fuel Level</Text>
          <View style={styles.fuelValueContainer}>
            <Text style={[styles.barValue, { color: hasFuelData ? fuelColor : colors.textMuted }]}>
              {hasFuelData ? `${fuelPercentage}%` : '--'}
            </Text>
            {hasFuelData && (
              <Text style={[styles.fuelLabel, { color: fuelColor }]}>{fuelLabel}</Text>
            )}
          </View>
        </View>
        <View style={[styles.progressBarBackground, { backgroundColor: colors.progressTrack }]}>
          {hasFuelData ? (
            <View
              style={[
                styles.progressBarFill,
                { width: `${fuelPercentage}%`, backgroundColor: fuelColor },
              ]}
            />
          ) : (
            <View style={styles.emptyIndicator}>
              <Text style={[styles.emptyText, { color: colors.textMuted }]}>No data</Text>
            </View>
          )}
        </View>
        <View style={styles.barFooter}>
          <Text style={[styles.barFooterText, { color: colors.textMuted }]}>0%</Text>
          <Text style={[styles.barFooterText, { color: colors.textMuted }]}>100%</Text>
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
  },
  barValue: {
    fontSize: 18,
    fontWeight: '700',
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
    borderRadius: 6,
    overflow: 'hidden',
    justifyContent: 'center',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 6,
  },
  emptyIndicator: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 10,
    fontWeight: '500',
  },
  barFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  barFooterText: {
    fontSize: 10,
  },
  divider: {
    height: 1,
    marginVertical: 12,
  },
});