import express from 'express'
import {
  getAllStudents,
  createStudent,
  updateStudent,
  deleteStudent,
  getStudentsWithService,
  getActiveStudents,
  checkTCNumber
} from '../controller/studentController'
import ScheduleController from '../controller/scheduleController' // ScheduleController için import
import upload from '../middleware/uploadMiddleware' // Fotoğraf yükleme middleware
import { authenticateToken, authenticateAdmin } from '../middleware/authMiddleware' // AuthMiddleware import et

const router = express.Router()

router.get('/', authenticateToken, getAllStudents)

// Fotoğraf yükleme middleware eklenmiş versiyon
router.post('/', authenticateToken, authenticateAdmin, upload.single('file'), createStudent)
router.put('/:id', authenticateToken, authenticateAdmin, upload.single('file'), updateStudent)
router.delete('/:id', authenticateToken, authenticateAdmin, deleteStudent)
router.get('/students-with-service', (req, res, next) => {
  next()
}, authenticateToken, getStudentsWithService)
router.get('/:studentId/schedules', authenticateToken, ScheduleController.getSchedulesByStudent)
router.get('/active-students', authenticateToken, getActiveStudents)
router.get('/check-tc/:tcNumber', authenticateToken, checkTCNumber)
export default router
