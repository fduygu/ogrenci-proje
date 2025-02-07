import bcrypt from 'bcryptjs'

const password = '123456'
const salt = bcrypt.genSaltSync(10)
const hashedPassword = bcrypt.hashSync(password, salt)

console.log('Hashlenmiş Şifre:', hashedPassword)

const isMatch = bcrypt.compareSync(password, hashedPassword)
console.log('Doğrulama Sonucu:', isMatch) // Burada true çıkmalı
