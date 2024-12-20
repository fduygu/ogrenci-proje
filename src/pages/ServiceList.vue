<template>
  <q-page>
    <!-- Öğrenci Tablosu -->
    <q-table
      :rows="filteredStudents"
      :columns="columns"
      row-key="_id"
      flat
      bordered
    >
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
      <template v-slot:body-cell-vehicle="props">
        <q-td :props="props">
          {{ props.row.vehicle }}
        </q-td>
      </template>
      <template v-slot:body-cell-phoneNumber1="props">
        <q-td :props="props">
          {{ props.row.phoneNumber1 }}
        </q-td>
      </template>
      <template v-slot:body-cell-createdAt="props">
        <q-td :props="props">
          {{ formatDate(props.row.createdAt) }}
        </q-td>
      </template>
    </q-table>

    <!-- Detay Popup -->
    <q-dialog v-model="isPopupOpen">
      <q-card style="width: 600px; max-width: 90vw">
        <q-card-section>
          <div v-if="selectedStudent">
            <q-input
              v-model="selectedStudent.name"
              outlined
              label="Ad"
              dense
            />
            <q-input
              v-model="selectedStudent.surname"
              outlined
              label="Soyad"
              dense
            />
            <q-select
              v-model="selectedStudent.vehicle"
              :options="vehicleOptions"
              emit-value
              outlined
              label="Servis Kullanıyor mu?"
              dense
            />
          </div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Kaydet" color="primary" @click="updateStudent" />
          <q-btn flat label="Vazgeç" color="secondary" @click="isPopupOpen = false" />
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
  vehicle: string;
}

export default defineComponent({
  name: 'ServiceList',
  setup () {
    const students = ref<Student[]>([])
    const selectedStudent = ref<Student | null>(null)
    const isPopupOpen = ref(false)
    const vehicleOptions = [
      { label: 'Evet', value: 'Evet' },
      { label: 'Hayır', value: 'Hayır' }
    ]

    const columns = [
      { name: 'photo', label: 'Fotoğraf', field: 'imageUrl', align: 'left' as const },
      { name: 'name', label: 'Ad', field: 'name', align: 'left' as const },
      { name: 'surname', label: 'Soyad', field: 'surname', align: 'left' as const },
      { name: 'vehicle', label: 'Servis Kullanımı', field: 'vehicle', align: 'left' as const },
      { name: 'phoneNumber1', label: 'Telefon', field: 'phoneNumber1', align: 'left' as const },
      { name: 'createdAt', label: 'Kayıt Tarihi', field: 'createdAt', align: 'left' as const }
    ]

    const formatDate = (date: string | Date | undefined) => {
      return date ? format(new Date(date), 'dd/MM/yyyy HH:mm') : '-'
    }
    const fetchStudents = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/students/students-with-service')
        students.value = response.data
      } catch (error) {
        console.error('Öğrenciler getirilirken hata oluştu:', error)
      }
    }

    const filteredStudents = computed(() => students.value)

    const showStudentDetails = (student: Student) => {
      selectedStudent.value = { ...student }
      isPopupOpen.value = true
    }

    const updateStudent = async () => {
      if (selectedStudent.value) {
        try {
          await axios.put(
            `http://localhost:3000/api/students/${selectedStudent.value._id}`,
            selectedStudent.value
          )
          const index = students.value.findIndex((s) => s._id === selectedStudent.value?._id)
          if (index !== -1) {
            students.value[index] = { ...selectedStudent.value }
          }
          isPopupOpen.value = false
        } catch (error) {
          console.error('Öğrenci güncellenirken hata oluştu:', error)
        }
      }
    }

    onMounted(fetchStudents)

    return {
      students,
      selectedStudent,
      isPopupOpen,
      vehicleOptions,
      columns,
      filteredStudents,
      showStudentDetails,
      updateStudent,
      formatDate
    }
  }
})
</script>

<style scoped>
/* Stilinizi buraya ekleyin */
</style>

<style scoped>
.text-green {
  color: #4caf50;
}
.text-bold {
  font-weight: bold;
}
.q-mb-md {
  margin-bottom: 1rem;
}
</style>
