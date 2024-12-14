<template>
  <q-page class="q-pa-md">
    <div class="q-mb-md">
      <q-input v-model="user.ad" label="Ad" filled />
    </div>
    <div class="q-mb-md">
      <q-input v-model="user.soyad" label="Soyad" filled />
    </div>
    <q-btn label="Kaydet" color="primary" @click="kaydet" />
  </q-page>
</template>

<script lang="ts">
import { defineComponent, reactive } from 'vue'
import axios from 'axios'
import { User } from 'src/types/User'

export default defineComponent({
  name: 'IndexPage',
  setup () {
    const user = reactive<User>({
      ad: '',
      soyad: ''
    })

    const kaydet = async () => {
      try {
        const response = await axios.post('http://localhost:3000/api/users', user)
        alert('Kayıt başarılı: ' + JSON.stringify(response.data.user))
        user.ad = ''
        user.soyad = ''
      } catch (error) {
        console.error('Kayıt hatası:', error)
        alert('Kayıt sırasında bir hata oluştu.')
      }
    }

    return {
      user,
      kaydet
    }
  }
})
</script>

<style>
/* İsteğe bağlı stil */
</style>
