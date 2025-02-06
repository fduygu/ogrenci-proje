import express from 'express'
import asyncHandler from '../utils/asyncHandler' // Yeni eklediğimiz async handler
import { forgotPassword, resetPassword, changePassword, login } from '../controller/authController'

const router = express.Router()

router.post('/login', asyncHandler(login)) // Kullanıcı girişi
router.post('/forgot-password', asyncHandler(forgotPassword)) // Şifremi unuttum
router.post('/reset-password/:token', asyncHandler(resetPassword)) // Yeni şifre belirleme
router.post('/change-password', asyncHandler(changePassword)) // Kullanıcı kendi şifresini güncelleyebilir
export default router
