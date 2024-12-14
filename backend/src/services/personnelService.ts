import PersonnelModel, { IPersonnel } from '../models/personnelModel'

// Personel oluşturma
export const createPersonnel = async (personnelData: IPersonnel): Promise<IPersonnel> => {
  const personnel = new PersonnelModel(personnelData)
  return await personnel.save()
}

// Tüm personelleri listeleme
export const getAllPersonnel = async (): Promise<IPersonnel[]> => {
  return await PersonnelModel.find()
}

// Personel detayını alma
export const getPersonnelById = async (id: string): Promise<IPersonnel | null> => {
  return await PersonnelModel.findById(id)
}

// Personel güncelleme
export const updatePersonnel = async (
  id: string,
  data: Partial<IPersonnel>
): Promise<IPersonnel | null> => {
  return await PersonnelModel.findByIdAndUpdate(id, data, { new: true })
}

// Personel silme
export const deletePersonnel = async (id: string): Promise<IPersonnel | null> => {
  return await PersonnelModel.findByIdAndDelete(id)
}
