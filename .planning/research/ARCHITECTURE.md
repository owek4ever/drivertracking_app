# Architectural Patterns for Driver Tracking Mobile Apps

**Domain:** Mobile Application Architecture
**Researched:** April 2026
**Confidence:** MEDIUM

## Executive Summary

Driver tracking mobile apps follow a well-established architectural pattern built on Clean Architecture principles, with clear separation between domain, data, and presentation layers. The architecture must accommodate offline-first operation since drivers frequently operate in areas with poor connectivity, and must handle critical data (shifts, mileage, delivery photos) with reliability. For this driver-only v1 scope, a streamlined Clean Architecture with MVVM state management provides the optimal balance of maintainability and simplicity, avoiding the complexity of microservices while preserving proper layer boundaries.

## Recommended Architecture

### Layered Architecture Overview

The recommended architecture follows Clean Architecture with three primary layers:

| Layer | Responsibility | Contains |
|-------|---------------|----------|
| **Presentation** | UI rendering, user interactions, state management | Screens, ViewModels, UI components |
| **Domain** | Business rules, use cases, entity definitions | Entities, Use Cases, Repository interfaces |
| **Data** | Data access, storage, external services | Repository implementations, Data Sources, Models |

### Data Flow Direction

```
User Action → Presentation Layer → Domain Layer (Use Case) → Data Layer → Storage/API
                                    ↓
                              Repository Interface
                                    ↓
                         Data Layer (Implementation)
```

All data flow follows this unidirectional pattern. The presentation layer never directly accesses data sources—it invokes use cases which then coordinate data retrieval through repository interfaces. This ensures testability and maintains proper dependency inversion.

### Key Architectural Constraint

Since real-time GPS tracking is explicitly out of scope for v1, the architecture does not require the complex geospatial infrastructure (Kafka, Redis with geospatial indexes, WebSocket connections) that full delivery platforms use. This significantly simplifies the architecture to focus on reliable offline-first data capture and synchronization.

## Component Boundaries

### Core Components for Driver App

| Component | Responsibility | Communication |
|-----------|---------------|----------------|
| **ShiftManager** | Track shift start/end/breaks, calculate duration | Emits ShiftState to ViewModel |
| **MileageTracker** | Log start/end odometer, calculate miles driven | Emits MileageState to ViewModel |
| **DeliveryListProvider** | Fetch and cache delivery job list | Provides Delivery[] via repository |
| **DeliveryStatusUpdater** | Update delivery status, capture completion | Calls UpdateDeliveryUseCase |
| **PhotoCaptureService** | Handle camera, photo storage, sync queue | Manages offline photo queue |
| **JobHistoryProvider** | Provide completed jobs for viewing | Read-only via repository |

### Component Dependencies

```
Presentation Layer
├── DeliveryListViewModel → DeliveryListProvider
├── ShiftViewModel → ShiftManager
├── MileageViewModel → MileageTracker
├── DeliveryDetailViewModel → DeliveryStatusUpdater, PhotoCaptureService
└── HistoryViewModel → JobHistoryProvider

Domain Layer
├── GetDeliveryListUseCase → DeliveryRepository (interface)
├── UpdateDeliveryStatusUseCase → DeliveryRepository (interface)
├── StartShiftUseCase → ShiftRepository (interface)
├── LogMileageUseCase → MileageRepository (interface)
└── CapturePhotoUseCase → PhotoRepository (interface)

Data Layer
├── DeliveryRepositoryImpl → RemoteDataSource, LocalDataSource
├── ShiftRepositoryImpl → LocalDataSource, SyncQueue
├── MileageRepositoryImpl → LocalDataSource
└── PhotoRepositoryImpl → LocalStorage, SyncQueue
```

## Architecture Patterns to Follow

### Pattern 1: Offline-First with Sync Queue

**When to Apply:** Required for all data capture features (shifts, mileage, deliveries, photos)

**Implementation:**
- All data operations write to local SQLite first
- A background sync service monitors connectivity
- When online, sync service pushes queued changes to backend
- Conflict resolution: last-write-wins with server timestamp

**Why Essential:** Drivers work in areas with variable connectivity. The app must never lose shift or delivery data due to network issues. The sync queue pattern ensures data integrity.

