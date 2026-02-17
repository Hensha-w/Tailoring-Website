const express = require('express');
const {
    getEvents,
    createEvent,
    updateEvent,
    deleteEvent
} = require('../controllers/calendarController');
const { protect, checkSubscription } = require('../middleware/auth');

const router = express.Router();

router.use(protect);
router.use(checkSubscription);

router.route('/')
    .get(getEvents)
    .post(createEvent);

router.route('/:id')
    .put(updateEvent)
    .delete(deleteEvent);

module.exports = router;