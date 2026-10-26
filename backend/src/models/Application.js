import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema(
  {
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
      required: true,
    },
    candidate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    resume: {
      type: String, // Baad mein file upload ke liye use karenge
      required: true,
    },
    coverLetter: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['applied', 'shortlisted', 'interview', 'hired', 'rejected'],
      default: 'applied',
    },
  },
  { timestamps: true }
);

// Ek candidate ek job par ek hi baar apply kar sakta hai
applicationSchema.index({ job: 1, candidate: 1 }, { unique: true });

const Application = mongoose.model('Application', applicationSchema);
export default Application;