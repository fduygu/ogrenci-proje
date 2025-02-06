import { route } from 'quasar/wrappers'
import {
  createMemoryHistory,
  createRouter,
  createWebHashHistory,
  createWebHistory
} from 'vue-router'
import routes from './routes'

// JWT çözümleme için
import { jwtDecode } from 'jwt-decode'

export default route(function () {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : (process.env.VUE_ROUTER_MODE === 'history' ? createWebHistory : createWebHashHistory)

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,
    history: createHistory(process.env.VUE_ROUTER_BASE)
  })

  // **🛡️ Navigation Guard - Giriş kontrolü ve yönlendirme**
  Router.beforeEach((to, from, next) => {
    const token = localStorage.getItem('token')
    const isAuthPage = to.path.startsWith('/auth')

    if (!token) {
      // 🛑 Giriş yapmamış ve giriş yapması gerekiyorsa, login sayfasına yönlendir
      if (to.meta.requiresAuth) {
        console.warn('🔴 Kullanıcı giriş yapmamış, login sayfasına yönlendiriliyor...')
        return next('/auth/login')
      }
    } else {
      try {
        console.log('📢 Token:', token)
        const decoded = jwtDecode<{ role?: string, exp?: number }>(token)

        // **📌 Token süresi dolmuşsa oturumu kapat ve login'e yönlendir**
        if (decoded.exp && decoded.exp * 1000 < Date.now()) {
          console.warn('⚠️ Token süresi dolmuş, çıkış yapılıyor...')
          localStorage.removeItem('token')
          localStorage.removeItem('user')
          return next('/auth/login')
        }

        // **🛑 Kullanıcı giriş yapmışsa, /auth sayfalarına gitmesini engelle**
        if (isAuthPage) {
          console.warn('🔄 Kullanıcı zaten giriş yapmış, ana sayfaya yönlendiriliyor...')
          return next('/main')
        }
      } catch (error) {
        console.error('🚨 Token çözümleme hatası:', error)
        localStorage.removeItem('token') // Hatalı token varsa kaldır
        return next('/auth/login')
      }
    }

    // **✅ Tüm kontrollerden geçerse devam et**
    next()
  })

  return Router
})
