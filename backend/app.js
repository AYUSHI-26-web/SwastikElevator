const express = require('express');
const cors = require('cors');
const { getConnectionStatus } = require('./config/db');
const contactRoutes = require('./routes/contactRoutes');
const authRoutes = require('./routes/authRoutes');
const opsRoutes = require('./routes/opsRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const adminRoutes = require('./routes/adminRoutes');
const contactInfoRoutes = require('./routes/contactInfoRoutes');
const { getEmailAuthStatus } = require('./services/emailService');
const { getEmailQueueStats } = require('./services/emailQueueService');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/contact', contactRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/ops', opsRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/contact-info', contactInfoRoutes);

app.get('/health', async (req, res) => {
  let queueStats = { pending: 0, processing: 0, sent: 0, failed: 0 };

  try {
    queueStats = await getEmailQueueStats();
  } catch (error) {
    console.error('Health check: failed to fetch queue stats:', error.message);
  }

  const emailAuth = getEmailAuthStatus().status || 'unknown';

  res.json({
    status: 'ok',
    database: getConnectionStatus() ? 'connected' : 'disconnected',
    emailAuth,
    emailQueuePending: queueStats.pending,
    emailQueueFailed: queueStats.failed,
    timestamp: new Date().toISOString(),
  });
});

app.get('/', (req, res) => {
  res.send('Contact Form Backend is Running!');
});

app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

module.exports = app;
