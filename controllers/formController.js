const Form = require('../models/Form');
const { AppError } = require('../utils/errorHandler');

// @desc    Create new form submission
// @route   POST /api/forms
// @access  Public
const createForm = async (req, res, next) => {
  try {
    const formData = req.body;

    // Check for duplicate submission (optional)
    const existingForm = await Form.findOne({
      $or: [
        { email: formData.email },
        { mobile: formData.mobile }
      ]
    });

    if (existingForm) {
      return next(new AppError('Form already submitted with this email or mobile number', 409));
    }

    const form = new Form(formData);
    const savedForm = await form.save();

    res.status(201).json({
      success: true,
      message: 'Form submitted successfully',
      data: {
        id: savedForm._id,
          userId: savedForm.userId, 
        submissionDate: savedForm.submissionDate
      }
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Get all form submissions with pagination
// @route   GET /api/forms
// @access  Public
const getForms = async (req, res, next) => {
  try {
    // Build query
    let query = {};
    
    // Optional filtering
    if (req.query.district) {
      query.nativeDistrict = new RegExp(req.query.district, 'i');
    }
    if (req.query.constituency) {
      query.assemblyConstituency = new RegExp(req.query.constituency, 'i');
    }

    const forms = await Form.find(query)
      .sort({ submissionDate: -1 })
      .select('-__v');

    res.status(200).json({
      success: true,
      data: forms
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Get form submission by id
// @route   GET /api/forms/user/:id
// @access  Public
const getFormByUserId = async (req, res, next) => {
  try {
    const form = await Form.findOne({ userId: req.params.id }).select('-__v');
    if (!form) {
      return res.status(404).json({ success: false, message: 'Candidate not found' });
    }
    res.status(200).json({ success: true, data: form });
  } catch (error) {
    next(error);
  }
};



// @desc    Get form statistics
// @route   GET /api/forms/stats/summary
// @access  Public
const getFormStats = async (req, res, next) => {
  try {
    const totalSubmissions = await Form.countDocuments();
    const todaySubmissions = await Form.countDocuments({
      submissionDate: {
        $gte: new Date().setHours(0, 0, 0, 0)
      }
    });

    // District-wise count
    const districtStats = await Form.aggregate([
      {
        $group: {
          _id: '$nativeDistrict',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalSubmissions,
        todaySubmissions,
        topDistricts: districtStats
      }
    });

  } catch (error) {
    next(error);
  }
};

module.exports = {
  createForm,
  getForms,
  getFormByUserId,
  getFormStats
};