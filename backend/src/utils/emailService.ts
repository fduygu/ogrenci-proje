import nodemailer from 'nodemailer'

// E-posta gönderme fonksiyonu
export const sendEmail = async (to: string, subject: string, text: string) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER, // Gmail adresin
        pass: process.env.EMAIL_PASS // Gmail uygulama şifren
      }
    })

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      text
    }

    await transporter.sendMail(mailOptions)
    console.log(`E-posta başarıyla gönderildi: ${to}`)
  } catch (error) {
    console.error('E-posta gönderme hatası:', error)
    throw new Error('E-posta gönderilemedi.')
  }
}
