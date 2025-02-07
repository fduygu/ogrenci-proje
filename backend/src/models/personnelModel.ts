import mongoose, { Document, Schema } from 'mongoose'
export interface IPersonnel extends Document {
  name: string
  surname: string
  tcNumber: string
  title: string
  branch: string
  phone: string
  address: string
  imageUrl?: string
  email: string;
  password: string;
  role?: string;
  createdAt?: Date // Kayıt tarihi
}

const PersonnelSchema = new Schema<IPersonnel>({
  name: { type: String, required: true },
  surname: { type: String, required: true },
  tcNumber: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  branch: { type: String, required: true },
  phone: { type: String, required: true },
  imageUrl: { type: String, required: false },
  address: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'personnel'], default: 'personnel' } // String olarak kaydedildi
},
{ timestamps: true } // Otomatik olarak createdAt ve updatedAt alanlarını ekler

)
export default mongoose.model<IPersonnel>('Personnel', PersonnelSchema)
