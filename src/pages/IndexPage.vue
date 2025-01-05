<template>
  <q-page>
    <!-- Tablo Başlığı -->
    <div class="text-h5 text-center q-mb-md">Engelsiz Yaşam Alanı Ders Programı</div>

    <!-- Ders Programı Tablosu -->
    <q-table
      :rows="processedRows"
      :columns="columns"
      flat
      dense
      class="q-mt-md  bordered-table"
    >
      <!-- Özel başlık düzeni -->
      <template v-slot:header>
        <tr>
          <th class="text-center bg-grey-3">{{ currentMonth }}-Seanslar</th>
          <th
          class="text-left-uppercase bg-grey-3"
          v-for="personnel in personnelOptions"
          :key="personnel._id"
            >
            {{ personnel.name }}
          </th>
        </tr>
      </template>

      <!-- Gövde hücreleri -->
      <template v-slot:body="props">
        <tr v-if="props.row.separator" class="day-separator">
          <td colspan="100%" class="text-center bg-light-blue text-bold">
            {{ props.row.day }}
          </td>
        </tr>
        <tr v-else>
          <!-- Seans bilgisi -->
          <q-td>{{ props.row.time }}</q-td>
          <!-- Plan bilgisi -->
          <q-td
           v-for="personnel in personnelOptions"
           :key="personnel._id"
           :class="['with-border', { 'bg-green': props.row[personnel._id]?.isVehicle }]"
           >
            <span v-if="props.row[personnel._id] !== 'Boş'">
              {{ props.row[personnel._id]?.studentName || 'Boş' }}
            </span>
            <span v-else class="text-grey">Boş</span>
          </q-td>
        </tr>
      </template>
    </q-table>
  </q-page>
</template>

<script>
import axios from 'axios'

export default {
  data () {
    return {
      currentMonth: '', // Bulunduğumuz ay
      personnelOptions: [],
      columns: [],
      rows: [],
      schedules: [],
      processedRows: [] // Gün separatorlarıyla birlikte işlenmiş satırlar
    }
  },
  methods: {
    getMonthName (date) {
      const monthNames = [
        'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
        'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
      ]
      return monthNames[date.getMonth()]
    },
    // Haftanın günlerini ve tarihlerini getir
    getDaysWithDates () {
      const startDate = new Date() // Haftanın başlangıç tarihi
      startDate.setDate(startDate.getDate() - startDate.getDay() + 1) // Pazartesiye ayarla

      return ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma'].map((day, index) => {
        const currentDate = new Date(startDate)
        currentDate.setDate(startDate.getDate() + index) // Tarihleri hesapla
        const formattedDate = currentDate.toLocaleDateString('tr-TR', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        })
        return `${day} (${formattedDate})`
      })
    },
    // Verileri backend'den çek
    async fetchData () {
      try {
        const personnelResponse = await axios.get('http://localhost:3000/api/personnel')
        this.personnelOptions = personnelResponse.data.map((personnel) => ({
          ...personnel,
          name: personnel.name.toUpperCase() // Adı büyük harfe dönüştür
        }))
        // Sütunları tanımla
        this.columns = [
          { name: 'time', label: 'Seanslar', align: 'center', field: 'time' },
          ...this.personnelOptions.map((personnel) => ({
            name: personnel._id,
            label: personnel.name,
            align: 'left',
            field: personnel._id
          }))
        ]

        // Satırları oluştur
        const days = this.getDaysWithDates()
        const times = []
        for (const dayWithDate of days) {
          const day = dayWithDate.split(' ')[0] // Gün bilgisini al
          for (let i = 8; i <= 18; i++) {
            const row = { day, time: `${i}:00` }
            this.personnelOptions.forEach((personnel) => {
              row[personnel._id] = 'Boş'
            })
            times.push(row)
          }
        }
        this.rows = times

        // Planlama bilgilerini al
        const scheduleResponse = await axios.get('http://localhost:3000/api/schedules')
        this.schedules = scheduleResponse.data

        // Gelen verileri tabloya aktar
        this.rows.forEach((row) => {
          this.columns.slice(1).forEach((col) => {
            const schedule = this.schedules.find(
              (s) =>
                s.time === row.time &&
        s.personnelId === col.name &&
        // Haftanın gününe ek olarak saat kontrolü de yapılır
        this.getDaysWithDates().find((d) => d.startsWith(row.day)) ===
          `${row.day} (${new Date(s.date).toLocaleDateString('tr-TR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
          })})`
            )
            // Saat ve tarih uyumlu ise veriyi ekle, aksi takdirde 'Boş' bırak
            row[col.name] = schedule
              ? {
                  studentName: schedule.studentName,
                  isVehicle: schedule.studentVehicle === 'Evet' // Servis bilgisi kontrolü
                }
              : 'Boş'
          })
        }) // Gün separatorlarını ekle
        this.processedRows = []
        let currentDay = null
        this.rows.forEach((row) => {
          if (row.day !== currentDay) {
            const dayWithDate = days.find((d) => d.startsWith(row.day))
            this.processedRows.push({ separator: true, day: dayWithDate }) // Gün ve tarih separatoru
            currentDay = row.day
          }
          this.processedRows.push(row) // Normal satır
        })
      } catch (error) {
        console.error('Veriler alınamadı:', error)
      }
    }
  },
  mounted () {
    this.fetchData()
    this.currentMonth = this.getMonthName(new Date()) // Mevcut ayı al
  }
}
</script>

<style scoped>
.q-page {
  padding: 20px;
}

.text-h5 {
  font-weight: bold;
}

.bg-grey-3 {
  background-color: #e0e0e0;
}

.text-grey {
  color: #9e9e9e;
}

.day-separator td {
  background-color: #d9edf7;
  font-weight: bold;
  border-top: 2px solid #4c86dc;
}

.bg-light-blue {
  background-color: #d9edf7;
}
.bg-green {
  background-color: #88e88b; /* Açık yeşil */
  color: #000; /* Siyah yazı */
  font-weight: bold;
}
.text-left-uppercase {
  text-align: left; /* Sola yasla */
  text-transform: uppercase; /* Büyük harf yap */
  padding-left: 10px; /* Hafif bir iç boşluk ekle */
}
/* Sütunlar arasına çizgi */
.with-border {
  border-left: 1px solid #ccc; /* Sütunlar arası çizgi */
}

/* Tabloyu çerçevelemek için */
.bordered-table {
  border: 1px solid #ccc;
  border-collapse: collapse;
}
</style>
