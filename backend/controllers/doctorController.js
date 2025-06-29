// controllers/doctor.controller.js
import Doctor from '../models/Doctor.js';
import { body, query, validationResult } from 'express-validator';

/* ───────────────────────── 1. Validation chains ───────────────────────── */

export const validateDoctor = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('specialty').trim().notEmpty().withMessage('Specialty is required'),
  body('availability')
    .optional()
    .isArray({ max: 7 })
    .withMessage('Availability must be an array'),
  body('location').optional().isString(),
  body('contact').optional().isString()
];

export const validatePagination = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be ≥ 1'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage('Limit must be 1‑50')
];

/* ───────────────────────── 2. Helpers ─────────────────────────────────── */

const validate = req => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const list = errors.array().map(e => ({ field: e.param, msg: e.msg }));
    return list;
  }
  return null;
};

const tryCatch =
  fn =>
  async (req, res, next) => {
    try {
      await fn(req, res, next);
    } catch (err) {
      next(err);
    }
  };

/* ───────────────────────── 3. Controllers ─────────────────────────────── */

export const getAllDoctors = tryCatch(async (req, res) => {
  const errList = validate(req);
  if (errList) return res.status(422).json({ errors: errList });

  const { specialty, page = 1, limit = 10 } = req.query;
  const filter = specialty
    ? { specialty: { $regex: specialty, $i: true } }
    : {};

  const docs = await Doctor.find(filter)
    .skip((page - 1) * limit)
    .limit(+limit);

  res.json(docs);
});

export const createDoctor = tryCatch(async (req, res) => {
  const errList = validate(req);
  if (errList) return res.status(422).json({ errors: errList });

  const doctor = await Doctor.create(req.body);
  res.status(201).json(doctor);
});

export const updateDoctor = tryCatch(async (req, res) => {
  const errList = validate(req);
  if (errList) return res.status(422).json({ errors: errList });

  const updated = await Doctor.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  if (!updated)
    return res.status(404).json({ message: 'Doctor not found' });

  res.json(updated);
});

export const deleteDoctor = tryCatch(async (req, res) => {
  const deleted = await Doctor.findByIdAndDelete(req.params.id);
  if (!deleted)
    return res.status(404).json({ message: 'Doctor not found' });

  res.json({ message: 'Deleted successfully' });
});
