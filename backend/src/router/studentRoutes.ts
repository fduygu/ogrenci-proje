import express from 'express'
import {
  getAllStudents,
  createStudent,
  updateStudent,
  deleteStudent
} from '../controller/studentController'
import upload from '../middleware/uploadMiddleware' // Fotoğraf yükleme middleware

const router = express.Router()

router.get('/', getAllStudents)

// Fotoğraf yükleme middleware eklenmiş versiyon
router.post('/', upload.single('file'), createStudent)

router.put('/:id', upload.single('file'), updateStudent)
router.delete('/:id', deleteStudent)

export default router
