import { Request, Response } from 'express'
import Schedule from '../models/scheduleModel'
import PersonnelModel from '../models/personnelModel'
import StudentModel from '../models/studentModel'

class ScheduleController {
  createSchedule = async (req: Request, res: Response): Promise<void> => {
    try {
      const { personnelId, studentId, date, time, note } = req.body

      console.log('Gelen veri:', req.body)

      // Validate inputs
      if (!personnelId || !studentId || !date || !time) {
        res.status(400).json({ message: 'Eksik alanlar var!' })
        return
      }

      // Check and format date
      const formattedDate = new Date(date)
      if (isNaN(formattedDate.getTime())) {
        res.status(400).json({ message: 'Geçersiz tarih formatı!' })
        return
      }

      // Fetch Personnel and Student Details
      const personnel = await PersonnelModel.findById(personnelId)
      const student = await StudentModel.findById(studentId)

      if (!personnel) {
        res.status(404).json({ message: 'Personel bulunamadı!' })
        return
      }

      if (!student) {
        res.status(404).json({ message: 'Öğrenci bulunamadı!' })
        return
      }
      console.log('Öğrenciden Gelen vehicle:', student.vehicle) // Burayı loglayın

      // Create Schedule
      const scheduleData = {
        personnelId,
        personnelName: `${personnel.name} ${personnel.surname}`,
        studentId,
        studentName: `${student.name} ${student.surname}`,
        date: formattedDate,
        studentVehicle: student.vehicle || 'Hayır', // Öğrenci servis bilgisi
        time,
        note
      }

      const newSchedule = new Schedule(scheduleData)
      await newSchedule.save()

      res.status(201).json(newSchedule)
    } catch (error) {
      console.error('Plan oluşturulamadı:', error)
      res.status(500).json({ message: 'Plan oluşturulamadı!', error })
    }
  }

  // Get All Schedules
  getSchedules = async (req: Request, res: Response): Promise<void> => {
    try {
      const schedules = await Schedule.find({})
      res.status(200).json(schedules)
    } catch (error) {
      console.error('Planlar alınamadı:', error)
      res.status(500).json({ message: 'Planlar alınamadı!', error })
    }
  }

  // Get Schedules by Personnel
  getSchedulesByPersonnel = async (req: Request, res: Response): Promise<void> => {
    try {
      const { personnelId } = req.query
      if (!personnelId) {
        res.status(400).json({ message: 'Personel ID gerekli!' })
        return
      }

      const schedules = await Schedule.find({ personnelId })
      res.status(200).json(schedules)
    } catch (error) {
      console.error('Planlar alınamadı:', error)
      res.status(500).json({ message: 'Planlar alınamadı!', error })
    }
  }

  // Get Schedules by Student
  getSchedulesByStudent = async (req: Request, res: Response): Promise<void> => {
    try {
      const { studentId } = req.params

      if (!studentId) {
        res.status(400).json({ message: 'Öğrenci ID gerekli!' })
        return
      }

      const schedules = await Schedule.find({ studentId })
      if (schedules.length === 0) {
        res.status(404).json({ message: 'Bu öğrenciye ait plan bulunamadı!' })
        return
      }

      res.status(200).json(schedules)
    } catch (error) {
      console.error('Planlar alınamadı:', error)
      res.status(500).json({ message: 'Planlar alınamadı!', error })
    }
  }

  // Update Schedule
  updateSchedule = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params
      const { personnelId, studentId, note } = req.body

      // Mevcut kaydı bul
      const schedule = await Schedule.findById(id)
      if (!schedule) {
        res.status(404).json({ message: 'Plan bulunamadı!' })
        return
      }

      // Personel bilgilerini güncelle
      if (personnelId && personnelId !== schedule.personnelId) {
        const personnel = await PersonnelModel.findById(personnelId)
        if (!personnel) {
          res.status(404).json({ message: 'Personel bulunamadı!' })
          return
        }
        schedule.personnelId = personnelId
        schedule.personnelName = `${personnel.name} ${personnel.surname}`
      }

      // Öğrenci bilgilerini güncelle
      if (studentId && studentId !== schedule.studentId) {
        const student = await StudentModel.findById(studentId)
        if (!student) {
          res.status(404).json({ message: 'Öğrenci bulunamadı!' })
          return
        }
        schedule.studentId = studentId
        schedule.studentName = `${student.name} ${student.surname}`
      }

      // Not bilgilerini güncelle
      if (note !== undefined) {
        schedule.note = note
      }

      // Kaydet ve güncellenmiş kaydı döndür
      const updatedSchedule = await schedule.save()
      res.status(200).json(updatedSchedule)
    } catch (error) {
      console.error('Plan güncellenemedi:', error)
      res.status(500).json({ message: 'Plan güncellenemedi!', error })
    }
  }

  // Delete Schedule
  deleteSchedule = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params

      const deletedSchedule = await Schedule.findByIdAndDelete(id)
      if (!deletedSchedule) {
        res.status(404).json({ message: 'Plan bulunamadı!' })
        return
      }

      res.status(200).json({ message: 'Plan silindi!' })
    } catch (error) {
      console.error('Plan silinemedi:', error)
      res.status(500).json({ message: 'Plan silinemedi!', error })
    }
  }
}

export default new ScheduleController()