**Example Implementation:**
```kotlin
// Domain layer defines the interface
interface ShiftRepository {
    suspend fun saveShift(shift: Shift): Result<Shift>
    suspend fun getShifts(): Result<List<Shift>>
}

// Data layer implements with offline-first
class ShiftRepositoryImpl(
    private val localDataSource: LocalDataSource,
    private val syncQueue: SyncQueue
): ShiftRepository {
    
    override suspend fun saveShift(shift: Shift): Result<Shift> {
        // Always persist locally first
        localDataSource.saveShift(shift)
        
        // Queue for sync if offline
        if (!networkAvailable()) {
            syncQueue.enqueue(SyncItem(shift))
            return Result.success(shift)
        }
        
        // Attempt sync when online
        return try {
            remoteDataSource.pushShift(shift)
            Result.success(shift)
        } catch (e: NetworkError) {
            syncQueue.enqueue(SyncItem(shift))
            Result.success(shift)
        }
    }
}
```

### Pattern 2: Repository Pattern with Dependency Inversion

**When to Apply:** Always—the architecture depends on this

**Implementation:**
- Domain layer defines repository interfaces (abstractions)
- Data layer implements concrete repository classes
- Dependency injection connects implementations to interfaces
- Presentation layer only knows about interfaces

**Why Essential:** This enables testing (mock repositories), allows implementation changes without affecting UI, and maintains clean layer boundaries.

### Pattern 3: Unidirectional Data Flow (UDF)

**When to Apply:** All state management in presentation layer

**Implementation:**
- User actions emit events to ViewModel
- ViewModel processes events via use cases
- Use cases return results (not data directly)
- ViewModel updates state (sealed class with states)
- UI observes state and re-renders

**Why Essential:** Predictable state transitions make debugging trivial and enable time-travel debugging in development. Prevents state corruption from race conditions.

**Example:**
```kotlin
sealed class ShiftUiState {
    object Idle : ShiftUiState()
    object Loading : ShiftUiState()
    data class Active(val startTime: Long, val duration: Long) : ShiftUiState()
    data class Error(val message: String) : ShiftUiState()
}

class ShiftViewModel(
    private val startShiftUseCase: StartShiftUseCase
): ViewModel() {
    
    private val _uiState = MutableStateFlow<ShiftUiState>(ShiftUiState.Idle)
    val uiState: StateFlow<ShiftUiState> = _uiState
    
    fun onStartShift() {
        viewModelScope.launch {
            _uiState.value = ShiftUiState.Loading
            startShiftUseCase()
                .onSuccess { shift ->
                    _uiState.value = ShiftUiState.Active(
                        startTime = shift.startTime,
                        duration = 0
                    )
                }
                .onFailure { error ->
                    _uiState.value = ShiftUiState.Error(error.message)
                }
        }
    }
}
```

### Pattern 4: Feature-Based Package Organization

**When to Apply:** Always—preferred over layer-based organization

**Implementation:**
- Group files by feature (shift, delivery, mileage) not by layer
- Each feature package contains its own presentation, domain, and data files
- Shared code (DI, utilities) lives in root packages
- Clean layer boundaries maintained within each feature

**Why Essential:** This scales better as features are added. Reduces navigation complexity when browsing code. Each feature can be developed and tested in isolation.

**Directory Structure:**
```
com.driverapp/
├── di/                    # Dependency injection setup
├── shared/                # Shared utilities, extensions
├── features/
│   ├── shift/
│   │   ├── presentation/
│   │   │   ├── ShiftScreen.kt
│   │   │   └── ShiftViewModel.kt
│   │   ├── domain/
│   │   │   ├── Shift.kt
│   │   │   ├── ShiftRepository.kt
│   │   │   └── StartShiftUseCase.kt
│   │   └── data/
│   │       ├── ShiftEntity.kt
│   │       ├── ShiftLocalDataSource.kt
│   │       └── ShiftRepositoryImpl.kt
│   ├── delivery/
│   │   └── [same structure]
│   ├── mileage/
│   │   └── [same structure]
│   └── photo/
│       └── [same structure]
```

