const express = require('express');
const {
    getMe,
    updateSettings,
    changePassword,
    changeEmail,
    getAllUsers,
    deleteUser,
    getAdminStats
} = require('../controllers/userController');
const { protect, admin } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.get('/me', getMe);
router.put('/settings', updateSettings);
router.put('/changepassword', changePassword);
router.put('/changeemail', changeEmail);

// Admin routes
router.get('/admin', admin, getAllUsers);
router.get('/admin/stats', admin, getAdminStats);
router.delete('/admin/:id', admin, deleteUser);

module.exports = router;