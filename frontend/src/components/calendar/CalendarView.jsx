// frontend/src/components/calendar/CalendarView.jsx
import React, { useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    Button, TextField, Select, MenuItem, FormControl,
    InputLabel, Chip
} from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';

const localizer = momentLocalizer(moment);

const CalendarView = ({ events, onEventCreate, onEventUpdate }) => {
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [newEvent, setNewEvent] = useState({
        title: '',
        type: 'fitting',
        start: new Date(),
        end: new Date(),
        description: '',
        priority: 'medium'
    });

    const eventStyleGetter = (event) => {
        let backgroundColor = '#5D4037'; // Default primary.mid

        switch (event.type) {
            case 'delivery': backgroundColor = '#4CAF50'; break;
            case 'fitting': backgroundColor = '#D4AF37'; break;
            case 'measurement': backgroundColor = '#2196F3'; break;
            case 'payment': backgroundColor = '#9C27B0'; break;
            default: backgroundColor = '#5D4037';
        }

        return {
            style: {
                backgroundColor,
                borderRadius: '4px',
                opacity: 0.8,
                color: 'white',
                border: '0px',
                display: 'block'
            }
        };
    };

    const handleSelectSlot = (slotInfo) => {
        setNewEvent({
            ...newEvent,
            start: slotInfo.start,
            end: slotInfo.end
        });
        setOpenDialog(true);
    };

    const handleSelectEvent = (event) => {
        setSelectedEvent(event);
        // Show event details modal
    };

    return (
        <LocalizationProvider dateAdapter={AdapterMoment}>
            <div style={{ height: '600px' }}>
                <Calendar
                    localizer={localizer}
                    events={events}
                    startAccessor="start"
                    endAccessor="end"
                    style={{ padding: 16 }}
                    eventPropGetter={eventStyleGetter}
                    onSelectSlot={handleSelectSlot}
                    onSelectEvent={handleSelectEvent}
                    selectable
                />
            </div>

            {/* Add Event Dialog */}
            <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                <DialogTitle>Schedule New Appointment</DialogTitle>
                <DialogContent>
                    <TextField
                        fullWidth
                        label="Title"
                        value={newEvent.title}
                        onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                        margin="normal"
                    />
                    <FormControl fullWidth margin="normal">
                        <InputLabel>Event Type</InputLabel>
                        <Select
                            value={newEvent.type}
                            label="Event Type"
                            onChange={(e) => setNewEvent({...newEvent, type: e.target.value})}
                        >
                            <MenuItem value="fitting">Fitting</MenuItem>
                            <MenuItem value="delivery">Delivery</MenuItem>
                            <MenuItem value="measurement">Measurement</MenuItem>
                            <MenuItem value="payment">Payment</MenuItem>
                            <MenuItem value="other">Other</MenuItem>
                        </Select>
                    </FormControl>
                    <DatePicker
                        label="Start Date"
                        value={newEvent.start}
                        onChange={(date) => setNewEvent({...newEvent, start: date})}
                        renderInput={(params) => <TextField {...params} fullWidth margin="normal" />}
                    />
                    <DatePicker
                        label="End Date"
                        value={newEvent.end}
                        onChange={(date) => setNewEvent({...newEvent, end: date})}
                        renderInput={(params) => <TextField {...params} fullWidth margin="normal" />}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
                    <Button
                        variant="contained"
                        onClick={() => {
                            onEventCreate(newEvent);
                            setOpenDialog(false);
                        }}
                    >
                        Schedule
                    </Button>
                </DialogActions>
            </Dialog>
        </LocalizationProvider>
    );
};