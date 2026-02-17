const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const {
    createPayment,
    getUserPayments,
    getAllPayments,
    approvePayment,
    declinePayment
} = require('../controllers/paymentController');
const { protect, admin } = require('../middleware/auth');

const router = express.Router();

// Define upload directory path
const uploadDir = path.join(__dirname, '../../uploads');

// Ensure uploads directory exists synchronously when the route loads
try {
    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
        console.log('✅ Created uploads directory:', uploadDir);
    } else {
        console.log('✅ Uploads directory exists:', uploadDir);
    }
} catch (err) {
    console.error('❌ Error creating uploads directory:', err);
}

// Configure multer for receipt uploads
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        // Use the uploadDir variable that's defined in this scope
        cb(null, uploadDir);
    },
    filename: function(req, file, cb) {
        // Create unique filename with original extension
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, `receipt-${uniqueSuffix}${ext}`);
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    },
    fileFilter: function(req, file, cb) {
        const filetypes = /jpeg|jpg|png|pdf/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);

        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Only images (JPEG, PNG) and PDFs are allowed'));
        }
    }
});

// Routes
router.use(protect);

// Payment routes
router.route('/')
    .post(upload.single('receipt'), createPayment)
    .get(getUserPayments);

// Admin routes
router.get('/admin', admin, getAllPayments);
router.put('/:id/approve', admin, approvePayment);
router.put('/:id/decline', admin, declinePayment);

// Error handling middleware for multer errors
router.use((error, req, res, next) => {
    if (error instanceof multer.MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ message: 'File too large. Maximum size is 5MB' });
        }
        return res.status(400).json({ message: error.message });
    } else if (error) {
        return res.status(400).json({ message: error.message });
    }
    next();
});

module.exports = router;