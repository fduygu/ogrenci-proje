import { Schema, model, Document } from 'mongoose'

export interface IStudent extends Document {
  name: string
  surname: string
  age: number
  phoneNumber: string
  tcNumber: string
  gender: string
  vehicle: string
  diagnosis: string
  address: string
  parentinfo: string
  education: string
  imageUrl?: string// Optional field
  createdAt?: Date // Kayıt tarihi
  blood: string
}

const StudentSchema = new Schema<IStudent>({
  name: { type: String, required: true },
  surname: { type: String, required: true },
  age: { type: Number, required: true },
  phoneNumber: { type: String, required: true },
  tcNumber: { type: String, required: true },
  gender: { type: String, required: true },
  vehicle: { type: String, required: true },
  diagnosis: { type: String, required: true },
  address: { type: String, required: true },
  parentinfo: { type: String, required: true },
  education: { type: String, required: true },
  imageUrl: { type: String, required: false },
  blood: { type: String, required: false }
},
{ timestamps: true } // Otomatik olarak createdAt ve updatedAt alanlarını ekler

)

export default model<IStudent>('Student', StudentSchema)
