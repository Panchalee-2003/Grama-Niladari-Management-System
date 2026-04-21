const express = require('express');
const db = require('./config/db');
const path = require('path');
require('dotenv').config();

const app = express();

// Middleware to parse JSON
app.use(express.json());
app.use(require('cors')());

// Serve uploaded files (complaint attachments)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Test route to check database connection
app.get('/api/test-connection', async (req, res) => {
    try {
        const result = await db.query('SELECT NOW()');
        res.status(200).json({
            status: 'Success',
            message: 'Database connection is active',
            timestamp: result.rows[0].now
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({
            status: 'Error',
            message: 'Database connection failed'
        });
    }
});

// API Routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/citizen', require('./routes/citizen.routes'));
app.use('/api/household', require('./routes/household.routes'));
app.use('/api/family', require('./routes/family.routes'));
app.use('/api/gn', require('./routes/gn.routes'));
app.use('/api/complaint', require('./routes/complaint.routes'));
app.use('/api/notice', require('./routes/notice.routes'));
app.use('/api/certificate', require('./routes/certificate.routes'));
app.use('/api/availability', require('./routes/availability.routes'));

// Global Error Handler Middleware
// Ensures all unhandled errors are logged with time, route, and trace
app.use((err, req, res, next) => {
    const timestamp = new Date().toISOString();
    console.error(`\n[${timestamp}] ❌ UNHANDLED BACKEND ERROR`);
    console.error(`Route: ${req.method} ${req.originalUrl}`);
    console.error(`Trace:`, err.stack);
    
    res.status(500).json({
        ok: false,
        error: "Internal Server Error",
        details: process.env.NODE_ENV === "development" ? err.message : undefined
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});