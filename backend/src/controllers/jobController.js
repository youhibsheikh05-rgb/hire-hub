import Job from '../models/Job.js';
import Company from '../models/Company.js';

// @desc    Create job
// @route   POST /api/jobs
export const createJob = async (req, res, next) => {
  try {
    // Find recruiter's company
    const company = await Company.findOne({ createdBy: req.user.id });
    if (!company) {
      return res.status(400).json({ success: false, message: 'Please create a company profile first' });
    }

    const job = await Job.create({
      ...req.body,
      company: company._id,
      createdBy: req.user.id,
    });

    res.status(201).json({ success: true, data: job });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all jobs (with search & filters)
// @route   GET /api/jobs
export const getJobs = async (req, res, next) => {
  try {
    const { keyword, location, jobType, experienceLevel } = req.query;
    let query = { status: 'open' };

    // Search by keyword (text index)
    if (keyword) {
      query.$text = { $search: keyword };
    }
    if (location) query.location = { $regex: location, $options: 'i' };
    if (jobType) query.jobType = jobType;
    if (experienceLevel) query.experienceLevel = experienceLevel;

    const jobs = await Job.find(query)
      .populate('company', 'name logo location')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: jobs.length, data: jobs });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single job
// @route   GET /api/jobs/:id
export const getJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id).populate('company', 'name logo website location');
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }
    
    // Increment views
    job.views += 1;
    await job.save();

    res.status(200).json({ success: true, data: job });
  } catch (error) {
    next(error);
  }
};

// @desc    Get recruiter's own jobs
// @route   GET /api/jobs/my-jobs
export const getMyJobs = async (req, res, next) => {
  try {
    const jobs = await Job.find({ createdBy: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: jobs.length, data: jobs });
  } catch (error) {
    next(error);
  }
};