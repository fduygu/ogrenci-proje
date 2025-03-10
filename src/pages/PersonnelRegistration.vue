<template>
  <q-page class="q-pa-md q-page-styled">
    <q-form @submit.prevent="addOrUpdatePersonnel" @reset="resetForm" class="q-gutter-md q-form-styled">
      <!-- Ad ve Soyad -->
      <div class="q-field-row">
        <q-input v-model="personnelData.name" label="Ad" required />
        <q-input v-model="personnelData.surname" label="Soyad" required />
        <q-input v-model="personnelData.birthdate" type="date" label="Doğum Tarihi"  mask="DD-MM-YYYY" required />
      </div>
      <!-- Email ve Şifre -->
      <div class="q-field-row">
        <q-input v-model="personnelData.email" type="email" label="E-Posta" required />
        <q-input v-model="personnelData.password" type="password" label="Şifre" required />
      </div>
      <!-- T.C. Kimlik No ve Ünvan -->
      <div class="q-field-row">
        <q-input v-model="personnelData.tcNumber" label="T.C. Kimlik No" required @blur="validateTCNumber"  />
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
        <q-file v-model="selectedFile" label="Fotoğraf Yükle" filled @update:model-value="handleFileChange" />
      </div>
      <!-- Role Seçimi -->
        <q-select
          v-model="personnelData.role"
          :options="roleOptions"
          option-value="value"
          option-label="label"
          emit-value
          label="Kullanıcı Rolü"
          outlined
          required
        />
      <!-- Butonlar -->
      <div>
        <q-btn label="Kaydet" type="submit" color="primary" />
        <q-btn label="Sıfırla" type="reset" color="secondary" />
      </div>
    </q-form>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, watch } from 'vue'
import { Notify } from 'quasar'
import api from '../utils/axiosInstance'
export default defineComponent({
  name: 'PersonnelRegistration',
  emits: ['personnel-added'],
  setup (_, { emit }) {
    const personnelData = reactive({
      name: '',
      surname: '',
      birthdate: '',
      tcNumber: '',
      title: '',
      branch: '',
      phone: '',
      email: '',
      password: '',
      address: '',
      role: 'personnel' // Varsayılan olarak "personnel"
    })
    const selectedFile = ref<File | null>(null)

    const roleOptions = [
      { label: 'Personel', value: 'personnel' },
      { label: 'Admin', value: 'admin' }
    ]
    const validateTCNumber = () => {
      const tc = personnelData.tcNumber
      const tcRegex = /^[1-9][0-9]{10}$/
      if (!tcRegex.test(tc)) {
        Notify.create({ message: 'Geçersiz T.C. Kimlik Numarası!', color: 'negative', position: 'top' })
        personnelData.tcNumber = ''
      }
    }
    watch(
      () => [personnelData.name, personnelData.surname],
      ([newName, newSurname]) => {
        if (newName) {
          personnelData.name = newName.toLocaleUpperCase('tr-TR')
        }
        if (newSurname) {
          personnelData.surname = newSurname.toLocaleUpperCase('tr-TR')
        }
      }
    )

    const handleFileChange = (file: File | null) => {
      if (file) {
        selectedFile.value = file
      } else {
        selectedFile.value = null
      }
    }

    // Backend'e kaydetme fonksiyonu
    const addOrUpdatePersonnel = async () => {
      try {
        const token = localStorage.getItem('token') // LocalStorage'dan token al

        if (!token) {
          console.error('Token bulunamadı, giriş yapmalısınız.')
          Notify.create({ message: 'Yetkisiz işlem! Lütfen giriş yapınız.', color: 'negative', position: 'top' })
          return
        }

        const formData = new FormData()

        // Form verilerini FormData'ya ekle
        formData.append('name', personnelData.name)
        formData.append('surname', personnelData.surname)
        formData.append('birthdate', personnelData.birthdate)
        formData.append('email', personnelData.email)
        formData.append('password', personnelData.password)
        formData.append('tcNumber', personnelData.tcNumber)
        formData.append('title', personnelData.title)
        formData.append('branch', personnelData.branch)
        formData.append('phone', personnelData.phone)
        formData.append('address', personnelData.address)
        formData.append('role', personnelData.role)
        // Dosya ekle
        if (selectedFile.value) {
          formData.append('file', selectedFile.value)
        }

        // Backend'e gönder
        const response = await api.post('/personnel', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        if (response.status === 201) {
          Notify.create({ message: 'Kayıt başarılı!', color: 'positive', position: 'top' })
          emit('personnel-added') // **Liste güncellenecek**

          setTimeout(() => {
            location.reload() // **Sayfa otomatik yenilenecek**
          }, 500)
        }
      } catch (error) {
        console.error('Kayıt hatası:', error)
        Notify.create({ message: 'Kayıt sırasında bir hata oluştu! Aynı Tc ile kayıtlı biri olabilir!', color: 'negative', position: 'top' })
      }
    }

    // Form sıfırlama fonksiyonu
    const resetForm = () => {
      Object.assign(personnelData, {
        name: '',
        surname: '',
        birthdate: '',
        email: '',
        password: '',
        tcNumber: '',
        title: '',
        branch: '',
        phone: '',
        address: '',
        role: 'personnel'
      })
      selectedFile.value = null
    }

    return {
      personnelData,
      selectedFile,
      addOrUpdatePersonnel,
      resetForm,
      roleOptions,
      validateTCNumber,
      handleFileChange
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
.q-field-row > .q-file ,
.q-field-row > .q-select{
  flex: 1;
}

.q-form-styled > .q-btn {
  margin-right: 1rem;
}
</style>
