const express    = require('express');
const mongoose   = require('mongoose');
const cors       = require('cors');
const auth       = require('./middleware/authMiddleware');
require('dotenv').config();

const app = express();
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://the-bridge-dusky.vercel.app',
    'https://thebridge.bridgemakersmn.org',
    'http://thebridge.bridgemakersmn.org',
  ],
  credentials: true,
}));
app.use(express.json()); 

// Public
app.use('/api/auth',    require('./routes/auth'));
app.use('/api/admin',   require('./routes/admin'));

// Protected — requires JWT
app.use('/api/members',  auth, require('./routes/members'));
app.use('/api/events',   require('./routes/events'));
app.use('/api/services', auth, require('./routes/services'));

const port = process.env.PORT || 5001;

// Health endpoint to report DB status
app.get('/health', (req, res) => {
  const state = mongoose.connection.readyState; // 0 = disconnected, 1 = connected
  res.json({ server: 'ok', db: state === 1 ? 'connected' : 'disconnected', dbState: state });
});

async function init() {
  let dbConnected = false;
  const mongoUri = process.env.MONGO_URI;

  if (mongoUri) {
    try {
      console.log('Attempting MongoDB connection...');
      await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 5000 });
      dbConnected = true;
      console.log('MongoDB connected');
    } catch (err) {
      console.warn('MongoDB connection failed:', err.message);
    }
    app.listen(port, () => {
    console.log(`Server listening on port ${port} (db:${dbConnected ? 'connected' : 'disconnected'})`);
  });
  } else {
    console.warn('MONGO_URI not provided; skipping DB connection');
  }

  
}

// Global unhandled exception logging
process.on('unhandledRejection', (reason, p) => {
  console.error('Unhandled Rejection at:', p, 'reason:', reason);
});
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});

// Express error handler to log stack traces
app.use((err, req, res, next) => {
  console.error('Express error middleware caught:', err && err.stack ? err.stack : err);
  res.status(err && err.statusCode ? err.statusCode : 500).json({ error: err && err.message ? err.message : 'Internal Server Error' });
});

init();