import mongoose, { Schema, Document } from 'mongoose'

export interface IClass extends Document {
  className: string;
  classroomNumber: string;
  capacity: number;
  isActive: boolean;
}

const ClassSchema: Schema = new Schema(
  {
    className: { type: String, required: true },
    classroomNumber: { type: String, required: true },
    capacity: { type: Number, required: true },
    isActive: { type: Boolean, default: true }

  },
  { timestamps: true }
)

export default mongoose.model<IClass>('Class', ClassSchema)
