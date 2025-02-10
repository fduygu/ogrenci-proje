import { Router } from 'express'
import * as ClassController from '../controller/classController'
import { authenticateToken, authenticateAdmin } from '../middleware/authMiddleware'

const router = Router()

router.post('/', authenticateToken, authenticateAdmin, (req, res, next) => {
  ClassController.createClass(req, res).catch(next)
})

router.get('/', authenticateToken, (req, res, next) => {
  ClassController.getAllClasses(req, res).catch(next)
})

router.get('/:id', authenticateToken, (req, res, next) => {
  ClassController.getClassById(req, res).catch(next)
})

router.put('/:id', authenticateToken, authenticateAdmin, (req, res, next) => {
  ClassController.updateClass(req, res).catch(next)
})

router.delete('/:id', authenticateToken, authenticateAdmin, (req, res, next) => {
  ClassController.deleteClass(req, res).catch(next)
})

export default router
