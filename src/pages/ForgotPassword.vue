<template>
    <q-page class="flex flex-center">
      <q-card class="q-pa-md card-style">
        <q-card-section>
          <div class="text-h6 text-center">Şifremi Unuttum</div>
        </q-card-section>

        <q-card-section>
          <q-input v-model="email" label="E-posta" outlined dense />
          <q-btn
            label="Kod Gönder"
            color="primary"
            class="full-width q-mt-md"
            @click="sendResetCode"
          />
        </q-card-section>

        <q-card-section v-if="step === 2">
          <q-input v-model="otp" label="Doğrulama Kodu" outlined dense />
          <q-input v-model="newPassword" label="Yeni Şifre" outlined dense type="password" />
          <q-btn
            label="Şifreyi Sıfırla"
            color="positive"
            class="full-width q-mt-md"
            @click="resetPassword"
          />
        </q-card-section>

        <q-card-section>
          <q-btn label="Geri Dön" flat @click="$router.push('/#/auth/login')" />
        </q-card-section>
      </q-card>
    </q-page>
  </template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import api from 'src/utils/axiosInstance'

export default defineComponent({
  name: 'ForgotPassword',
  setup () {
    const email = ref('')
    const otp = ref('')
    const newPassword = ref('')
    const step = ref(1) // 1: E-posta girişi, 2: OTP ve şifre

    const sendResetCode = async () => {
      try {
        const response = await api.post('/auth/forgot-password', { email: email.value })
        console.log('✅ Doğrulama Kodu Gönderildi:', response.data)
        step.value = 2
      } catch (error: unknown) {
        const err = error as { response?: { data?: string } }
        console.error('🚨 Hata:', err.response?.data || err)
      }
    }

    const resetPassword = async () => {
      try {
        const response = await api.post('/auth/reset-password', { email: email.value, otp: otp.value, newPassword: newPassword.value })
        console.log('✅ Şifre Başarıyla Güncellendi:', response.data)
        alert('Şifre sıfırlandı, giriş yapabilirsiniz!')
        step.value = 1
      } catch (error: unknown) {
        const err = error as { response?: { data?: string } }
        console.error('🚨 Hata:', err.response?.data || err)
      }
    }

    return { email, otp, newPassword, step, sendResetCode, resetPassword }
  }
})
</script>

  <style scoped>
  .card-style {
    width: 400px;
    max-width: 90vw;
  }
  </style>
