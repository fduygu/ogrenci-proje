import { Request, Response } from 'express'
import * as PersonnelService from '../services/personnelService'
import Personnel from '../models/personnelModel'

// Personel oluşturma
export const createPersonnel = async (req: Request, res: Response): Promise<void> => {
  const personnelId = req.params.id
  console.log('Gelen ID:', personnelId) // Burada gelen id'yi kontrol edin
  try {
    const { email, password, role, tcNumber } = req.body

    const userRole = typeof role === 'string' ? role : 'personnel'
    // TC numarasına göre personel kontrolü
    const existingPersonnelByTc = await Personnel.findOne({ tcNumber })
    if (existingPersonnelByTc) {
      res.status(400).json({ message: 'Bu TC numarası ile kayıtlı bir personel zaten var!' })
      return
    }
    // Aynı email ile kayıtlı personel var mı kontrol et
    const existingPersonnel = await Personnel.findOne({ email })
    if (existingPersonnel) {
      res.status(400).json({ message: 'Bu email ile kayıtlı bir personel zaten var!' })
      return
    }
    // Eğer fotoğraf yüklendiyse imageUrl'i ayarla
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null

    // Personel verisini oluştur
    const personnelData = {
      ...req.body,
      password, // Hashlenmiş şifreyi kaydediyoruz
      imageUrl, // Fotoğraf URL'sini ekle
      role: userRole, // Rolü belirle
      isActive: true
    }
    console.log('Veritabanına Kaydedilecek Veri:', personnelData)
    const savedPersonnel = await PersonnelService.createPersonnel(personnelData) // Veritabanına kaydet
    console.log('Personel Başarıyla Kaydedildi:', savedPersonnel)
    res.status(201).json(savedPersonnel)
  } catch (error) {
    console.error('Veritabanına kaydedilirken hata oluştu:', error)
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
    console.log('Gelen Personel ID:', req.params.id) // Gelen ID'yi kontrol ediyoruz

    const personnel = await PersonnelService.getPersonnelById(req.params.id)

    // Eğer personel bulunmazsa, hata mesajı döndür
    if (!personnel) {
      console.log('Personel bulunamadı:', req.params.id) // Personel bulunamadığında log ekleyelim
      res.status(404).json({ message: 'Personel bulunamadı' })
      return
    }

    // Personel bulunduğunda log ekleyelim
    console.log('Bulunan Personel:', personnel)
    res.status(200).json(personnel)
  } catch (error) {
    // Hata durumunda da log ekleyelim
    console.error('Personel alınırken bir hata oluştu:', error)
    res.status(500).json({ message: 'Personel alınırken bir hata oluştu', error })
  }
}

// Personel güncelleme
export const updatePersonnel = async (req: Request, res: Response): Promise<void> => {
  try {
    const { password, role } = req.body

    const updatedRole = typeof role === 'string' ? role : undefined
    // Eğer yeni bir fotoğraf yüklendiyse imageUrl'i güncelle
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null

    const personnelData = {
      ...req.body,
      ...(imageUrl && { imageUrl }), // Sadece yeni bir fotoğraf varsa güncelle
      ...(updatedRole && { role: updatedRole }) // Eğer role string olarak varsa güncelle
    }

    // Eğer şifre güncelleniyorsa ve hashlenmemişse, hashle
    if (password && !password.startsWith('$2a$')) {
      personnelData.password = password
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
    const deletedPersonnel = await Personnel.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true })
    if (!deletedPersonnel) {
      res.status(404).json({ message: 'Personel bulunamadı' })
      return
    }
    res.status(200).json({ message: 'Personel pasif hale getirildi.', personnel: deletedPersonnel })
  } catch (error) {
    res.status(500).json({ message: 'Personel silinirken hata oluştu', error })
  }
}
