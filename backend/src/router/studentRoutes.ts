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

const router = express.Router()

router.get('/', getAllStudents)

// Fotoğraf yükleme middleware eklenmiş versiyon
router.post('/', upload.single('file'), createStudent)
router.put('/:id', upload.single('file'), updateStudent)
router.delete('/:id', deleteStudent)
router.get('/students-with-service', (req, res, next) => {
  next()
}, getStudentsWithService)
router.get('/:studentId/schedules', ScheduleController.getSchedulesByStudent)
router.get('/active-students', getActiveStudents)
router.get('/check-tc/:tcNumber', checkTCNumber)
export default router
