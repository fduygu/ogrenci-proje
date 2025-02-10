// Updated classController.ts
import { Request, Response } from 'express'
import * as ClassService from '../services/classService'
import { AuthenticatedRequest } from '../middleware/authMiddleware'
import { createLog } from '../utils/logger'

export const createClass = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const newClass = await ClassService.createClass(req.body)
    await createLog(req.user?.id.toString(), 'add_class', `Sınıf eklendi: ${newClass.className}`)
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

export const updateClass = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const classId = req.params.id
    const classData = req.body

    const oldClass = await ClassService.getClassById(classId)
    if (!oldClass) {
      return res.status(404).json({ message: 'Sınıf bulunamadı' })
    }

    const updatedClass = await ClassService.updateClass(classId, classData)
    if (!updatedClass) {
      return res.status(404).json({ message: 'Sınıf bulunamadı' })
    }

    const excludedFields = ['_id', 'createdAt', 'updatedAt', '__v']
    const changedFields = Object.keys(classData)
      .filter(
        (key) => oldClass[key] !== classData[key] && !excludedFields.includes(key)
      )
      .reduce((acc, key) => {
        acc[key] = classData[key]
        return acc
      }, {} as Record<string, unknown>)

    if (Object.keys(changedFields).length > 0) {
      await createLog(
        req.user?.id.toString(),
        'update_class',
        `**Değişiklik Yapan:** ${req.user?.email} (${req.user?.id})\n**Güncellenen Sınıf:** ${updatedClass.className}\n**Yapılan Değişiklikler:** ${JSON.stringify(changedFields, null, 2)}`
      )
    }
    res.status(200).json(updatedClass)
  } catch (error) {
    res.status(500).json({ message: 'Sınıf güncellenemedi', error })
  }
}

export const deleteClass = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const deletedClass = await ClassService.deleteClass(req.params.id)
    if (!deletedClass) {
      return res.status(404).json({ message: 'Sınıf bulunamadı' })
    }
    await createLog(req.user?.id.toString(), 'delete_class', `Sınıf silindi: ${deletedClass.className}`)
    res.status(200).json({ message: 'Sınıf silindi' })
  } catch (error) {
    res.status(500).json({ message: 'Sınıf silinemedi', error })
  }
}
