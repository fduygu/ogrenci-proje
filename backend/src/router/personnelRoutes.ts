import express from 'express'
import {
  getAllPersonnel,
  createPersonnel,
  updatePersonnel,
  deletePersonnel
} from '../controller/personnelController'
import upload from '../middleware/uploadMiddleware' // Fotoğraf yükleme middleware

const router = express.Router()

router.get('/', getAllPersonnel)
router.post('/', upload.single('file'), createPersonnel)
router.put('/:id', upload.single('file'), updatePersonnel)
router.delete('/:id', deletePersonnel) // Personel sil

export default router
