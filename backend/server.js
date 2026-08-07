const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

const app = require('./app');
const connectDB = require('./config/db');
const { preflightEmailAuth } = require('./services/emailService');
const { processPendingEmailJobs } = require('./services/emailQueueService');
const { getConnectionStatus } = require('./config/db');

const PORT = process.env.PORT || 5000;
const EMAIL_QUEUE_INTERVAL_MS = 60 * 1000;

let queueWorkerTimer = null;
let queueWorkerRunning = false;

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
