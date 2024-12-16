import multer, { StorageEngine } from 'multer'
import path from 'path'

// Multer Storage Konfigürasyonu
const storage: StorageEngine = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/')
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`
    cb(null, uniqueSuffix + path.extname(file.originalname))
  }
})

// Dosya Türü Kontrolü
const fileFilter: multer.Options['fileFilter'] = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/jfif']
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(new Error('Sadece JPEG, PNG ve JFIF formatındaki dosyalara izin veriliyor!'))
  }
}

// Multer Yükleme Ayarları
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 } // Maksimum dosya boyutu: 2MB
})

export default upload
