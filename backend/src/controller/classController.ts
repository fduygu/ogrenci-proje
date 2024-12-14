import { Request, Response } from 'express'
import * as ClassService from '../services/classService'

export const createClass = async (req: Request, res: Response) => {
  try {
    const newClass = await ClassService.createClass(req.body)
    res.status(201).json(newClass)
  } catch (error) {
    res.status(500).json({ message: 'Sınıf oluşturulamadı', error })
  }
}

export const getAllClasses = async (req: Request, res: Response) => {
  try {
    const classes = await ClassService.getAllClasses()
    res.status(200).json(classes)
  } catch (error) {
    res.status(500).json({ message: 'Sınıflar alınamadı', error })
  }
}

export const getClassById = async (req: Request, res: Response) => {
  try {
    const classItem = await ClassService.getClassById(req.params.id)
    if (!classItem) {
      return res.status(404).json({ message: 'Sınıf bulunamadı' })
    }
    res.status(200).json(classItem)
  } catch (error) {
    res.status(500).json({ message: 'Sınıf alınamadı', error })
  }
}

export const updateClass = async (req: Request, res: Response) => {
  try {
    const updatedClass = await ClassService.updateClass(req.params.id, req.body)
    if (!updatedClass) {
      return res.status(404).json({ message: 'Sınıf bulunamadı' })
    }
    res.status(200).json(updatedClass)
  } catch (error) {
    res.status(500).json({ message: 'Sınıf güncellenemedi', error })
  }
}

export const deleteClass = async (req: Request, res: Response) => {
  try {
    const deletedClass = await ClassService.deleteClass(req.params.id)
    if (!deletedClass) {
      return res.status(404).json({ message: 'Sınıf bulunamadı' })
    }
    res.status(200).json({ message: 'Sınıf silindi' })
  } catch (error) {
    res.status(500).json({ message: 'Sınıf silinemedi', error })
  }
}
