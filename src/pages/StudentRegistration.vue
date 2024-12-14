<template>
  <q-page class="q-pa-md q-page-styled">
    <q-form @submit.prevent="addOrUpdateStudent" @reset="resetForm" class="q-gutter-md q-form-styled">
      <div class="q-field-row">
        <q-input v-model="studentData.name" label="Ad" required />
        <q-input v-model="studentData.surname" label="Soyad" required />
      </div>
      <div class="q-field-row">
        <q-input v-model="studentData.tcNumber" label="T.C. Kimlik No" required />
        <q-select v-model="studentData.gender" :options="genderOptions"  option-label="label" option-value="value" label="Cinsiyet" required />
      </div>
      <div class="q-field-row">
        <q-input v-model="studentData.age" type="number" label="Yaş" required />
        <q-input v-model="studentData.phoneNumber" label="Telefon" mask="(###) ### - ## ##" />
      </div>
      <div class="q-field-row">
        <q-input v-model="studentData.address" label="Adres" required />
        <q-input v-model="studentData.diagnosis" label="Tanısı" required />
      </div>
      <div class="q-field-row">
        <q-input v-model="studentData.parentinfo" label="Veli Bilgisi" required />
        <q-select v-model="studentData.education" :options="educationOptions"  option-label="label" option-value="value" label="Aldığı Eğitim" required />
      </div>
      <div class="q-field-row">
        <q-select v-model="studentData.vehicle" :options="vehicleOptions"  option-label="label" option-value="value" label="Servis Kullanılsın mı?" required />
      </div>
      <div class="q-field-row">
        <q-input v-model="studentData.imageUrl" label="Resim URL'si" />
      </div>
      <div>
        <q-btn label="Kaydet" type="submit" color="primary" />
        <q-btn label="Sıfırla" type="reset" color="secondary" />
      </div>
    </q-form>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, reactive } from 'vue'
import { Notify } from 'quasar'
import axios from 'axios'

export default defineComponent({
  name: 'StudentRegistration',
  setup () {
    // Reactive nesne ile tüm form verileri
    const studentData = reactive({
      name: '',
      surname: '',
      age: null as number | null,
      phoneNumber: '',
      tcNumber: '',
      gender: { label: '', value: '' }, // Türü doğrudan tanımlamaya gerek yok
      vehicle: { label: '', value: '' },
      education: { label: '', value: '' },
      diagnosis: '',
      address: '',
      parentinfo: '',
      imageUrl: ''
    })

    const genderOptions = [
      { label: 'Erkek', value: 'Erkek' },
      { label: 'Kadın', value: 'Kadın' }
    ]

    const vehicleOptions = [
      { label: 'Evet', value: 'Evet' },
      { label: 'Hayır', value: 'Hayır' }
    ]

    const educationOptions = [
      { label: 'Bireysel', value: 'Bireysel' },
      { label: 'Fizyoterapi', value: 'Fizyoterapi' },
      { label: 'Grup', value: 'Grup' },
      { label: 'Dil Konuşma', value: 'Dil Konuşma' }
    ]

    const addOrUpdateStudent = async () => {
      try {
        // Form verilerini backend'e uygun hale getir
        const sanitizedData = {
          ...studentData,
          gender: studentData.gender.value, // Object'in value'sunu alın
          vehicle: studentData.vehicle.value, // Object'in value'sunu alın
          education: studentData.education.value // Object'in value'sunu alın
        }

        await axios.post('http://localhost:3000/api/students', sanitizedData)
        Notify.create({
          message: 'Kayıt başarılı!',
          color: 'positive',
          position: 'top'
        })

        resetForm()
      } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          console.error('Kayıt sırasında hata:', error.response?.data || error.message)
        } else {
          console.error('Bilinmeyen bir hata oluştu:', error)
        }
        Notify.create({
          message: 'Kayıt sırasında bir hata oluştu!',
          color: 'negative',
          position: 'top'
        })
      }
    }

    const resetForm = () => {
      studentData.name = ''
      studentData.surname = ''
      studentData.age = null
      studentData.phoneNumber = ''
      studentData.tcNumber = ''
      studentData.gender = { label: '', value: '' } // Boş nesne atanıyor
      studentData.vehicle = { label: '', value: '' } // Boş nesne atanıyor
      studentData.diagnosis = ''
      studentData.address = ''
      studentData.parentinfo = ''
      studentData.education = { label: '', value: '' } // Boş nesne atanıyor
      studentData.imageUrl = ''
    }

    return {
      studentData,
      genderOptions,
      vehicleOptions,
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
.q-field-row > .q-select {
  flex: 1;
}

.q-form-styled > .q-btn {
  margin-right: 1rem;
}
</style>
