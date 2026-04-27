# Context: Phase 2 - Authentication + API Wiring

**Phase**: 2 of 4
**Goal**: Driver can log in and the app fully works with live data from the backend
**Domain**: Authentication and API integration

---

## Problem Statement

Phase 1 built all screens with stubbed placeholder data. Nothing works end-to-end:
- No login screen exists
- No token is ever obtained
- All screens show placeholder/stub data

**Phase 2 Goal:** Make the existing screens work with real data behind a working login.

---

## Decisions

### Authentication Flow

- **Login endpoint:** `POST /api/index.php/login`
  - Body: `{ username, password }`
  - Response: `{ token: string }` (DOLAPIKEY)
  - Header for subsequent requests: `DOLAPIKEY: {token}`

- **Token storage:** expo-secure-store (already installed in Phase 1)
  - Key: `auth_token`
  - Server URL: stored in AsyncStorage under `server_url`

- **Login screen requirement:**
  - Input fields: Username, Password, Server URL (e.g., https://yourserver.com)
  - "Login" button calls POST /api/index.php/login
  - On success: Store token + redirect to tab navigator
  - On failure: Show error message (wrong credentials, server unreachable)

- **Session persistence:**
  - On app launch: Check if token exists in secure storage
  - If valid token: Skip login, go directly to HomeScreen
  - If no token: Show LoginScreen

### API Wiring

**All existing screens must be wired to live API:**

| Screen | API Call | Data Source |
|--------|---------|-------------|
| HomeScreen | GET /custom/drivertracking/api_driver.php | Dashboard |
| BookingsScreen | GET /api/index.php/flotte/bookings?status=confirmed | Bookings list |
| BookingDetailScreen | GET /api/index.php/flotte/bookings/{id} | Single booking |
| HistoryScreen | GET /api/index.php/flotte/bookings | Filtered by status |

### Session Handling

- **401 error handling (global):**
  - Any API call returns 401 → Token expired or invalid
  - Action: Clear token from secure storage → Redirect to LoginScreen
  - Show message: "Session expired. Please log in again."

- **Network errors:**
  - Show alert: "Cannot connect to server. Check your connection."

### Pull-to-Refresh

- All list screens (BookingsScreen, HistoryScreen) must work with pull-to-refresh
- On refresh: Call the same API endpoint, update state

---

## Backend Reference

### Authentication

```
POST /api/index.php/login
Body: { "login": "username", "password": "password" }
Response: { "token": "dol_abc123...", "success": true }
```

### Custom API Endpoints (Phase 1 context)

| Endpoint | Method | Purpose |
|----------|--------|---------|
| /custom/drivertracking/api_driver.php | GET | Dashboard data |
| /custom/drivertracking/ajax_start_booking.php | POST | Start booking |
| /custom/drivertracking/ajax_update_booking.php | POST | Complete/cancel booking |
| /api/index.php/flotte/bookings | GET | List bookings |
| /api/index.php/flotte/bookings/{id} | GET | Single booking |

---

## What NOT to Add (Scope Guard)

- No ETA enhancements
- No route information display
- No new UI components
- No customer notes
- No map or GPS features

**Only goal:** Make existing screens work with real data behind working login.

---

## Canonical Refs

- src/services/api.ts — Already configured with DOLAPIKEY header and server URL storage
- src/services/auth.ts — Login function ready for update
- src/screens/* — All screens built in Phase 1, need API wiring

---

## Code Context

**Phase 1 Assets:**
- src/screens/HomeScreen.tsx (stubbed)
- src/screens/BookingsScreen.tsx (stubbed)
- src/screens/BookingDetailScreen.tsx (stubbed)
- src/screens/HistoryScreen.tsx (stubbed)
- src/services/api.ts (configured, not wired to screens)
- src/services/auth.ts (login function exists)
- expo-secure-store installed

**Missing:**
- src/screens/LoginScreen.tsx (does not exist)
- All screen components need useDashboard/useBookings hooks wired to API

---

## Deferred Ideas

- ETA display on bookings (Phase 3 if needed)
- Route information (Phase 3 if needed)
- Customer notes (Phase 3 if needed)

---

*Created: 2026-04-27*
*Phase 2: Authentication + API Wiring*