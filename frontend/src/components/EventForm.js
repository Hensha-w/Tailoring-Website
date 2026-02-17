import React, { useState, useEffect } from 'react';
import { createUTCDate, formatDateForInput, formatDateForDisplay } from '../utils/dateUtils';

const EventForm = ({ event, clients, initialDate, onSubmit, onCancel }) => {
    const [formData, setFormData] = useState({
        title: event?.title || '',
        clientId: event?.clientId || '',
        clientName: event?.clientName || '',
        type: event?.type || 'collection',
        startDate: event?.startDate
            ? formatDateForInput(event.startDate)
            : (initialDate ? formatDateForInput(initialDate) : formatDateForInput(new Date())),
        description: event?.description || '',
        status: event?.status || 'pending'
    });

    const [customClient, setCustomClient] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [dateError, setDateError] = useState('');

    // Get today's date in YYYY-MM-DD format using UTC
    const getTodayString = () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    // Check if selected date is in the past using UTC comparison
    const isPastDate = (dateString) => {
        const today = createUTCDate(getTodayString());
        const selected = createUTCDate(dateString);
        return selected < today;
    };

    const getDateLabel = () => {
        switch(formData.type) {
            case 'collection':
                return 'Collection Date *';
            case 'deadline':
                return 'Deadline Date *';
            case 'fitting':
                return 'Fitting Date *';
            default:
                return 'Event Date *';
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === 'startDate') {
            setDateError('');
        }

        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleClientChange = (e) => {
        const clientId = e.target.value;
        if (clientId === 'custom') {
            setCustomClient(true);
            setFormData({
                ...formData,
                clientId: '',
                clientName: ''
            });
        } else {
            setCustomClient(false);
            const selectedClient = clients.find(c => c._id === clientId);
            setFormData({
                ...formData,
                clientId,
                clientName: selectedClient?.name || ''
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate date is not in the past
        if (isPastDate(formData.startDate)) {
            setDateError('Cannot create events on past dates. Please select a future date.');
            return;
        }

        setSubmitting(true);
        setDateError('');

        try {
            // Use createUTCDate to ensure consistent date handling
            const eventDate = createUTCDate(formData.startDate);

            if (!eventDate) {
                throw new Error('Invalid date');
            }

            console.log('Selected date:', formData.startDate);
            console.log('UTC date created:', eventDate.toISOString());
            console.log('UTC date timestamp:', eventDate.getTime());

            const submissionData = {
                title: formData.title,
                clientId: formData.clientId || undefined,
                clientName: formData.clientName || undefined,
                type: formData.type,
                // Send as ISO string but it's already UTC midnight
                startDate: eventDate.toISOString(),
                endDate: (formData.type === 'collection' || formData.type === 'deadline')
                    ? eventDate.toISOString()
                    : null,
                allDay: true,
                description: formData.description || undefined,
                status: formData.status
            };

            // Remove undefined fields
            Object.keys(submissionData).forEach(key =>
                submissionData[key] === undefined && delete submissionData[key]
            );

            await onSubmit(submissionData);
        } catch (error) {
            console.error('Form submission error:', error);
            setSubmitting(false);
        }
    };

    const getMinDate = () => {
        return getTodayString();
    };

    return (
        <form onSubmit={handleSubmit} className="event-form">
            <div className="form-group">
                <label htmlFor="title">Event Title *</label>
                <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    className="form-control"
                    placeholder="e.g., Fitting for Agbada"
                    disabled={submitting}
                />
            </div>

            <div className="form-group">
                <label htmlFor="type">Event Type *</label>
                <select
                    id="type"
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    required
                    className="form-control"
                    disabled={submitting}
                >
                    <option value="collection">Collection</option>
                    <option value="deadline">Deadline</option>
                    <option value="fitting">Fitting</option>
                    <option value="other">Other</option>
                </select>
            </div>

            <div className="form-group">
                <label htmlFor="clientId">Client</label>
                {!customClient ? (
                    <select
                        id="clientId"
                        name="clientId"
                        value={formData.clientId}
                        onChange={handleClientChange}
                        className="form-control"
                        disabled={submitting}
                    >
                        <option value="">-- No Client --</option>
                        {clients.map(client => (
                            <option key={client._id} value={client._id}>
                                {client.name}
                            </option>
                        ))}
                        <option value="custom">+ Add custom client name</option>
                    </select>
                ) : (
                    <div className="custom-client-input">
                        <input
                            type="text"
                            name="clientName"
                            value={formData.clientName}
                            onChange={handleChange}
                            className="form-control"
                            placeholder="Enter client name"
                            disabled={submitting}
                        />
                        <button
                            type="button"
                            className="btn-small"
                            onClick={() => setCustomClient(false)}
                            disabled={submitting}
                        >
                            Cancel
                        </button>
                    </div>
                )}
            </div>

            <div className="form-group">
                <label htmlFor="startDate">{getDateLabel()}</label>
                <input
                    type="date"
                    id="startDate"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                    min={getMinDate()}
                    required
                    className={`form-control ${dateError ? 'is-invalid' : ''}`}
                    disabled={submitting}
                />
                {dateError && (
                    <div className="error-message">
                         {dateError}
                    </div>
                )}
                <small className="form-text text-muted">
                    {formData.type === 'collection' && "Select the collection date (future dates only)"}
                    {formData.type === 'deadline' && "Select the completion deadline (future dates only)"}
                </small>
            </div>

            <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="4"
                    className="form-control"
                    placeholder="Additional details..."
                    disabled={submitting}
                />
            </div>

            {event && (
                <div className="form-group">
                    <label htmlFor="status">Status</label>
                    <select
                        id="status"
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        className="form-control"
                        disabled={submitting}
                    >
                        <option value="pending">Pending</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                </div>
            )}

            <div className="form-actions">
                <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={submitting}
                >
                    {submitting ? 'Saving...' : (event ? 'Update Event' : 'Create Event')}
                </button>
                <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={onCancel}
                    disabled={submitting}
                >
                    Cancel
                </button>
            </div>
        </form>
    );
};

export default EventForm;