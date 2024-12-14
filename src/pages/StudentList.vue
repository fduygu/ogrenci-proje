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
      <template v-slot:body-cell-gender="props">
        <q-td :props="props">
          {{ props.row.gender }}
        </q-td>
      </template>
      <template v-slot:body-cell-tcNumber="props">
        <q-td :props="props">
          {{ props.row.tcNumber }}
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
          <div class="text-h6">Öğrenci Detayları</div>
        </q-card-section>
        <q-separator />
        <q-card-section v-if="selectedStudent">
          <q-form @submit.prevent="updateStudent">
            <q-input
              v-model="selectedStudent.name"
              label="Ad"
              outlined
              dense
              :readonly="!isEditMode"
            />
            <q-input
              v-model="selectedStudent.surname"
              label="Soyad"
              outlined
              dense
              :readonly="!isEditMode"
            />
            <q-input
              v-model="selectedStudent.tcNumber"
              label="T.C. Kimlik No"
              outlined
              dense
              :readonly="!isEditMode"
            />
            <q-input
              v-model="selectedStudent.phoneNumber"
              label="Telefon"
              outlined
              dense
              :readonly="!isEditMode"
            />
            <q-input
              v-model="selectedStudent.diagnosis"
              label="Tanısı"
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
            @click="updateStudent"
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
  surname: string;
  tcNumber: string;
  gender: string;
  phoneNumber: string;
  diagnosis: string;
  createdAt: string; // Kayıt tarihi alanı
}

export default defineComponent({
  name: 'StudentList',
  setup () {
    const students = ref<Student[]>([])
    const searchQuery = ref('')
    const isPopupOpen = ref(false)
    const selectedStudent = ref<Student | null>(null)
    const isLoading = ref(true)
    const isEditMode = ref(false)
    const isDeleteDialogOpen = ref(false)

    const columns = [
      { name: 'name', label: 'Ad', field: 'name', align: 'left' as const },
      { name: 'surname', label: 'Soyad', field: 'surname', align: 'left' as const },
      { name: 'gender', label: 'Cinsiyet', field: 'gender', align: 'left' as const },
      { name: 'tcNumber', label: 'T.C. Kimlik No', field: 'tcNumber', align: 'left' as const },
      { name: 'createdAt', label: 'Kayıt Tarihi', field: 'createdAt', align: 'left' as const }
    ]

    const formatDate = (date: string | Date | undefined) => {
      return date ? format(new Date(date), 'dd/MM/yyyy HH:mm') : '-'
    }

    const filteredStudents = computed(() =>
      students.value.filter((student) =>
        `${student.name} ${student.surname}`
          .toLowerCase()
          .includes(searchQuery.value.toLowerCase())
      )
    )

    const fetchStudents = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/students')
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
      isLoading
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
