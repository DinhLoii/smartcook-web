import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

type Theme = 'light' | 'dark';
const storageKey = 'smartcook-theme';
const systemQuery = '(prefers-color-scheme: dark)';
const ThemeContext = createContext<{ theme: Theme; toggleTheme: () => void } | null>(null);

function readPreference(): Theme | null {
  try {
    const value = window.localStorage.getItem(storageKey);
    return value === 'light' || value === 'dark' ? value : null;
  } catch {
    return null;
  }
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [preference, setPreference] = useState(readPreference);
  const [systemTheme, setSystemTheme] = useState<Theme>(() =>
    window.matchMedia(systemQuery).matches ? 'dark' : 'light'
  );
  const theme = preference ?? systemTheme;

  useEffect(() => {
    const media = window.matchMedia(systemQuery);
    const syncSystem = () => setSystemTheme(media.matches ? 'dark' : 'light');
    const syncStorage = (event: StorageEvent) => {
      if (event.key === storageKey || event.key === null) setPreference(readPreference());
    };
    syncSystem();
    media.addEventListener('change', syncSystem);
    window.addEventListener('storage', syncStorage);
    return () => {
      media.removeEventListener('change', syncSystem);
      window.removeEventListener('storage', syncStorage);
    };
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.querySelector('meta[name="theme-color"]')?.setAttribute(
      'content', getComputedStyle(document.documentElement).getPropertyValue('--color-canvas').trim()
    );
  }, [theme]);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setPreference(nextTheme);
    try {
      window.localStorage.setItem(storageKey, nextTheme);
    } catch {
      // The current tab can still change themes when storage is unavailable.
    }
  };

  return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const value = useContext(ThemeContext);
  if (!value) throw new Error('useTheme requires ThemeProvider');
  return value;
}
