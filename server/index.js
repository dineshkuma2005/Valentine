const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const path = require('path');

// Middleware
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true
}));
app.use(express.json());
app.use('/public', express.static(path.join(__dirname, 'public')));

// Database Connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/valentine-app')
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.error('MongoDB Connection Error:', err));

// Routes
app.get('/', (req, res) => {
    res.send('Valentine Surprise API is running...');
});

// Import Routes
const valentineRoutes = require('./routes/valentineRoutes');
app.use('/api/valentine', valentineRoutes);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
