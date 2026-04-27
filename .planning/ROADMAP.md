# Roadmap: Driver Tracking App

## Overview

A mobile app for delivery drivers to manage bookings (missions) with real-time status tracking, mileage display, and driver profile. Four phases deliver a complete driver workflow: booking management → UI polish → profile.

## Phases

- [x] **Phase 1: Booking Management** - Drivers manage bookings/missions
- [ ] **Phase 2: Delivery Jobs** (same as original) - Drivers view and update deliveries
- [ ] **Phase 3: UI Polish** - Emergency contacts, vehicle status, themes
- [ ] **Phase 4: Profile** - Driver profile editing, photo upload, language

## Phase Details

### Phase 1: Booking Management
**Goal**: Drivers can view and manage assigned bookings/missions
**Depends on**: Nothing (first phase)
**Requirements**: SHIFT-01, SHIFT-02, SHIFT-04, MILE-04 (mapped to booking model)
**Success Criteria** (what must be TRUE):
  1. Driver can start a booking from task schedule
  2. Driver can end/complete a booking
  3. Driver can view booking details (addresses, customer, distance)
  4. Driver can view mileage from database (read-only)
  5. Driver can view booking history
**Plans**: 3 plans

Plans:
- [x] 01-01: Initialize React Native project with Expo
- [x] 01-02: Implement booking management (start/complete/status)
- [x] 01-03: Implement mileage display and history

**Note**: "Shifts" do not exist in this app. Only "bookings" (missions).

### Phase 2: Delivery Jobs
**Goal**: Drivers view assigned deliveries and update delivery status
**Depends on**: Phase 1
**Requirements**: JOB-01, JOB-02, JOB-03, JOB-04, JOB-05
**Success Criteria** (what must be TRUE):
  1. Driver can view list of assigned deliveries
  2. Driver can tap a job to see full details (address, customer, time)
  3. Driver can update job status (pending → in progress → completed)
  4. Driver can view customer contact information
  5. Driver can view completed job history
**Plans**: 2 plans

Plans:
- [ ] 02-01: Build job list and job detail screens
- [ ] 02-02: Implement job status updates and history view

### Phase 3: UI Polish
**Goal**: Enhanced driver experience with quick actions and theming
**Depends on**: Phase 2
**Requirements**: UI-01, UI-02, UI-03, UI-04
**Success Criteria** (what must be TRUE):
  1. Driver has emergency contacts with one-tap calling (dispatch, customer, manager)
  2. Vehicle status bars showing mileage and fuel levels
  3. Task schedule displayed on HomeScreen
  4. Driver can toggle dark/light theme
**Plans**: 2 plans

Plans:
- [ ] 03-01: Add emergency contacts with one-tap calling
- [ ] 03-02: Add vehicle status bars, task schedule, theme toggle

**Note**: No camera/photo proof needed — Flotte module handles this natively.

### Phase 4: Profile
**Goal**: Driver profile management with customization
**Depends on**: Phase 3
**Requirements**: PROF-01, PROF-02, PROF-03
**Success Criteria** (what must be TRUE):
  1. Driver can view and edit profile (name, phone, email)
  2. Driver can upload profile photo
  3. Driver can select language (EN/FR/AR) with RTL support
**Plans**: 1 plan

Plans:
- [ ] 04-01: Implement profile editing, photo upload, language selector

**Note**: Notifications (FCM) are built into the Flotte module — not a separate phase.

## Progress

**Execution Order:**
1 → 2 → 3 → 4

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Booking Management | 3/3 | Complete | 2026-04-27 |
| 2. Delivery Jobs | 0/2 | Not started | - |
| 3. UI Polish | 0/2 | Not started | - |
| 4. Profile | 0/1 | Not started | - |

## Coverage

**Phase Mapping:**
- Phase 1: 5 requirements (booking management)
- Phase 2: 5 requirements (JOB-01 to JOB-05)
- Phase 3: 4 requirements (UI-01 to UI-04)
- Phase 4: 3 requirements (PROF-01 to PROF-03)

**Coverage:** 17/17 requirements mapped ✓

---

*Roadmap corrected: 2026-04-27*
*Removed: Photo Proof (Phase 3) — handled by Flotte module*
*Removed: Notifications (Phase 4) — handled by Flotte module (FCM)*