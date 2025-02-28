import React, { createContext, useState, useEffect } from 'react';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('darkMode');
    if (savedTheme) {
      setDarkMode(JSON.parse(savedTheme));
    } else {
      // Check for system preference with a safety check for testing environments
      try {
        // Mock matchMedia for testing environments
        if (!window.matchMedia) {
          window.matchMedia = () => ({
            matches: false,
            addListener: () => {},
            removeListener: () => {}
          });
        }
        
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        setDarkMode(prefersDark);
      } catch (error) {
        console.warn('Could not detect system theme preference:', error);
        // Default to light mode if detection fails
        setDarkMode(false);
      }
    }
  }, []);

  useEffect(() => {
    try {
      document.body.classList.toggle('dark-mode', darkMode);
      localStorage.setItem('darkMode', JSON.stringify(darkMode));
    } catch (error) {
      console.warn('Could not apply theme preferences:', error);
    }
  }, [darkMode]);

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  return (
    <ThemeContext.Provider value={{ darkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};