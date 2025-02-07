import express from 'express'
import asyncHandler from '../utils/asyncHandler' // Yeni eklediğimiz async handler
import { forgotPassword, resetPassword, login } from '../controller/authController'

const router = express.Router()

router.post('/login', asyncHandler(login)) // Kullanıcı girişi
router.post('/forgot-password', asyncHandler(forgotPassword)) // Şifremi unuttum
router.post('/reset-password/:token', asyncHandler(resetPassword)) // Yeni şifre belirleme
export default router
