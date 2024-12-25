<template>
  <q-page class="q-pa-md q-page-styled">
    <q-form @submit.prevent="addOrUpdatePersonnel" @reset="resetForm" class="q-gutter-md q-form-styled">
      <!-- Ad ve Soyad -->
      <div class="q-field-row">
        <q-input v-model="personnelData.name" label="Ad" required />
        <q-input v-model="personnelData.surname" label="Soyad" required />
      </div>
      <!-- T.C. Kimlik No ve Ünvan -->
      <div class="q-field-row">
        <q-input v-model="personnelData.tcNumber" label="T.C. Kimlik No" required />
        <q-input v-model="personnelData.title" label="Ünvan" required />
      </div>
      <!-- Branş ve Telefon -->
      <div class="q-field-row">
        <q-input v-model="personnelData.branch" label="Branş" required />
        <q-input v-model="personnelData.phone" label="Telefon" mask="(###) ### - ## ##" required />
      </div>
      <!-- Adres -->
      <div class="q-field-row">
        <q-input v-model="personnelData.address" label="Adres" required />
        <q-file v-model="selectedFile" label="Fotoğraf Yükle" filled />
      </div>
      <!-- Butonlar -->
      <div>
        <q-btn label="Kaydet" type="submit" color="primary" />
        <q-btn label="Sıfırla" type="reset" color="secondary" />
      </div>
    </q-form>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from 'vue'
import { Notify } from 'quasar'
import axios from 'axios'

export default defineComponent({
  name: 'PersonnelRegistration',
  setup () {
    const personnelData = reactive({
      name: '',
      surname: '',
      tcNumber: '',
      title: '',
      branch: '',
      phone: '',
      address: ''
    })
    const selectedFile = ref<File | null>(null)

    // Backend'e kaydetme fonksiyonu
    const addOrUpdatePersonnel = async () => {
      try {
        const formData = new FormData()

        // Form verilerini FormData'ya ekle
        formData.append('name', personnelData.name)
        formData.append('surname', personnelData.surname)
        formData.append('tcNumber', personnelData.tcNumber)
        formData.append('title', personnelData.title)
        formData.append('branch', personnelData.branch)
        formData.append('phone', personnelData.phone)
        formData.append('address', personnelData.address)
        // Dosya ekle
        if (selectedFile.value) {
          formData.append('file', selectedFile.value)
        }

        // Backend'e gönder
        await axios.post('http://localhost:3000/api/personnel', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })

        Notify.create({ message: 'Kayıt başarılı!', color: 'positive', position: 'top' })
        resetForm()
      } catch (error) {
        console.error('Kayıt hatası:', error)
        Notify.create({ message: 'Kayıt sırasında bir hata oluştu!', color: 'negative', position: 'top' })
      }
    }

    // Form sıfırlama fonksiyonu
    const resetForm = () => {
      Object.assign(personnelData, {
        name: '',
        surname: '',
        tcNumber: '',
        title: '',
        branch: '',
        phone: '',
        address: ''
      })
      selectedFile.value = null
    }

    return {
      personnelData,
      selectedFile,
      addOrUpdatePersonnel,
      resetForm
    }
  }
})
</script>

<style scoped>
.q-page-styled {
  max-width: 100%;
  margin: auto;
  padding: 2rem;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  background-color: #fff;
}

.q-form-styled {
  width: 100%;
  margin: 0 auto;
  padding: 2rem;
  background-color: #f9f9f9;
  border: 4px solid #2196F3;
  border-radius: 8px;
}

.q-field-row {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}

.q-field-row > .q-input,
.q-field-row > .q-file {
  flex: 1;
}

.q-form-styled > .q-btn {
  margin-right: 1rem;
}
</style>
