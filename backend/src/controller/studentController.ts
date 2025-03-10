import { Request, Response } from 'express'
import * as StudentService from '../services/studentService'
import { AuthenticatedRequest } from '../middleware/authMiddleware'
import { createLog } from '../utils/logger'

interface EducationItem {
  value: string;
}

// Öğrenci oluşturma
export const createStudent = async (req: AuthenticatedRequest, res: Response) => {
  try {
    console.log('Gelen req.body içeriği:', req.body)
    if (req.body.surname) {
      req.body.surname = req.body.surname.toUpperCase()
    }
    // Fotoğraf yüklenmişse, URL oluştur
    const imageUrl = req.file
      ? `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`
      : ''
    // `education` alanını doğru formatta işleyin
    let education: string[] = []
    if (typeof req.body.education === 'string') {
      education = JSON.parse(req.body.education).map((item: EducationItem) => item.value || item)
    } else if (Array.isArray(req.body.education)) {
      education = req.body.education.map((item: EducationItem) => item.value || item)
    }
    // Gelen veriye fotoğraf URL'sini ekle
    const studentData = { ...req.body, imageUrl, education, status: req.body.status || 'Asil', isActive: true }
    // Öğrenci oluşturma servisini çağır
    const savedStudent = await StudentService.createStudent(studentData)
    await createLog(req.user?.id.toString(), 'add_student', `Öğrenci eklendi: ${savedStudent.name} ${savedStudent.surname}`)
    res.status(201).json(savedStudent)
  } catch (error) {
    console.error('Veritabanına kaydedilirken hata:', error) // Hataları logla
    res.status(500).json({ message: 'Veritabanına kaydedilirken hata oluştu', error })
  }
}

// Tüm öğrencileri listeleme
export const getAllStudents = async (req: Request, res: Response): Promise<void> => {
  try {
    const students = await StudentService.getAllStudents()
    res.status(200).json(students)
  } catch (error) {
    res.status(500).json({ message: 'Öğrenciler alınırken bir hata oluştu', error })
  }
}

// Öğrenci detayını alma
export const getStudentById = async (req: Request, res: Response): Promise<void> => {
  try {
    const student = await StudentService.getStudentById(req.params._id)
    if (!student) {
      res.status(404).json({ message: 'Öğrenci bulunamadı' })
      return
    }
    res.status(200).json(student)
  } catch (error) {
    res.status(500).json({ message: 'Öğrenci alınırken bir hata oluştu', error })
  }
}

// Öğrenci güncelleme
export const updateStudent = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const studentId = req.params.id
  const studentData = req.body // Gelen veriler

  console.log('Güncellenmek istenen öğrenci ID:', studentId)
  try {
    const oldStudent = await StudentService.getStudentById(studentId)
    if (!oldStudent) {
      res.status(404).json({ message: 'Öğrenci bulunamadı' })
      return
    }
    // Soyad alanını büyük harfe dönüştür
    if (studentData.surname) {
      studentData.surname = studentData.surname.toUpperCase()
    }
    // Fotoğraf yüklenmişse, URL oluştur
    const imageUrl = req.file
      ? `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`
      : undefined
    // `education` alanını doğru formatta işleyin
    let education: string[] = []
    if (typeof studentData.education === 'string') {
      education = JSON.parse(studentData.education).map((item: EducationItem) => item.value || item)
    } else if (Array.isArray(studentData.education)) {
      education = studentData.education.map((item: EducationItem) => item.value || item)
    }
    // Güncellenmiş veriyi oluştur
    const updatedData = imageUrl
      ? { ...studentData, education, imageUrl }
      : { ...studentData, education }

    const updatedStudent = await StudentService.updateStudent(studentId, updatedData)
    if (!updatedStudent) {
      res.status(404).json({ message: 'Öğrenci bulunamadı' })
      return
    }
    // Değişiklikleri takip etmek için sadece değişen alanları yakala
    const excludedFields = ['_id', 'createdAt', 'updatedAt', '__v']
    const changedFields = Object.keys(studentData)
      .filter(
        (key) =>
          oldStudent.get(key) !== studentData[key] && !excludedFields.includes(key)
      )
      .reduce((acc, key) => {
        acc[key] = studentData[key]
        return acc
      }, {} as Record<string, unknown>)

    if (Object.keys(changedFields).length > 0) {
      await createLog(
        req.user?.id.toString(),
        'update_student',
        `**Değişiklik Yapan:** ${req.user?.email} (${req.user?.id})
        **Güncellenen Öğrenci:** ${updatedStudent.name} ${updatedStudent.surname}
        **Yapılan Değişiklikler:** ${JSON.stringify(changedFields, null, 2)}`
      )
    }
    res.status(200).json(updatedStudent)
  } catch (error) {
    res.status(500).json({ message: 'Öğrenci güncellenirken bir hata oluştu', error })
  }
}

// Öğrenci silme
export const deleteStudent = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const studentId = req.params.id
    const updatedStudent = await StudentService.updateStudent(studentId, { isActive: false })

    console.log('Silinen öğrenci:', updatedStudent) // Konsola log ekle

    if (!updatedStudent) {
      res.status(404).json({ message: 'Öğrenci bulunamadı' })
      return
    }
    await createLog(req.user?.id.toString(), 'delete_student', `Öğrenci silindi: ${updatedStudent.name}`)
    res.status(200).json({ message: 'Öğrenci başarıyla silindi.', student: updatedStudent })
  } catch (error) {
    console.error('Silme işlemi sırasında hata oluştu:', error)
    res.status(500).json({ message: 'Silme işlemi sırasında hata oluştu', error })
  }
}
export const getStudentsWithService = async (req: Request, res: Response) => {
  try {
    // Burada, öğrenciler veritabanından çekilmeye çalışılır
    const studentsWithService = await StudentService.getStudentsByFilter({ vehicle: 'Evet' })
    res.status(200).json(studentsWithService)
  } catch (error) {
    console.error('Hata:', error) // Eğer hata varsa loglar
    res.status(500).json({ message: 'Servis kullanan öğrenciler alınırken hata oluştu', error })
  }
}
export const getActiveStudents = async (req: Request, res: Response) => {
  try {
    const activeStudents = await StudentService.getStudentsByFilter({ status: 'Asil' }) // Sadece "Asil" durumundaki öğrencileri getir
    res.status(200).json(activeStudents)
  } catch (error) {
    console.error('Hata:', error)
    res.status(500).json({ message: 'Aktif öğrenciler alınırken hata oluştu', error })
  }
}
export const checkTCNumber = async (req: Request, res: Response): Promise<void> => {
  try {
    const { tcNumber } = req.params
    const existingStudent = await StudentService.getStudentsByFilter({ tcNumber })

    res.json({ exists: existingStudent.length > 0 })
  } catch (error) {
    console.error('TC Kimlik No kontrol hatası:', error)
    res.status(500).json({ message: 'Sunucu hatası!' })
  }
}
