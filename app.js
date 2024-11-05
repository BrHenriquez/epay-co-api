import express from 'express';
import clientRoutes from './src/routes/clientRoutes.js';
import { connectToDb } from './src/server.js';
import dotenv from 'dotenv';
import cors from 'cors';


dotenv.config();
const app = express();
const PORT = process.env.PORT || 4000;

// Database Connection
connectToDb();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', clientRoutes);

// 404 Error Handling
app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: 'Route not found',
        message: `The route ${req.originalUrl} does not exist on this server`
    });
});

// Global Error Handler
app.use((error, req, res, next) => {
    console.error('Error:', error);
    res.status(500).json({
        success: false,
        error: 'Internal Server Error',
        message: error.message || 'An unexpected error occurred'
    });
});

// Server Initialization
app.listen(PORT, () => {
    console.log(`API Service running on port ${PORT}`);
});
