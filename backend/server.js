const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const { getConnectionStatus } = require('./config/db');
const contactRoutes = require('./routes/contactRoutes');
const authRoutes = require('./routes/authRoutes');
const opsRoutes = require('./routes/opsRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const adminRoutes = require('./routes/adminRoutes');
const contactInfoRoutes = require('./routes/contactInfoRoutes');
const { preflightEmailAuth, getEmailAuthStatus } = require('./services/emailService');
const { processPendingEmailJobs, getEmailQueueStats } = require('./services/emailQueueService');

const app = express();
const PORT = process.env.PORT || 5000;
const EMAIL_QUEUE_INTERVAL_MS = 60 * 1000;

let queueWorkerTimer = null;
let queueWorkerRunning = false;

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

const runQueueWorkerCycle = async () => {
  if (queueWorkerRunning || !getConnectionStatus()) {
    return;
  }

  queueWorkerRunning = true;
  try {
    const result = await processPendingEmailJobs(10);
    if (result.processed > 0) {
      console.log(
        `Email queue processed: processed=${result.processed}, sent=${result.sent}, retried=${result.retried}, failed=${result.failed}`
      );
    }
  } catch (error) {
    console.error('Email queue worker failed:', error.message);
  } finally {
    queueWorkerRunning = false;
  }
};

const startQueueWorker = () => {
  if (queueWorkerTimer) {
    return;
  }

  queueWorkerTimer = setInterval(() => {
    runQueueWorkerCycle().catch((error) => {
      console.error('Email queue interval cycle failed:', error.message);
    });
  }, EMAIL_QUEUE_INTERVAL_MS);

  if (typeof queueWorkerTimer.unref === 'function') {
    queueWorkerTimer.unref();
  }

  runQueueWorkerCycle().catch((error) => {
    console.error('Initial email queue cycle failed:', error.message);
  });
};

const startServer = async () => {
  try {
    const dbConnected = await connectDB();

    if (!dbConnected) {
      console.warn('Starting server without database connection');
      console.warn('Contact form will return DB unavailable until DB reconnects');
    }

    const emailAuthStatus = await preflightEmailAuth();
    if (emailAuthStatus.status === 'ok') {
      console.log('Email preflight verified successfully');
    } else if (emailAuthStatus.status === 'failed') {
      console.warn('Email preflight failed: Gmail authentication failed. Update EMAIL_PASS.');
    } else {
      console.warn('Email preflight status is unknown');
    }

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Health check: http://localhost:${PORT}/health`);
      startQueueWorker();
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
