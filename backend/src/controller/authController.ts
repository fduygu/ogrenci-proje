import { Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import Personnel from '../models/personnelModel'
import nodemailer from 'nodemailer'

// ** Kullanıcı Girişi (Login)**
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body
    const personnel = await Personnel.findOne({ email }).select('+password')

    if (!personnel) {
      console.log('Kullanıcı bulunamadı:', email)
      return res.status(400).json({ message: 'Geçersiz e-posta veya şifre' })
    }

    const isMatch = await bcrypt.compare(password, personnel.password)
    if (!isMatch) {
      return res.status(400).json({ message: 'Geçersiz e-posta veya şifre' })
    }
    const userRole = typeof personnel.role === 'string' ? personnel.role : 'personnel'
    // **✅ Token oluştur ve kullanıcıya dön**
    const token = jwt.sign(
      { id: personnel._id, email: personnel.email, role: personnel.role },
      process.env.JWT_SECRET || 'default_secret_key', // Eğer .env yüklenmezse, varsayılan bir değer kullan
      { expiresIn: '1h' } // Token 1 saat geçerli olacak
    )
    return res.status(200).json({
      message: 'Giriş başarılı',
      personnel: {
        id: personnel._id,
        name: personnel.name,
        surname: personnel.surname,
        email: personnel.email,
        role: userRole,
        imageUrl: personnel.imageUrl || 'https://www.w3schools.com/howto/img_avatar.png'// Varsayılan resim
      },
      token
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

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: personnel.email,
      subject: 'Şifre Sıfırlama Talebi',
      text: `Merhaba ${personnel.name},\n\nŞifrenizi sıfırlamak için aşağıdaki bağlantıya tıklayın:\n${resetLink}\n\nBu bağlantı 15 dakika içinde geçerliliğini yitirecektir.`
    }

    await transporter.sendMail(mailOptions)

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

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      id: string;
    }

    const personnel = await Personnel.findById(decoded.id)
    if (!personnel) {
      return res.status(400).json({ message: 'Geçersiz veya süresi dolmuş token!' })
    }

    const salt = await bcrypt.genSalt(10)
    personnel.password = await bcrypt.hash(newPassword, salt)
    await personnel.save()

    res.status(200).json({ message: 'Şifre başarıyla sıfırlandı.' })
  } catch (error) {
    res.status(500).json({ message: 'Şifre sıfırlama işlemi başarısız oldu!' })
  }
}

// ** Kullanıcı Şifresini Güncelleme (Mevcut Kullanıcı)**
export const changePassword = async (req: Request, res: Response) => {
  try {
    const { email, oldPassword, newPassword } = req.body

    const personnel = await Personnel.findOne({ email }).select('+password')
    if (!personnel) {
      return res.status(400).json({ message: 'Kullanıcı bulunamadı' })
    }

    const isMatch = await bcrypt.compare(oldPassword, personnel.password)
    if (!isMatch) {
      return res.status(400).json({ message: 'Mevcut şifre yanlış' })
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10)
    personnel.password = hashedPassword
    await personnel.save()

    res.status(200).json({ message: 'Şifre başarıyla güncellendi' })
  } catch (error) {
    res.status(500).json({ message: 'Şifre güncellenirken hata oluştu', error })
  }
}
