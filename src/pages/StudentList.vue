<template>
  <q-page>
    <!-- Arama Alanı -->
    <q-input
      v-model="searchQuery"
      outlined
      label="Öğrenci Ara"
      class="q-mb-md"
      dense
    />

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

    <!-- Yükleniyor Göstergesi -->
    <q-spinner v-if="isLoading" />

    <!-- Detay Popup -->
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
          <q-btn
            v-if="!isEditMode"
            flat
            label="Düzenle"
            color="primary"
            @click="isEditMode = true"
          />
          <q-btn
            v-if="isEditMode"
            flat
            label="Kaydet"
            color="primary"
            @click="updateStudent"
          />
          <q-btn
            v-if="isEditMode"
            flat
            label="Vazgeç"
            color="secondary"
            @click="isEditMode = false"
          />
          <q-btn flat label="Sil" color="red" @click="confirmDelete" />
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
import axios from 'axios'
import { format } from 'date-fns'

interface Student {
  _id: string;
  name: string;
  age:number;
  surname: string;
  tcNumber: string;
  gender: string;
  vehicle:string;
  address:string;
  parentinfo:string;
  education: string[];
  phoneNumber1: string;
  phoneNumber2: string;
  diagnosis: string;
  createdAt: string; // Kayıt tarihi alanı
  imageUrl?: string;
  blood:string;
  status: 'main' | 'waiting';
}
export default defineComponent({
  name: 'StudentList',
  setup () {
    const students = ref<Student[]>([])
    const searchQuery = ref('')
    const isPopupOpen = ref(false)
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
      status: 'main'
    })
    const isLoading = ref(true)
    const isEditMode = ref(false)
    const isDeleteDialogOpen = ref(false)
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
    const statusOptions = [
      { label: 'Asıl Öğrenci', value: 'main' },
      { label: 'Sıradaki Öğrenci', value: 'waiting' },
      { label: 'Pasif', value: 'inactive' }
    ]
    const columns = [
      { name: 'photo', label: 'Fotoğraf', field: 'imageUrl', align: 'left' as const },
      { name: 'name', label: 'Ad', field: 'name', align: 'left' as const },
      { name: 'surname', label: 'Soyad', field: 'surname', align: 'left' as const },
      { name: 'phoneNumber1', label: 'Telefon', field: 'phoneNumber1', align: 'left' as const },
      { name: 'education', label: 'Aldığı Eğitim', field: 'education', align: 'left' as const },
      { name: 'createdAt', label: 'Kayıt Tarihi', field: 'createdAt', align: 'left' as const }
    ]

    const formatDate = (date: string | Date | undefined) => {
      return date ? format(new Date(date), 'dd/MM/yyyy HH:mm') : '-'
    }

    const filteredStudents = computed(() =>
      students.value.filter((student) =>
        student.status === 'main' && // Yalnızca "main" olan öğrenciler
        `${student.name} ${student.surname}`
          .toLowerCase()
          .includes(searchQuery.value.toLowerCase())
      )
    )

    const fetchStudents = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/students')
        console.log('Backend\'den Gelen Veriler:', response.data) // Backend'den gelen veriyi logla
        students.value = response.data
      } catch (error) {
        console.error('Öğrenciler getirilirken hata oluştu:', error)
      } finally {
        isLoading.value = false
      }
    }
    const showStudentDetails = (student: Student) => {
      selectedStudent.value = { ...student }
      isPopupOpen.value = true
    }

    const updateStudent = async () => {
      if (selectedStudent.value) {
        try {
          const response = await axios.put(
            `http://localhost:3000/api/students/${selectedStudent.value._id}`,
            selectedStudent.value
          )
          console.log('Güncelleme başarılı:', response.data)

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
      if (status === 'main') {
        return 'Asıl Öğrenci'
      } else if (status === 'waiting') {
        return 'Sıradaki Öğrenci'
      } else if (status === 'inactive') {
        return 'Pasif'
      }
      return 'Bilinmiyor'
    }
    const deleteStudent = async () => {
      if (selectedStudent.value) {
        try {
          await axios.delete(`http://localhost:3000/api/students/${selectedStudent.value._id}`)
          students.value = students.value.filter(
            (s) => s._id !== selectedStudent.value?._id
          )

          isPopupOpen.value = false
          isDeleteDialogOpen.value = false
        } catch (error) {
          console.error('Silme işlemi sırasında hata oluştu:', error)
        }
      }
    }

    onMounted(fetchStudents)

    return {
      students,
      searchQuery,
      columns,
      filteredStudents,
      formatDate,
      isPopupOpen,
      selectedStudent,
      isEditMode,
      isDeleteDialogOpen,
      showStudentDetails,
      updateStudent,
      confirmDelete,
      deleteStudent,
      isLoading,
      vehicleOptions,
      educationOptions,
      bloodOptions,
      statusOptions,
      statusText
    }
  }
})
</script>
<style scoped>
.student-details {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 8px 16px;
}
</style>
