import mongoose, { Document } from 'mongoose'

// Schedule interface
export interface ISchedule extends Document {
  personnelId: string;
  personnelName: string;
  studentIds: string[];
  studentNames: string [];
  studentVehicle: string; // Servis bilgisi alanı
  date: Date;
  time: string;
  note?: string;
}

// Schedule Schema
const scheduleSchema = new mongoose.Schema({
  personnelId: { type: String, required: true },
  personnelName: { type: String, required: true },
  studentIds: { type: [String], required: true }, // Birden fazla öğrenci
  studentNames: { type: [String], required: true }, // Öğrenci adları listesi
  studentVehicle: { type: String, enum: ['Evet', 'Hayır'], default: 'Hayır' }, // Servis bilgisi
  date: { type: Date, required: true },
  time: { type: String, required: true },
  note: { type: String }
})

const Schedule = mongoose.model<ISchedule>('Schedule', scheduleSchema)

export default Schedule
