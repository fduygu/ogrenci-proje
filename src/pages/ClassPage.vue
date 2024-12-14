<template>
  <q-page padding>
    <q-card>
      <q-card-section>
        <div class="text-h6">Sınıf Ekle</div>
      </q-card-section>

      <q-card-section>
        <q-input
          v-model="className"
          label="Sınıf Adı"
          filled
        />
        <q-input
          v-model="classroomNumber"
          label="Sınıf Numarası"
          type="text"
          filled
        />
        <q-input
          v-model="capacity"
          label="Kapasite"
          type="number"
          filled
        />
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="Kaydet" @click="saveClass" />
      </q-card-actions>
    </q-card>

    <div v-if="successMessage" class="q-mt-md text-green text-bold">
      {{ successMessage }}
    </div>
  </q-page>
</template>

<script lang="ts">
import { ref } from 'vue'
import axios from 'axios'

export default {
  name: 'ClassPage',
  setup () {
    const className = ref('')
    const classroomNumber = ref('')
    const capacity = ref<number | null>(null)
    const successMessage = ref('')

    const saveClass = async () => {
      try {
        if (!className.value || !classroomNumber.value || !capacity.value) {
          alert('Lütfen tüm alanları doldurun.')
          return
        }

        await axios.post('http://localhost:3000/api/classes', {
          className: className.value,
          classroomNumber: classroomNumber.value,
          capacity: capacity.value
        })

        // Başarı mesajını göster
        successMessage.value = 'Sınıf başarıyla kaydedildi!'

        // Alanları temizle
        className.value = ''
        classroomNumber.value = ''
        capacity.value = null

        // Mesajı 3 saniye sonra kaldır
        setTimeout(() => {
          successMessage.value = ''
        }, 3000)
      } catch (error) {
        console.error('Sınıf kaydedilemedi:', error)
        alert('Sınıf kaydedilemedi. Lütfen tekrar deneyin.')
      }
    }

    return {
      className,
      classroomNumber,
      capacity,
      saveClass,
      successMessage
    }
  }
}
</script>

<style scoped>
.text-green {
  color: #4caf50 /* Quasar'ın yeşil tonu */
}

.text-bold {
  font-weight: bold
}
</style>
