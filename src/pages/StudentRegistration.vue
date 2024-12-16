<template>
  <q-page class="q-pa-md q-page-styled">
    <q-form @submit.prevent="addOrUpdateStudent" @reset="resetForm" class="q-gutter-md q-form-styled">
      <!-- Ad ve Soyad -->
      <div class="q-field-row">
        <q-input v-model="studentData.name" label="Ad" required />
        <q-input v-model="studentData.surname" label="Soyad" required />
      </div>
      <!-- T.C. Kimlik No ve Cinsiyet -->
      <div class="q-field-row">
        <q-input v-model="studentData.tcNumber" label="T.C. Kimlik No" required />
        <q-select v-model="studentData.gender" :options="genderOptions" option-label="label" option-value="value" label="Cinsiyet" required />
      </div>
      <!-- Yaş ve Telefon -->
      <div class="q-field-row">
        <q-input v-model="studentData.age" type="number" label="Yaş" required />
        <q-input v-model="studentData.phoneNumber" label="Telefon" mask="(###) ### - ## ##" />
      </div>
      <!-- Adres ve Tanı -->
      <div class="q-field-row">
        <q-input v-model="studentData.address" label="Adres" required />
        <q-input v-model="studentData.diagnosis" label="Tanısı" required />
      </div>
      <!-- Veli Bilgisi ve Eğitim Türü -->
      <div class="q-field-row">
        <q-input v-model="studentData.parentinfo" label="Veli Bilgisi" required />
        <q-select v-model="studentData.education" :options="educationOptions" option-label="label" option-value="value" label="Aldığı Eğitim" required />
      </div>
      <!-- Servis Kullanımı -->
      <div class="q-field-row">
        <q-select v-model="studentData.vehicle" :options="vehicleOptions" option-label="label" option-value="value" label="Servis Kullanılsın mı?" required />
        <q-select v-model="studentData.blood" :options="bloodOptions" option-label="label" option-value="value" label="Kan Grubu" required />
      </div>
      <!-- Fotoğraf Yükleme -->
      <div class="q-field-row">
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
  name: 'StudentRegistration',
  setup () {
    const studentData = reactive({
      name: '',
      surname: '',
      age: null as number | null,
      phoneNumber: '',
      tcNumber: '',
      gender: { label: '', value: '' },
      vehicle: { label: '', value: '' },
      education: { label: '', value: '' },
      diagnosis: '',
      address: '',
      parentinfo: '',
      blood: { label: '', value: '' }
    })
    const selectedFile = ref<File | null>(null)

    const genderOptions = [
      { label: 'Erkek', value: 'Erkek' },
      { label: 'Kadın', value: 'Kadın' }
    ]

    const vehicleOptions = [
      { label: 'Evet', value: 'Evet' },
      { label: 'Hayır', value: 'Hayır' }
    ]
    const bloodOptions = [
      { label: 'A+', value: 'A+' },
      { label: 'A-', value: 'A-' },
      { label: 'B+', value: 'B+' },
      { label: 'B-', value: 'B-' },
      { label: 'AB+', value: 'AB+' },
      { label: 'AB-', value: 'AB-' },
      { label: '0+', value: '0+' },
      { label: '0-', value: '0-' }
    ]
    const educationOptions = [
      { label: 'Bireysel', value: 'Bireysel' },
      { label: 'Fizyoterapi', value: 'Fizyoterapi' },
      { label: 'Grup', value: 'Grup' },
      { label: 'Dil Konuşma', value: 'Dil Konuşma' }
    ]

    // Formu Gönderme Fonksiyonu
    const addOrUpdateStudent = async () => {
      try {
        const formData = new FormData()

        // Form verilerini ekle
        formData.append('name', studentData.name)
        formData.append('surname', studentData.surname)
        formData.append('tcNumber', studentData.tcNumber)
        formData.append('age', studentData.age?.toString() || '')
        formData.append('phoneNumber', studentData.phoneNumber)
        formData.append('gender', studentData.gender.value)
        formData.append('vehicle', studentData.vehicle.value)
        formData.append('education', studentData.education.value)
        formData.append('diagnosis', studentData.diagnosis)
        formData.append('address', studentData.address)
        formData.append('parentinfo', studentData.parentinfo)
        formData.append('blood', studentData.blood.value)
        // Dosyayı ekle
        if (selectedFile.value) {
          formData.append('file', selectedFile.value)
        }

        // Backend'e istek gönder
        await axios.post('http://localhost:3000/api/students', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })

        Notify.create({ message: 'Kayıt başarılı!', color: 'positive', position: 'top' })
        resetForm()
      } catch (error) {
        console.error('Kayıt hatası:', error)
        Notify.create({ message: 'Kayıt sırasında bir hata oluştu!', color: 'negative', position: 'top' })
      }
    }

    // Formu Sıfırlama Fonksiyonu
    const resetForm = () => {
      Object.assign(studentData, {
        name: '',
        surname: '',
        age: null,
        phoneNumber: '',
        tcNumber: '',
        gender: { label: '', value: '' },
        vehicle: { label: '', value: '' },
        education: { label: '', value: '' },
        diagnosis: '',
        address: '',
        parentinfo: '',
        blood: { label: '', value: '' }
      })
      selectedFile.value = null
    }

    return {
      studentData,
      selectedFile,
      genderOptions,
      vehicleOptions,
      bloodOptions,
      educationOptions,
      addOrUpdateStudent,
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
.q-field-row > .q-select,
.q-field-row > .q-file {
  flex: 1;
}

.q-form-styled > .q-btn {
  margin-right: 1rem;
}
</style>
