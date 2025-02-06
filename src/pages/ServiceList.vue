<template>
  <q-page>
    <!-- Geri Butonu -->
    <div class="row items-center q-mb-md">
      <q-btn
        flat
        dense
        icon="arrow_back"
        label="Geri"
        color="primary"
        @click="goBack"
      />
    </div>

    <!-- Öğrenci Tablosu -->
    <div class="print-area">
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
      <template v-slot:body-cell-status="props">
        <q-td :props="props">
          {{ statusText(props.row.status) }}
        </q-td>
      </template>
      <template v-slot:body-cell-createdAt="props">
        <q-td :props="props">
          {{ formatDate(props.row.createdAt) }}
        </q-td>
      </template>
    </q-table>
  </div>
        <!-- Çıktı Al Butonu -->
        <div class="print-btn-container">
      <q-btn label="Çıktı Al" @click="printPage" color="primary" icon="print" />
    </div>

    <!-- Detay Popup -->
    <q-dialog v-model="isPopupOpen">
      <q-card style="width: 600px; max-width: 90vw">
        <q-card-section>
          <div v-if="selectedStudent">
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
import { useRouter } from 'vue-router' // Vue Router kullanımı
import axios from 'axios'
import { format } from 'date-fns'

interface Student {
  _id: string;
  name: string;
  surname: string;
  vehicle: string;
  phoneNumber1?: string;// Telefon alanını ekledik
  status: string;// Durum alanını ekledik
  createdAt?: string;
  imageUrl?: string;

}

export default defineComponent({
  name: 'ServiceList',
  setup () {
    const router = useRouter() // Vue Router'ı tanımlıyoruz
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
      { name: 'status', label: 'Durumu', field: 'status', align: 'left' as const },
      { name: 'createdAt', label: 'Kayıt Tarihi', field: 'createdAt', align: 'left' as const }
    ]

    const formatDate = (date: string | Date | undefined) => {
      return date ? format(new Date(date), 'dd/MM/yyyy HH:mm') : '-'
    }

    const fetchStudents = async () => {
      try {
        const token = localStorage.getItem('token') // Burada token'ı alıyoruz
        if (!token) {
          console.error('Token bulunamadı!')
          return
        }
        const response = await axios.get('http://localhost:3000/api/students/students-with-service', {
          headers: {
            Authorization: `Bearer ${token}` // Token'ı header'a ekliyoruz
          }
        })
        students.value = response.data
      } catch (error) {
        console.error('Öğrenciler getirilirken hata oluştu:', error)
      }
    }

    const filteredStudents = computed(() => {
      return students.value.filter(student => student.status === 'Asil')
    })
    const showStudentDetails = (student: Student) => {
      selectedStudent.value = { ...student }
      isPopupOpen.value = true
    }

    const statusText = (status: string) => {
      if (status === 'Asil') {
        return 'Asil Öğrenci'
      } else if (status === 'Sıradaki') {
        return 'Sıradaki Öğrenci'
      }
      return 'Bilinmiyor'
    }

    const updateStudent = async () => {
      if (selectedStudent.value) {
        try {
          const token = localStorage.getItem('token') // Token'ı alıyoruz
          console.log('Token:', token) // Token'ı logla, doğru olup olmadığını görmek için

          if (!token) {
            console.error('Token bulunamadı!')
            return
          }
          await axios.put(
            `http://localhost:3000/api/students/${selectedStudent.value._id}`,
            selectedStudent.value,
            {
              headers: {
                Authorization: `Bearer ${token}` // Header'a token'ı ekliyoruz
              }
            }
          )
          const index = students.value.findIndex((s) => s._id === selectedStudent.value?._id)
          if (index !== -1) {
            students.value[index] = { ...selectedStudent.value }
          }
          await fetchStudents()
          isPopupOpen.value = false
        } catch (error) {
          console.error('Öğrenci güncellenirken hata oluştu:', error)
        }
      }
    }

    const goBack = () => {
      router.push('/main/student-list') // Geri butonuna basıldığında yönlendir
    }
    const printPage = () => {
      const tableContent = `
    <table>
      <thead>
        <tr>
          <th>Fotoğraf</th>
          <th>Ad</th>
          <th>Soyad</th>
          <th>Servis Kullanımı</th>
          <th>Telefon</th>
          <th>Durumu</th>
          <th>Kayıt Tarihi</th>
        </tr>
      </thead>
      <tbody>
        ${filteredStudents.value.map(student => `
          <tr>
            <td>${student.imageUrl ? `<img src="${student.imageUrl}" alt="${student.name}" style="width: 40px; height: 40px; border-radius: 50%;">` : ''}</td>
            <td>${student.name}</td>
            <td>${student.surname}</td>
            <td>${student.vehicle}</td>
            <td>${student.phoneNumber1}</td>
            <td>${statusText(student.status)}</td>
            <td>${formatDate(student.createdAt)}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `

      const newWindow = window.open('', '', 'width=900,height=700')

      if (!newWindow) {
        console.error('Yeni pencere açılamadı! Tarayıcı pop-up engelleyicisini kontrol edin.')
        return
      }

      newWindow.document.write(`
    <html>
      <head>
        <title>Servis Kullanan Öğrenciler</title>
        <style>
          @media print {
            @page {
              size: A4 portrait;
              margin: 10px;
            }
            body {
              font-family: Arial, sans-serif;
              font-size: 12px;
              padding: 20px;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              font-size: 12px;
            }
            th, td {
              border: 1px solid black;
              padding: 6px;
              text-align: center;
              white-space: nowrap;
            }
          }
        </style>
      </head>
      <body>
        <h2>Servis Kullanan Öğrenciler</h2>
        ${tableContent}
      </body>
    </html>
  `)

      newWindow.document.close()
      newWindow.focus()
      setTimeout(() => {
        newWindow.print()
        newWindow.close()
      }, 500)
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
      formatDate,
      statusText,
      printPage,
      goBack // Geri fonksiyonunu ekledik
    }
  }
})
</script>

<style scoped>
.q-mb-md {
  margin-bottom: 1rem;
}
.text-bold {
  font-weight: bold;
}
@media print {
  @page {
    size: A4 portrait;
    margin: 10px;
  }

  body, html {
    margin: 0;
    padding: 0;
    height: 100%;
    width: 100%;
  }

  .print-area {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    page-break-after: auto;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    font-size: 12px;
  }

  th, td {
    border: 1px solid black;
    padding: 6px;
    text-align: center;
    white-space: nowrap;
  }

}
.print-btn-container {
  display: flex;
  justify-content: flex-end; /* Butonu en sağa hizala */
  padding: 10px;
}
</style>
