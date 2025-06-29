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

router.post('/', authMiddleware, validateCreate, createAppointment);
router.get('/', authMiddleware, listAppointments);
router.patch(
  '/:id/status',
  authMiddleware,
  roleMiddleware('admin'),
  validateStatus,
  changeStatus
);

export default router;
