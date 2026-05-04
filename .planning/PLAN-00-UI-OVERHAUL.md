# Phase 0: UI Overhaul

## Goal
Fix all current UI/UX issues before proceeding to Phase 4 (Profile). Ensure consistent Uber-style design across all screens and components.

## Current Issues Identified

### Issue 1: Home Screen Background
- **Problem**: Background is black in dark mode instead of white as per DESIGN.md
- **Current**: `background: isDark ? '#000000' : '#ffffff'`
- **Expected**: Default to white background, use `#1C1C1E` only for cards in dark mode

### Issue 2: Tab Bar Active Tab Invisible
- **Problem**: Active tab has same color as inactive, making it invisible
- **Current**: `tabBarActiveTintColor: '#FFFFFF'` on black header (both are same!)
- **Expected**: Active tab should use Uber Black (#000000), inactive uses Muted Gray (#afafaf)

### Issue 3: Progress Bars Show Full
- **Problem**: Progress bars display 100% width even with no/0 data
- **Current**: `width: ${fuelPercentage ?? 0}%` shows 0% but bar appears full visually
- **Expected**: Empty bar should be clearly visible as empty

### Issue 4: Dark Mode Inconsistent
- **Problem**: Dark mode colors vary across components
- **HomeScreen**: Uses `#1C1C1E` for cards
- **VehicleStatusBars**: Uses same hardcoded `#E5E5EA` for bar background
- **EmergencyContacts**: Uses hardcoded white text
- **Expected**: Centralized theme colors applied consistently

### Issue 5: Theme Toggle Emoji
- **Problem**: Using Unicode characters (☀, ☾) looks unprofessional
- **Current**: `\u2600` and `\u263E`
- **Expected**: Proper icon library (Lucide or similar) or clean text labels

### Issue 6: Tab Icons Mixed Styles
- **Problem**: Using random Unicode symbols that don't match
- **Current**: ⌂, ☰, ■, ☺ - different visual weights and meanings
- **Expected**: Consistent icon library icons

## Design System Compliance

Per DESIGN.md:
- **Primary**: Uber Black (#000000) for buttons, headers, active states
- **Background**: Pure White (#ffffff) for screens, #1C1C1E for dark mode cards only
- **Text**: Body Gray (#4b4b4b) for secondary, Muted Gray (#afafaf) for tertiary
- **Shadows**: `rgba(0,0,0,0.12) 0px 4px 16px` for cards
- **Radius**: 999px for pills/buttons, 8px for cards
- **Typography**: Bold headings (700), medium body (500)

## Success Criteria

1. Home screen has white background in both themes
2. Tab bar active tab is clearly visible (black on white)
3. Progress bars show empty state when no data
4. All components respect dark/light theme consistently
5. Theme toggle uses professional icons/text
6. All tab icons are consistent style
7. No hardcoded colors in any component

## Plans

### Plan 00-01: Theme System Fix
**Scope**: Fix theme context and background colors
**Success Criteria**: 
- Background colors are white in both themes
- Cards use #1C1C1E in dark mode
- Theme context provides complete color palette

**Tasks**:
- Update ThemeContext to export full color object
- Fix HomeScreen background to always be white
- Update all card background logic

### Plan 00-02: Tab Bar Fix
**Scope**: Fix navigation styling and tab visibility
**Success Criteria**:
- Active tab is clearly visible with Uber Black (#000000)
- Header follows Uber design (black background, white text)
- Tab bar background is white

**Tasks**:
- Update AppNavigator tab bar styling
- Fix tabBarActiveTintColor to use #000000
- Ensure header style consistency

### Plan 00-03: Progress Bars Fix
**Scope**: Fix VehicleStatusBars and progress indicator
**Success Criteria**:
- Empty bars clearly visible with no data
- Proper progress calculation with null/0 values
- Consistent styling across light/dark themes

**Tasks**:
- Fix progress bar empty state styling
- Update background colors for progress track
- Ensure proper width calculation

### Plan 00-04: Icons and Polish
**Scope**: Replace emoji icons and ensure design consistency
**Success Criteria**:
- Theme toggle uses text labels or proper icons
- Tab icons are consistent and recognizable
- All components use design system colors

**Tasks**:
- Replace theme toggle emoji with text icons
- Update tab bar icons to consistent unicode set
- Audit all components for design compliance

## Execution Order

00-01 → 00-02 → 00-03 → 00-04

Each plan builds on previous fixes to ensure consistency.

## Risks

- **Risk**: Changing theme system could break existing components
  - **Mitigation**: Update ThemeContext first, then migrate components one by one
  
- **Risk**: Tab bar styling affects all screens
  - **Mitigation**: Test navigation flow after changes

## Notes

- This is a pre-phase cleanup before Phase 4 (Profile)
- No new features - only fixes
- All changes must follow DESIGN.md strictly
