import { Request, Response, NextFunction } from 'express'

// Asenkron fonksiyonlar için doğru tipleri belirledik
type AsyncFunction<T = void> = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<T>;

const asyncHandler = <T>(fn: AsyncFunction<T>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next)
  }
}

export default asyncHandler
