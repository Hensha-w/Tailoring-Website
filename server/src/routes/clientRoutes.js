// server/src/routes/clientRoutes.js
const express = require('express');
const router = express.Router();
const clientController = require('../controllers/clientController');
const { protect } = require('../middleware/auth');

// All routes require authentication
router.use(protect);

router.route('/')
    .get(clientController.getClients)
    .post(clientController.createClient);

router.route('/search')
    .get(clientController.searchClients);

router.route('/:id')
    .get(clientController.getClient)
    .put(clientController.updateClient)
    .delete(clientController.deleteClient);

router.route('/:id/measurements')
    .post(clientController.addMeasurement);

module.exports = router;