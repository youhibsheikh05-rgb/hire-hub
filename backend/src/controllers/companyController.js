import Company from '../models/Company.js';

// @desc    Create company
// @route   POST /api/companies
export const createCompany = async (req, res, next) => {
  try {
    // Check if user already has a company
    const existingCompany = await Company.findOne({ createdBy: req.user.id });
    if (existingCompany) {
      return res.status(400).json({ success: false, message: 'You already have a company profile' });
    }

    const company = await Company.create({
      ...req.body,
      createdBy: req.user.id,
    });

    res.status(201).json({ success: true, data: company });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all companies
// @route   GET /api/companies
export const getCompanies = async (req, res, next) => {
  try {
    const companies = await Company.find().populate('createdBy', 'name email');
    res.status(200).json({ success: true, count: companies.length, data: companies });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single company
// @route   GET /api/companies/:id
export const getCompany = async (req, res, next) => {
  try {
    const company = await Company.findById(req.params.id).populate('createdBy', 'name email');
    if (!company) {
      return res.status(404).json({ success: false, message: 'Company not found' });
    }
    res.status(200).json({ success: true, data: company });
  } catch (error) {
    next(error);
  }
}; // @desc    Get my company (Recruiter)
// @route   GET /api/companies/my
export const getMyCompany = async (req, res, next) => {
  try {
    const company = await Company.findOne({ createdBy: req.user.id });
    if (!company) {
      return res.status(404).json({ success: false, message: 'No company found' });
    }
    res.status(200).json({ success: true, data: company });
  } catch (error) {
    next(error);
  }
};