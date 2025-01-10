import { Router } from 'express'
import ScheduleController from '../controller/scheduleController'

const router = Router()

// Yeni plan ekle
router.post('/', ScheduleController.createSchedule)

// Planları listele
router.get('/', ScheduleController.getSchedules)

// Planı güncelle
router.put('/:id', ScheduleController.updateSchedule)

// Planı sil
router.delete('/:id', ScheduleController.deleteSchedule)

router.get('/student/:studentId', ScheduleController.getSchedulesByStudent)

router.get('/personnel/:personnelId', ScheduleController.getSchedulesByPersonnel)

router.post('/copy-to-next-week', ScheduleController.copyScheduleToNextWeek)

export default router
