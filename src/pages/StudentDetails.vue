<template>
  <q-page>
    <q-card>
      <q-card-section>
        <div class="text-h6">Öğrenci Detayları</div>
      </q-card-section>
      <q-separator />
      <q-card-section v-if="student">
        <div><strong>Ad:</strong> {{ student.name }}</div>
        <div><strong>Anne Adı:</strong> {{ student.motherName }}</div>
        <div><strong>Baba Adı:</strong> {{ student.fatherName }}</div>
        <div><strong>Doğum Tarihi:</strong> {{ student.birthDate }}</div>
        <div><strong>Cinsiyet:</strong> {{ student.gender }}</div>
        <div><strong>Kayıt Tarihi:</strong> {{ student.registerDate }}</div>
        <div><strong>Rapor Durumu:</strong> {{ student.reportStatus }}</div>
        <div><strong>Ayrılış Tarihi:</strong> {{ student.leaveDate }}</div>
        <div><strong>Tanısı:</strong> {{ student.diagnosis }}</div>
        <div><strong>Okulu:</strong> {{ student.school }}</div>
        <div><strong>Sınıfı:</strong> {{ student.class }}</div>
        <div><strong>Okul Saatleri:</strong> {{ student.schoolHours }}</div>
        <div><strong>Servis Kullanımı:</strong> {{ student.serviceUsage }}</div>
        <div><strong>Telefon 1:</strong> {{ student.phone1 }}</div>
        <div><strong>Telefon 2:</strong> {{ student.phone2 }}</div>
        <div><strong>Adres:</strong> {{ student.address }}</div>
        <div><strong>Kan Grubu:</strong> {{ student.bloodGroup }}</div>
        <div><strong>Aldığı Eğitimler:</strong> {{ student.educationReceived }}</div>
      </q-card-section>
      <q-card-section v-else>
        <div class="text-negative">Öğrenci bulunamadı!</div>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn flat label="Geri Dön" @click="goBack" />
      </q-card-actions>
    </q-card>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from 'src/utils/axiosInstance'

interface Student {
  _id: string;
  name: string;
  motherName: string;
  fatherName: string;
  birthDate: string;
  gender: string;
  registerDate: string;
  reportStatus: string;
  leaveDate: string;
  diagnosis: string;
  school: string;
  class: string;
  schoolHours: string;
  serviceUsage: string;
  phone1: string;
  phone2: string;
  address: string;
  bloodGroup: string;
  educationReceived: string;
}

export default defineComponent({
  name: 'StudentDetails',
  setup () {
    const route = useRoute()
    const router = useRouter()
    const student = ref<Student | null>(null)
    const id = route.params.id as string // id'yi doğrudan string olarak al

    // Öğrenci Detaylarını Getir
    const fetchStudentDetails = async () => {
      try {
        const response = await api.get(`/students/${id}`)
        student.value = response.data
      } catch (error) {
        console.error('Öğrenci bilgileri alınırken hata oluştu:', error)
        student.value = null
      }
    }

    // Geri Dönüş
    const goBack = () => {
      router.push('/main/student-list') // Öğrenci listesine geri yönlendir
    }

    onMounted(fetchStudentDetails)

    return {
      student,
      goBack
    }
  }
})
</script>

<style scoped>
.q-page {
  padding: 20px;
}
</style>
