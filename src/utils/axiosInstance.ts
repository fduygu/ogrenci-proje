import axios, { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios'

// API URL'sini belirle ve logla
const apiUrl = import.meta.env.VITE_BASEURL || 'http://localhost:3000/api'
const api: AxiosInstance = axios.create({
  baseURL: apiUrl, // Backend API adresi
  headers: {
    'Content-Type': 'application/json'
  }
})

// Her isteğe otomatik olarak token ekleyelim
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    console.log('İstek Yapılıyor:', config.method?.toUpperCase(), config.url, config.headers) // Log eklendi
    return config
  },
  (error) => {
    console.error('İstek başlatma hatası:', error)
    return Promise.reject(error)
  }
)

// Eğer sunucudan 401 (Unauthorized) hatası gelirse, çıkış yapalım
api.interceptors.response.use(
  (response: AxiosResponse) => {
    console.log('Başarılı Yanıt:', response.status, response.data) // Yanıt logu eklendi
    return response
  },
  (error) => {
    if (error.response) {
      console.error('Hata Yanıtı:', error.response.status, error.response.data)

      if (error.response.status === 401) {
        console.warn('Oturum süresi doldu! Kullanıcı çıkış yapıyor...')
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        window.location.href = '/auth/login' // Giriş sayfasına yönlendir
      }
    } else {
      console.error('Sunucuya bağlanılamadı:', error.message)
    }

    return Promise.reject(error)
  }
)

export default api
