import Application from '../models/Application.js';
import Job from '../models/Job.js';

// @desc    Apply for a job
// @route   POST /api/applications
export const applyForJob = async (req, res, next) => {
  try {
    const { jobId, resume, coverLetter } = req.body;

    // Check if job exists
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    // Check if already applied
    const existingApplication = await Application.findOne({
      job: jobId,
      candidate: req.user.id,
    });

    if (existingApplication) {
      return res.status(400).json({ success: false, message: 'You have already applied for this job' });
    }

    const application = await Application.create({
      job: jobId,
      candidate: req.user.id,
      resume,
      coverLetter,
    });

    res.status(201).json({ success: true, data: application, message: 'Application submitted successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Get my applications (Candidate)
// @route   GET /api/applications/my
export const getMyApplications = async (req, res, next) => {
  try {
    const applications = await Application.find({ candidate: req.user.id })
      .populate('job', 'title location jobType salary company')
      .populate({
        path: 'job',
        populate: { path: 'company', select: 'name logo' }
      })
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: applications.length, data: applications });
  } catch (error) {
    next(error);
  }
};

// @desc    Get applicants for a job (Recruiter)
// @route   GET /api/applications/job/:jobId
export const getJobApplicants = async (req, res, next) => {
  try {
    // Check if the recruiter owns this job
    const job = await Job.findById(req.params.jobId);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }
    if (job.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to view these applicants' });
    }

    const applications = await Application.find({ job: req.params.jobId })
      .populate('candidate', 'name email phone location bio')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: applications.length, data: applications });
  } catch (error) {
    next(error);
  }
};