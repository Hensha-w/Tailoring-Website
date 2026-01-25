// backend/src/controllers/client.controller.js
const Client = require('../models/Client');

exports.getClients = async (req, res) => {
    try {
        const { search, page = 1, limit = 10 } = req.query;
        const tailorId = req.user.id;

        let query = { tailor: tailorId };

        // Search functionality
        if (search) {
            query.$text = { $search: search };
        }

        const clients = await Client.find(query)
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await Client.countDocuments(query);

        res.json({
            clients,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            totalClients: total
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createClient = async (req, res) => {
    try {
        const tailorId = req.user.id;
        const { firstName, lastName, gender, phone, email, measurements } = req.body;

        const client = await Client.create({
            tailor: tailorId,
            firstName,
            lastName,
            gender,
            phone,
            email,
            measurements,
            lastMeasurementDate: new Date()
        });

        res.status(201).json({ success: true, client });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Add: getClientById, updateClient, deleteClient, updateMeasurements