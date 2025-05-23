// File: constants/ThemeContext.js
import { createContext, useMemo, useState } from 'react';

export const ThemeContext = createContext({});

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const theme = useMemo(
    () => ({
      background: isDarkMode ? '#000' : '#FFF',
      text:       isDarkMode ? '#FFF' : '#000',
      primary:    isDarkMode ? '#1E90FF' : '#3366FF',
    }),
    [isDarkMode]
  );

  return (
    <ThemeContext.Provider value={{ theme, isDarkMode, setIsDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};
