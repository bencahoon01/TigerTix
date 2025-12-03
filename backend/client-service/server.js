const express = require('express');
const cors = require('cors');
const clientRoute = require('./routes/clientRoutes.js');

const app = express();

// Middleware
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://bencahoon01.github.io'
  ]
}));
app.use(express.json()); // Middleware to parse JSON bodies

// Routes
// Mount under /api so POST /api/events is RESTful per requirements
app.use('/api', clientRoute);

const PORT = process.env.PORT_CLIENT || 6001;
app.listen(PORT, () => console.log(`Client service running at http://localhost:${PORT}`));