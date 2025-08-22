const { body, validationResult } = require('express-validator');

const validateForm = [
  body('name')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Name must be between 1-100 characters'),
  
  body('gender')
    .isIn(['male', 'female', 'other'])
    .withMessage('Gender must be male, female, or other'),
  
  body('dob')
    .isISO8601()
    .withMessage('Date of birth must be a valid date'),
  
  body('guardianName')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Guardian name must be between 1-100 characters'),
  
  body('permanentAddress')
    .trim()
    .isLength({ min: 1, max: 500 })
    .withMessage('Address must be between 1-500 characters'),
  
  body('nativeDistrict')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('District name must be between 1-100 characters'),

  
  body('qualification')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Qualification must be between 1-100 characters'),
  
  body('yearOfCompletion')
    .isInt({ min: 1900, max: new Date().getFullYear() })
    .withMessage(`Year must be between 1900-${new Date().getFullYear()}`),
  

  
  body('mobile')
    .matches(/^[6-9]\d{9}$/)
    .withMessage('Mobile must be a valid 10-digit Indian number'),
  
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors.array()
      });
    }
    next();
  }
];

module.exports = { validateForm };