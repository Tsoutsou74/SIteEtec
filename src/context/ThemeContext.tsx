import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext<{ darkMode: boolean; toggleTheme: () => void } | undefined>(undefined);
const THEME_STORAGE_KEY = 'etec-theme';

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [darkMode, setDarkMode] = useState(() => {
    try {
      return localStorage.getItem(THEME_STORAGE_KEY) !== 'light';
    } catch {
      return true;
    }
  });

  const toggleTheme = () => setDarkMode((currentMode) => !currentMode);

  // Applique ou retire la classe .dark sur l'élément racine
  useEffect(() => {
    const root = window.document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    try {
      localStorage.setItem(THEME_STORAGE_KEY, darkMode ? 'dark' : 'light');
    } catch {
      // localStorage can be unavailable depending on browser settings.
    }
  }, [darkMode]);

  return (
    <ThemeContext.Provider value={{ darkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within a ThemeProvider");
  return context;
};
