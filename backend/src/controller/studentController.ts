import { Request, Response } from 'express'
import * as StudentService from '../services/studentService'

// Öğrenci oluşturma
export const createStudent = async (req: Request, res: Response) => {
  console.log('Gelen Veri:', req.body) // Gelen veriyi logla
  try {
    const savedStudent = await StudentService.createStudent(req.body)// MongoDB kaydı
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
    const updatedStudent = await StudentService.updateStudent(req.params.id, req.body)
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
