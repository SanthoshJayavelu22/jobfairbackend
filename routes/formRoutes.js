const express = require('express');
const router = express.Router();
const {
  createForm,
  getForms,
  getFormByUserId,
  getFormStats
} = require('../controllers/formController');
const { validateForm } = require('../middleware/validation');
const { formSubmissionLimiter } = require('../middleware/rateLimit');

// Apply rate limiting to form submission
router.post('/', formSubmissionLimiter, validateForm, createForm);
router.get('/', getForms);
router.get('/stats/summary', getFormStats);
router.get('/:id', getFormByUserId);

module.exports = router;