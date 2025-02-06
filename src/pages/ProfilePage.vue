<template>
    <q-page>
      <q-dialog v-model="isPopupOpen" persistent>
        <q-card style="width: 600px; max-width: 90vw">
          <q-card-section class="row">
            <!-- Kullanıcı Resmi -->
            <div class="col-4 flex flex-center">
              <q-img
                v-if="personnel?.imageUrl"
                :src="personnel.imageUrl.startsWith('http') ? personnel.imageUrl : `http://localhost:3000${personnel.imageUrl}`"
                alt="Fotoğraf"
                style="width: 150px; height: 150px; border-radius: 50%"
              />
              <q-icon v-else name="person" color="grey" size="150px" />
            </div>

            <!-- Kullanıcı Bilgileri -->
            <div class="col-8">
              <!-- Görüntüleme Modu -->
              <div v-if="!isEditMode && personnel">
                <div class="text-h6">
                  {{ personnel.name }} {{ personnel.surname }}
                </div>
                <q-separator class="q-my-sm" />
                <div class="q-mt-md">
                  <p><strong>Email:</strong> {{ personnel.email }}</p>
                  <p><strong>Ünvan:</strong> {{ personnel.title }}</p>
                  <p><strong>Branş:</strong> {{ personnel.branch }}</p>
                  <p><strong>Telefon:</strong> {{ personnel.phone }}</p>
                  <p><strong>Adres:</strong> {{ personnel.address }}</p>
                  <p><strong>T.C. Kimlik No:</strong> {{ personnel.tcNumber }}</p>
                </div>
              </div>

              <!-- Düzenleme Modu -->
              <div v-else-if="isEditMode && personnel">
                <q-input v-model="personnel.name" outlined label="Ad" dense class="q-mb-sm" />
                <q-input v-model="personnel.surname" outlined label="Soyad" dense class="q-mb-sm" />
                <q-input v-model="personnel.tcNumber" outlined label="T.C. Kimlik No" dense class="q-mb-sm" />
                <q-input v-model="personnel.title" outlined label="Ünvan" dense class="q-mb-sm" />
                <q-input v-model="personnel.branch" outlined label="Branş" dense class="q-mb-sm" />
                <q-input v-model="personnel.phone" outlined label="Telefon" dense class="q-mb-sm" />
                <q-input v-model="personnel.address" outlined label="Adres" dense class="q-mb-sm" />
              </div>
            </div>
          </q-card-section>

          <!-- Düzenle ve Sil Butonları -->
          <q-card-actions align="right">
            <q-btn v-if="!isEditMode" flat label="Düzenle" color="primary" @click="isEditMode = true" />
            <q-btn v-if="isEditMode" flat label="Kaydet" color="primary" @click="updatePersonnel" />
            <q-btn v-if="isEditMode" flat label="Vazgeç" color="secondary" @click="isEditMode = false" />
            <q-btn flat label="Sil" color="red" @click="confirmDelete" />
            <q-btn flat label="Kapat" color="primary" v-close-popup />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </q-page>
  </template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from 'src/utils/axiosInstance'

  interface Personnel {
    _id: string;
    name: string;
    surname: string;
    email: string;
    tcNumber: string;
    title: string;
    branch: string;
    phone: string;
    address: string;
    imageUrl?: string;
  }

export default defineComponent({
  name: 'ProfilePage',
  setup () {
    const router = useRouter()
    const personnel = ref<Personnel | null>(null)
    const isPopupOpen = ref(true)
    const isEditMode = ref(false)

    onMounted(async () => {
      const storedPersonnel = localStorage.getItem('personnel')
      if (storedPersonnel) {
        personnel.value = JSON.parse(storedPersonnel)
        console.log('Stored Personnel:', personnel.value) // Doğru veriyi aldığınızı kontrol edin.
      }

      if (!personnel.value) {
        personnel.value = {
          _id: '',
          name: 'Bilinmeyen Kullanıcı',
          surname: '',
          email: '',
          tcNumber: '',
          title: '',
          branch: '',
          phone: '',
          address: '',
          imageUrl: '/default-avatar.png'
        }
      }

      console.log('Gönderilen Personel ID:', personnel.value?._id)

      if (personnel.value._id !== '') {
        try {
          console.log('Veritabanından güncel veriyi çekiyor...')
          const response = await api.get(`/personnel/${personnel.value._id}`)
          console.log('API Yanıtı:', response.data)
          personnel.value = response.data
          localStorage.setItem('personnel', JSON.stringify(response.data))
        } catch (error) {
          console.error('Personel bilgisi alınamadı:', error)
        }
      }
    })

    const updatePersonnel = async () => {
      if (!personnel.value || !personnel.value._id) {
        console.error('Güncelleme hatası: ID tanımsız!')
        return
      }

      console.log('Güncellenen Personel:', personnel.value)

      try {
        const response = await api.put(`/personnel/${personnel.value._id}`, personnel.value)
        console.log('API Yanıtı:', response.data)
        // Güncellenen veriyi localStorage'a kaydet
        localStorage.setItem('personnel', JSON.stringify(response.data))

        // Vue reaktif değerini güncelle
        personnel.value = response.data

        isEditMode.value = false
      } catch (error) {
        console.error('Güncelleme sırasında hata oluştu:', error)
      }
    }

    const confirmDelete = async () => {
      if (personnel.value) {
        try {
          await api.delete(`/personnel/${personnel.value._id}`)
          localStorage.removeItem('personnel')
          router.push('/login')
        } catch (error) {
          console.error('Silme işlemi sırasında hata oluştu:', error)
        }
      }
    }

    return {
      personnel,
      isPopupOpen,
      isEditMode,
      updatePersonnel,
      confirmDelete
    }
  }
})
</script>

  <style scoped>
  .q-page {
    padding: 20px;
  }
  .q-dialog {
    max-width: 80vw;
  }
  .q-card {
    width: 100%;
    max-width: 600px;
  }
  .q-avatar img {
    width: 150px;
    height: 150px;
    border-radius: 50%;
  }
  </style>
