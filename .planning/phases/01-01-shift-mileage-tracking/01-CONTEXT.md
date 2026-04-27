# Context: Phase 1 - Shift & Mileage Tracking

**Phase**: 1 of 4
**Goal**: Drivers can log work shifts and track mileage driven
**Domain**: Booking/mission tracking (NOT shift tracking)

---

## Key Clarification

**This app does NOT use "shifts".** Only bookings (called "missions" or "appointments") exist. Each booking is a single transport task assigned to a driver.

Terminology: Use **"booking"** or **"mission"** — never "shift".

---

## Decisions

### Booking/Mission Behavior

- Bookings are individual transport tasks, NOT work shifts
- Booking status flow: `confirmed` → `in_progress` → `done` → `cancelled`
- Driver starts a booking from the **task schedule** view
- Start action: Tap "Start" button on booking → calls `POST /custom/drivertracking/ajax_start_booking.php` with `booking_id`
- Backend auto-captures timestamp — no manual time entry

### Mileage

- **No mileage input** — app never collects mileage
- Mileage/distance is **read-only** from database
- Source table: `llx_flotte_inspection` (meter_out, meter_in)
- Display on dashboard as progress bar
- Booking distance comes from `llx_flotte_booking.distance` field

### Data Storage

- **Always online** — no offline mode
- All data fetched from REST API (no local database)
- Local storage only for:
  - Auth token → `flutter_secure_storage`
  - Theme/language → `SharedPreferences`

### API Endpoints

**Dolibarr Flotte REST API** (`/api/index.php/flotte/`):
- `POST /api/index.php/login` — get auth token (header: `DOLAPIKEY`)
- `GET /api/index.php/flotte/vehicles` — list vehicles
- `GET /api/index.php/flotte/vehicles/{id}` — single vehicle
- `GET /api/index.php/flotte/bookings` — list bookings
- `GET /api/index.php/flotte/bookings/{id}` — single booking
- `PUT /api/index.php/flotte/bookings/{id}` — update booking status

**Custom DriverTracking API** (`/custom/drivertracking/`):
- `GET /api_driver.php` — full dashboard data (bookings, driver info, vehicle info)
- `POST ajax_start_booking.php` — start booking (set status to in_progress)
- `POST ajax_update_booking.php` — complete/cancel/undo booking

### History View

- Simple list, reverse chronological order (newest first)
- Filter by status: all / done / cancelled
- No date range picker for v1

### Database Tables

- `llx_flotte_booking` — bookings (ref, status, fk_driver, fk_vehicle, fk_customer, departure_address, arriving_address, pickup_datetime, dropoff_datetime, distance, eta, geo coordinates)
- `llx_flotte_driver` — driver profiles (firstname, lastname, phone, email, license info, driver_image, fk_vehicle, fk_user)
- `llx_flotte_vehicle` — vehicles (maker, model, license_plate, engine_type, color, year, vin, horsepower, initial_mileage, in_service)
- `llx_flotte_customer` — customers (firstname, lastname, phone, company_name)
- `llx_flotte_inspection` — mileage records (meter_out, meter_in, fuel_out, fuel_in)
- `llx_flotte_fuel` — fuel records (qty, cost_unit, date, fk_vehicle)

---

## Requirements (from ROADMAP.md)

Mapped to booking/mission model:

| ID | Original | Mapped To |
|----|----------|-----------|
| SHIFT-01 | Driver can start a shift with timestamp | Driver starts booking from task schedule |
| SHIFT-02 | Driver can end a shift with timestamp | Driver completes/cancels booking |
| SHIFT-03 | Driver can log breaks during shift | NOT APPLICABLE — breaks not tracked |
| SHIFT-04 | Driver can view current shift status and duration | Display active booking status |
| MILE-01 | Driver can log start mileage | NOT APPLICABLE — mileage is read-only |
| MILE-02 | Driver can log end mileage | NOT APPLICABLE — mileage is read-only |
| MILE-03 | System calculates total miles driven | NOT APPLICABLE — distance from DB |
| MILE-04 | Driver can view mileage history | Display from llx_flotte_inspection |

---

## Canonical Refs

No external docs — all from backend integration (Dolibarr Flotte module + DriverTracking custom module).

---

## Code Context

- Empty codebase — React Native project not yet initialized
- Backend already exists: Dolibarr with Flotte module + DriverTracking custom module

---

## Deferred Ideas

- Real-time GPS tracking during bookings (v2)
- Route display on map (v2)
- Offline mode with sync queue (v2)

---

*Created: 2026-04-27*