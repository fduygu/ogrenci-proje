<template>
  <q-page>
    <!-- Üst Araç Çubuğu -->
    <div class="q-mb-md row items-center justify-between">
      <q-btn
      v-if="userRole === 'admin'"
        label="Yeni Kayıt"
        color="primary"
        icon="add"
        @click="showModal = true"
        class="col-auto"
      />
      <q-input
        v-model="searchQuery"
        outlined
        label="Personel Ara"
        dense
        class="col"
      />
    </div>

    <!-- Personel Tablosu -->
    <q-table
      :rows="filteredPersonnel"
      :columns="columns"
      row-key="_id"
      flat
      bordered
      dense
    >
      <!-- Fotoğraf Sütunu -->
      <template v-slot:body-cell-photo="props">
        <q-td :props="props">
          <q-avatar size="40px" rounded>
            <img
             v-if="props.row.imageUrl"
             :src="`http://localhost:3000${props.row.imageUrl}`"
             alt="Fotoğraf" />
            <q-icon v-else name="person" color="grey" />
          </q-avatar>
        </q-td>
      </template>
      <template v-slot:body-cell-name="props">
        <q-td :props="props">
          <q-btn flat dense color="primary" @click="showPersonnelDetails(props.row)">
            {{ props.row.name }}
          </q-btn>
        </q-td>
      </template>
      <template v-slot:body-cell-surname="props">
        <q-td :props="props">
          {{ props.row.surname }}
        </q-td>
      </template>
      <template v-slot:body-cell-title="props">
        <q-td :props="props">
          {{ props.row.title }}
        </q-td>
      </template>
      <template v-slot:body-cell-branch="props">
        <q-td :props="props">
          {{ props.row.branch }}
        </q-td>
      </template>
    </q-table>

    <!-- Yükleniyor Göstergesi -->
    <q-spinner v-if="isLoading" />
        <!-- Yeni Kayıt Modalı -->
        <q-dialog v-model="showModal" persistent>
          <q-card class="q-pa-md q-card-styled">
       <!-- Sağ Üstte Kapat Butonu -->
      <q-btn
        flat
        dense
        icon="close"
        color="white"
        class="close-btn"
        @click="showModal = false"
       />
        <q-card-section>
          <div class="text-h6 text-center">YENİ PERSONEL KAYIT İSLEMİ</div>
        </q-card-section>
        <q-card-section>
          <!-- PersonnelRegistration Bileşeni -->
          <PersonnelRegistration @form-submitted="onPersonnelAdded" />
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- Detay Popup -->
    <q-dialog v-model="isPopupOpen">
      <q-card style="width: 600px; max-width: 90vw">
        <q-card-section class="row">
          <!-- Personel Resmi -->
          <div class="col-4 flex flex-center">
            <q-img
              v-if="selectedPersonnel?.imageUrl"
              :src="`http://localhost:3000${selectedPersonnel.imageUrl}`"
              alt="Fotoğraf"
              style="width: 150px; height: 150px; border-radius: 50%"
            />
            <q-icon v-else name="person" color="grey" size="150px" />
          </div>

          <!-- Personel Bilgileri -->
          <div class="col-8">
            <div v-if="!isEditMode">
              <div class="text-h6">
                {{ selectedPersonnel?.name }} {{ selectedPersonnel?.surname }}
              </div>
              <q-separator class="q-my-sm" />
              <div v-if="selectedPersonnel" class="q-mt-md">
                <p><strong>Email:</strong>{{selectedPersonnel.email }}</p>
                <p><strong>Ünvan:</strong> {{ selectedPersonnel.title }}</p>
                <p><strong>Branş:</strong> {{ selectedPersonnel.branch }}</p>
                <p><strong>Telefon:</strong> {{ selectedPersonnel.phone }}</p>
                <p><strong>Adres:</strong> {{ selectedPersonnel.address }}</p>
                <p><strong>T.C. Kimlik No:</strong> {{ selectedPersonnel.tcNumber }}</p>
              </div>
            </div>

            <!-- Düzenleme Formu -->
            <div v-else>
              <q-input
                v-model="selectedPersonnel.name"
                outlined
                label="Ad"
                dense
                class="q-mb-sm"
              />
              <q-input
                v-model="selectedPersonnel.surname"
                outlined
                label="Soyad"
                dense
                class="q-mb-sm"
              />
              <q-input
                v-model="selectedPersonnel.tcNumber"
                outlined
                label="T.C. Kimlik No"
                dense
                class="q-mb-sm"
              />
              <q-input
                v-model="selectedPersonnel.title"
                outlined
                label="Ünvan"
                dense
                class="q-mb-sm"
              />
              <q-input
                v-model="selectedPersonnel.branch"
                outlined
                label="Branş"
                dense
                class="q-mb-sm"
              />
              <q-input
                v-model="selectedPersonnel.phone"
                outlined
                label="Telefon"
                dense
                class="q-mb-sm"
              />
              <q-input
                v-model="selectedPersonnel.address"
                outlined
                label="Adres"
                dense
                class="q-mb-sm"
              />
            </div>
          </div>
        </q-card-section>

        <!-- Düzenle ve Sil Butonları -->
        <q-card-actions align="right">
          <q-btn v-if="!isEditMode && userRole !== 'personnel'" flat label="Düzenle" color="primary" @click="isEditMode = true" />
          <q-btn v-if="isEditMode && userRole !== 'personnel'" flat label="Kaydet" color="primary" @click="updatePersonnel" />
          <q-btn v-if="isEditMode && userRole !== 'personnel'" flat label="Vazgeç" color="secondary" @click="isEditMode = false" />
          <q-btn v-if="userRole !== 'personnel'" flat label="Sil" color="red" @click="confirmDelete" />
          <q-btn flat label="Kapat" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Silme Onayı Dialog -->
    <q-dialog v-model="isDeleteDialogOpen">
      <q-card>
        <q-card-section>
          <div class="text-h6">Emin misiniz?</div>
        </q-card-section>
        <q-card-section>
          <p>Bu personeli silmek istediğinize emin misiniz?</p>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="İptal" @click="isDeleteDialogOpen = false" />
          <q-btn flat label="Sil" color="red" @click="deletePersonnel" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted } from 'vue'
