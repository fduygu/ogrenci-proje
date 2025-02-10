<template>
  <q-page class="q-pa-md q-page-styled">
    <q-form @submit.prevent="saveClass" class="q-gutter-md q-form-styled">
      <!-- Başlık -->
      <div class="text-h6 text-center q-mb-md">Sınıf Ekle</div>

      <!-- Form Alanları -->
      <q-input
        v-model="className"
        label="Sınıf Adı"
        outlined
        dense
        required
      />
      <q-input
        v-model="classroomNumber"
        label="Sınıf Numarası"
        outlined
        dense
        required
      />
      <q-input
        v-model="capacity"
        label="Kapasite"
        outlined
        dense
        type="number"
        required
      />

      <!-- Butonlar -->
      <div class="q-mt-md row justify-end">
        <q-btn label="Kaydet" type="submit" color="primary" />
        <q-btn label="Sıfırla" type="reset" color="secondary" class="q-ml-sm" @click="resetForm" />
      </div>
    </q-form>

    <!-- Başarı Mesajı -->
    <div v-if="successMessage" class="q-mt-md text-green text-bold text-center">
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
    const token = localStorage.getItem('token')

    const saveClass = async () => {
      try {
        if (!className.value || !classroomNumber.value || !capacity.value) {
          alert('Lütfen tüm alanları doldurun.')
          return
        }

        await axios.post('http://localhost:3000/api/classes', {
          className: className.value,
          classroomNumber: classroomNumber.value,
          capacity: capacity.value,
          isActive: true
        }, {
          headers: { Authorization: `Bearer ${token}` }
        })

        successMessage.value = 'Sınıf başarıyla kaydedildi!'
        resetForm()

        setTimeout(() => {
          successMessage.value = ''
        }, 3000)
      } catch (error) {
        console.error('Sınıf kaydedilemedi:', error)
        alert('Sınıf kaydedilemedi. Lütfen tekrar deneyin.')
      }
    }

    const resetForm = () => {
      className.value = ''
      classroomNumber.value = ''
      capacity.value = null
    }

    return {
      className,
      classroomNumber,
      capacity,
      saveClass,
      resetForm,
      successMessage
    }
  }
}
</script>

<style scoped>
.q-page-styled {
  max-width: 600px;
  margin: auto;
  padding: 2rem;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  background-color: #fff;
}

.q-form-styled {
  background-color: #f9f9f9;
  border: 4px solid #2196F3; /* Mavi çerçeve */
  border-radius: 8px;
  padding: 2rem;
}

.q-form-styled > .q-btn {
  margin-right: 1rem;
}

.text-green {
  color: #4caf50; /* Quasar'ın yeşil tonu */
}

.text-bold {
  font-weight: bold;
}
</style>
