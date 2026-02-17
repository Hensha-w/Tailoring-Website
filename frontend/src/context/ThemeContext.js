import React, { createContext, useState, useContext, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};

export const ThemeProvider = ({ children }) => {
    // Always dark mode - no toggle needed
    const [darkMode] = useState(true);

    // Apply dark mode on initial load
    useEffect(() => {
        document.body.classList.add('dark-mode');
    }, []);

    // These functions are kept but won't do anything
    const toggleDarkMode = () => {
        console.log('Theme toggle is disabled - dark mode only');
    };

    const saveThemePreference = async () => {
        // No need to save - always dark mode
        return Promise.resolve();
    };

    const value = {
        darkMode: true, // Always true
        toggleDarkMode,
        saveThemePreference
    };

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
};