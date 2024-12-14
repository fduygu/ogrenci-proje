import Class, { IClass } from '../models/classModel'

export const createClass = async (classData: IClass) => {
  const newClass = new Class(classData)
  return await newClass.save()
}

export const getAllClasses = async () => {
  return await Class.find()
}

export const getClassById = async (id: string) => {
  return await Class.findById(id)
}

export const updateClass = async (id: string, updateData: Partial<IClass>) => {
  return await Class.findByIdAndUpdate(id, updateData, { new: true })
}

export const deleteClass = async (id: string) => {
  return await Class.findByIdAndDelete(id)
}
