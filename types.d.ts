import { File } from 'multer'

declare global {
  namespace Express {
    interface Request {
      file?: File // req.file için Multer tipi
      files?: File[] // Eğer birden fazla dosya yükleme yapılacaksa
    }
  }
}
