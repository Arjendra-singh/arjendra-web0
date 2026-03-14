const mongoose = require('mongoose');
const Inquiry = require('./models/Inquiry');
require('dotenv').config();

async function checkDb() {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/portfolio_db');
        const latest = await Inquiry.findOne().sort({ createdAt: -1 });
        console.log('LATEST_INQUIRY:', JSON.stringify(latest, null, 2));
        await mongoose.disconnect();
    } catch (err) {
        console.error('DB_ERROR:', err);
        process.exit(1);
    }
}

checkDb();
