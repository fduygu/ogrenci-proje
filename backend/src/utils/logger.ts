import Log from '../models/log'

export const createLog = async (userId: string, action: string, details: string) => {
  try {
    await Log.create({
      userId,
      action,
      details
    })
  } catch (error) {
    console.error('Log kaydedilirken hata oluştu:', error)
  }
}
