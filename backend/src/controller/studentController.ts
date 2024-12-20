import { Request, Response } from 'express'
import * as StudentService from '../services/studentService'

interface EducationItem {
  value: string;
}

// Öğrenci oluşturma
export const createStudent = async (req: Request, res: Response) => {
  console.log('Gelen Veri:', req.body) // Gelen veriyi logla
  try {
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
    const studentData = { ...req.body, imageUrl, education, status: req.body.status || 'main' }

    // Öğrenci oluşturma servisini çağır
    const savedStudent = await StudentService.createStudent(studentData)
    console.log('Kaydedilen Öğrenci:', savedStudent) // Kaydedilen veriyi logla
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
    const student = await StudentService.getStudentById(req.params.id)
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
export const updateStudent = async (req: Request, res: Response): Promise<void> => {
  try {
    // Soyad alanını büyük harfe dönüştür
    if (req.body.surname) {
      req.body.surname = req.body.surname.toUpperCase()
    }
    // Fotoğraf yüklenmişse, URL oluştur
    const imageUrl = req.file
      ? `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`
      : undefined
    // `education` alanını doğru formatta işleyin
    let education: string[] = []
    if (typeof req.body.education === 'string') {
      education = JSON.parse(req.body.education).map((item: EducationItem) => item.value || item)
    } else if (Array.isArray(req.body.education)) {
      education = req.body.education.map((item: EducationItem) => item.value || item)
    }
    // Güncellenmiş veriyi oluştur
    const updatedData = imageUrl
      ? { ...req.body, education, imageUrl }
      : { ...req.body, education }

    const updatedStudent = await StudentService.updateStudent(req.params.id, updatedData)

    if (!updatedStudent) {
      res.status(404).json({ message: 'Öğrenci bulunamadı' })
      return
    }
    res.status(200).json(updatedStudent)
  } catch (error) {
    res.status(500).json({ message: 'Öğrenci güncellenirken bir hata oluştu', error })
  }
}

// Öğrenci silme
export const deleteStudent = async (req: Request, res: Response): Promise<void> => {
  try {
    const deletedStudent = await StudentService.deleteStudent(req.params.id)
    if (!deletedStudent) {
      res.status(404).json({ message: 'Öğrenci bulunamadı' })
      return
    }
    res.status(200).json({ message: 'Öğrenci silindi', student: deletedStudent })
  } catch (error) {
    res.status(500).json({ message: 'Öğrenci silinirken bir hata oluştu', error })
  }
}
export const getStudentsWithService = async (req: Request, res: Response) => {
  try {
    console.log('Servis kullanan öğrenciler için sorgu başlıyor...')
    const studentsWithService = await StudentService.getStudentsByFilter({ vehicle: 'Evet' })
    console.log('Bulunan öğrenciler:', studentsWithService)
    res.status(200).json(studentsWithService)
  } catch (error) {
    console.error('Hata:', error)
    res.status(500).json({ message: 'Servis kullanan öğrenciler alınırken hata oluştu', error })
  }
}