import api from 'src/utils/axiosInstance'
import { format } from 'date-fns'
import PersonnelRegistration from './PersonnelRegistration.vue' // Yeni kayıt bileşeni

interface Personnel {
  _id: string;
  name: string;
  surname: string;
  email: string;
  password: string;
  tcNumber: string;
  title: string;
  branch: string;
  phone: string;
  address: string;
  createdAt?: string;
  imageUrl?: string;
}

export default defineComponent({
  name: 'PersonnelList',
  components: { PersonnelRegistration },
  setup () {
    const personnel = ref<Personnel[]>([])
    const searchQuery = ref('')
    const showModal = ref(false)
    const isPopupOpen = ref(false)
    const userRole = ref('') // Kullanıcı rolü
    const selectedPersonnel = ref<Personnel>({
      _id: '',
      name: '',
      surname: '',
      email: '',
      password: '',
      tcNumber: '',
      title: '',
      branch: '',
      phone: '',
      address: '',
      imageUrl: '',
      createdAt: ''
    })
    const isLoading = ref(true)
    const isEditMode = ref(false)
    const isDeleteDialogOpen = ref(false)

    const columns = [
      { name: 'photo', label: 'Fotoğraf', field: 'imageUrl', align: 'left' as const },
      { name: 'name', label: 'Ad', field: 'name', align: 'left' as const },
      { name: 'surname', label: 'Soyad', field: 'surname', align: 'left' as const },
      { name: 'title', label: 'Ünvan', field: 'title', align: 'left' as const },
      { name: 'branch', label: 'Brans', field: 'branch', align: 'left' as const }
    ]

    const formatDate = (date: string | Date | undefined) => {
      return date ? format(new Date(date), 'dd/MM/yyyy HH:mm') : '-'
    }

    const filteredPersonnel = computed(() =>
      personnel.value.filter((person) =>
        (person.name + ' ' + person.surname)
          .toLowerCase()
          .includes(searchQuery.value.toLowerCase())
      )
    )

    const fetchPersonnel = async () => {
      try {
        const token = localStorage.getItem('token')
        if (token) {
          const decodedToken = JSON.parse(atob(token.split('.')[1]))
          userRole.value = decodedToken.role // Token'dan kullanıcı rolünü al
        }
        const response = await api.get('/personnel')
        personnel.value = response.data
      } catch (error) {
        console.error('Personeller getirilirken hata oluştu:', error)
      } finally {
        isLoading.value = false
      }
    }

    const onPersonnelAdded = () => {
      showModal.value = false
      fetchPersonnel()
    }
    const showPersonnelDetails = (person: Personnel) => {
      console.log('Seçilen Personel:', person)
      selectedPersonnel.value = { ...person }
      isPopupOpen.value = true
    }

    const updatePersonnel = async () => {
      if (selectedPersonnel.value) {
        try {
          await api.put(`/personnel/${selectedPersonnel.value._id}`, selectedPersonnel.value)
          const index = personnel.value.findIndex(
            (p) => p._id === selectedPersonnel.value?._id
          )
          if (index !== -1) {
            personnel.value[index] = { ...selectedPersonnel.value }
          }
          isPopupOpen.value = false
          isEditMode.value = false
        } catch (error) {
          console.error('Güncelleme sırasında hata oluştu:', error)
        }
      }
    }

    const confirmDelete = () => {
      isDeleteDialogOpen.value = true
    }

    const deletePersonnel = async () => {
      if (selectedPersonnel.value) {
        try {
          await api.delete(`/personnel/${selectedPersonnel.value._id}`)
          personnel.value = personnel.value.filter((p) => p._id !== selectedPersonnel.value?._id)

          isPopupOpen.value = false
          isDeleteDialogOpen.value = false
        } catch (error) {
          console.error('Silme işlemi sırasında hata oluştu:', error)
        }
      }
    }

    onMounted(fetchPersonnel)

    return {
      personnel,
      searchQuery,
      columns,
      filteredPersonnel,
      showModal,
      isPopupOpen,
      selectedPersonnel,
      isEditMode,
      isDeleteDialogOpen,
      onPersonnelAdded,
      formatDate,
      showPersonnelDetails,
      updatePersonnel,
      confirmDelete,
      deletePersonnel,
      isLoading,
      userRole
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
.q-spinner {
  display: block;
  margin: 20px auto;
}
.close-btn {
  position: absolute;
  top: 8px;
  right: 8px;
  z-index: 10; /* Üstte görünmesini sağlar */
  width: 36px; /* Tıklama alanı genişliği */
  height: 36px; /* Tıklama alanı yüksekliği */
  background-color: red; /* Kırmızı arka plan */
  color: white; /* İkon rengi */
  border-radius: 50%; /* Yuvarlak görünüm */
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3); /* Hafif gölge */
  transition: background-color 0.3s ease; /* Hover animasyonu */
}

.close-btn:hover {
  background-color: darkred; /* Hover sırasında koyu kırmızı */
}
</style>
