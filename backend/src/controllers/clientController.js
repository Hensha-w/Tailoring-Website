const Client = require('../models/Client');

// @desc    Get all clients for a tailor
// @route   GET /api/clients
exports.getClients = async (req, res) => {
    try {
        const clients = await Client.find({ tailorId: req.user.id })
            .sort('-createdAt');
        res.json(clients);
    } catch (error) {
        console.error('Get clients error:', error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single client
// @route   GET /api/clients/:id
exports.getClient = async (req, res) => {
    try {
        const client = await Client.findOne({
            _id: req.params.id,
            tailorId: req.user.id
        });

        if (!client) {
            return res.status(404).json({ message: 'Client not found' });
        }

        res.json(client);
    } catch (error) {
        console.error('Get client error:', error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create new client
// @route   POST /api/clients
exports.createClient = async (req, res) => {
    try {
        console.log('Creating client with data:', req.body); // Debug log
        console.log('User ID:', req.user.id); // Debug log

        // Ensure required fields are present
        if (!req.body.name) {
            return res.status(400).json({ message: 'Client name is required' });
        }

        if (!req.body.gender) {
            return res.status(400).json({ message: 'Client gender is required' });
        }

        const clientData = {
            ...req.body,
            tailorId: req.user.id,
            // Ensure measurements object exists
            measurements: req.body.measurements || {}
        };

        const client = await Client.create(clientData);
        console.log('Client created successfully:', client._id); // Debug log

        res.status(201).json(client);
    } catch (error) {
        console.error('Create client error details:', {
            message: error.message,
            name: error.name,
            code: error.code,
            errors: error.errors
        });

        // Handle validation errors
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                message: 'Validation failed',
                errors: messages
            });
        }

        // Handle duplicate key error
        if (error.code === 11000) {
            return res.status(400).json({
                message: 'Duplicate field value entered'
            });
        }

        res.status(500).json({
            message: 'Failed to save client. Please try again.'
        });
    }
};

// @desc    Update client
// @route   PUT /api/clients/:id
exports.updateClient = async (req, res) => {
    try {
        console.log('Updating client:', req.params.id); // Debug log
        console.log('Update data:', req.body); // Debug log

        const client = await Client.findOneAndUpdate(
            { _id: req.params.id, tailorId: req.user.id },
            req.body,
            {
                returnDocument: 'after',
                runValidators: true
            }
        );

        if (!client) {
            return res.status(404).json({ message: 'Client not found' });
        }

        console.log('Client updated successfully:', client._id); // Debug log
        res.json(client);
    } catch (error) {
        console.error('Update client error:', error);

        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                message: 'Validation failed',
                errors: messages
            });
        }

        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete client
// @route   DELETE /api/clients/:id
exports.deleteClient = async (req, res) => {
    try {
        const client = await Client.findOneAndDelete({
            _id: req.params.id,
            tailorId: req.user.id
        });

        if (!client) {
            return res.status(404).json({ message: 'Client not found' });
        }

        res.json({ success: true, message: 'Client deleted' });
    } catch (error) {
        console.error('Delete client error:', error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Search clients
// @route   GET /api/clients/search?name=
exports.searchClients = async (req, res) => {
    try {
        const { name } = req.query;

        if (!name) {
            return res.status(400).json({ message: 'Search term required' });
        }

        const clients = await Client.find({
            tailorId: req.user.id,
            name: { $regex: name, $options: 'i' }
        });

        res.json(clients);
    } catch (error) {
        console.error('Search clients error:', error);
        res.status(500).json({ message: error.message });
    }
};