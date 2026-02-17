import React, { useState } from 'react';
import {
    getCalendarDate,
    isSameDay,
    formatDateForDisplay,
    createUTCDate
} from '../utils/dateUtils';

const CalendarView = ({ events, onAddEvent, onEditEvent, onDeleteEvent, onCompleteEvent }) => {
    const [currentDate, setCurrentDate] = useState(new Date());

    const getDaysInMonth = (date) => {
        return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (date) => {
        return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    };

    // Get today's date as UTC for comparison
    const getTodayUTC = () => {
        const today = new Date();
        return createUTCDate(
            `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
        );
    };

    // Check if a date is in the past (using UTC)
    const isPastDate = (date) => {
        if (!date) return false;

        const todayUTC = getTodayUTC();
        const dateUTC = createUTCDate(formatDateForDisplay(date));

        return dateUTC < todayUTC;
    };

    // Get the date to display the event on (always as UTC date)
    const getEventDisplayDate = (event) => {
        // For collection/deadline events, show on the end date
        const dateToUse = (event.type === 'collection' || event.type === 'deadline')
            ? (event.endDate || event.startDate)
            : event.startDate;

        // Return as UTC date for consistent comparison
        return createUTCDate(formatDateForDisplay(dateToUse));
    };

    const getEventsForDay = (day) => {
        // Create UTC date for this calendar day
        const targetDate = createUTCDate(
            `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
        );

        return events.filter(event => {
            const displayDate = getEventDisplayDate(event);
            return displayDate && displayDate.getTime() === targetDate.getTime();
        });
    };

    const changeMonth = (increment) => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + increment, 1));
    };

    const goToToday = () => {
        setCurrentDate(new Date());
    };

    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    // Fill in empty days
    for (let i = 0; i < firstDay; i++) {
        days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
    }

    // Fill in actual days
    for (let day = 1; day <= daysInMonth; day++) {
        const dayEvents = getEventsForDay(day);

        // Create UTC date for this day to check if it's past
        const currentDayUTC = createUTCDate(
            `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
        );

        const todayUTC = getTodayUTC();
        const isToday = todayUTC && currentDayUTC && todayUTC.getTime() === currentDayUTC.getTime();
        const isPast = isPastDate(currentDayUTC);

        days.push(
            <div
                key={day}
                className={`calendar-day ${isToday ? 'today' : ''} ${isPast ? 'past-date' : ''}`}
            >
                <div className="day-header">
                    <span className="day-number">{day}</span>
                    {!isPast && (
                        <button
                            className="btn-add-event-small"
                            onClick={() => {
                                // Pass the date as a Date object for the form
                                const selectedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
                                onAddEvent(selectedDate);
                            }}
                            title="Add event on this day"
                        >
                            +
                        </button>
                    )}
                    {isPast && (
                        <span className="past-date-label" title="Cannot add events on past dates">🚫</span>
                    )}
                </div>
                <div className="day-events">
                    {dayEvents.map(event => {
                        const displayDate = getEventDisplayDate(event);
                        const formattedDate = displayDate ? formatDateForDisplay(displayDate) : '';

                        return (
                            <div
                                key={event._id}
                                className={`event-item event-${event.type} ${event.status === 'completed' ? 'event-completed' : ''}`}
                                onClick={() => onEditEvent(event)}
                                title={`Date: ${formattedDate}`}
                            >
                                <div className="event-title">{event.title}</div>
                                {event.clientName && (
                                    <div className="event-client">{event.clientName}</div>
                                )}
                                <div className="event-badge">
                                    {event.type === 'collection' && ' Collection'}
                                    {event.type === 'deadline' && ' Deadline'}
                                    {event.type === 'fitting' && ' Fitting'}
                                    {event.type === 'other' && ' Other'}
                                </div>
                                <div className="event-actions">
                                    {event.status !== 'completed' && (
                                        <button
                                            className="btn-complete"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onCompleteEvent(event._id);
                                            }}
                                            title="Mark as completed"
                                        >
                                            ✓
                                        </button>
                                    )}
                                    <button
                                        className="btn-delete"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onDeleteEvent(event._id);
                                        }}
                                        title="Delete event"
                                    >
                                        ×
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    }

    return (
        <div className="calendar">
            <div className="calendar-header">
                <div className="calendar-nav">
                    <button className="btn-nav" onClick={() => changeMonth(-1)}>←</button>
                    <h2>
                        {currentDate.toLocaleString('default', { month: 'long' })} {currentDate.getFullYear()}
                    </h2>
                    <button className="btn-nav" onClick={() => changeMonth(1)}>→</button>
                </div>
                <button className="btn-today" onClick={goToToday}>
                    Today
                </button>
            </div>

            <div className="calendar-weekdays">
                <div>Sun</div>
                <div>Mon</div>
                <div>Tue</div>
                <div>Wed</div>
                <div>Thu</div>
                <div>Fri</div>
                <div>Sat</div>
            </div>

            <div className="calendar-grid">
                {days}
            </div>

        </div>
    );
};

export default CalendarView;