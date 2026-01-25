// frontend/src/contexts/ThemeContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

const lightTheme = {
    primary: {
        dark: '#2A1E1C',
        mid: '#5D4037',
        light: '#8B6B61',
    },
    accent: {
        gold: '#D4AF37',
        cream: '#F5F1E8',
    },
    neutral: {
        dark: '#121212',
        mid: '#3D3D3D',
        light: '#F8F8F8',
    },
    background: '#F8F8F8',
    card: '#FFFFFF',
    text: {
        primary: '#1A1A1A',
        secondary: '#4A4A4A',
        light: '#FFFFFF',
    },
    border: '#E0E0E0',
    shadow: 'rgba(0, 0, 0, 0.05)',
};

const darkTheme = {
    primary: {
        dark: '#2A1E1C',
        mid: '#5D4037',
        light: '#8B6B61',
    },
    accent: {
        gold: '#D4AF37',
        cream: '#F5F1E8',
    },
    neutral: {
        dark: '#121212',
        mid: '#3D3D3D',
        light: '#F8F8F8',
    },
    background: '#121212',
    card: '#3D3D3D',
    text: {
        primary: '#FFFFFF',
        secondary: '#CCCCCC',
        light: '#FFFFFF',
    },
    border: '#444444',
    shadow: 'rgba(0, 0, 0, 0.3)',
};

export const ThemeProvider = ({ children }) => {
    const [isDarkMode, setIsDarkMode] = useState(() => {
        const saved = localStorage.getItem('theme');
        return saved ? saved === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches;
    });

    const theme = isDarkMode ? darkTheme : lightTheme;

    useEffect(() => {
        localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');

        // Apply theme to document
        const root = document.documentElement;
        root.style.setProperty('--bg-primary', theme.background);
        root.style.setProperty('--bg-card', theme.card);
        root.style.setProperty('--text-primary', theme.text.primary);
        root.style.setProperty('--primary-dark', theme.primary.dark);
        root.style.setProperty('--accent-gold', theme.accent.gold);
    }, [isDarkMode, theme]);

    const toggleTheme = () => {
        setIsDarkMode(!isDarkMode);
    };

    return (
        <ThemeContext.Provider value={{ theme, isDarkMode, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};