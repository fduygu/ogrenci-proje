import express from 'express'
import studentRoutes from './studentRoutes' // Burada öğrenci rotası dahil edildi
import personnelRoutes from './personnelRoutes'
import classRoutes from './classRoutes'
import scheduleRoutes from './scheduleRoutes'

const router = express.Router()

// Rotaları tanımla
router.use('/students', studentRoutes)
router.use('/personnel', personnelRoutes) // Personelle ilgili işlemler
router.use('/classes', classRoutes)
router.use('/schedules', scheduleRoutes)

export default router
