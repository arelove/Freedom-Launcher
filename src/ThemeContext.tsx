import React, { createContext, useState, useContext, useEffect } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

interface ThemeContextType {
  setThemeMode: (theme: string) => void;
  setCustomThemeColors: (primaryColor: string, secondaryColor: string) => void;
  setThemeModeLightDark: (mode: 'light' | 'dark') => void;
  themeMode: string;
  themeModeLightDark: 'light' | 'dark';
  setFontFamily: (fontFamily: string) => void;
  setFontSize: (fontSize: number) => void;
  fontFamily: string;
  fontSize: number;
}

const ThemeContext = createContext<ThemeContextType>({
  setThemeMode: () => {},
  setCustomThemeColors: () => {},
  setThemeModeLightDark: () => {},
  themeMode: 'custom1',
  themeModeLightDark: 'dark',
  setFontFamily: () => {},
  setFontSize: () => {},
  fontFamily: 'Arial',
  fontSize: 16,
});

export const useThemeContext = () => useContext(ThemeContext);

export const CustomThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [primaryColor, setPrimaryColor] = useState<string>('#6a0dad');
  const [secondaryColor, setSecondaryColor] = useState<string>('#9c27b0');
  const [themeMode, setThemeMode] = useState<string>('custom1');
  const [themeModeLightDark, setThemeModeLightDark] = useState<'light' | 'dark'>('dark');

  const [fontFamily, setFontFamily] = useState<string>('Arial');
  const [fontSize, setFontSize] = useState<number>(14);

  const theme = createTheme({
    typography: {
      fontFamily: fontFamily,
      fontSize: fontSize,
    },
    palette: {
      mode: themeModeLightDark,
      primary: { main: primaryColor },
      secondary: { main: secondaryColor },
    },
  });

  const handleSetThemeMode = (theme: string) => {
    setThemeMode(theme);
    localStorage.setItem('theme', theme);
  };

  const setCustomThemeColors = (primary: string, secondary: string) => {
    setPrimaryColor(primary);
    setSecondaryColor(secondary);
    localStorage.setItem('primaryColor', primary);
    localStorage.setItem('secondaryColor', secondary);
  };

  const handleSetThemeModeLightDark = (mode: 'light' | 'dark') => {
    setThemeModeLightDark(mode);
    localStorage.setItem('themeModeLightDark', mode);
  };

  useEffect(() => {
    const savedThemeMode = localStorage.getItem('theme');
    const savedPrimaryColor = localStorage.getItem('primaryColor');
    const savedSecondaryColor = localStorage.getItem('secondaryColor');
    const savedThemeModeLightDark = localStorage.getItem('themeModeLightDark') as 'light' | 'dark';

    if (savedThemeMode) {
      setThemeMode(savedThemeMode);
    }
    if (savedPrimaryColor) {
      setPrimaryColor(savedPrimaryColor);
    }
    if (savedSecondaryColor) {
      setSecondaryColor(savedSecondaryColor);
    }
    if (savedThemeModeLightDark) {
      setThemeModeLightDark(savedThemeModeLightDark);
    }
  }, []);

  return (
    <ThemeContext.Provider
      value={{
        fontFamily, fontSize, setFontFamily, setFontSize,
        setThemeMode: handleSetThemeMode,
        setCustomThemeColors,
        setThemeModeLightDark: handleSetThemeModeLightDark,
        themeMode,
        themeModeLightDark,
      }}
    >
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};