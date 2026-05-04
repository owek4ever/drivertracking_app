/**
 * Theme Context
 * Manages dark/light theme state with persistence
 * Supports system preference detection and user override
 * Uber-style: high contrast for night driving visibility
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useColorScheme, AsyncStorage } from 'react-native';

type ThemeMode = 'light' | 'dark' | 'system';

// Uber design system color palette
export interface ThemeColors {
  // Backgrounds
  background: string;
  card: string;
  // Text
  text: string;
  textSecondary: string;
  textMuted: string;
  // UI Elements
  border: string;
  divider: string;
  // Accents
  accent: string;
  accentText: string;
  // Interactive
  primary: string;
  primaryText: string;
  secondary: string;
  secondaryText: string;
  // Status
  success: string;
  warning: string;
  error: string;
  // Progress bars
  progressTrack: string;
  progressFill: string;
}

interface ThemeContextType {
  theme: 'light' | 'dark';
  isDark: boolean;
  themeMode: ThemeMode;
  toggleTheme: () => void;
  setThemeMode: (mode: ThemeMode) => void;
  colors: ThemeColors;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = '@driver_tracking_theme';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemColorScheme = useColorScheme();
  const [themeMode, setThemeModeState] = useState<ThemeMode>('system');
  const [isLoaded, setIsLoaded] = useState(false);

  // Determine actual theme based on mode and system preference
  const getEffectiveTheme = useCallback(
    (mode: ThemeMode, system: string | null): 'light' | 'dark' => {
      if (mode === 'system') {
        return system === 'dark' ? 'dark' : 'light';
      }
      return mode;
    },
    []
  );

  const theme = getEffectiveTheme(themeMode, systemColorScheme);
  const isDark = theme === 'dark';

  // Uber design system colors per DESIGN.md
  const colors: ThemeColors = isDark
    ? {
        // Dark theme
        background: '#000000',       // Uber Black for dark mode
        card: '#1C1C1E',             // Card background in dark mode
        text: '#FFFFFF',             // White text on dark
        textSecondary: '#8E8E93',    // Muted text
        textMuted: '#636366',        // Very muted
        border: '#38383A',           // Borders
        divider: '#38383A',          // Dividers
        accent: '#000000',           // Accent black
        accentText: '#FFFFFF',       // Accent text white
        primary: '#000000',          // Primary button
        primaryText: '#FFFFFF',      // Primary button text
        secondary: '#1C1C1E',        // Secondary button
        secondaryText: '#FFFFFF',    // Secondary button text
        success: '#34C759',          // Green
        warning: '#FFCC00',          // Yellow
        error: '#FF3B30',            // Red
        progressTrack: '#38383A',    // Progress bar track
        progressFill: '#FFFFFF',     // Progress bar fill
      }
    : {
        // Light theme (default Uber design)
        background: '#ffffff',       // Pure White per DESIGN.md
        card: '#ffffff',             // Cards on white background
        text: '#000000',             // Uber Black text
        textSecondary: '#4b4b4b',    // Body Gray per DESIGN.md
        textMuted: '#afafaf',        // Muted Gray per DESIGN.md
        border: '#E5E5EA',           // Light borders
        divider: '#E5E5EA',          // Light dividers
        accent: '#000000',           // Accent black
        accentText: '#ffffff',       // Accent text white
        primary: '#000000',          // Primary black button
        primaryText: '#ffffff',      // White text on primary
        secondary: '#efefef',        // Chip Gray per DESIGN.md
        secondaryText: '#000000',    // Black text on secondary
        success: '#34C759',          // Green
        warning: '#FFCC00',          // Yellow
        error: '#FF3B30',            // Red
        progressTrack: '#E5E5EA',    // Progress bar track
        progressFill: '#000000',     // Progress bar fill
      };

  // Load saved theme preference on mount
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedMode = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        if (savedMode && ['light', 'dark', 'system'].includes(savedMode)) {
          setThemeModeState(savedMode as ThemeMode);
        }
      } catch (error) {
        console.error('Failed to load theme preference:', error);
      } finally {
        setIsLoaded(true);
      }
    };
    loadTheme();
  }, []);

  // Save theme preference when it changes
  const setThemeMode = useCallback(async (mode: ThemeMode) => {
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, mode);
      setThemeModeState(mode);
    } catch (error) {
      console.error('Failed to save theme preference:', error);
    }
  }, []);

  const toggleTheme = useCallback(() => {
    const newMode = isDark ? 'light' : 'dark';
    setThemeMode(newMode);
  }, [isDark, setThemeMode]);

  if (!isLoaded) {
    return null;
  }

  return (
    <ThemeContext.Provider
      value={{
        theme,
        isDark,
        themeMode,
        toggleTheme,
        setThemeMode,
        colors,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

export default ThemeContext;