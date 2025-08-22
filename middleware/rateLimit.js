const rateLimit = require('express-rate-limit');

const formSubmissionLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 20, // Limit each IP to 5 requests per windowMs
  message: {
    success: false,
    error: 'Too many form submissions from this IP, please try again later.',
    retryAfter: '15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = { formSubmissionLimiter };