'use client';

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { createTheme, ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { useLocale } from 'next-intl';

type ThemeMode = 'light' | 'dark';
export type ThemePreference = 'light' | 'dark' | 'system';

type ThemeModeContextValue = {
  mode: ThemeMode;
  themePreference: ThemePreference;
  toggleMode: () => void;
  setThemeMode: (pref: ThemePreference) => void;
};

const ThemeModeContext = createContext<ThemeModeContextValue | undefined>(undefined);

export const useThemeMode = (): ThemeModeContextValue => {
  const ctx = useContext(ThemeModeContext);
  if (!ctx) {
    throw new Error('useThemeMode must be used within ThemeProvider');
  }
  return ctx;
};

const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [themePreference, setThemePreference] = useState<ThemePreference>('system');
  const [mode, setMode] = useState<ThemeMode>('light');

  // Sync from localStorage after mount to avoid SSR/hydration mismatch
  useEffect(() => {
    const stored = localStorage.getItem('theme-preference');
    if (stored === 'light' || stored === 'dark') {
      setThemePreference(stored);
      setMode(stored);
    } else {
      setThemePreference('system');
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setMode(prefersDark ? 'dark' : 'light');
    }
  }, []);
  const locale = useLocale();
  const direction = locale === 'en' ? 'ltr' : 'rtl';

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', mode);
  }, [mode]);

  useEffect(() => {
    document.documentElement.setAttribute('dir', direction);
  }, [direction]);

  const toggleMode = () => {
    const next: ThemeMode = mode === 'light' ? 'dark' : 'light';
    setMode(next);
    setThemePreference(next);
    localStorage.setItem('theme-preference', next);
  };

  const setThemeMode = (pref: ThemePreference) => {
    setThemePreference(pref);
    if (pref === 'system') {
      localStorage.removeItem('theme-preference');
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const resolved: ThemeMode = prefersDark ? 'dark' : 'light';
      setMode(resolved);
    } else {
      localStorage.setItem('theme-preference', pref);
      setMode(pref);
    }
  };

  const theme = useMemo(
    () =>
      createTheme({
        direction,
        palette: {
          mode,
          primary: {
            main: '#324d3e',
            light: '#527a66',
            dark: '#22382d',
            contrastText: '#f6fff5',
          },
          secondary: {
            main: '#8ea58b',
            contrastText: '#172820',
          },
          background: {
            default: mode === 'dark' ? '#172820' : '#f6fff5',
            paper: mode === 'dark' ? '#22382d' : '#ffffff',
          },
          text: {
            primary: mode === 'dark' ? '#e2ede3' : '#172820',
            secondary: mode === 'dark' ? '#b0c8b2' : '#6e7672',
          },
          divider: mode === 'dark' ? '#324d3e' : '#C9D6C6',
        },
        typography: {
          fontFamily: "'Noto Kufi Arabic', system-ui, sans-serif",
        },
        shape: {
          borderRadius: 8,
        },
        components: {
          MuiInputBase: {
            styleOverrides: {
              input: {
                fontFeatureSettings: '"locl" 0',
              },
            },
          },
        },
      }),
    [mode, direction]
  );

  return (
    <ThemeModeContext.Provider value={{ mode, themePreference, toggleMode, setThemeMode }}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeModeContext.Provider>
  );
};

export default ThemeProvider;
