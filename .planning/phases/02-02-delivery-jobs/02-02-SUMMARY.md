---
phase: "02"
plan: "02"
subsystem: api-wiring
tags:
  - api
  - authentication
  - session-handling
  - pull-to-refresh
dependency_graph:
  requires: []
  provides:
    - api-client-with-auth-header
    - 401-session-handling
    - network-error-handling
    - pull-to-refresh-all-screens
  affects:
    - src/screens/HomeScreen.tsx
    - src/screens/BookingsScreen.tsx
    - src/screens/BookingDetailScreen.tsx
    - src/screens/HistoryScreen.tsx
tech_stack:
  added:
    - expo-secure-store (already installed)
  patterns:
    - DOLAPIKEY header injection
    - 401 global error handler
    - React hooks for data fetching
key_files:
  created:
    - src/hooks/useBookings.ts
  modified:
    - src/services/api.ts
    - src/screens/BookingsScreen.tsx
    - src/screens/HistoryScreen.tsx
key_decisions:
  - "Added global 401 handler in api.ts that clears token and navigates to Login"
  - "Added network error handler that shows Alert to user"
  - "Created useBookings hook for reusable booking data fetching with status filtering"
  - "HistoryScreen uses useBookings with includeHistory flag for history endpoint"
metrics:
  duration: ~5 minutes
  completed: "2026-04-27"
  tasks_completed: 6
  files_modified: 4
---

# Phase 02-02 Plan: API Wiring & Session Handling Summary

**One-liner:** Wired all screens to live API with DOLAPIKEY auth header, 401 session handling, and pull-to-refresh

## Tasks Completed

| # | Task | Status | Commit |
|---|------|--------|--------|
| 1 | Update api.ts with DOLAPIKEY header and 401 handling | ✅ | - |
| 2 | Create useDashboard and useBookings hooks | ✅ | - |
| 3 | Update HomeScreen with real API | ✅ | (already done) |
| 4 | Update BookingsScreen with real API | ✅ | - |
| 5 | Update BookingDetailScreen with real API | ✅ | (already done) |
| 6 | Update HistoryScreen with real API | ✅ | - |

## Deviations from Plan

None - plan executed exactly as written.

### Auto-fixed Issues

None required.

## Changes Made

### src/services/api.ts
- Added `handleSessionExpired()` function that:
  - Clears auth token and server URL
  - Shows Alert "Session expired. Please log in again."
  - Navigates to LoginScreen
- Added `handleNetworkError()` function that shows Alert with user-friendly message
- Updated `apiRequest()` to check for 401 and call `handleSessionExpired()`
- Updated `getDashboard()`, `getBookings()`, and `getHistory()` to handle 401 and network errors

### src/hooks/useBookings.ts (NEW)
- Created hook for fetching bookings with optional status filter
- Supports `useBookings(status)` for regular bookings
- Supports `useBookings(undefined, { includeHistory: true })` for history screen
- Returns `{ bookings, loading, error, isAuthenticated, refetch }`

### src/screens/BookingsScreen.tsx
- Replaced manual fetch logic with `useBookings` hook
- Pull-to-refresh now uses hook's `refetch()` method

### src/screens/HistoryScreen.tsx
- Replaced props-based data with `useBookings` hook
- Uses `includeHistory: true` option for history endpoint
- Added loading state display
- Pull-to-refresh uses hook's `refetch()` method

## Verification

| Check | Result |
|-------|--------|
| DOLAPIKEY header in api.ts | ✅ 11 occurrences |
| handleSessionExpired in api.ts | ✅ 6 occurrences |
| useBookings hook created | ✅ |
| HomeScreen uses useDashboard | ✅ |
| BookingsScreen uses useBookings | ✅ |
| BookingDetailScreen uses apiGet | ✅ |
| HistoryScreen uses useBookings | ✅ |
| Pull-to-refresh on HomeScreen | ✅ |
| Pull-to-refresh on BookingsScreen | ✅ |
| Pull-to-refresh on BookingDetailScreen | ✅ |
| Pull-to-refresh on HistoryScreen | ✅ |

## API Endpoints Wired

| Screen | Endpoint | Status |
|--------|----------|--------|
| HomeScreen | GET /custom/drivertracking/api_driver.php | ✅ |
| BookingsScreen | GET /api/index.php/flotte/bookings?status={status} | ✅ |
| BookingDetailScreen | GET /api/index.php/flotte/bookings/{id} | ✅ |
| HistoryScreen | GET /api/index.php/flotte/bookings (all) | ✅ |

## Session Handling Flow

1. API request made with DOLAPIKEY header
2. If 401 response received:
   - `handleSessionExpired()` called
   - Token and server URL cleared
   - Alert shown: "Session expired. Please log in again."
   - User taps OK → navigates to LoginScreen
3. If network error:
   - `handleNetworkError()` called
   - Alert shown: "Cannot connect to server. Check your connection."

## Known Stubs

None.

## Threat Flags

None - no new security surface introduced.

## Self-Check: PASSED

All verification checks passed.