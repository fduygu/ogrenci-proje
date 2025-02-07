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
        dense
        filled
        debounce="300"
        v-model="searchQuery"
        placeholder="Öğrenci Ara..."
        class="col"
      />
      <q-btn-dropdown
        label="Filtrele"
        color="primary"
        dense
        flat
        icon="filter_list"
        class="col-auto"
      >
      <q-list>
        <q-item clickable @click="applyFilter('')">
      <q-item-section avatar>
        <q-icon name="format_list_bulleted" color="blue" />
      </q-item-section>
      <q-item-section>Hepsi</q-item-section>
    </q-item>

    <q-item clickable @click="applyFilter('Asil')">
      <q-item-section avatar>
        <q-icon name="check_circle" color="green" />
      </q-item-section>
      <q-item-section>Aktif Öğrenciler</q-item-section>
    </q-item>

    <q-item clickable @click="applyFilter('Sıradaki')">
      <q-item-section avatar>
        <q-icon name="hourglass_top" color="orange" />
      </q-item-section>
      <q-item-section>Sıradaki Öğrenciler</q-item-section>
    </q-item>

    <q-item clickable @click="applyFilter('Pasif')">
      <q-item-section avatar>
        <q-icon name="pause_circle" color="grey" />
      </q-item-section>
      <q-item-section>Pasif Öğrenciler</q-item-section>
    </q-item>

    <q-item clickable @click="redirectToServicePage()">
      <q-item-section avatar>
        <q-icon name="commute" color="teal" />
      </q-item-section>
      <q-item-section>Servis Kullananlar</q-item-section>
    </q-item>
  </q-list>
      </q-btn-dropdown>
    </div>

    <!-- Öğrenci Tablosu -->
    <q-table
      :rows="filteredStudents"
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
            <img v-if="props.row.imageUrl" :src="props.row.imageUrl" alt="Fotoğraf" />
            <q-icon v-else name="person" color="grey" />
          </q-avatar>
        </q-td>
      </template>
      <template v-slot:body-cell-name="props">
        <q-td :props="props">
          <q-btn flat dense color="primary" @click="showStudentDetails(props.row)">
            {{ props.row.name }}
          </q-btn>
        </q-td>
      </template>
      <template v-slot:body-cell-surname="props">
        <q-td :props="props">
          {{ props.row.surname }}
        </q-td>
      </template>
      <template v-slot:body-cell-phoneNumber1="props">
        <q-td :props="props">
          {{ props.row.phoneNumber1 }}
        </q-td>
      </template>
      <template v-slot:body-cell-status="props">
        <q-td :props="props">
          {{ statusText(props.row.status) }}
        </q-td>
      </template>
      <template v-slot:body-cell-education="props">
        <q-td :props="props">
          {{ props.row.education.join(', ') }}
        </q-td>
      </template>
      <template v-slot:body-cell-createdAt="props">
        <q-td :props="props">
          {{ formatDate(props.row.createdAt) }}
        </q-td>
      </template>
    </q-table>
    <!-- Çıktı Al Butonu -->
    <div class="print-btn-container">
      <q-btn label="Çıktı Al" @click="printPage" color="primary" icon="print" />
    </div>
    <!-- Yükleniyor Göstergesi -->
    <q-spinner v-if="isLoading" />

    <!-- Yeni Kayıt Modalı -->
    <q-dialog v-model="showModal" persistent>
      <q-card class="q-pa-md" style="min-width: 600px; max-width: 90vw;">
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
          <div class="text-h6 text-center">YENİ ÖĞRENCİ KAYIT İSLEMİ</div>
        </q-card-section>
        <q-card-section>
          <!-- StudentRegistration Bileşeni -->
          <StudentRegistration @form-submitted="onStudentAdded" />
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- Öğrenci Detayları (Popup) -->
    <q-dialog v-model="isPopupOpen">
      <q-card style="width: 600px; max-width: 90vw">
        <q-card-section class="row">
          <!-- Öğrenci Resmi -->
          <div class="col-4 flex flex-center">
            <q-img
              v-if="selectedStudent?.imageUrl"
              :src="selectedStudent.imageUrl"
              alt="Fotoğraf"
              style="width: 150px; height: 150px; border-radius: 50%"
            />
            <q-icon v-else name="person" color="grey" size="150px" />
          </div>

          <!-- Öğrenci Bilgileri -->
          <div class="col-8">
            <div v-if="!isEditMode">
              <div class="text-h6">
                {{ selectedStudent?.name }} {{ selectedStudent?.surname }}
              </div>
              <q-separator class="q-my-sm" />
              <div v-if="selectedStudent" class="q-mt-md">
              <p><strong>Yaş:</strong> {{ selectedStudent.age }}</p>
              <p><strong>Adres:</strong> {{ selectedStudent.address }}</p>
              <p><strong>Veli Bilgisi:</strong> {{ selectedStudent.parentinfo }}</p>
              <p><strong>Telefon1:</strong> {{ selectedStudent.phoneNumber1 }}</p>
              <p><strong>Telefon2:</strong> {{ selectedStudent.phoneNumber2 }}</p>
              <p><strong>T.C. Kimlik No:</strong> {{ selectedStudent.tcNumber }}</p>
              <p><strong>Cinsiyet:</strong> {{ selectedStudent.gender }}</p>
              <p><strong>Aldığı Eğitim:</strong> {{ selectedStudent.education.join(', ') }}</p>
              <p><strong>Servis Kullanıyor mu:</strong> {{ selectedStudent.vehicle }}</p>
              <p><strong>Kan Grubu:</strong> {{ selectedStudent.blood }}</p>
              <p><strong>Tanısı:</strong> {{ selectedStudent.diagnosis }}</p>
              <p><strong>Kayıt Tarihi:</strong> {{ formatDate(selectedStudent.createdAt) }}</p>
              <p><strong>Durumu:</strong> {{ statusText(selectedStudent.status) }}</p>
            </div>
          </div>

            <!-- Düzenleme Formu -->
            <div v-else>
              <q-input
                v-model="selectedStudent.name"
                outlined
                label="Ad"
                dense
                class="q-mb-sm"
              />
              <q-input
                v-model="selectedStudent.surname"
                outlined
                label="Soyad"
                dense
                class="q-mb-sm"
              />
              <q-input
                v-model="selectedStudent.tcNumber"
                outlined
                label="T.C.Kimlik No"
                dense
                class="q-mb-sm"
                />
              <q-input
                v-model="selectedStudent.age"
                outlined
                label="Yaş"
                dense
                class="q-mb-sm"
              />
              <q-input
                v-model="selectedStudent.address"
                outlined
                label="Adres"
                dense
                class="q-mb-sm"
              />
              <q-input
               v-model="selectedStudent.parentinfo"
               outlined
               label="Veli Bilgisi"
               dense
               class="q-mb-sm"
              />
              <q-select
               v-model="selectedStudent.education"
               :options="educationOptions"
               option-label="label"
               option-value="value"
               emit-value
               outlined
               label="Aldığı Eğitim"
               dense
               multiple
               class="q-mb-sm"
              />
              <q-select
               v-model="selectedStudent.vehicle"
               :options="vehicleOptions"
               option-label="label"
               option-value="value"
               emit-value
               outlined
               label="Servis Kullanımı"
               dense
               class="q-mb-sm"
              />
              <q-input
                v-model="selectedStudent.phoneNumber1"
                outlined
                label="Telefon 1"
                dense
                class="q-mb-sm"
                mask="(###) ### - ## ##"
                fill-mask
              />
              <q-input
                v-model="selectedStudent.phoneNumber2"
                outlined
                label="Telefon 2"
                dense
                class="q-mb-sm"
                mask="(###) ### - ## ##"
                fill-mask
              />
              <q-input
                v-model="selectedStudent.diagnosis"
                outlined
                label="Tanısı"
                dense
                class="q-mb-sm"
              />
              <q-select
               v-model="selectedStudent.blood"
               :options="bloodOptions"
               option-label="label"
               option-value="value"
               emit-value
               outlined
               label="Kan grubu"
               dense
               class="q-mb-sm"
              />
              <q-select
               v-model="selectedStudent.status"
               :options="statusOptions"
               option-label="label"
               option-value="value"
               emit-value
               label="Öğrenci Durumu"
               dense
               class="q-mb-sm"
              />
          </div>
          </div>
        </q-card-section>

        <!-- Düzenle ve Sil Butonları -->
        <q-card-actions align="right">
          <q-btn v-if="!isEditMode && userRole !== 'personnel'" flat label="Düzenle" color="primary" @click="isEditMode = true" />
          <q-btn v-if="isEditMode && userRole !== 'personnel'" flat label="Kaydet" color="primary" @click="updateStudent" />
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
          <p>Bu öğrenciyi silmek istediğinize emin misiniz?</p>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="İptal" @click="isDeleteDialogOpen = false" />
          <q-btn flat label="Sil" color="red" @click="deleteStudent" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted } from 'vue'
