const express = require('express');
const {
    createFeedback,
    getAllFeedback,
    respondToFeedback
} = require('../controllers/feedbackController');
const { protect, admin } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.route('/')
    .post(createFeedback);

router.get('/admin', admin, getAllFeedback);
router.post('/:id/respond', admin, respondToFeedback);

module.exports = router;