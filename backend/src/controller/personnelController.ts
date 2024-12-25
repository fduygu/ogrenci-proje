import { Request, Response } from 'express'
import * as PersonnelService from '../services/personnelService'

// Personel oluşturma
export const createPersonnel = async (req: Request, res: Response) => {
  try {
    console.log('Yüklenen Dosya:', req.file)
    // Eğer fotoğraf yüklendiyse imageUrl'i ayarla
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null

    // Personel verisini oluştur
    const personnelData = {
      ...req.body,
      imageUrl // Fotoğraf URL'sini ekle
    }
    const savedPersonnel = await PersonnelService.createPersonnel(personnelData)// Veritabanına kaydet
    console.log('Kaydedilen Personel:', savedPersonnel) // Başarıyla kaydedilen veriyi logla
    res.status(201).json(savedPersonnel)
  } catch (error) {
    console.error('Veritabanına kaydedilirken hata oluştu:', error) // Hataları logla
    res.status(500).json({ message: 'Veritabanına kaydedilirken hata oluştu', error })
  }
}

// Tüm personelleri listeleme
export const getAllPersonnel = async (req: Request, res: Response): Promise<void> => {
  try {
    const personnel = await PersonnelService.getAllPersonnel()
    res.status(200).json(personnel)
  } catch (error) {
    res.status(500).json({ message: 'Personeller alınırken bir hata oluştu', error })
  }
}

// Personel detayını alma
export const getPersonnelById = async (req: Request, res: Response): Promise<void> => {
  try {
    const personnel = await PersonnelService.getPersonnelById(req.params.id)
    if (!personnel) {
      res.status(404).json({ message: 'Personel bulunamadı' })
      return
    }
    res.status(200).json(personnel)
  } catch (error) {
    res.status(500).json({ message: 'Personel alınırken bir hata oluştu', error })
  }
}

// Personel güncelleme
export const updatePersonnel = async (req: Request, res: Response): Promise<void> => {
  try {
    // Eğer yeni bir fotoğraf yüklendiyse imageUrl'i güncelle
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null

    const personnelData = {
      ...req.body,
      ...(imageUrl && { imageUrl })// Sadece yeni bir fotoğraf varsa güncelle
    }
    const updatedPersonnel = await PersonnelService.updatePersonnel(req.params.id, personnelData)
    if (!updatedPersonnel) {
      res.status(404).json({ message: 'Personel bulunamadı' })
      return
    }
    res.status(200).json(updatedPersonnel)
  } catch (error) {
    res.status(500).json({ message: 'Personel güncellenirken bir hata oluştu', error })
  }
}

// Personel silme
export const deletePersonnel = async (req: Request, res: Response): Promise<void> => {
  try {
    const deletedPersonnel = await PersonnelService.deletePersonnel(req.params.id)
    if (!deletedPersonnel) {
      res.status(404).json({ message: 'Personel bulunamadı' })
      return
    }
    res.status(200).json({ message: 'Personel silindi', personnel: deletedPersonnel })
  } catch (error) {
    res.status(500).json({ message: 'Personel silinirken bir hata oluştu', error })
  }
}
