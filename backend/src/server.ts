import express from 'express'
import mongoose from 'mongoose'
import bodyParser from 'body-parser'
import cors from 'cors'
import router from '../src/router' // Doğru yolu kontrol edin
import path from 'path'

const app = express()
const PORT = 3000

// Middleware
app.use(cors())
app.use(bodyParser.json())

// İstekleri Loglamak için Middleware
app.use((req, res, next) => {
  console.log(`Request received: ${req.method} ${req.path}`)
  next()
})

// MongoDB bağlantısı
mongoose
  .connect('mongodb://localhost:27017/engelsiz_yasam')
  .then(() => console.log('MongoDB bağlantısı başarılı'))
  .catch((err) => console.error('MongoDB bağlantı hatası:', err))

// Rotalar
app.use('/api', router) // Burada rotaları kontrol edin

console.log('Static folder path:', path.join(__dirname, '../uploads'))
app.use('/uploads', express.static(path.join(__dirname, '../uploads')))

// Sunucuyu başlat
app.listen(PORT, () => {
  console.log(`Sunucu ${PORT} portunda çalışıyor`)
})
