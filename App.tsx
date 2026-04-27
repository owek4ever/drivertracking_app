import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Placeholder screens
function HomeScreen() {
  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Dashboard</Text>
      <Text>Driver: Loading...</Text>
      <Text>Active Booking: None</Text>
    </View>
  );
}

function BookingsScreen() {
  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Bookings</Text>
      <Text>Active & pending bookings will appear here</Text>
    </View>
  );
}

function HistoryScreen() {
  return (
    <View style={styles.screen}>
      <Text style={styles.title}>History</Text>
      <Text>Completed & cancelled bookings</Text>
    </View>
  );
}

function ProfileScreen() {
  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Profile</Text>
      <Text>Driver information</Text>
    </View>
  );
}

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={{
            tabBarActiveTintColor: '#007AFF',
            tabBarInactiveTintColor: '#8E8E93',
            headerShown: true,
          }}
        >
          <Tab.Screen
            name="Home"
            component={HomeScreen}
            options={{ title: 'Home' }}
          />
          <Tab.Screen
            name="Bookings"
            component={BookingsScreen}
            options={{ title: 'Bookings' }}
          />
          <Tab.Screen
            name="History"
            component={HistoryScreen}
            options={{ title: 'History' }}
          />
          <Tab.Screen
            name="Profile"
            component={ProfileScreen}
            options={{ title: 'Profile' }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});