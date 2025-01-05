import StudentModel, { IStudent } from '../models/studentModel'

// Öğrenci oluşturma
export const createStudent = async (studentData: IStudent): Promise<IStudent> => {
  const student = new StudentModel(studentData)
  return await student.save()
}

// Tüm öğrencileri listeleme
export const getAllStudents = async (): Promise<IStudent[]> => {
  return await StudentModel.find()
}

// Öğrenci detayını alma
export const getStudentById = async (id: string): Promise<IStudent | null> => {
  return await StudentModel.findById(id)
}
// Aktif öğrencileri getiren fonksiyon
export const getActiveStudents = async (): Promise<IStudent[]> => {
  return await StudentModel.find({ status: 'main' })
}

// Öğrenci güncelleme
export const updateStudent = async (
  id: string,
  data: Partial<IStudent>
): Promise<IStudent | null> => {
  return await StudentModel.findByIdAndUpdate(id, data, { new: true })
}

// Öğrenci silme
export const deleteStudent = async (id: string): Promise<IStudent | null> => {
  return await StudentModel.findByIdAndDelete(id)
}
export const getStudentsByFilter = async (filter: Record<string, unknown>) => {
  return await StudentModel.find(filter)
}
