import { Router } from 'express';
import {
  getAllDoctors,
  createDoctor,
  updateDoctor,
  deleteDoctor,
  validateDoctor,
  validatePagination
} from '../controllers/doctorController.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { roleMiddleware } from '../middleware/role.middleware.js';

const router = Router();

router.get('/', authMiddleware, validatePagination, getAllDoctors);
router.post('/', authMiddleware,   validateDoctor, roleMiddleware('admin'), createDoctor);
router
  .route('/:id')
  .put(authMiddleware, roleMiddleware('admin'), validateDoctor, updateDoctor)
  .delete(authMiddleware, roleMiddleware('admin'), deleteDoctor);

export default router;
