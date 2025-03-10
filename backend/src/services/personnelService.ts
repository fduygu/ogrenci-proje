import PersonnelModel, { IPersonnel } from '../models/personnelModel'
import bcrypt from 'bcryptjs'
import mongoose from 'mongoose'
// Personel oluşturma
export const createPersonnel = async (personnelData: IPersonnel): Promise<IPersonnel> => {
  try {
    // Şifre hashleme kontrolü
    if (personnelData.password && !personnelData.password.startsWith('$2a$')) {
      const salt = await bcrypt.genSalt(10)
      personnelData.password = await bcrypt.hash(personnelData.password, salt)
    }

    const personnel = new PersonnelModel(personnelData)
    return await personnel.save()
  } catch (error) {
    throw new Error(`Personel ekleme hatası: ${error.message}`)
  }
}

// Tüm personelleri listeleme
export const getAllPersonnel = async (): Promise<IPersonnel[]> => {
  return await PersonnelModel.find({ isActive: true })
}

// Email ile personel bulma
export const getPersonnelByEmail = async (email: string): Promise<IPersonnel | null> => {
  try {
    return await PersonnelModel.findOne({ email }).select('+password')
  } catch (error) {
    throw new Error(`Personel email ile alınamadı: ${error.message}`)
  }
}

// Personel detayını alma
export const getPersonnelById = async (id: string): Promise<IPersonnel | null> => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    console.error('Geçersiz ID formatı:', id)
    return null
  }

  return await PersonnelModel.findById(id)
}
// Personel güncelleme
export const updatePersonnel = async (
  id: string,
  data: Partial<IPersonnel>
): Promise<IPersonnel | null> => {
  try {
    // Eğer şifre güncelleniyorsa, hashleme kontrolü yap
    if (data.password && !data.password.startsWith('$2a$')) {
      const salt = await bcrypt.genSalt(10)
      data.password = await bcrypt.hash(data.password, salt)
    }
    return await PersonnelModel.findByIdAndUpdate(id, data, { new: true })
  } catch (error) {
    throw new Error(`Personel güncellenirken hata oluştu: ${error.message}`)
  }
}

// Personel silme
export const deletePersonnel = async (id: string): Promise<IPersonnel | null> => {
  return await PersonnelModel.findByIdAndDelete(id)
}
