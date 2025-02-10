import Class, { IClass } from '../models/classModel'

// Sınıf oluşturma
export const createClass = async (classData: IClass) => {
  const newClass = new Class({ ...classData, isActive: true }) // Varsayılan olarak aktif
  return await newClass.save()
}

// Aktif sınıfları listeleme
export const getAllClasses = async () => {
  return await Class.find({ isActive: true }) // Sadece aktif olanları getir
}

// ID'ye göre sınıf getirme
export const getClassById = async (id: string) => {
  return await Class.findOne({ _id: id, isActive: true }) // Silinmemiş olanı getir
}

// Sınıf güncelleme
export const updateClass = async (id: string, updateData: Partial<IClass>) => {
  return await Class.findByIdAndUpdate(id, updateData, { new: true })
}

// Yumuşak silme işlemi (soft delete)
export const deleteClass = async (id: string) => {
  return await Class.findByIdAndUpdate(id, { isActive: false }, { new: true }) // Tamamen silmiyoruz
}
