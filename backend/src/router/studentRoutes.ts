import express from 'express'
import {
  getAllStudents,
  createStudent,
  updateStudent,
  deleteStudent
} from '../controller/studentController'

const router = express.Router()

router.get('/', getAllStudents)
router.post('/', createStudent)
router.put('/:id', updateStudent)
router.delete('/:id', deleteStudent)

export default router
