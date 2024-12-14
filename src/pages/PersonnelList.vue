<template>
  <q-page>
    <!-- Arama Alanı -->
    <q-input
      v-model="searchQuery"
      outlined
      label="Personel Ara"
      class="q-mb-md"
      dense
    />

    <!-- Personel Tablosu -->
    <q-table
      :rows="filteredPersonnel"
      :columns="columns"
      row-key="_id"
      flat
      bordered
      dense
    >
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
  <template v-slot:body-cell-createdAt="props">
    <q-td :props="props">
      {{ formatDate(props.row.createdAt) }}
    </q-td>
  </template>
    </q-table>

    <!-- Yükleniyor Göstergesi -->
    <q-spinner v-if="isLoading" />

    <!-- Detay Popup -->
    <q-dialog v-model="isPopupOpen">
      <q-card>
        <q-card-section>
          <div class="text-h6">Personel Detayları</div>
        </q-card-section>
        <q-separator />
        <q-card-section v-if="selectedPersonnel">
          <q-form @submit.prevent="updatePersonnel">
            <q-input
              v-model="selectedPersonnel.name"
              label="Ad"
              outlined
              dense
              :readonly="!isEditMode"
            />
            <q-input
              v-model="selectedPersonnel.surname"
              label="Soyad"
              outlined
              dense
              :readonly="!isEditMode"
            />
            <q-input
              v-model="selectedPersonnel.tcNumber"
              label="T.C. Kimlik No"
              outlined
              dense
              :readonly="!isEditMode"
            />
            <q-input
              v-model="selectedPersonnel.title"
              label="Ünvan"
              outlined
              dense
              :readonly="!isEditMode"
            />
            <q-input
              v-model="selectedPersonnel.branch"
              label="Branş"
              outlined
              dense
              :readonly="!isEditMode"
            />
            <q-input
              v-model="selectedPersonnel.phone"
              label="Telefon"
              outlined
              dense
              :readonly="!isEditMode"
            />
            <q-input
              v-model="selectedPersonnel.address"
              label="Adres"
              outlined
              dense
              :readonly="!isEditMode"
            />
          </q-form>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn
            flat
            label="Düzenle"
            color="green"
            @click="isEditMode = true"
            v-if="!isEditMode"
          />
          <q-btn
            flat
            label="Kaydet"
            color="blue"
            @click="updatePersonnel"
            v-if="isEditMode"
          />
          <q-btn
            flat
            label="Sil"
            color="red"
            @click="confirmDelete"
          />
          <q-btn flat label="Kapat" @click="isPopupOpen = false" />
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
import axios from 'axios'
import { format } from 'date-fns'

interface Personnel {
  _id: string;
  name: string;
  surname: string;
  tcNumber: string;
  title: string;
  branch: string;
  phone: string;
  address: string;
  createdAt?: string;
}

export default defineComponent({
  name: 'PersonnelList',
  setup () {
    const personnel = ref<Personnel[]>([])
    const searchQuery = ref('')
    const isPopupOpen = ref(false)
    const selectedPersonnel = ref<Personnel | null>(null)
    const isLoading = ref(true)
    const isEditMode = ref(false)
    const isDeleteDialogOpen = ref(false)

    // Tablo sütunları
    const columns = [
      { name: 'name', label: 'Ad', field: 'name', align: 'left' as const },
      { name: 'surname', label: 'Soyad', field: 'surname', align: 'left' as const },
      { name: 'title', label: 'Ünvan', field: 'title', align: 'left' as const },
      { name: 'branch', label: 'Branş', field: 'branch', align: 'left' as const },
      { name: 'createdAt', label: 'Kayıt Tarihi', field: 'createdAt', align: 'left' as const }
    ]

    // Tarihi formatlama fonksiyonu
    const formatDate = (date: string | Date | undefined) => {
      return date ? format(new Date(date), 'dd/MM/yyyy HH:mm') : '-'
    }

    // Filtrelenmiş personel
    const filteredPersonnel = computed(() =>
      personnel.value.filter((person) =>
        (person.name + ' ' + person.surname)
          .toLowerCase()
          .includes(searchQuery.value.toLowerCase())
      )
    )

    // Personelleri backend'den getir
    const fetchPersonnel = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/personnel')
        personnel.value = response.data
      } catch (error) {
        console.error('Personeller getirilirken hata oluştu:', error)
      } finally {
        isLoading.value = false
      }
    }

    // Diğer fonksiyonlar: showPersonnelDetails, updatePersonnel, confirmDelete, deletePersonnel
    const showPersonnelDetails = (person: Personnel) => {
      selectedPersonnel.value = { ...person }
      isPopupOpen.value = true
    }

    const updatePersonnel = async () => {
      if (selectedPersonnel.value) {
        try {
          const response = await axios.put(
            `http://localhost:3000/api/personnel/${selectedPersonnel.value._id}`,
            selectedPersonnel.value
          )
          console.log('Güncelleme başarılı:', response.data)

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
          await axios.delete(`http://localhost:3000/api/personnel/${selectedPersonnel.value._id}`)
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
      isPopupOpen,
      selectedPersonnel,
      isEditMode,
      isDeleteDialogOpen,
      formatDate, // Formatlama fonksiyonu burada return edilmelidir
      showPersonnelDetails,
      updatePersonnel,
      confirmDelete,
      deletePersonnel,
      isLoading
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
</style>
