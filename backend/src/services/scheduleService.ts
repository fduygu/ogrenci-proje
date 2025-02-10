import Schedule from '../models/scheduleModel'
interface ISchedule {
    personnelId: string;
    personnelName: string;
    date: string;
    time: string;
    studentId: string;
    studentName: string;
    note?: string;
  }

class ScheduleService {
  // Yeni bir plan ekle
  async createSchedule (data: Partial<ISchedule>) {
    const schedule = new Schedule(data)
    return await schedule.save()
  }

  // Tüm planları getir
  async getSchedules (): Promise<ISchedule[]> {
    return await Schedule.find()
  }

  // Belirli bir personelin planlarını getir
  async getSchedulesByPersonnel (personnelId: string): Promise<ISchedule[]> {
    return await Schedule.find({ personnelId })
  }

  // Belirli bir öğrencinin planlarını getir
  async getSchedulesByStudent (studentId: string): Promise<ISchedule[]> {
    return await Schedule.find({ studentId })
  }

  // Bir planı güncelle
  async updateSchedule (id: string, data: Partial<ISchedule>): Promise<ISchedule | null> {
    return await Schedule.findByIdAndUpdate(id, data, { new: true })
  }

  // Bir planı sil
  async deleteSchedule (id: string): Promise<void> {
    await Schedule.findByIdAndUpdate(id, { isActive: false }) //  Soft delete
  }
}

export default new ScheduleService()
