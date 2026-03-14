require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const Inquiry = require('../models/Inquiry');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.static(path.join(__dirname, '../')));

// ✅ MongoDB Connection (FINAL CLEAN)
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error('❌ MONGODB_URI not found in environment variables');
    process.exit(1);
}

mongoose.connect(MONGODB_URI)
    .then(() => console.log('✅ MongoDB Connected'))
    .catch(err => {
        console.error('❌ MongoDB Connection Error:', err.message);
        process.exit(1);
    });

// ✅ API Route
app.post('/api/inquiries', async (req, res) => {
    try {
        const { name, company, service, email, phone, message, consent } = req.body;

        if (!name || !email || !service || !message) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const savedInquiry = await Inquiry.create({
            name,
            company,
            service,
            email,
            phone,
            message,
            consent,
            source: 'Portfolio Contact Form'
        });

        res.status(201).json({
            message: 'Inquiry received successfully',
            id: savedInquiry._id
        });

    } catch (error) {
        console.error('❌ Error saving inquiry:', error.message);
        res.status(500).json({ error: error.message });
    }
});

// ✅ Static fallback
app.get('*', (req, res) => {
    const fs = require('fs');
    const requestedFile = path.join(__dirname, '..', req.path);

    if (req.path !== '/' && fs.existsSync(requestedFile) && fs.statSync(requestedFile).isFile()) {
        res.sendFile(requestedFile);
    } else {
        res.sendFile(path.join(__dirname, '../index.html'));
    }
});

// ✅ Start Server
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
