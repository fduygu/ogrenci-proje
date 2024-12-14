import { Router } from 'express'
import * as ClassController from '../controller/classController'

const router = Router()

router.post('/', (req, res, next) => {
  ClassController.createClass(req, res).catch(next)
}) // Sınıf oluştur

router.get('/', (req, res, next) => {
  ClassController.getAllClasses(req, res).catch(next)
}) // Tüm sınıfları getir

router.get('/:id', (req, res, next) => {
  ClassController.getClassById(req, res).catch(next)
}) // ID ile sınıf getir

router.put('/:id', (req, res, next) => {
  ClassController.updateClass(req, res).catch(next)
}) // ID ile sınıf güncelle

router.delete('/:id', (req, res, next) => {
  ClassController.deleteClass(req, res).catch(next)
}) // ID ile sınıf sil

export default router
