const EmailJob = require('../models/EmailJob');
const { sendMailOptions, classifyEmailError } = require('./emailService');

const BASE_BACKOFF_MS = 60 * 1000;
const MAX_BACKOFF_MS = 60 * 60 * 1000;

const getNextAttemptDelayMs = (attempts) => {
  const exponent = Math.max(0, attempts - 1);
  return Math.min(BASE_BACKOFF_MS * 2 ** exponent, MAX_BACKOFF_MS);
};

const enqueueEmailJob = async ({
  sourceId,
  sourceType = 'contact',
  jobType,
  to,
  subject,
  text,
  html,
  maxAttempts = 10,
}) => {
  const now = new Date();

  return await EmailJob.findOneAndUpdate(
    { sourceId, jobType },
    {
      $setOnInsert: {
        sourceId,
        sourceType,
        jobType,
        to,
        subject,
        text,
        html,
        status: 'pending',
        attempts: 0,
        maxAttempts,
        nextAttemptAt: now,
        lastError: '',
      },
    },
    {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true,
    }
  );
};

const claimNextPendingJob = async () =>
  await EmailJob.findOneAndUpdate(
    {
      status: 'pending',
      nextAttemptAt: { $lte: new Date() },
    },
    {
      $set: { status: 'processing' },
      $inc: { attempts: 1 },
    },
    {
      sort: { nextAttemptAt: 1, createdAt: 1 },
      new: true,
    }
  );

const getEmailQueueStats = async () => {
  const counts = await EmailJob.aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
      },
    },
  ]);

  const summary = {
    pending: 0,
    processing: 0,
    sent: 0,
    failed: 0,
  };

  for (const row of counts) {
    if (Object.prototype.hasOwnProperty.call(summary, row._id)) {
      summary[row._id] = row.count;
    }
  }

  return summary;
};

const processPendingEmailJobs = async (batchSize = 10) => {
  const result = {
    processed: 0,
    sent: 0,
    retried: 0,
    failed: 0,
  };

  for (let index = 0; index < batchSize; index++) {
    const job = await claimNextPendingJob();
    if (!job) {
      break;
    }

    result.processed += 1;

    try {
      await sendMailOptions({
        from: `"Swastik Elevator" <${process.env.EMAIL_USER}>`,
        to: job.to,
        subject: job.subject,
        text: job.text,
        html: job.html,
      });

      await EmailJob.updateOne(
        { _id: job._id },
        {
          $set: {
            status: 'sent',
            sentAt: new Date(),
            lastError: '',
          },
        }
      );

      result.sent += 1;
    } catch (error) {
      const attempts = job.attempts;
      const statusCode = classifyEmailError(error);
      const lastErrorMessage = `[${statusCode}] ${error.message}`;
      const isFinalFailure = attempts >= job.maxAttempts;

      if (isFinalFailure) {
        await EmailJob.updateOne(
          { _id: job._id },
          {
            $set: {
              status: 'failed',
              lastError: lastErrorMessage,
            },
          }
        );
        result.failed += 1;
      } else {
        const nextAttemptAt = new Date(Date.now() + getNextAttemptDelayMs(attempts));
        await EmailJob.updateOne(
          { _id: job._id },
          {
            $set: {
              status: 'pending',
              nextAttemptAt,
              lastError: lastErrorMessage,
            },
          }
        );
        result.retried += 1;
      }
    }
  }

  return result;
};

module.exports = {
  enqueueEmailJob,
  processPendingEmailJobs,
  getEmailQueueStats,
};