## Anti-Patterns to Avoid

### Anti-Pattern 1: Direct Data Source Access from ViewModel

**What Happens:** ViewModels directly call local database or API clients
**Why Bad:** Breaks layer boundaries, makes testing impossible (must use real DB), mixes UI and data logic
**Instead:** ViewModel calls use case → use case calls repository → repository accesses data source

### Anti-Pattern 2: Mutable State in UI Layer

**What Happens:** UI components hold mutable data, modify it directly
**Why Bad:** Race conditions, unpredictable state, impossible to debug state changes
**Instead:** Use immutable state classes, state flows from ViewModel

### Anti-Pattern 3: Network-First Data Loading

**What Happens:** App attempts API call first, falls back to cache on failure
**Why Bad:** Driver loses functionality when offline—common in real-world use
**Instead:** Always read from local cache first, sync in background

### Anti-Pattern 4: Singleton Repository Instances

**What Happens:** Repositories created as singletons in Application class
**Why Bad:** Cannot inject different implementations for testing, implicit dependencies
**Instead:** Use dependency injection (Hilt/Koin/Dagger) to inject repository instances

### Anti-Pattern 5: Storing Photos Directly to Server

**What Happens:** App uploads photos immediately when captured
**Why Bad:** Large uploads fail on mobile networks, retry logic complex
**Instead:** Store photos locally, queue for upload, sync when connectivity available

## Scalability Considerations

### Current Scope (v1)

| Concern | Approach for v1 |
|---------|----------------|
| **Data volume** | SQLite local storage, monthly history |
| **Offline support** | Sync queue with auto-retry |
| **User count** | Single driver, single device |
| **Photo storage** | Local file system, queue uploads |
| **Backend** | Simple REST API (can be mocked) |

### Scaling Path for Future

| Concern | At 100 Drivers | At 10K Drivers |
|---------|---------------|----------------|
| **Database** | SQLite → PostgreSQL | Add read replicas |
| **Storage** | Local → S3/Cloud Storage | CDN for photos |
| **Sync** | Polling (every 5 min) | WebSocket push |
| **API** | Single server | API Gateway + microservices |
| **Location** | Manual log entry | GPS + geofencing (future phase) |

The architecture supports this path because repository interfaces abstract data sources. At scale, swap implementations (SQLite → PostgreSQL, REST → gRPC) without changing domain or presentation layers.

## Integration Points

### Backend API Contract

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/v1/shifts` | POST | Create shift |
| `/api/v1/shifts` | GET | List shifts |
| `/api/v1/mileage` | POST | Log mileage |
| `/api/v1/deliveries` | GET | Fetch delivery list |
| `/api/v1/deliveries/{id}/status` | PUT | Update delivery status |
| `/api/v1/photos` | POST | Upload photo (async) |

### Offline Sync Contract

| Operation | Local State | Sync Strategy |
|------------|--------------|---------------|
| Shift Start | SAVED + PENDING | Push on connectivity |
| Shift End | SAVED + PENDING | Push on connectivity |
| Mileage Log | SAVED + PENDING | Push on connectivity |
| Delivery Update | SAVED + PENDING | Push on connectivity |
| Photo Capture | SAVED + QUEUED | Async upload |

## Summary

The recommended architecture for this driver tracking app follows Clean Architecture with three layers (Presentation, Domain, Data), implementing offline-first patterns with a sync queue for reliability. Key decisions:

- **Clean Architecture**: Ensures testability and maintainability
- **MVVM + StateFlow**: Simple, effective state management
- **Offline-first**: Required for driver reliability
- **Repository pattern**: Dependency inversion for flexibility
- **Feature-based structure**: Scales with application complexity

This architecture intentionally avoids complexity needed for real-time GPS tracking (not in v1 scope) while laying the foundation for future scaling.

## Sources

- Flutter Clean Architecture Guide (2026) — Flutter Studio
- Uber System Design Analysis — Dev.to
- Courier App Development Practices — Developers.dev
- Real-Time Tracking Architecture — Developers.dev
- Mobile App Architecture Best Practices 2025 — NextNative.dev
- Android Clean Architecture with Kotlin — Marco Salis (2026)