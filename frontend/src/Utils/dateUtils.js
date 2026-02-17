/**
 * Date utility functions to handle timezone issues consistently
 */

// Create a date at UTC midnight from a YYYY-MM-DD string
export const createUTCDate = (dateString) => {
    if (!dateString) return null;

    // Parse the YYYY-MM-DD format
    const [year, month, day] = dateString.split('-').map(Number);

    // Create date at UTC midnight (this ensures the date doesn't shift)
    // month is 0-indexed in JavaScript Date, so subtract 1
    return new Date(Date.UTC(year, month - 1, day, 0, 0, 0, 0));
};

// Format a date for display in the user's local timezone
export const formatDateForDisplay = (date) => {
    if (!date) return '';

    const d = new Date(date);
    if (isNaN(d.getTime())) return '';

    // Use UTC methods to get the actual stored date
    const year = d.getUTCFullYear();
    const month = String(d.getUTCMonth() + 1).padStart(2, '0');
    const day = String(d.getUTCDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
};

// Format a date for input field (YYYY-MM-DD) in local timezone
export const formatDateForInput = (date) => {
    if (!date) return '';

    const d = new Date(date);
    if (isNaN(d.getTime())) return '';

    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
};

// Get date for calendar display (ensures correct day regardless of timezone)
export const getCalendarDate = (date) => {
    if (!date) return null;

    const d = new Date(date);
    if (isNaN(d.getTime())) return null;

    // Extract UTC components
    const year = d.getUTCFullYear();
    const month = d.getUTCMonth();
    const day = d.getUTCDate();

    // Return a date object set to local midnight of the UTC day
    return new Date(year, month, day);
};

// Check if two dates are the same day (using UTC)
export const isSameDay = (date1, date2) => {
    if (!date1 || !date2) return false;

    const d1 = new Date(date1);
    const d2 = new Date(date2);

    return (
        d1.getUTCFullYear() === d2.getUTCFullYear() &&
        d1.getUTCMonth() === d2.getUTCMonth() &&
        d1.getUTCDate() === d2.getUTCDate()
    );
};