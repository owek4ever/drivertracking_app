# Requirements: Driver Tracking App

**Defined:** 2026-04-27
**Core Value:** Drivers log all their work completely and verifiably — every shift, every mile, every delivery with photo confirmation.

## v1 Requirements

### Shift Tracking

- [ ] **SHIFT-01**: Driver can start a shift with timestamp
- [ ] **SHIFT-02**: Driver can end a shift with timestamp
- [ ] **SHIFT-03**: Driver can log breaks during shift
- [ ] **SHIFT-04**: Driver can view current shift status and duration

### Mileage Tracking

- [ ] **MILE-01**: Driver can log start mileage at shift start
- [ ] **MILE-02**: Driver can log end mileage at shift end
- [ ] **MILE-03**: System calculates total miles driven automatically
- [ ] **MILE-04**: Driver can view mileage history

### Delivery Jobs

- [ ] **JOB-01**: Driver can view list of assigned deliveries
- [ ] **JOB-02**: Driver can tap a job to see details (address, customer, time)
- [ ] **JOB-03**: Driver can update job status (pending → in progress → completed)
- [ ] **JOB-04**: Driver can view customer contact information
- [ ] **JOB-05**: Driver can view completed job history

### Photo Proof

- [ ] **PHOTO-01**: Driver can capture photo at delivery location
- [ ] **PHOTO-02**: Captured photo includes timestamp metadata
- [ ] **PHOTO-03**: Photo is saved locally and queued for upload
- [ ] **PHOTO-04**: Driver can view previously captured proof photos

### Notifications

- [ ] **NOTIF-01**: Driver receives push notifications for new job assignments
- [ ] **NOTIF-02**: Driver receives push notification for job updates

## v2 Requirements

### Differentiators (Deferred)

- Real-time GPS tracking during shifts
- Route optimization suggestions
- Earnings analytics dashboard
- Map view of assigned jobs

### Enhancements

- Offline mode with sync queue
- Signature capture (in addition to photo)
- Two-way chat with dispatch

## Out of Scope

| Feature | Reason |
|---------|--------|
| Fleet management dashboard | Focus on driver-facing app only for v1 |
| Map view for jobs | List view only — user preference |
| Signature capture | Photo only — user confirmed |
| Real-time GPS tracking | Not required for v1 |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| SHIFT-01 | Phase 1 | Pending |
| SHIFT-02 | Phase 1 | Pending |
| SHIFT-03 | Phase 1 | Pending |
| SHIFT-04 | Phase 1 | Pending |
| MILE-01 | Phase 1 | Pending |
| MILE-02 | Phase 1 | Pending |
| MILE-03 | Phase 1 | Pending |
| MILE-04 | Phase 1 | Pending |
| JOB-01 | Phase 2 | Pending |
| JOB-02 | Phase 2 | Pending |
| JOB-03 | Phase 2 | Pending |
| JOB-04 | Phase 2 | Pending |
| JOB-05 | Phase 2 | Pending |
| PHOTO-01 | Phase 3 | Pending |
| PHOTO-02 | Phase 3 | Pending |
| PHOTO-03 | Phase 3 | Pending |
| PHOTO-04 | Phase 3 | Pending |
| NOTIF-01 | Phase 4 | Pending |
| NOTIF-02 | Phase 4 | Pending |

**Coverage:**
- v1 requirements: 19 total
- Mapped to phases: 19
- Unmapped: 0 ✓

---
*Requirements defined: 2026-04-27*
*Last updated: 2026-04-27 after roadmap creation*