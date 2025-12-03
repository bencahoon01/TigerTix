const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 10000;

// Middleware
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://bencahoon01.github.io'
  ]
}));
app.use(express.json());

// Import route handlers
const adminRoutes = require('./admin-service/routes/adminRoute');
const clientRoutes = require('./client-service/routes/clientRoutes');
const authRoutes = require('./user-authentication/routes/authRoutes');
const llmApp = require('./llm-service/index');

// Mount routes
app.use('/api', adminRoutes);      // Admin endpoints
app.use('/api', clientRoutes);     // Client endpoints  
app.use('/api/auth', authRoutes);  // Auth endpoints
app.use('/api', llmApp);           // LLM endpoints

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'TigerTix Backend Running' });
});

app.listen(PORT, () => {
  console.log(`TigerTix unified backend running on port ${PORT}`);
});
