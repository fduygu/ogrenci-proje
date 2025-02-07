<template>
    <q-page class="flex flex-center">
      <q-card class="q-pa-md card-style">
        <q-card-section>
          <div class="text-h6 text-center">Şifremi Unuttum</div>
        </q-card-section>

        <q-card-section>
          <q-input v-model="email" label="E-posta" outlined dense />
          <q-btn
            label="Şifreyi Sıfırla"
            color="positive"
            class="full-width q-mt-md"
            @click="sendResetCode"
          />
        </q-card-section>
        <q-card-section>
          <q-btn label="Geri Dön" flat @click="$router.push('/auth/login')" />
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

    const sendResetCode = async () => {
      try {
        const response = await api.post('/auth/forgot-password', { email: email.value })
        console.log('Doğrulama Kodu Gönderildi:', response.data)
        alert('Şifre sıfırlama bağlantısı e-posta adresinize gönderildi.')
      } catch (error: unknown) {
        const err = error as { response?: { data?: string } }
        console.error('Hata:', err.response?.data || err)
      }
    }

    return { email, sendResetCode }
  }
})
</script>

  <style scoped>
  .card-style {
    width: 400px;
    max-width: 90vw;
  }
  </style>
