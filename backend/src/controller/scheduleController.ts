import { Request, Response } from 'express'
import Schedule from '../models/scheduleModel'
import PersonnelModel from '../models/personnelModel'
import StudentModel from '../models/studentModel'

class ScheduleController {
  copyScheduleToNextWeek = async (req: Request, res: Response): Promise<void> => {
    try {
      const { personnelId, startDate, endDate } = req.body

      if (!personnelId || !startDate || !endDate) {
        res.status(400).json({ message: 'Personel ID ve tarih aralığı gerekli!' })
        return
      }

      // Mevcut haftanın planlarını al
      const schedules = await Schedule.find({
        personnelId,
        date: {
          $gte: new Date(startDate),
          $lte: new Date(endDate)
        }
      })

      if (!schedules || schedules.length === 0) {
        res.status(404).json({ message: 'Kopyalanacak plan bulunamadı!' })
        return
      }

      // Yeni planlar oluştur (bir hafta ileriye kopyala)
      const newSchedules = await Promise.all(
        schedules.map(async (schedule) => {
          const newDate = new Date(schedule.date)
          newDate.setDate(newDate.getDate() + 7)

          // Öğrencileri çek
          const students = await StudentModel.find({ _id: { $in: schedule.studentIds } })

          // Öğrenci isimlerini oluştur
          const studentNames = students.map(student => `${student.name} ${student.surname}`)

          // Servis kullanımı kontrolü
          const studentVehicle = students.some(student => student.vehicle === 'Evet') ? 'Evet' : 'Hayır'

          return {
            personnelId: schedule.personnelId,
            personnelName: schedule.personnelName,
            studentIds: schedule.studentIds, // ID'leri koru
            studentNames, // Doğru öğrenci isimlerini ekle
            studentVehicle, // Servis bilgisi
            date: newDate,
            time: schedule.time,
            note: schedule.note
          }
        })
      )

      // Yeni planları veritabanına kaydet
      await Schedule.insertMany(newSchedules)

      res.status(201).json({ message: 'Planlar başarıyla bir sonraki haftaya kopyalandı!' })
    } catch (error) {
      console.error('Planlar kopyalanamadı:', error)
      res.status(500).json({ message: 'Planlar kopyalanamadı!', error })
    }
  }

  createSchedule = async (req: Request, res: Response): Promise<void> => {
    try {
      const { personnelId, studentIds, date, time, note } = req.body
      // Validate inputs
      if (!personnelId || !studentIds || !date || !time) {
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
      if (!personnel) {
        res.status(404).json({ message: 'Personel bulunamadı!' })
        return
      }
      const students = await StudentModel.find({ _id: { $in: studentIds } })
      if (!students || students.length === 0) {
        res.status(404).json({ message: 'Öğrenciler bulunamadı!' })
        return
      }
      const studentNames = students.map((student) => `${student.name} ${student.surname}`)
      const studentVehicle = students
        .map((student) => student.vehicle)
        .includes('Evet')
        ? 'Evet'
        : 'Hayır'
      // Create Schedule
      const scheduleData = {
        personnelId,
        personnelName: `${personnel.name} ${personnel.surname}`,
        studentIds,
        studentNames,
        date: formattedDate,
        studentVehicle, // Bir öğrenci bile "Evet" ise tüm plan için "Evet" yap
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
      const { personnelId } = req.params
      const { startDate, endDate } = req.query

      if (!personnelId) {
        res.status(400).json({ message: 'Personel ID gerekli!' })
        return
      }

      if (!startDate || !endDate) {
        res.status(400).json({ message: 'Tarih aralığı gerekli!' })
        return
      }

      const parsedStartDate = new Date(startDate as string)
      const parsedEndDate = new Date(endDate as string)

      if (isNaN(parsedStartDate.getTime()) || isNaN(parsedEndDate.getTime())) {
        res.status(400).json({ message: 'Geçersiz tarih formatı!' })
        return
      }

      const schedules = await Schedule.find({
        personnelId,
        date: {
          $gte: parsedStartDate,
          $lte: parsedEndDate
        }
      })

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
      const { personnelId, studentIds, note } = req.body

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
      if (studentIds && studentIds.length > 0) {
        const students = await StudentModel.find({ _id: { $in: studentIds } })
        if (!students || students.length === 0) {
          res.status(404).json({ message: 'Öğrenciler bulunamadı!' })
          return
        }
        schedule.studentIds = studentIds
        const studentNames = students.map(student => `${student.name} ${student.surname}`)
        schedule.studentNames = studentNames
        const hasVehicle = students.some(student => student.vehicle === 'Evet')
        schedule.studentVehicle = hasVehicle ? 'Evet' : 'Hayır'
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
