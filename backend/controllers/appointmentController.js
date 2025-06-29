// controllers/appointment.controller.js
import Appointment from '../models/Appointment.js';
import { body, param, validationResult } from 'express-validator';
import mongoose from 'mongoose';

/* ───────────────────────── 1. Validation chains ───────────────────────── */

export const validateCreate = [
  body('doctorId')
    .custom(v => mongoose.Types.ObjectId.isValid(v))
    .withMessage('Valid doctorId is required'),
  body('date')
    .isISO8601({ strict: true })
    .withMessage('Date must be ISO‑8601 (YYYY‑MM‑DD)'),
  body('time')
    .matches(/^([01]\d|2[0-3]):[0-5]\d$/)
    .withMessage('Time must be HH:mm in 24‑hour format')
];

export const validateStatus = [
  param('id')
    .custom(v => mongoose.Types.ObjectId.isValid(v))
    .withMessage('Invalid appointment id'),
  body('status')
    .isIn(['pending', 'confirmed', 'cancelled'])
    .withMessage('Status must be pending | confirmed | cancelled')
];

/* ───────────────────────── 2. Helpers ─────────────────────────────────── */

const errorsIfAny = req => {
  const errs = validationResult(req);
  if (!errs.isEmpty()) {
    return errs.array().map(e => ({ field: e.param, msg: e.msg }));
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

export const createAppointment = tryCatch(async (req, res) => {
  const errs = errorsIfAny(req);
  if (errs) return res.status(422).json({ errors: errs });

  const data = { ...req.body, userId: req.user.id, status: 'pending' };
  const appt = await Appointment.create(data);
  res.status(201).json(appt);
});

export const listAppointments = tryCatch(async (req, res) => {
  const filter = req.user.role === 'admin' ? {} : { userId: req.user.id };

  const list = await Appointment.find(filter)
    .populate('doctorId', 'name specialty')
    .populate('userId', 'name email');

  res.json(list);
});

export const changeStatus = tryCatch(async (req, res) => {
  const errs = errorsIfAny(req);
  if (errs) return res.status(422).json({ errors: errs });

  const updated = await Appointment.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status },
    { new: true, runValidators: true }
  );
  if (!updated)
    return res.status(404).json({ message: 'Appointment not found' });

  res.json(updated);
});
