---
phase: 03-ui-polish
plan: 01
subsystem: UI Components
tags: [emergency-contacts, home-screen, uber-design, quick-call]
dependency_graph:
  requires: []
  provides:
    - path: src/components/EmergencyContacts.tsx
      provides: Emergency contacts UI with quick-call buttons
    - path: src/screens/HomeScreen.tsx
      provides: HomeScreen with emergency contacts integrated
  affects:
    - HomeScreen displays emergency contacts
tech_stack:
  added: [Linking.openURL for tel: calling]
  patterns: [Uber design (999px pill buttons, whisper shadows, black/white)]
key_files:
  created:
    - src/components/EmergencyContacts.tsx
  modified:
    - src/screens/HomeScreen.tsx
decisions:
  - "Use hardcoded dispatch (1234567890) and manager (0987654321) phone numbers for now"
  - "Customer phone from activeBooking or first pending booking"
metrics:
  duration: ~2 min
  completed_date: 2026-04-27
---

# Phase 03 Plan 01: Emergency Contacts Summary

## Overview
Add emergency contacts with one-tap calling functionality to the HomeScreen. Drivers can quickly call dispatch, customer, or manager during missions.

## One-Liner
Emergency contacts with quick-call buttons integrated into HomeScreen using Uber design system

## Completed Tasks

### Task 1: Create EmergencyContacts Component
- **Commit:** 70557a8
- **Status:** Complete
- Created `src/components/EmergencyContacts.tsx` with 3 pill-shaped call buttons
- Uses `Linking.openURL('tel:...')` for one-tap calling
- Uber design: 999px border-radius, Uber Black (#000000) buttons, whisper shadow
- Customer button disabled when no phone available

### Task 2: Integrate EmergencyContacts into HomeScreen
- **Commit:** 2888839
- **Status:** Complete
- Added EmergencyContacts below Vehicle Card in ScrollView
- Customer phone from `activeBooking?.customer?.phone` or `pendingBookings[0]?.customer?.phone`
- Hardcoded dispatch: 1234567890, manager: 0987654321

## Verification Results

| Criteria | Status |
|----------|--------|
| Emergency contacts section visible on HomeScreen | ✓ |
| Three buttons visible: Dispatch, Customer, Manager | ✓ |
| Tapping button opens phone dialer with correct number | ✓ |
| Customer button disabled when no active booking | ✓ |

## Design Compliance (DESIGN.md)

| Design Requirement | Implementation |
|---------------------|----------------|
| Uber Black (#000000) for primary elements | ✓ Buttons use #000000 |
| Pure White (#ffffff) for backgrounds | ✓ Card uses #ffffff |
| 999px border-radius for pill buttons | ✓ All buttons use 999 |
| Whisper shadows (rgba(0,0,0,0.12) | ✓ Used in card shadow |
| Large fonts for visibility | ✓ 14px labels, 20px icons |
| High contrast for glance readability | ✓ White text on black |

## Deviations from Plan

None - plan executed exactly as written.

## Notes
- Phone numbers are hardcoded for now - future task can connect to driver profile/config
- Using the same calling pattern as BookingDetailScreen.tsx (line 165)
- Touch targets are large (80px height) for safe use while driving