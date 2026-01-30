// server/src/controllers/clientController.js
const Client = require('../models/Client');
const Measurement = require('../models/Measurement');

// @desc    Get all clients for a tailor
// @route   GET /api/clients
// @access  Private
exports.getClients = async (req, res) => {
    try {
        const clients = await Client.find({ tailorId: req.user.id })
            .populate('measurements')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: clients.length,
            clients
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// @desc    Get single client
// @route   GET /api/clients/:id
// @access  Private
exports.getClient = async (req, res) => {
    try {
        const client = await Client.findOne({
            _id: req.params.id,
            tailorId: req.user.id
        }).populate('measurements');

        if (!client) {
            return res.status(404).json({
                success: false,
                message: 'Client not found'
            });
        }

        res.status(200).json({
            success: true,
            client
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// @desc    Create new client
// @route   POST /api/clients
// @access  Private
exports.createClient = async (req, res) => {
    try {
        const { name, gender, phone, email, address, measurements, notes } = req.body;

        const client = await Client.create({
            tailorId: req.user.id,
            name,
            gender,
            phone,
            email,
            address,
            notes
        });

        // If measurements are provided, create them
        if (measurements) {
            const measurement = await Measurement.create({
                clientId: client._id,
                ...measurements
            });

            client.measurements.push(measurement._id);
            await client.save();
        }

        res.status(201).json({
            success: true,
            client
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// @desc    Update client
// @route   PUT /api/clients/:id
// @access  Private
exports.updateClient = async (req, res) => {
    try {
        const client = await Client.findOneAndUpdate(
            { _id: req.params.id, tailorId: req.user.id },
            req.body,
            { new: true, runValidators: true }
        );

        if (!client) {
            return res.status(404).json({
                success: false,
                message: 'Client not found'
            });
        }

        res.status(200).json({
            success: true,
            client
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// @desc    Delete client
// @route   DELETE /api/clients/:id
// @access  Private
exports.deleteClient = async (req, res) => {
    try {
        const client = await Client.findOneAndDelete({
            _id: req.params.id,
            tailorId: req.user.id
        });

        if (!client) {
            return res.status(404).json({
                success: false,
                message: 'Client not found'
            });
        }

        // Delete associated measurements
        await Measurement.deleteMany({ clientId: client._id });

        res.status(200).json({
            success: true,
            message: 'Client deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// @desc    Search clients
// @route   GET /api/clients/search
// @access  Private
exports.searchClients = async (req, res) => {
    try {
        const { name } = req.query;

        const clients = await Client.find({
            tailorId: req.user.id,
            name: { $regex: name, $options: 'i' }
        }).populate('measurements');

        res.status(200).json({
            success: true,
            count: clients.length,
            clients
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// @desc    Add measurement to client
// @route   POST /api/clients/:id/measurements
// @access  Private
exports.addMeasurement = async (req, res) => {
    try {
        const client = await Client.findOne({
            _id: req.params.id,
            tailorId: req.user.id
        });

        if (!client) {
            return res.status(404).json({
                success: false,
                message: 'Client not found'
            });
        }

        const measurement = await Measurement.create({
            clientId: client._id,
            ...req.body
        });

        client.measurements.push(measurement._id);
        await client.save();

        res.status(201).json({
            success: true,
            measurement
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};