import api from 'src/utils/axiosInstance'
import { format } from 'date-fns'
import StudentRegistration from './StudentRegistration.vue' // Yeni Kayıt bileşeni
import { useRouter } from 'vue-router'

interface Student {
  _id: string;
  name: string;
  age: number;
  surname: string;
  tcNumber: string;
  gender: string;
  vehicle: string;
  address: string;
  parentinfo: string;
  education: string[];
  phoneNumber1: string;
  phoneNumber2: string;
  diagnosis: string;
  createdAt: string;
  imageUrl?: string;
  blood: string;
  status: 'Asil' | 'Sıradaki' | 'Pasif';
  isActive: boolean;
}

export default defineComponent({
  name: 'StudentList',
  components: { StudentRegistration },
  setup () {
    const router = useRouter()
    const students = ref<Student[]>([])
    const showModal = ref(false)
    const isEditMode = ref(false)
    const isPopupOpen = ref(false)
    const isDeleteDialogOpen = ref(false)
    const searchQuery = ref('')
    const selectedFilter = ref('')
    const userRole = ref('') // Kullancı rolünü tutacak
    const allStudents = ref<Student[]>([])
    const filteredStudents = computed(() => {
      let filtered = students.value

      // Önce filtreyi uygula (aktif, sıradaki, pasif)
      if (selectedFilter.value) {
        filtered = filtered.filter(student => student.status === selectedFilter.value)
      }

      // Sonra arama sorgusunu uygula (ad, soyad, eğitim)
      if (searchQuery.value) {
        filtered = filtered.filter(student =>
          student.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
          student.surname.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
          student.education.some(edu => edu.toLowerCase().includes(searchQuery.value.toLowerCase()))
        )
      }

      return filtered
    })
    const selectedStudent = ref<Student>({
      _id: '',
      name: '',
      surname: '',
      age: 0,
      tcNumber: '',
      gender: '',
      vehicle: '',
      address: '',
      phoneNumber1: '',
      phoneNumber2: '',
      parentinfo: '',
      education: [],
      diagnosis: '',
      createdAt: '',
      imageUrl: '',
      blood: '',
      status: 'Asil',
      isActive: true
    })
    const isLoading = ref(true)
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
    const statusOptions = [
      { label: 'Asil Öğrenci', value: 'Asil' },
      { label: 'Sıradaki Öğrenci', value: 'Sıradaki' },
      { label: 'Pasif', value: 'Pasif' }
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
    const columns = [
      { name: 'photo', label: 'Fotoğraf', field: 'imageUrl', align: 'left' as const },
      { name: 'name', label: 'Ad', field: 'name', align: 'left' as const },
      { name: 'surname', label: 'Soyad', field: 'surname', align: 'left' as const },
      { name: 'phoneNumber1', label: 'Telefon', field: 'phoneNumber1', align: 'left' as const },
      { name: 'status', label: 'Durumu', field: 'status', align: 'left' as const },
      { name: 'education', label: 'Aldığı Eğitim', field: 'education', align: 'left' as const },
      { name: 'createdAt', label: 'Kayıt Tarihi', field: 'createdAt', align: 'left' as const }
    ]

    const formatDate = (date: string | Date | undefined) => {
      return date ? format(new Date(date), 'dd/MM/yyyy HH:mm') : '-'
    }

    const fetchStudents = async () => {
      try {
        const token = localStorage.getItem('token')
        if (token) {
          const decodedToken = JSON.parse(atob(token.split('.')[1]))
          userRole.value = decodedToken.role // Token'dan kullanıcı rolünü al
        }
        const response = await api.get('/students')
        students.value = response.data
        allStudents.value = response.data
      } catch (error) {
        console.error('Öğrenciler getirilirken hata oluştu:', error)
      } finally {
        isLoading.value = false // Veri çekme tamamlandıktan sonra kapat
      }
    }

    const applyFilter = (status: string) => {
      selectedFilter.value = status
    }

    const redirectToServicePage = () => {
      router.push('/main/service-list') // Rota yolunu belirleyin
    }
    const onStudentAdded = () => {
      fetchStudents()
    }

    const showStudentDetails = (student: Student) => {
      selectedStudent.value = { ...student }
      isPopupOpen.value = true
    }
    const updateStudent = async () => {
      if (selectedStudent.value) {
        try {
          await api.put(`/students/${selectedStudent.value._id}`, selectedStudent.value)
          const index = students.value.findIndex(
            (s) => s._id === selectedStudent.value?._id
          )

          if (index !== -1) {
            students.value[index] = { ...selectedStudent.value }
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
    const statusText = (status: string) => {
      if (status === 'Asil') {
        return 'Asil Öğrenci'
      } else if (status === 'Sıradaki') {
        return 'Sıradaki Öğrenci'
      } else if (status === 'Pasif') {
        return 'Pasif Öğrenci'
      }
      return 'Bilinmiyor'
    }
    const deleteStudent = async () => {
      if (selectedStudent.value) {
        try {
          await api.delete(`/students/${selectedStudent.value._id}`)
          students.value = students.value.filter((s) => s._id !== selectedStudent.value?._id)

          isPopupOpen.value = false
          isDeleteDialogOpen.value = false
        } catch (error) {
          console.error('Silme işlemi sırasında hata oluştu:', error)
        }
      }
    }
    const printPage = async () => {
      try {
        const allData = filteredStudents.value
        const newWindow = window.open('', '', 'width=900,height=700')

        if (!newWindow) {
          console.error('Yeni pencere açılamadı! Tarayıcı pop-up engelleyicisini kontrol edin.')
          return
        }

        const tableContent = `
          <table border="1" width="100%" style="border-collapse: collapse; font-size: 12px; text-align: center;">
            <thead>
              <tr>
                <th>Fotoğraf</th>
                <th>Ad</th>
                <th>Soyad</th>
                <th>Telefon</th>
                <th>Durumu</th>
                <th>Aldığı Eğitim</th>
                <th>Kayıt Tarihi</th>
              </tr>
            </thead>
            <tbody>
              ${allData.map((student: Student) => `
                <tr>
                  <td>${student.imageUrl ? `<img src="${student.imageUrl}" alt="${student.name}" style="width: 40px; height: 40px; border-radius: 50%;">` : ''}</td>
                  <td>${student.name}</td>
                  <td>${student.surname}</td>
                  <td>${student.phoneNumber1}</td>
                  <td>${statusText(student.status)}</td>
                  <td>${student.education.join(', ')}</td>
                  <td>${formatDate(student.createdAt)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        `

        newWindow.document.write(`
          <html>
            <head>
              <title>Öğrenci Listesi</title>
              <style>
                @media print {
                  @page {
                    size: A4 portrait;
                    margin: 10px;
                  }
                  body {
                    font-family: Arial, sans-serif;
                    font-size: 12px;
                  }
                  table {
                    width: 100%;
                    border-collapse: collapse;
                  }
                  th, td {
                    border: 1px solid black;
                    padding: 5px;
                    text-align: center;
                    white-space: nowrap;
                  }
                }
              </style>
            </head>
            <body>
              <h2 style="text-align: center;">Öğrenci Listesi</h2>
              ${tableContent}
            </body>
          </html>
        `)

        newWindow.document.close()
        newWindow.focus()
        newWindow.print()
        newWindow.close()
      } catch (error) {
        console.error('Çıktı alma sırasında hata oluştu:', error)
      }
    }
    onMounted(fetchStudents)

    return {
      students,
      filteredStudents,
      columns,
      formatDate,
      showModal,
      isPopupOpen,
      isEditMode,
      isDeleteDialogOpen,
      selectedStudent,
      isLoading,
      applyFilter,
      redirectToServicePage,
      onStudentAdded,
      statusText,
      vehicleOptions,
      bloodOptions,
      educationOptions,
      statusOptions,
      deleteStudent,
      updateStudent,
      confirmDelete,
      showStudentDetails,
      printPage,
      searchQuery,
      userRole
    }
  }
})
</script>

<style scoped>
.q-page {
  padding: 16px;
}

.q-btn-dropdown {
  max-width: 150px;
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
.print-btn-container {
  display: flex;
  justify-content: flex-end; /* Butonu en sağa hizala */
  padding: 10px;
}
</style>
