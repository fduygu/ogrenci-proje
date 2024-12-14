<template>
  <q-page class="q-pa-md q-page-styled">
    <q-form @submit.prevent="addOrUpdatePersonnel" @reset="resetForm" class="q-gutter-md q-form-styled">
      <div class="q-field-row">
        <q-input v-model="personnelData.name" label="Ad" required />
        <q-input v-model="personnelData.surname" label="Soyad" required />
      </div>
      <div class="q-field-row">
        <q-input v-model="personnelData.tcNumber" label="T.C. Kimlik No" required />
        <q-input v-model="personnelData.title" label="Ünvan" required />
      </div>
      <div class="q-field-row">
        <q-input v-model="personnelData.branch" label="Branş" required />
        <q-input v-model="personnelData.phone" label="Telefon" mask="(###) ### - ## ##" required />
      </div>
      <div class="q-field-row">
        <q-input v-model="personnelData.address" label="Adres" required />
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

    const addOrUpdatePersonnel = async () => {
      try {
        await axios.post('http://localhost:3000/api/personnel', personnelData)
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
      personnelData.name = ''
      personnelData.surname = ''
      personnelData.tcNumber = ''
      personnelData.title = ''
      personnelData.branch = ''
      personnelData.phone = ''
      personnelData.address = ''
    }

    return {
      personnelData,
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

.q-field-row > .q-input {
  flex: 1;
}

.q-form-styled > .q-btn {
  margin-right: 1rem;
}
</style>
