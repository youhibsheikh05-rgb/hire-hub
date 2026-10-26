import express from 'express';
import { createCompany, getCompanies, getCompany, getMyCompany } from '../controllers/companyController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';

const router = express.Router();

// 'my' route hamesha '/:id' se pehle hona chahiye
router.get('/my', protect, authorize('recruiter'), getMyCompany);

router.route('/')
  .get(getCompanies)
  .post(protect, authorize('recruiter'), createCompany);

router.route('/:id').get(getCompany);

export default router;