const express = require('express');
const cors = require('cors');
const clientRoute = require('./routes/clientRoutes.js');

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // Middleware to parse JSON bodies

// Routes
// Mount under /api so POST /api/events is RESTful per requirements
app.use('/api', clientRoute);

const PORT = 6001;
app.listen(PORT, () => console.log(`Client service running at http://localhost:${PORT}`));