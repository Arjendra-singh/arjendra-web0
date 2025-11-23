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
app.use(express.static(path.join(__dirname, '../'))); // Serve static files from root

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/portfolio_db';

mongoose.connect(MONGODB_URI)
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.error('MongoDB Connection Error:', err));

// API Routes
app.post('/api/inquiries', async (req, res) => {
    try {
        const { name, company, service, email, phone, message, consent } = req.body;

        // Basic Validation
        if (!name || !email || !service || !message) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const newInquiry = new Inquiry({
            name,
            company,
            service,
            email,
            phone,
            message,
            consent,
            source: 'Portfolio Contact Form'
        });

        const savedInquiry = await newInquiry.save();
        res.status(201).json({
            message: 'Inquiry received successfully',
            id: savedInquiry._id,
            createdAt: savedInquiry.createdAt
        });
    } catch (error) {
        console.error('Error saving inquiry:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Serve index.html for any other route (SPA behavior, though mostly single page here)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
