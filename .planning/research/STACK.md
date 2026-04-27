# Technology Stack

**Project:** Driver Tracking App
**Researched:** 2026-04-27
**Domain:** Native Mobile Driver/Delivery Tracking

## Recommended Stack

### Mobile Framework

| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| React Native (with Expo) | 0.85+ | Cross-platform mobile framework | Single codebase for iOS/Android, mature ecosystem, excellent hiring pool. Expo SDK 56 includes RN 0.85 with new Animation Backend. |
| TypeScript | 5.x+ | Type-safe JavaScript | Catches errors at compile time, better DX, strong tooling support |
| Expo | SDK 56+ | Simplified RN development | Managed workflow, OTA updates, easier native module access, no Mac needed for iOS builds |

**Alternative:** Flutter 3.41+ with Dart 3.11+ — Choose if team has Dart experience or needs near-native rendering performance. React Native with Expo recommended as default for broader hiring pool.

### State Management

| Technology | Version | Purpose | When to Use |
|------------|---------|---------|-------------|
| Zustand | 5.x+ | Lightweight global state | Simple app state, minimal boilerplate — recommended for v1 |
| React Query | 5.x+ | Server state sync | When backend data needs caching, offline support, optimistic updates |
| AsyncStorage | 3.x+ | Persistent local storage | Offline data persistence for delivery queue, shift history |

### Navigation

| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| React Navigation | 7.x+ | Screen routing | De facto standard for RN, native performance, excellent TypeScript support |

### Backend

| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| Node.js | 22.x LTS | JavaScript runtime | Single language end-to-end, mature ecosystem, excellent hiring availability |
| Express | 5.x | REST API framework | Minimal, flexible, well-understood — suitable for v1 |
| NestJS | 11.x+ | Structured Node.js | Better for larger apps with clear architecture — defer until needed |
| PostgreSQL | 17.x | Relational database | ACID compliance for financial/shift data, PostGIS for future geo features |
| Redis | 8.x | In-memory cache | Session caching, job queue, real-time presence |

### Real-Time Communication

| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| Socket.IO | 4.x+ | WebSocket abstraction | Fallback support, room/namespace abstraction, batteries included |
| Firebase Realtime Database | — | Managed real-time DB | Alternative if seeking managed solution, works well with FCM |

### Push Notifications

| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| Firebase Cloud Messaging (FCM) | — | Cross-platform push | Free high-volume push for both iOS/Android, tight Expo integration |
| Expo Notifications | — | Expo wrapper for FCM | Simplified integration within Expo workflow |

### Image Handling

| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| expo-image-picker | — | Camera/gallery access | Built-in Expo module, handles permissions |
| expo-image-manipulator | — | Image processing | Resize, crop before upload — critical for photo proof |

### Location & Maps

| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| expo-location | — | GPS access | Current driver location shift tracking |
| Google Maps SDK | — | Map display | Future phase — list view only for v1 per requirements |

### Database (Optional — Local First)

| Technology | Version | Purpose | When to Use |
|------------|---------|---------|-------------|
| expo-sqlite | — | Local SQLite | Complex local queries, offline work queue |
| WatermelonDB | — | Offline-first sync | When offline-first is priority — adds complexity |

### Testing

| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| Jest | — | Unit/integration testing | Built into Expo, fast execution |
| Testing Library | — | Component testing | User-centered test patterns, better test maintenance |
| Detox | — | E2E testing | Native app automation, CI integration — defer until mature phase |

### Deployment

| Technology | Purpose | Why |
|------------|---------|-----|
| EAS Update | OTA updates | Push updates without app store review — critical for driver app patches |
| EAS Build | App builds | Managed builds for iOS/Android, no local Xcode needed |
| TestFlight | iOS beta | Apple's beta distribution — free, built into Xcode |
| Google Play Internal Testing | Android beta | Free, built into Play Console |

## Alternative Considerations

| Category | Recommended | Alternative | Why Not Default |
|----------|-------------|-------------|-----------------|
| Mobile Framework | React Native + Expo | Flutter | RN has larger hiring pool, more mature package ecosystem |
| Backend | Node.js + Express | Go | Go offers better performance at scale, but hiring is harder; defer unless scaling is proven |
| Database | PostgreSQL | MongoDB | MongoDB simpler initially, but PostgreSQL with JSONB covers same use cases with ACID |
| Real-Time | Socket.IO | raw WebSockets | Socket.IO provides fallback, room abstraction — worth the overhead |
| Push | FCM | OneSignal | FCM is free; OneSignal adds features but complexity for v1 |

## Installation

```bash
# Initialize Expo project (recommended starting point)
npx create-expo-app@latest driver-tracking-app --template blank-typescript

# Core dependencies
npx expo install expo-location expo-image-picker expo-image-manipulator
npx expo install expo-notifications expo-sqlite
npx expo install @react-navigation/native @react-navigation/native-stack

# State management
npm install zustand @tanstack/react-query

# Real-time
npm install socket.io-client

# Backend (separate service)
npm install express pg socket.io cors dotenv

# Dev dependencies
npm install -D typescript @types/node @types/express jest @testing-library/react
```

## Stack Justification

### Why React Native with Expo (Not Native Swift/Kotlin)

The user requirement explicitly specifies a native mobile app (iOS/Android), which could mean either true native (Swift/Kotlin) or cross-platform native (React Native/Flutter). React Native with Expo is recommended because:

1. **Single codebase** — One codebase for both platforms, critical for small team
2. **Hiring availability** — Larger pool than Dart (Flutter) or Swift developers
3. **Ecosystem maturity** — Delivery/logistics app patterns well-established in RN
4. **Expo managed workflow** — No Mac needed for iOS builds (EAS Build)
5. **OTA updates** — EAS Update allows pushing critical driver app patches without App Store review

### Why Not Native Swift/Kotlin

True native with SwiftUI/Kotlin has advantages (performance, platform API access), but requires:
- Separate codebases (or complex setup with Kotlin Multiplatform)
- Mac for iOS builds (unless using costly cloud CI)
- Smaller hiring pool for delivery-focused apps
- Longer development time for feature parity

Defer native Swift/Kotlin if performance issues surface after v1 launch.

### Why Backend Present

Even though the focus is on the driver-facing mobile app, a lightweight backend is needed for:
- Delivery job synchronization
- Photo proof storage
- Shift/mileage record persistence
- Push notification orchestration

For v1, a simple Node.js + Express + PostgreSQL backend is sufficient. As scale grows, consider migrating to Go or adding NestJS structure.

## Sources

- React Native 0.85 Release (2026-04-07): https://reactnative.dev/blog/2026/04/07/react-native-0.85
- Flutter 3.41 Release (2026-02): https://blog.flutter.dev/flutter-darts-2026-roadmap-89378f17ebbd
- PostGIS 3.6.2 Release (2026-02): https://postgis.net/documentation/getting_started/install_windows/released_versions/
- Courier Delivery App Development Guide 2026: https://medium.com/@brookp591/courier-delivery-app-development-cost-timeline-tech-stack-guide-2026-810efb874145 (HIGH confidence)
- On-Demand Delivery App Best Practices: https://www.wildnetedge.com/blogs/how-to-build-a-successful-on-demand-delivery-app (MEDIUM confidence)
- Real-Time Delivery Tracking Engineering: https://dev.to/oluwatosinolamilekan/engineering-real-time-delivery-tracking-that-increased-checkout-conversions-by-20-4mo8 (MEDIUM confidence)