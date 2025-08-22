const mongoose = require('mongoose');
const Counter = require('./Counter');

const formSchema = new mongoose.Schema({
  userId: {
    type: String,
    unique: true,
    uppercase: true,
    
  },
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  gender: {
    type: String,
    required: [true, 'Gender is required'],
    enum: {
      values: ['male', 'female', 'other'],
      message: 'Gender must be male, female, or other'
    }
  },
dob: {
  type: Date,
  required: [true, 'Date of birth is required'],
  validate: {
    validator: function(value) {
      return value < new Date();
    },
    message: 'Date of birth must be in the past'
  }
}
,
  guardianName: {
    type: String,
    required: [true, 'Guardian name is required'],
    trim: true,
    maxlength: [100, 'Guardian name cannot exceed 100 characters']
  },
  permanentAddress: {
    type: String,
    required: [true, 'Permanent address is required'],
    trim: true,
    maxlength: [500, 'Address cannot exceed 500 characters']
  },
  nativeDistrict: {
    type: String,
    required: [true, 'Native district is required'],
    trim: true,
    maxlength: [100, 'District name cannot exceed 100 characters']
  },
  assemblyConstituency: {
    type: String,
   required: false,

    trim: true,
    maxlength: [100, 'Constituency cannot exceed 100 characters']
  },
  qualification: {
    type: String,
    required: [true, 'Qualification is required'],
    trim: true,
    maxlength: [100, 'Qualification cannot exceed 100 characters']
  },
  yearOfCompletion: {
    type: Number,
    required: [true, 'Year of completion is required'],
    min: [1900, 'Year must be after 1900'],
    max: [new Date().getFullYear(), 'Year cannot be in the future']
  },
  institutionName: {
    type: String,
  required: false,

    trim: true,
    maxlength: [200, 'Institution name cannot exceed 200 characters']
  },
  institutionLocation: {
    type: String,
  required: false,
    trim: true,
    maxlength: [200, 'Location cannot exceed 200 characters']
  },
  mobile: {
    type: String,
    required: [true, 'Mobile number is required'],
    validate: {
      validator: function(v) {
        return /^[6-9]\d{9}$/.test(v);
      },
      message: 'Mobile number must be a valid 10-digit Indian number'
    }
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    lowercase: true,
    validate: {
      validator: function(v) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      },
      message: 'Please provide a valid email address'
    }
  },
  submissionDate: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Pre-save middleware to generate userId
formSchema.pre('save', async function(next) {
  if (!this.isNew) {
    return next();
  }
  
  try {
    const counter = await Counter.findOneAndUpdate(
      { name: 'formUserId' },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );

    const year = new Date().getFullYear().toString().slice(-2); // Last 2 digits of current year
    const sequence = counter.seq.toString().padStart(5, '0');
    this.userId = `CVM${year}${sequence}`;
    
    next();
  } catch (error) {
    next(error);
  }
});

// Indexes for better performance
formSchema.index({ userId: 1 });
formSchema.index({ email: 1 });
formSchema.index({ mobile: 1 });
formSchema.index({ submissionDate: -1 });
formSchema.index({ nativeDistrict: 1 });

module.exports = mongoose.model('Form', formSchema);