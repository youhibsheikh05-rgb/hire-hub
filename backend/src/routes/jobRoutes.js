import express from 'express';
import { createJob, getJobs, getJob, getMyJobs } from '../controllers/jobController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';

const router = express.Router();

// Order matters! 'my-jobs' should come before '/:id'
router.get('/my-jobs', protect, authorize('recruiter'), getMyJobs);

router.route('/')
  .get(getJobs)
  .post(protect, authorize('recruiter'), createJob);

router.route('/:id').get(getJob);

export default router;