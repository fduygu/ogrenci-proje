<template>
    <q-page class="q-pa-md q-page-styled">
      <!-- Logo -->
      <div class="logo-container">
        <q-img src="/elogo.png" alt="Logo" class="logo" />
      </div>

      <q-form @submit.prevent="login" class="q-gutter-md q-form-styled">
        <q-input v-model="email" label="E-Posta" type="email" required class="q-mb-md" />
        <q-input v-model="password" label="Şifre" type="password" required class="q-mb-md" />

        <q-btn label="Giriş Yap" type="submit" color="primary" class="full-width q-mb-md" />
        <q-btn label="Şifremi Unuttum" color="primary" @click="forgotPassword" flat />

      </q-form>

      <!-- Hata mesajı gösterme -->
      <q-banner v-if="errorMessage" class="text-negative bg-red-2 q-mt-md">
        {{ errorMessage }}
      </q-banner>
    </q-page>
  </template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from 'src/utils/axiosInstance'

export default defineComponent({
  name: 'LoginPage',
  setup () {
    const email = ref('')
    const password = ref('')
    const router = useRouter()
    const errorMessage = ref('')

    // 📌 Sayfa yüklendiğinde token var mı kontrol et
    onMounted(() => {
      const token = localStorage.getItem('token')
      console.log('📢 Tarayıcıda Kayıtlı Token:', token)
      if (token) {
        console.log('🔄 Kullanıcı zaten giriş yapmış, yönlendiriliyor...')
        router.push('/')
      }
    })
    console.log('💡 Login fonksiyonu çalıştı!')
    const login = async () => {
      try {
        errorMessage.value = ''
        console.log('🟡 Giriş isteği gönderiliyor...')

        const response = await api.post('/auth/login', {
          email: email.value,
          password: password.value
        })

        console.log('✅ API Response:', response.data)

        if (response.data.token) {
          console.log('✅ Token Kaydediliyor:', response.data.token)
          localStorage.setItem('token', response.data.token)

          const personnel = response.data.personnel
          if (personnel) {
            console.log('✅ Gelen Personnel Bilgisi:', personnel)
            const personnelData = {
              _id: personnel.id,
              name: personnel.name || 'Bilinmeyen',
              surname: personnel.surname || 'Kullanıcı',
              email: personnel.email,
              role: personnel.role,
              imageUrl: personnel.imageUrl ? `http://localhost:3000${personnel.imageUrl}` : '/default-avatar.png'

            }
            localStorage.setItem('personnel', JSON.stringify(personnelData)) // 🔥 Burada personnel olarak kaydediyoruz!
            console.log('Gelen personel bilgisi:', localStorage.getItem(personnel.value))
          } else {
            console.error('🚨 personnel verisi bulunamadı!')
          }

          console.log('🔄 Kullanıcı yönlendiriliyor...')
          setTimeout(() => {
            router.push('/main')
          }, 500)
        } else {
          console.error('🚨 Giriş başarısız, token alınamadı.')
        }
      } catch (error) {
        console.error('❌ Giriş hatası:', error)
        errorMessage.value = 'E-Posta veya şifre hatalı. Lütfen tekrar deneyin!'
      }
    }

    const forgotPassword = () => {
      router.push('/forgot-password')
    }

    return { email, password, login, forgotPassword, errorMessage }
  }
})
</script>

  <style scoped>
  .q-page-styled {
    max-width: 400px;
    margin: auto;
    padding: 2rem;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    background-color: #fff;
  }
  .q-form-styled {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  .full-width {
    width: 100%;
  }
  </style>
