<template>
  <q-page>
    <!-- Arama Alanı -->
    <q-input
      v-model="searchQuery"
      outlined
      label="Sınıf Ara"
      class="q-mb-md"
      dense
    />

    <!-- Sınıf Tablosu -->
    <q-table
      :rows="filteredClasses"
      :columns="columns"
      row-key="_id"
      flat
      bordered
      dense
    >
      <template v-slot:body-cell-className="props">
        <q-td :props="props">
          <q-btn flat dense color="primary" @click="showClassDetails(props.row)">
            {{ props.row.className }}
          </q-btn>
        </q-td>
      </template>
    </q-table>

    <!-- Yükleniyor Göstergesi -->
    <q-spinner v-if="isLoading" />

    <!-- Detay Popup -->
    <q-dialog v-model="isPopupOpen">
      <q-card>
        <q-card-section>
          <div class="text-h6">Sınıf Detayları</div>
        </q-card-section>
        <q-separator />
        <q-card-section v-if="selectedClass">
          <q-form @submit.prevent="updateClass">
            <q-input
              v-model="selectedClass.className"
              label="Sınıf Adı"
              outlined
              dense
              :readonly="!isEditMode"
            />
            <q-input
              v-model="selectedClass.classroomNumber"
              label="Sınıf Numarası"
              outlined
              dense
              :readonly="!isEditMode"
            />
            <q-input
              v-model="selectedClass.capacity"
              label="Kapasite"
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
            @click="updateClass"
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
          <p>Bu sınıfı silmek istediğinize emin misiniz?</p>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="İptal" @click="isDeleteDialogOpen = false" />
          <q-btn flat label="Sil" color="red" @click="deleteClass" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted } from 'vue'
import axios from 'axios'

interface Class {
  _id: string;
  className: string;
  classroomNumber: string;
  capacity: number;
}

export default defineComponent({
  name: 'ClassroomPage',
  setup () {
    const classes = ref<Class[]>([])
    const searchQuery = ref('')
    const isPopupOpen = ref(false)
    const selectedClass = ref<Class | null>(null)
    const isLoading = ref(true)
    const isEditMode = ref(false)
    const isDeleteDialogOpen = ref(false)

    // Tablo Sütunları
    const columns = [
      { name: 'className', label: 'Sınıf Adı', field: 'className', align: 'left' as const },
      { name: 'classroomNumber', label: 'Sınıf Numarası', field: 'classroomNumber', align: 'left' as const },
      { name: 'capacity', label: 'Kapasite', field: 'capacity', align: 'center' as const }
    ]

    // Filtrelenmiş Sınıflar
    const filteredClasses = computed(() =>
      classes.value.filter((classItem) =>
        classItem.className.toLowerCase().includes(searchQuery.value.toLowerCase())
      )
    )

    // Sınıfları Backend'den Getir
    const fetchClasses = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/classes')
        classes.value = response.data
      } catch (error) {
        console.error('Sınıflar getirilirken hata oluştu:', error)
      } finally {
        isLoading.value = false
      }
    }

    // Sınıf Detaylarını Göster
    const showClassDetails = (classItem: Class) => {
      selectedClass.value = { ...classItem }
      isPopupOpen.value = true
    }

    // Sınıfı Güncelle
    const updateClass = async () => {
      if (selectedClass.value) {
        try {
          await axios.put(`http://localhost:3000/api/classes/${selectedClass.value._id}`, selectedClass.value)
          const index = classes.value.findIndex((c) => c._id === selectedClass.value?._id)
          if (index !== -1) {
            classes.value[index] = { ...selectedClass.value }
          }
          isPopupOpen.value = false
          isEditMode.value = false
        } catch (error) {
          console.error('Güncelleme sırasında hata oluştu:', error)
        }
      }
    }

    // Silme Onayı Diyalogunu Göster
    const confirmDelete = () => {
      isDeleteDialogOpen.value = true
    }

    // Sınıfı Sil
    const deleteClass = async () => {
      if (selectedClass.value) {
        try {
          await axios.delete(`http://localhost:3000/api/classes/${selectedClass.value._id}`)
          classes.value = classes.value.filter((c) => c._id !== selectedClass.value?._id)
          isPopupOpen.value = false
          isDeleteDialogOpen.value = false
        } catch (error) {
          console.error('Silme işlemi sırasında hata oluştu:', error)
        }
      }
    }

    onMounted(fetchClasses)

    return {
      classes,
      searchQuery,
      columns,
      filteredClasses,
      isPopupOpen,
      selectedClass,
      isEditMode,
      isDeleteDialogOpen,
      showClassDetails,
      updateClass,
      confirmDelete,
      deleteClass,
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
