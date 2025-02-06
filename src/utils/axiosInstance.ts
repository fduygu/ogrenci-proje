import axios, { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios'

// Axios örneğini oluştur
const api: AxiosInstance = axios.create({
  baseURL: 'http://localhost:3000/api' // Backend API adresiniz
})

// Her isteğe otomatik olarak token ekleyelim
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Eğer sunucudan 401 (Unauthorized) hatası gelirse, çıkış yapalım
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.warn('Oturum süresi doldu! Kullanıcı çıkış yapıyor...')
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login' // Giriş sayfasına yönlendir
    }
    return Promise.reject(error)
  }
)

export default api
