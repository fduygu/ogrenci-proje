import mongoose, { Schema, Document } from 'mongoose'

export interface IClass extends Document {
  className: string;
  classroomNumber: string;
  capacity: number;
}

const ClassSchema: Schema = new Schema(
  {
    className: { type: String, required: true },
    classroomNumber: { type: String, required: true },
    capacity: { type: Number, required: true }
  },
  { timestamps: true }
)

export default mongoose.model<IClass>('Class', ClassSchema)
