import express from 'express'
import {
  getAllPersonnel,
  createPersonnel,
  getPersonnelById,
  updatePersonnel,
  deletePersonnel
} from '../controller/personnelController'
import ScheduleController from '../controller/scheduleController'
import upload from '../middleware/uploadMiddleware'
import { authenticateToken, authenticateAdmin } from '../middleware/authMiddleware'

const router = express.Router()

// ** Token doğrulama middleware'i ile koruma ekledik**
router.get('/', authenticateToken, getAllPersonnel)
router.get('/:id', authenticateToken, getPersonnelById)
router.post('/', authenticateToken, authenticateAdmin, upload.single('file'), createPersonnel)
router.put('/:id', authenticateToken, upload.single('file'), updatePersonnel)
router.delete('/:id', authenticateToken, authenticateAdmin, deletePersonnel)
router.get('/:personnelId/schedules', authenticateToken, ScheduleController.getSchedulesByPersonnel)

export default router
