import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CalendarView from '../components/CalendarView';
import EventForm from '../components/EventForm';
import { createUTCDate, formatDateForDisplay } from '../utils/dateUtils';

const Calendar = () => {
    const [events, setEvents] = useState([]);
    const [clients, setClients] = useState([]);
    const [showEventForm, setShowEventForm] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        fetchEvents();
        fetchClients();
    }, []);

    const fetchEvents = async () => {
        try {
            const { data } = await axios.get('/api/calendar');
            // Process dates using UTC
            const processedEvents = data.map(event => ({
                ...event,
                // Store as UTC dates
                startDate: createUTCDate(formatDateForDisplay(event.startDate)),
                endDate: event.endDate ? createUTCDate(formatDateForDisplay(event.endDate)) : null
            }));
            console.log('Fetched events:', processedEvents);
            setEvents(processedEvents);
            setLoading(false);
        } catch (error) {
            console.error('Failed to fetch events:', error);
            setError('Failed to load events');
            setLoading(false);
        }
    };

    const fetchClients = async () => {
        try {
            const { data } = await axios.get('/api/clients');
            setClients(data);
        } catch (error) {
            console.error('Failed to fetch clients:', error);
        }
    };

    const handleAddEvent = (date) => {
        setSelectedDate(date);
        setSelectedEvent(null);
        setShowEventForm(true);
        setMessage('');
        setError('');
    };

    const handleEditEvent = (event) => {
        setSelectedEvent(event);
        setShowEventForm(true);
        setMessage('');
        setError('');
    };

    const handleDeleteEvent = async (eventId) => {
        if (window.confirm('Are you sure you want to delete this event?')) {
            try {
                await axios.delete(`/api/calendar/${eventId}`);
                setEvents(events.filter(e => e._id !== eventId));
                setMessage('Event deleted successfully');
                setTimeout(() => setMessage(''), 3000);
            } catch (error) {
                console.error('Failed to delete event:', error);
                setError('Failed to delete event');
                setTimeout(() => setError(''), 3000);
            }
        }
    };

    const handleEventSubmit = async (eventData) => {
        try {
            let response;
            if (selectedEvent) {
                // Update existing event
                response = await axios.put(`/api/calendar/${selectedEvent._id}`, eventData);
                const updatedEvent = {
                    ...response.data,
                    startDate: createUTCDate(formatDateForDisplay(response.data.startDate)),
                    endDate: response.data.endDate ? createUTCDate(formatDateForDisplay(response.data.endDate)) : null
                };
                setEvents(events.map(e =>
                    e._id === selectedEvent._id ? updatedEvent : e
                ));
                setMessage('Event updated successfully');
            } else {
                // Create new event
                response = await axios.post('/api/calendar', eventData);
                const newEvent = {
                    ...response.data,
                    startDate: createUTCDate(formatDateForDisplay(response.data.startDate)),
                    endDate: response.data.endDate ? createUTCDate(formatDateForDisplay(response.data.endDate)) : null
                };
                setEvents([...events, newEvent]);
                setMessage('Event created successfully');
            }

            // Close modal and show success message
            setShowEventForm(false);
            setSelectedEvent(null);

            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            console.error('Failed to save event:', error);
            setError(error.response?.data?.message || 'Failed to save event');
        }
    };

    const handleEventComplete = async (eventId) => {
        try {
            await axios.put(`/api/calendar/${eventId}`, { status: 'completed' });
            setEvents(events.map(e =>
                e._id === eventId ? { ...e, status: 'completed' } : e
            ));
            setMessage('Event marked as completed');
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            console.error('Failed to complete event:', error);
            setError('Failed to update event status');
            setTimeout(() => setError(''), 3000);
        }
    };

    const filteredEvents = events.filter(event => {
        if (filter === 'all') return true;
        return event.type === filter;
    });

    if (loading) return <div className="loading">Loading calendar...</div>;

    return (
        <div className="calendar-page">
            <div className="page-header">
                <h1>Calendar</h1>
                <button className="btn btn-primary" onClick={() => handleAddEvent(new Date())}>
                    + Add Event
                </button>
            </div>

            {message && <div className="alert alert-success fade-in">{message}</div>}
            {error && <div className="alert alert-danger fade-in">{error}</div>}

            <div className="calendar-filters">
                <div className="filter-group">
                    <label>Filter by:</label>
                    <select value={filter} onChange={(e) => setFilter(e.target.value)} className="form-control">
                        <option value="all">All Events</option>
                        <option value="collection">Collections</option>
                        <option value="deadline">Deadlines</option>
                        <option value="fitting">Fittings</option>
                        <option value="other">Other</option>
                    </select>
                </div>
            </div>

            {showEventForm && (
                <div className="modal">
                    <div className="modal-content event-modal">
                        <div className="modal-header">
                            <h2>{selectedEvent ? 'Edit Event' : 'Add New Event'}</h2>
                            <button className="btn-close" onClick={() => {
                                setShowEventForm(false);
                                setSelectedEvent(null);
                            }}>&times;</button>
                        </div>
                        <div className="modal-body">
                            <EventForm
                                event={selectedEvent}
                                clients={clients}
                                initialDate={selectedDate}
                                onSubmit={handleEventSubmit}
                                onCancel={() => {
                                    setShowEventForm(false);
                                    setSelectedEvent(null);
                                }}
                            />
                        </div>
                    </div>
                </div>
            )}

            <div className="calendar-container">
                <CalendarView
                    events={filteredEvents}
                    onAddEvent={handleAddEvent}
                    onEditEvent={handleEditEvent}
                    onDeleteEvent={handleDeleteEvent}
                    onCompleteEvent={handleEventComplete}
                />
            </div>
        </div>
    );
};

export default Calendar;