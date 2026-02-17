const express = require('express');
const {
    getClients,
    getClient,
    createClient,
    updateClient,
    deleteClient,
    searchClients
} = require('../controllers/clientController');
const { protect, checkSubscription } = require('../middleware/auth');

const router = express.Router();

router.use(protect);
router.use(checkSubscription);

router.route('/')
    .get(getClients)
    .post(createClient);

router.get('/search', searchClients);
router.route('/:id')
    .get(getClient)
    .put(updateClient)
    .delete(deleteClient);

module.exports = router;