import { Router } from 'express';
import {
  getAllDoctors,
  createDoctor,
  updateDoctor,
  deleteDoctor
} from '../controllers/doctorController.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { roleMiddleware } from '../middleware/role.middleware.js';

const router = Router();

router.get('/', authMiddleware, getAllDoctors);
router.post('/', authMiddleware, roleMiddleware('admin'), createDoctor);
router
  .route('/:id')
  .put(authMiddleware, roleMiddleware('admin'), updateDoctor)
  .delete(authMiddleware, roleMiddleware('admin'), deleteDoctor);

export default router;
