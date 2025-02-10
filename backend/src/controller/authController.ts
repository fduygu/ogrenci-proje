import { Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import Personnel from '../models/personnelModel'
import nodemailer from 'nodemailer'
import { createLog } from '../utils/logger'

// ** Kullanıcı Girişi (Login)**
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body

    const personnel = await Personnel.findOne({ email }).select('+password')
    if (!personnel) {
      return res.status(400).json({ message: 'Geçersiz e-posta veya şifre' })
    }

    const isMatch = await bcrypt.compare(password, personnel.password)
    if (!isMatch) {
      return res.status(400).json({ message: 'Geçersiz e-posta veya şifre' })
    }

    // Token oluşturma
    const token = jwt.sign(
      { id: personnel._id, email: personnel.email, role: personnel.role },
      process.env.JWT_SECRET || 'default_secret_key',
      { expiresIn: '1h' }
    )

    console.log('Oluşturulan Token:', token) // Token'in gerçekten oluşup oluşmadığını kontrol etmek için
    // Giriş başarılıysa log kaydını oluşturuyoruz
    await createLog(personnel._id.toString(), 'login', `Kullanıcı giriş yaptı: ${personnel.email}`)

    res.status(200).json({
      message: 'Giriş başarılı',
      token, // Token'i frontend'e gönderiyoruz
      personnel: {
        id: personnel._id,
        name: personnel.name,
        surname: personnel.surname,
        email: personnel.email,
        role: personnel.role,
        imageUrl: personnel.imageUrl
      }
    })
  } catch (error) {
    console.error('Giriş hatası:', error)
    return res.status(500).json({ message: 'Sunucu hatası' })
  }
}

// ** Şifremi Unuttum (Şifre Sıfırlama)**
export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body

    const personnel = await Personnel.findOne({ email })
    if (!personnel) {
      return res.status(404).json({ message: 'Bu e-posta ile kayıtlı bir kullanıcı bulunamadı' })
    }

    const resetToken = jwt.sign(
      { id: personnel._id },
      process.env.JWT_SECRET as string,
      { expiresIn: '15m' }
    )

    const resetLink = `http://localhost:9000/#/auth/reset-password/${resetToken}`

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    })
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: personnel.email,
      subject: 'Şifre Sıfırlama Talebi',
      html: `<p>Merhaba ${personnel.name},</p>
      <p>Şifrenizi sıfırlamak için aşağıdaki bağlantıya tıklayın:</p>
      <a href="${resetLink}">${resetLink}</a>
      <p>Bu bağlantı 1 saat içinde geçerliliğini yitirecektir.</p>`
    })
    await createLog(personnel._id.toString(), 'password_reset_request', `Şifre sıfırlama talebi gönderildi: ${personnel.email}`)
    res.status(200).json({ message: 'Şifre sıfırlama bağlantısı e-posta adresinize gönderildi!' })
  } catch (error) {
    console.error('Şifre sıfırlama hatası:', error)
    res.status(500).json({ message: 'Şifre sıfırlanırken bir hata oluştu', error })
  }
}

// ** Yeni Şifreyi Güncelleme (Şifreyi Değiştir)**
export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { token } = req.params
    const { newPassword } = req.body

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string }
    const personnel = await Personnel.findById(decoded.id).select('+password')

    if (!personnel) {
      return res.status(400).json({ message: 'Geçersiz veya süresi dolmuş token!' })
    }

    console.log('Eski Şifre (Hashli):', personnel.password)

    // Aynı şifre olup olmadığını kontrol et
    const isSamePassword = await bcrypt.compare(newPassword, personnel.password)
    console.log('Yeni Şifre Eski Şifre ile Aynı mı?', isSamePassword)

    if (isSamePassword) {
      return res.status(400).json({ message: 'Yeni şifre eski şifreyle aynı olamaz!' })
    }

    // Şifreyi hashle (bcrypt ile)
    const salt = await bcrypt.genSalt(10) // Tutarlı bir salt rounds değeri
    const hashedPassword = await bcrypt.hash(newPassword, salt)
    console.log('Veritabanına Kaydedilmeden Önce Hash:', hashedPassword)

    // Şifreyi kaydet
    personnel.password = hashedPassword
    await personnel.save()

    // Veritabanından tekrar çekerek doğrula
    const updatedPersonnel = await Personnel.findById(personnel._id).select('+password')
    console.log('Veritabanından Tekrar Çekilen Hash:', updatedPersonnel?.password)
    await createLog(personnel._id.toString(), 'password_reset_success', `Şifre başarıyla sıfırlandı: ${personnel.email}`)
    res.status(200).json({ message: 'Şifre başarıyla sıfırlandı.' })
  } catch (error) {
    console.error('Şifre sıfırlama hatası:', error)
    res.status(500).json({ message: 'Şifre sıfırlama işlemi başarısız oldu!' })
  }
}
