import mongoose, { Document, Schema } from 'mongoose'

export interface IPersonnel extends Document {
  name: string
  surname: string
  tcNumber: string
  title: string
  branch: string
  phone: string
  address: string
  createdAt?: Date // Kayıt tarihi
}

const PersonnelSchema = new Schema<IPersonnel>({
  name: { type: String, required: true },
  surname: { type: String, required: true },
  tcNumber: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  branch: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true }
},
{ timestamps: true } // Otomatik olarak createdAt ve updatedAt alanlarını ekler

)

export default mongoose.model<IPersonnel>('Personnel', PersonnelSchema)
