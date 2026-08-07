# Backend Notes

## Email Environment Variables

- `EMAIL_USER`: Gmail address used for SMTP authentication and as the admin inbox for contact form notifications.
- `EMAIL_PASS`: Gmail App Password for `EMAIL_USER` (16-character app password, not your normal Gmail password).

## Contact Form Email Flow

- `POST /api/contact` saves contact data in MongoDB first.
- Backend immediately attempts two emails:
  - admin notification to `EMAIL_USER`
  - welcome email to submitter address
- If one or both emails fail, failed emails are queued for retry and API still returns success with warning.
- Queue worker retries pending emails every 60 seconds with exponential backoff (1m -> 2m -> 4m, capped at 60m).

## Gmail Auth Troubleshooting

- Enable 2-Step Verification on the Gmail account in `EMAIL_USER`.
- Generate a new App Password from Google Account Security and use that in `EMAIL_PASS`.
- Do not use your normal Gmail login password in `EMAIL_PASS`.
- Restart the backend server after updating `.env`.

## API Response Fields (`POST /api/contact`)

- `data.emailStatus`: `sent` or `queued`
- `data.adminEmailSent`: `true` when admin email sent immediately
- `data.welcomeEmailSent`: `true` when welcome email sent immediately
- `data.queuedEmails`: array of delayed email types (`admin`, `welcome`)

## Health and Ops

- `GET /health` includes:
  - `emailAuth`: `ok | failed | unknown`
  - `emailQueuePending`
  - `emailQueueFailed`
- `GET /api/ops/email-queue/stats` returns queue counts for `pending`, `processing`, `sent`, and `failed`.
