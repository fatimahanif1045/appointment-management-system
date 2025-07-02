import { Router } from 'express';
import {
  createAppointment,
  listAppointments,
  changeStatus,
  validateCreate,
  validateStatus
} from '../controllers/appointmentController.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { roleMiddleware } from '../middleware/role.middleware.js';

const router = Router();

// User: Create an appointment
router.post('/', authMiddleware, validateCreate, createAppointment);

// User or Admin: List appointments
router.get('/', authMiddleware, listAppointments);

// Admin: Change the status of an appointment
router.patch('/:id/status', authMiddleware, roleMiddleware('admin'), validateStatus, changeStatus);

export default router;
