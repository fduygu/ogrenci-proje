import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

// Token'den çözümlenen veriler için bir arayüz oluşturduk
interface DecodedToken {
  id: string;
  email: string;
  role?: string;
  iat: number; // Token'ın oluşturulma zamanı
  exp: number; // Token'ın geçerlilik süresi
}

// `Request` türünü genişletmek için bir arayüz tanımlıyoruz
interface AuthenticatedRequest extends Request {
  user?: DecodedToken;
}

// ** Token doğrulama middleware**
export const authenticateToken = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.header('Authorization')
  if (!authHeader) {
    res.status(401).json({ message: 'Yetkisiz erişim! Token gerekli.' })
    return
  }
  const token = authHeader.split(' ')[1] // Bearer token formatı: "Bearer TOKEN"

  if (!token) {
    res.status(401).json({ message: 'Yetkisiz erişim! Token gerekli.' })
    return // Fonksiyonu burada sonlandır
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as DecodedToken // Bu satırda dönüşüm yapıyoruz
    console.log(decoded) // Kullanıcının kimliğini logla
    req.user = decoded
    next()
  } catch (error: unknown) {
    console.error('Token doğrulama hatası:', error)
    if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({ message: 'Oturum süresi doldu! Tekrar giriş yapınız.' })
      return
    }
    res.status(403).json({ message: 'Geçersiz token! Giriş yapmayı deneyin.' })
  }
}

// ** Admin yetkilendirme middleware**
export const authenticateAdmin = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  if (!req.user) {
    res.status(401).json({ message: 'Yetkisiz erişim! Token gerekli.' })
    return
  }

  if (req.user.role !== 'admin') {
    res.status(403).json({ message: 'Yetkisiz işlem! Admin olmanız gerekiyor.' })
    return
  }

  next()
}
