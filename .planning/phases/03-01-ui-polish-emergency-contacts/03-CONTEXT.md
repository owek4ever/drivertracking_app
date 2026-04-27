# Context: Phase 3 - UI Polish

**Phase**: 3 of 4
**Goal**: Enhanced driver experience with quick actions and theming
**Domain**: UI enhancements, emergency contacts, vehicle status, theming

---

## Problem Statement

Phase 2 completed authentication and API wiring. The app now works end-to-end with real data. However, driver experience needs polish:
- No emergency contacts for quick calling
- Vehicle status (mileage/fuel) only shown as read-only component
- No task schedule on HomeScreen
- No theme toggle

---

## Decisions

### UI-01: Emergency Contacts

**Required contacts:**
- **Dispatch**: Primary contact for issues (stored in backend or hardcoded default)
- **Customer**: From current/selected booking (phone number from booking)
- **Manager**: Direct manager contact (stored in driver profile or hardcoded default)

**Implementation:**
- Create EmergencyContacts component with 3 quick-call buttons
- Use `Linking.openURL('tel:...')` for one-tap calling (already used in BookingDetailScreen)
- Position: Accessible from HomeScreen (floating or fixed section)
- Icon + Name + Phone display

### UI-02: Vehicle Status Bars

**Components to add:**
- **Mileage bar**: Already exists (MileageDisplay component), show on HomeScreen
- **Fuel level bar**: New - display fuel level from vehicle data (percentage or gauge)

**Data source:**
- Mileage: from `useDashboard().mileage`
- Fuel: from `useDashboard().vehicleInfo.fuel_level` (or mock if not in API)

**Display:**
- Progress bar style (like MileageDisplay)
- Color coding: green (>50%), yellow (20-50%), red (<20%)

### UI-03: Task Schedule on HomeScreen

**Display today's tasks/bookings:**
- Show next 3-5 pending bookings as quick-access list
- Each item shows: time, destination, customer name
- Tap to navigate to BookingDetail

**Data source:**
- From `useDashboard().pendingBookings`

### UI-04: Theme Toggle

**Implementation:**
- Use React Native's `useColorScheme()` for system preference detection
- Add toggle button in HomeScreen header or ProfileScreen
- Store preference in AsyncStorage (`theme_preference`: 'light' | 'dark' | 'system')
- Apply theme colors consistently across all screens

**Colors (light/dark):**
- Background: #F2F2F7 / #000000
- Card background: #FFFFFF / #1C1C1E
- Text primary: #000000 / #FFFFFF
- Text secondary: #8E8E93 / #8E8E93
- Accent: #007AFF (same both)

---

## Scope Guard

**What NOT to add:**
- No GPS/map features
- No photo capture (handled by Flotte module)
- No push notifications (handled by Flotte module)
- No signature capture

---

## Code Context

**Existing assets:**
- src/screens/HomeScreen.tsx (already uses useDashboard)
- src/components/MileageDisplay.tsx (exists)
- src/screens/BookingDetailScreen.tsx (has Linking.openURL for calls)
- src/hooks/useDashboard.ts (provides all data)

**To create:**
- src/components/EmergencyContacts.tsx
- src/components/VehicleStatusBars.tsx
- src/components/TaskSchedule.tsx
- src/context/ThemeContext.tsx (for theme management)
- Update HomeScreen to include new components

---

## Must-Haves

1. **Emergency contacts callable with one tap**
2. **Vehicle mileage bar visible on HomeScreen**
3. **Vehicle fuel level bar visible on HomeScreen**
4. **Task schedule visible on HomeScreen**
5. **Dark/light theme toggle works**

---

## Requirement IDs

- UI-01: Emergency contacts
- UI-02: Vehicle status bars (mileage + fuel)
- UI-03: Task schedule
- UI-04: Theme toggle

---

*Created: 2026-04-27*
*Phase 3: UI Polish*