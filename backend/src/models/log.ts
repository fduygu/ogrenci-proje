import mongoose from 'mongoose'

// Log şeması tanımlanıyor
const logSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Kullanıcı ID'si
  action: { type: String, required: true }, // Yapılan işlem (örneğin: login, add_student)
  timestamp: { type: Date, default: Date.now }, // İşlemin zamanı
  details: { type: String } // İşlemle ilgili ek bilgiler
})

// Model olarak dışa aktarılıyor
export default mongoose.model('Log', logSchema)
