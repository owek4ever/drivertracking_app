# Roadmap: Driver Tracking App

## Overview

A mobile app for delivery drivers to track shifts, mileage, and deliver jobs with photo verification. Four phases deliver a complete driver workflow: shift/mileage logging → job management → photo proof → notifications.

## Phases

- [ ] **Phase 1: Shift & Mileage Tracking** - Drivers log work time and miles
- [ ] **Phase 2: Delivery Jobs** - Drivers view and update assigned deliveries
- [ ] **Phase 3: Photo Proof** - Drivers capture delivery verification photos
- [ ] **Phase 4: Notifications** - Drivers receive push alerts for jobs

## Phase Details

### Phase 1: Shift & Mileage Tracking
**Goal**: Drivers can log work shifts and track mileage driven
**Depends on**: Nothing (first phase)
**Requirements**: SHIFT-01, SHIFT-02, SHIFT-03, SHIFT-04, MILE-01, MILE-02, MILE-03, MILE-04
**Success Criteria** (what must be TRUE):
  1. Driver can start a shift with automatic timestamp
  2. Driver can end a shift with automatic timestamp
  3. Driver can log breaks during active shift
  4. Driver can view current shift duration in real-time
  5. Driver can log start mileage at shift start
  6. Driver can log end mileage at shift end
  7. System calculates total miles driven automatically
  8. Driver can view history of past shifts and mileage
**Plans**: 3 plans

Plans:
- [ ] 01-01: Initialize React Native project with Expo
- [ ] 01-02: Implement shift tracking (start/end/breaks/status)
- [ ] 01-03: Implement mileage logging and history

### Phase 2: Delivery Jobs
**Goal**: Drivers can view assigned jobs and update delivery status
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

### Phase 3: Photo Proof
**Goal**: Drivers can capture and store photo proof at delivery locations
**Depends on**: Phase 2
**Requirements**: PHOTO-01, PHOTO-02, PHOTO-03, PHOTO-04
**Success Criteria** (what must be TRUE):
  1. Driver can capture photo using device camera
  2. Captured photo includes timestamp metadata
  3. Photo is saved locally and queued for backend upload
  4. Driver can view previously captured proof photos
**Plans**: 2 plans

Plans:
- [ ] 03-01: Implement photo capture with camera
- [ ] 03-02: Implement photo storage and gallery view

### Phase 4: Notifications
**Goal**: Drivers receive push notifications for job updates
**Depends on**: Phase 3
**Requirements**: NOTIF-01, NOTIF-02
**Success Criteria** (what must be TRUE):
  1. Driver receives push notification when new job is assigned
  2. Driver receives push notification when job details are updated
**Plans**: 1 plan

Plans:
- [ ] 04-01: Implement push notification integration with FCM

## Progress

**Execution Order:**
1 → 2 → 3 → 4

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Shift & Mileage Tracking | 0/3 | Not started | - |
| 2. Delivery Jobs | 0/2 | Not started | - |
| 3. Photo Proof | 0/2 | Not started | - |
| 4. Notifications | 0/1 | Not started | - |

## Coverage

**Phase Mapping:**
- Phase 1: 8 requirements (SHIFT-01 to SHIFT-04, MILE-01 to MILE-04)
- Phase 2: 5 requirements (JOB-01 to JOB-05)
- Phase 3: 4 requirements (PHOTO-01 to PHOTO-04)
- Phase 4: 2 requirements (NOTIF-01 to NOTIF-02)

**Coverage:** 19/19 requirements mapped ✓

---

*Roadmap created: 2026-04-27*