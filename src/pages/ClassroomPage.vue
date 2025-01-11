<template>
  <q-page>
    <!-- Üst Araç Çubuğu -->
    <div class="q-mb-md row items-center justify-between">
      <q-btn
        label="Yeni Kayıt"
        color="primary"
        icon="add"
        @click="showModal = true"
        class="col-auto"
      />
      <q-input
        v-model="searchQuery"
        outlined
        label="Sınıf Ara"
        dense
        class="col"
      />
    </div>

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
      <div class="text-h6 text-center">YENİ SINIF KAYIT İSLEMİ</div>
    </q-card-section>
    <q-card-section>
      <!-- ClassPage Bileşeni -->
      <ClassPage @class-saved="onClassAdded" />
    </q-card-section>
  </q-card>
</q-dialog>
<!-- Detay Popup -->
<q-dialog v-model="isPopupOpen">
  <q-card class="q-pa-md q-card-styled">
    <!-- Sağ Üstte Kapat Butonu -->
    <q-btn
      flat
      dense
      icon="close"
      color="white"
      class="close-btn"
      @click="isPopupOpen = false"
    />
    <q-card-section>
      <div class="text-h6 text-center">Sınıf Detayları</div>
    </q-card-section>
    <q-separator />
    <q-card-section v-if="selectedClass">
  <q-form @submit.prevent="updateClass">
    <div class="row items-center q-mb-md">
      <div class="col-4 text-bold">Sınıf Adı:</div>
      <div class="col-8">
        <q-input
          v-model="selectedClass.className"
          dense
          :readonly="!isEditMode"
        />
      </div>
    </div>
    <div class="row items-center q-mb-md">
      <div class="col-4 text-bold">Sınıf Numarası:</div>
      <div class="col-8">
        <q-input
          v-model="selectedClass.classroomNumber"
          dense
          :readonly="!isEditMode"
        />
      </div>
    </div>
    <div class="row items-center">
      <div class="col-4 text-bold">Kapasite:</div>
      <div class="col-8">
        <q-input
          v-model="selectedClass.capacity"
          dense
          :readonly="!isEditMode"
        />
      </div>
    </div>
  </q-form>
</q-card-section>
    <q-card-actions align="right">
      <q-btn
        flat
        label="Düzenle"
        color="primary"
        @click="isEditMode = true"
        v-if="!isEditMode"
      />
      <q-btn
        flat
        label="Kaydet"
        color="positive"
        @click="updateClass"
        v-if="isEditMode"
      />
      <q-btn
        flat
        label="Sil"
        color="negative"
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
import ClassPage from './ClassPage.vue' // Yeni kayıt bileşeni

interface Class {
  _id: string;
  className: string;
  classroomNumber: string;
  capacity: number;
}

export default defineComponent({
  name: 'ClassroomPage',
  components: { ClassPage },
  setup () {
    const classes = ref<Class[]>([])
    const searchQuery = ref('')
    const showModal = ref(false)
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

    // Yeni Sınıf Eklendiğinde Listeyi Güncelle
    const onClassAdded = () => {
      showModal.value = false
      fetchClasses()
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
      showModal,
      isPopupOpen,
      selectedClass,
      isEditMode,
      isDeleteDialogOpen,
      showClassDetails,
      onClassAdded,
      updateClass,
      confirmDelete,
      deleteClass,
      isLoading
    }
  }
})
</script>

<style scoped>
.text-bold {
  font-weight: bold;
  font-size: 14px;
}

.q-card-section .row {
  align-items: center;
}
.q-input {
  width: 100%;
  background-color: #f5f5f5;
  border-radius: 6px;
  padding: 4px 8px;
}

.q-input.readonly {
  background-color: #e0e0e0; /* Okuma modunda arka plan rengi */
  cursor: default;
}
.q-card-styled {
  width: 100%;
  max-width: 700px; /* Modal genişliği */
  margin: auto;
  overflow: hidden; /* Fazladan boşluğu kaldırır */
}

.q-dialog {
  display: flex;
  align-items: center;
  justify-content: center;
}

.q-card {
  width: 100%;
  max-width: 800px; /* Modal genişliğini artırdık */
  max-height: 90vh; /* Modalın ekran yüksekliğine sığmasını sağlar */
  overflow-y: auto; /* Uzun içerikler için kaydırma çubuğu ekler */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); /* Görsellik için gölge */
  border-radius: 8px; /* Köşeleri yuvarlar */
  padding: 16px; /* İç boşluk ekler */
}
.close-btn {
  position: absolute;
  top: 8px;
  right: 8px;
  z-index: 10; /* Üstte görünmesini sağlar */
  width: 36px; /* Tıklama alanını genişletir */
  height: 36px; /* Tıklama alanını genişletir */
  background-color: red; /* Arka plan rengi */
  color: white; /* İkon rengi */
  border-radius: 50%; /* Yuvarlak görünüm */
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3); /* Hafif bir gölge */
  transition: background-color 0.3s ease; /* Hover animasyonu */
}

.close-btn:hover {
  background-color: darkred; /* Hover sırasında arka plan rengi */
}
</style>
