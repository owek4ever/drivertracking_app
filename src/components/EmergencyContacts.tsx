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

interface EmergencyContactsProps {
  dispatchPhone: string;
  customerPhone?: string;
  managerPhone: string;
  isDark?: boolean;
}

interface ContactButtonProps {
  label: string;
  phone: string;
  icon?: string;
  disabled?: boolean;
}

const ContactButton: React.FC<ContactButtonProps> = ({
  label,
  phone,
  disabled = false,
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
      style={[styles.button, disabled && styles.buttonDisabled]}
      onPress={handlePress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      <Text style={[styles.buttonIcon, disabled && styles.textDisabled]}>
        📞
      </Text>
      <Text style={[styles.buttonLabel, disabled && styles.textDisabled]}>
        {label}
      </Text>
      <Text style={[styles.buttonPhone, disabled && styles.textDisabled]}>
        {disabled ? '--' : phone}
      </Text>
    </TouchableOpacity>
  );
};

export default function EmergencyContacts({
  dispatchPhone,
  customerPhone,
  managerPhone,
  isDark = false,
}: EmergencyContactsProps) {
  const hasCustomer = !!customerPhone && customerPhone.length > 0;

  const backgroundColor = isDark ? '#1C1C1E' : '#FFFFFF';

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <Text style={styles.sectionTitle}>Emergency Contacts</Text>
      <View style={styles.buttonRow}>
        <ContactButton label="Dispatch" phone={dispatchPhone} />
        <ContactButton
          label="Customer"
          phone={customerPhone || ''}
          disabled={!hasCustomer}
        />
        <ContactButton label="Manager" phone={managerPhone} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff', // Default, overridden by prop
    borderRadius: 12,
    padding: 16,
    marginTop: 12,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 3,
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
    color: '#ffffff',
    opacity: 0.8,
    textAlign: 'center',
    marginTop: 2,
  },
  textDisabled: {
    color: '#afafaf',
  },
});