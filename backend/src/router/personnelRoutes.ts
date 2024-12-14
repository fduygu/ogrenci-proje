import express from 'express'
import {
  getAllPersonnel,
  createPersonnel,
  updatePersonnel,
  deletePersonnel
} from '../controller/personnelController'

const router = express.Router()

router.get('/', getAllPersonnel) // Tüm personelleri getir
router.post('/', createPersonnel) // Yeni personel ekle
router.put('/:id', updatePersonnel) // Personel güncelle
router.delete('/:id', deletePersonnel) // Personel sil

export default router
