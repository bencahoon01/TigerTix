const express = require('express');
const cors = require('cors');
const adminRoute = require('./routes/adminRoute');

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // Middleware to parse JSON bodies

// Routes
// Mount under /api so POST /api/events is RESTful per requirements
app.use('/api', adminRoute);

const PORT = 5001;
app.listen(PORT, () => console.log(`Admin service running at http://localhost:${PORT}`));