import dotenv from 'dotenv'
import path from 'path'

// .env dosyasının tam yolunu belirtiyoruz
const envPath = path.resolve(__dirname, '.env')

// .env dosyasını yükle
const result = dotenv.config({ path: envPath })

if (result.error) {
  console.error('ENV YÜKLENİRKEN HATA:', result.error)
} else {
  console.log('ENV DOSYASI YÜKLENDİ!')
}

// Değişkeni oku
console.log('JWT_SECRET:', process.env.JWT_SECRET || 'ENV YÜKLENMEDİ!')
