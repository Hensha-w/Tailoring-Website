// Utility to ensure theme is properly applied
export const applyTheme = (darkMode) => {
    if (darkMode) {
        document.body.classList.add('dark-mode');
        document.documentElement.classList.add('dark-mode');
    } else {
        document.body.classList.remove('dark-mode');
        document.documentElement.classList.remove('dark-mode');
    }

    // Force a reflow to ensure styles are applied
    document.body.style.display = 'none';
    document.body.offsetHeight; // Trigger reflow
    document.body.style.display = '';
};