import { Schema, model, Document } from 'mongoose'

export interface IStudent extends Document {
  name: string
  surname: string
  birthdate: Date
  phoneNumber1: string
  phoneNumber2: string
  tcNumber: string
  gender: string
  vehicle: string
  diagnosis: string
  address: string
  parentinfo: string
  education: string[]
  imageUrl?: string
  createdAt?: Date // Kayıt tarihi
  blood: string
  status: 'Asil' | 'Sıraki' | 'Pasif'
  isActive: boolean
}

const StudentSchema = new Schema<IStudent>({
  name: { type: String, required: true },
  surname: { type: String, required: true },
  birthdate: { type: Date, required: true },
  phoneNumber1: { type: String, required: true },
  phoneNumber2: { type: String, required: true },
  tcNumber: { type: String, required: true },
  gender: { type: String, required: true },
  vehicle: { type: String, required: true },
  diagnosis: { type: String, required: true },
  address: { type: String, required: true },
  parentinfo: { type: String, required: true },
  education: { type: [String], required: true },
  imageUrl: { type: String, required: false },
  blood: { type: String, required: false },
  status: { type: String, enum: ['Asil', 'Sıradaki', 'Pasif'], default: 'Asil' }, // Güncellenmiş "status" alanı
  isActive: { type: Boolean, default: true }

},
{ timestamps: true } // Otomatik olarak createdAt ve updatedAt alanlarını ekler

)

export default model<IStudent>('Student', StudentSchema)
