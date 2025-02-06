<template>
    <q-page class="flex flex-center">
      <q-card class="q-pa-md card-style">
        <q-card-section>
          <div class="text-h6 text-center">Yeni Şifre Belirleme</div>
        </q-card-section>

        <q-card-section>
          <q-input v-model="newPassword" label="Yeni Şifre" outlined dense type="password" />
          <q-btn
            label="Şifreyi Güncelle"
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
import { useRoute, useRouter } from 'vue-router'
import api from 'src/utils/axiosInstance'

export default defineComponent({
  name: 'ResetPassword',
  setup () {
    const route = useRoute()
    const router = useRouter()
    const newPassword = ref('')
    const token = route.params.token

    const resetPassword = async () => {
      try {
        await api.post(`/auth/reset-password/${token}`, { newPassword: newPassword.value })
        alert('Şifre başarıyla güncellendi, giriş yapabilirsiniz!')
        router.push('/login')
      } catch (error: unknown) {
        const err = error as { response?: { data?: string } }
        console.error('🚨 Hata:', err.response?.data || err)
      }
    }

    return { newPassword, resetPassword }
  }
})
</script>

  <style scoped>
  .card-style {
    width: 400px;
    max-width: 90vw;
  }
  </style>
