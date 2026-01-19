import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type ThemeMode = 'light' | 'dark';
type PrimaryColor = 'green' | 'purple' | 'orange' | 'blue';

interface ThemeContextType {
  mode: ThemeMode;
  primaryColor: PrimaryColor;
  toggleMode: () => void;
  setMode: (mode: ThemeMode) => void;
  setPrimaryColor: (color: PrimaryColor) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Apply theme immediately before React renders
const initializeTheme = () => {
  const storedMode = localStorage.getItem('inventory_theme_mode') as ThemeMode;
  const storedColor = localStorage.getItem('inventory_primary_color') as PrimaryColor;
  
  // Apply immediately to prevent flash
  document.documentElement.setAttribute('data-theme', storedMode || 'light');
  document.documentElement.setAttribute('data-primary', storedColor || 'blue');
};

// Run immediately
initializeTheme();

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [mode, setModeState] = useState<ThemeMode>(() => {
    const stored = localStorage.getItem('inventory_theme_mode');
    return (stored as ThemeMode) || 'light';
  });
  
  const [primaryColor, setPrimaryColorState] = useState<PrimaryColor>(() => {
    const stored = localStorage.getItem('inventory_primary_color');
    // Default to 'blue' for light mode to match original PHP design
    return (stored as PrimaryColor) || 'blue';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', mode);
    localStorage.setItem('inventory_theme_mode', mode);
  }, [mode]);

  useEffect(() => {
    document.documentElement.setAttribute('data-primary', primaryColor);
    localStorage.setItem('inventory_primary_color', primaryColor);
  }, [primaryColor]);

  const toggleMode = () => {
    setModeState(prev => prev === 'light' ? 'dark' : 'light');
  };

  const setMode = (newMode: ThemeMode) => {
    setModeState(newMode);
  };

  const setPrimaryColor = (color: PrimaryColor) => {
    setPrimaryColorState(color);
  };

  return (
    <ThemeContext.Provider 
      value={{ 
        mode, 
        primaryColor, 
        toggleMode, 
        setMode, 
        setPrimaryColor 
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
