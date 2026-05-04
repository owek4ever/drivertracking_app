/**
 * Emergency Contacts Component
 * Quick-call buttons for dispatch, customer, and manager
 * Uses Uber design system: black/white, pill buttons, whisper shadows
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Alert,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';

interface EmergencyContactsProps {
  dispatchPhone: string;
  customerPhone?: string;
  managerPhone: string;
}

interface ContactButtonProps {
  label: string;
  phone: string;
  icon?: string;
  disabled?: boolean;
}

const ContactButton: React.FC<ContactButtonProps & { colors: any }> = ({
  label,
  phone,
  disabled = false,
  colors,
}) => {
  const handlePress = () => {
    const url = `tel:${phone}`;
    Linking.canOpenURL(url)
    .then((supported) => {
      if (supported) {
        Linking.openURL(url);
      } else {
        Alert.alert('Error', 'Phone call not supported on this device');
      }
    })
    .catch((err) => {
      console.error('Error opening phone dialer:', err);
      Alert.alert('Error', 'Failed to open phone dialer');
    });
  };

  return (
    <TouchableOpacity
      style={[
        styles.button,
        { backgroundColor: disabled ? colors.secondary : colors.primary },
      ]}
      onPress={handlePress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      <Text
        style={[
          styles.buttonIcon,
          { color: disabled ? colors.textMuted : colors.primaryText },
        ]}
      >
        {'\u260F'}
      </Text>
      <Text
        style={[
          styles.buttonLabel,
          { color: disabled ? colors.textMuted : colors.primaryText },
        ]}
      >
        {label}
      </Text>
      <Text
        style={[
          styles.buttonPhone,
          { color: disabled ? colors.textMuted : colors.textMuted },
        ]}
      >
        {disabled ? '--' : phone}
      </Text>
    </TouchableOpacity>
  );
};

export default function EmergencyContacts({
  dispatchPhone,
  customerPhone,
  managerPhone,
}: EmergencyContactsProps) {
  const { colors } = useTheme();
  const hasCustomer = !!customerPhone && customerPhone.length > 0;

  return (
    <View style={[styles.container, { backgroundColor: colors.card }]}>
      <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>
        Emergency Contacts
      </Text>
      <View style={styles.buttonRow}>
        <ContactButton label="Dispatch" phone={dispatchPhone} colors={colors} />
        <ContactButton
          label="Customer"
          phone={customerPhone || ''}
          disabled={!hasCustomer}
          colors={colors}
        />
        <ContactButton label="Manager" phone={managerPhone} colors={colors} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff', // Default, overridden by prop
    borderRadius: 8,
    padding: 16,
    marginTop: 12,
    shadowColor: 'rgba(0, 0, 0, 0.12)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 16,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8E8E93',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  button: {
    flex: 1,
    backgroundColor: '#000000',
    borderRadius: 999,
    paddingVertical: 14,
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 80,
  },
  buttonDisabled: {
    backgroundColor: '#efefef',
  },
  buttonIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  buttonLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
    textAlign: 'center',
  },
  buttonPhone: {
    fontSize: 10,
    color: '#afafaf',
    textAlign: 'center',
    marginTop: 2,
  },
  textDisabled: {
    color: '#afafaf',
  },
});