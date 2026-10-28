import express from 'express';
import { 
  applyForJob, 
  getMyApplications, 
  getJobApplicants, 
  updateApplicationStatus // Yeh add karo
} from '../controllers/applicationController.js';

import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.post('/', protect, authorize('candidate'), applyForJob);
router.get('/my', protect, authorize('candidate'), getMyApplications);
router.get('/job/:jobId', protect, authorize('recruiter'), getJobApplicants);

// Yeh nayi line add karo
router.put('/:id/status', protect, authorize('recruiter'), updateApplicationStatus);

export default router;