import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Text, StyleSheet, View } from 'react-native';

// Import screens
import HomeScreen from '../screens/HomeScreen';
import BookingsScreen from '../screens/BookingsScreen';
import BookingDetailScreen from '../screens/BookingDetailScreen';
import HistoryScreen from '../screens/HistoryScreen';
import ProfileScreen from '../screens/ProfileScreen';

export type RootTabParamList = {
  Home: undefined;
  Bookings: undefined;
  History: undefined;
  Profile: undefined;
};

// Stack param list for bookings flow
export type BookingsStackParamList = {
  BookingsList: undefined;
  BookingDetail: { bookingId: number };
};

const Tab = createBottomTabNavigator<RootTabParamList>();
const BookingsStack = createNativeStackNavigator<BookingsStackParamList>();

// Tab icon component with consistent styling per Uber design system
const TabIcon = ({ name, focused }: { name: string; focused: boolean }) => {
  const icons: Record<string, string> = {
    Home: '⌂',      // House
    Bookings: '☰',  // Menu/List
    History: '◷',   // Clock-like symbol
    Profile: '○',   // Circle for user
  };

  return (
    <View style={styles.iconContainer}>
      <Text style={[styles.icon, focused && styles.iconFocused]}>
        {icons[name] || '•'}
      </Text>
    </View>
  );
};

// Bookings stack navigator
function BookingsStackNavigator() {
  return (
    <BookingsStack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#000000',
        },
        headerTintColor: '#ffffff',
        headerTitleStyle: {
          fontWeight: '600',
        },
      }}
    >
      <BookingsStack.Screen
        name="BookingsList"
        component={BookingsScreen}
        options={{
          title: 'Bookings',
          headerTitle: 'Active Bookings',
        }}
      />
      <BookingsStack.Screen
        name="BookingDetail"
        component={BookingDetailScreen}
        options={{
          title: 'Booking Details',
          headerTitle: 'Booking Detail',
        }}
      />
    </BookingsStack.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused }) => (
          <TabIcon name={route.name} focused={focused} />
        ),
        tabBarActiveTintColor: '#000000',
        tabBarInactiveTintColor: '#afafaf',
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopWidth: 1,
          borderTopColor: '#E5E5EA',
          elevation: 0,
          shadowColor: 'transparent',
        },
        headerStyle: {
          backgroundColor: '#000000',
        },
        headerTintColor: '#ffffff',
        headerTitleStyle: {
          fontWeight: '600',
        },
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: 'Home',
          headerTitle: 'Driver Tracking',
        }}
      />
      <Tab.Screen
        name="Bookings"
        component={BookingsStackNavigator}
        options={{
          title: 'Bookings',
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="History"
        component={HistoryScreen}
        options={{
          title: 'History',
          headerTitle: 'Booking History',
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: 'Profile',
          headerTitle: 'My Profile',
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 24,
    color: '#afafaf',
    fontWeight: '400',
  },
  iconFocused: {
    color: '#000000',
    fontWeight: '600',
  },
});