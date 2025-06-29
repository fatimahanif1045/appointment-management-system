import { Router } from 'express';
import {
  createAppointment,
  listAppointments,
  changeStatus
} from '../controllers/appointmentController.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { roleMiddleware } from '../middleware/role.middleware.js';

const router = Router();

router.post('/', authMiddleware, createAppointment);
router.get('/', authMiddleware, listAppointments);
router.patch(
  '/:id/status',
  authMiddleware,
  roleMiddleware('admin'),
  changeStatus
);

export default router;
