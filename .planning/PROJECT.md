# Driver Tracking App

## What This Is

A standalone mobile application for delivery drivers to track their work — shifts, mileage, and deliveries with photo proof. Built as a native mobile app (not a Dolibarr module).

## Core Value

Drivers log all their work completely and verifiably — every shift, every mile, every delivery with photo confirmation.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] Time & mileage tracking — Drivers log start/end of shifts, breaks, miles driven
- [ ] Delivery verification — Drivers capture photo proof at delivery location
- [ ] Job management — Drivers see assigned deliveries in a list, tap to view details and update status

### Out of Scope

- Fleet management / dispatch features — Focus on driver-facing app only for v1
- Real-time GPS tracking — Not required for v1
- Signature capture — Photo only for proof of delivery
- Map view — List view only for v1

## Context

Reference prototype analyzed: Dolibarr ERP drivertracking module (integrated with Flotte fleet management). That prototype informed feature scope but this is a new standalone build.

**Key learnings from prototype:**
- Driver needs: shift tracking, mileage logging, delivery status updates, vehicle info access
- Emergency contacts: dispatch, customer, manager — quick-call buttons
- Completed trip history with details
- Photo proof of delivery is core requirement

## Constraints

- **Platform**: Native mobile app (iOS/Android) — not web
- **Scope**: Driver-facing only — no fleet manager dashboard in v1

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Mobile-first native app | User specified mobile app, not web | — Pending |
| List view for jobs | User preference — simple tap-through, no map for v1 | — Pending |
| Photo-only proof | User confirmed photo only, not signature | — Pending |
| Driver-only (no fleet manager) | User said "just drivers for now" | — Pending |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd-transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd-complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-04-27 after initialization*