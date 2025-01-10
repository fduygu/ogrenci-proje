<template>
  <q-page>
    <!-- Haftalık Kontroller ve Personel Seç -->
    <div class="row items-center justify-between q-mb-md">
      <q-btn
        flat
        icon="chevron_left"
        label="Önceki Hafta"
        @click="loadPreviousWeek"
      />
      <div class="row items-center">
        <q-select
          v-model="selectedPersonnel"
          :options="personnelOptions"
          label="Personel Seç"
          style="width: 300px;"
          outlined
          dense
          @update:model-value="fetchSchedules"
        />
        <q-btn
          flat
          label="Planı Haftaya Kopyala"
          color="primary"
          class="q-ml-sm"
          @click="copyScheduleToNextWeek"
        />
      </div>
      <q-btn
        flat
        icon="chevron_right"
        label="Sonraki Hafta"
        @click="loadNextWeek"
      />
    </div>
    <!-- Tablo -->
    <q-table
      :rows="rows"
      :columns="columns"
      flat
      dense
      class="q-mt-md"
    >
      <template v-slot:body-cell="props">
        <q-td
          :props="props"
          class="text-center"
          :class="{ 'bg-green': props.row[props.col.name]?.isVehicle }"
        >
          <!-- Eğer zaman sütunuysa sadece saat göster -->
          <div v-if="props.col.name === 'time'">
            {{ props.row[props.col.name] }}
          </div>
          <!-- Eğer veri varsa öğrenci bilgisi göster -->
          <div v-else>
            <q-icon
              name="edit"
              class="cursor-pointer"
              @click="openCellModal(props.row, props.col)"
            />
            <div v-if="props.row[props.col.name] && typeof props.row[props.col.name] === 'object'">
              {{ props.row[props.col.name].studentName || 'Boş' }}
            </div>
            <div v-else>Boş</div>
          </div>
        </q-td>
      </template>
    </q-table>

    <!-- Modal -->
    <q-dialog v-model="isCellModalOpen">
      <q-card>
        <q-card-section>
          <div class="text-h6">Detaylar</div>
        </q-card-section>

        <q-card-section>
          <div v-if="activeCell">
            <p><strong>Tarih:</strong> {{ activeCell.col.label }}</p>
            <p><strong>Saat:</strong> {{ activeCell.row.time }}</p>
            <p><strong>Personel:</strong> {{ activeCell.row[activeCell.col.name]?.personnelName || 'Seçim Yok' }}</p>
            <p><strong>Öğrenci:</strong> {{ activeCell.row[activeCell.col.name]?.studentName || 'Boş' }}</p>
            <p><strong>Not:</strong> {{ activeCell.row[activeCell.col.name]?.note || 'Yok' }}</p>
          </div>
          <q-select
            v-model="selectedStudent"
            :options="studentOptions"
            label="Öğrenci Seçin"
            outlined
          />
          <q-input
            v-model="note"
            label="Not"
            type="textarea"
            outlined
            class="q-mt-md"
          />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="İptal" color="negative" @click="closeCellModal" />
          <q-btn flat label="Kaydet" color="primary" @click="saveCellData" />
          <q-btn flat label="Sil" color="negative" @click="confirmDeleteCell" />
        </q-card-actions>
      </q-card>
    </q-dialog>
         <!-- Silme Onayı için Dialog -->
         <q-dialog v-model="isDeleteDialogOpen">
      <q-card>
        <q-card-section>
          <div class="text-h6">Emin misiniz?</div>
        </q-card-section>
        <q-card-section>
          Bu kaydı silmek istediğinize emin misiniz?
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="İptal" color="primary" @click="isDeleteDialogOpen = false" />
          <q-btn flat label="Sil" color="negative" @click="deleteCellData" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import axios from 'axios'

export default {
  data () {
    return {
      currentDate: new Date(), // Haftanın başlangıç tarihi
      selectedPersonnel: null,
      personnelOptions: [],
      studentOptions: [],
      selectedStudent: null,
      note: '',
      isCellModalOpen: false,
      isDeleteDialogOpen: false, // Silme onayı için dialog kontrolü
      activeCell: null,
      columns: [],
      rows: []
    }
  },
  methods: {
    // Sütunları oluşturma
    generateColumns () {
      if (!this.currentDate) {
        console.error('currentDate undefined in generateColumns!')
        this.currentDate = new Date() // Varsayılan olarak bugünün tarihini ayarla
      }

      const days = ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma']
      const monday = this.getMonday(this.currentDate)

      return [
        { name: 'time', label: 'Saatler', align: 'center', field: 'time' },
        ...days.map((day, index) => {
          const date = new Date(monday)
          date.setDate(monday.getDate() + index)
          return {
            name: day.toLowerCase(),
            label: `${date.getFullYear()}-${(date.getMonth() + 1)
          .toString()
          .padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} (${day})`,
            align: 'center',
            field: day.toLowerCase()
          }
        })
      ]
    },
    // Satırları oluşturma
    generateTimeRows () {
      const times = []
      for (let i = 8; i <= 18; i++) {
        times.push({
          time: `${i}:00`,
          monday: '',
          tuesday: '',
          wednesday: '',
          thursday: '',
          friday: ''
        })
      }
      return times
    },

    // Haftanın başlangıç tarihini al
    getMonday (date) {
      if (!date) {
        console.error('getMonday fonksiyonuna undefined bir tarih gönderildi.')
        return new Date() // Varsayılan olarak bugünün tarihini döndür
      }

      const day = date.getDay()
      const diff = day === 0 ? -6 : 1 - day
      return new Date(date.setDate(date.getDate() + diff))
    },

    async copyScheduleToNextWeek () {
      if (!this.selectedPersonnel) {
        this.$q.notify({ type: 'warning', message: 'Lütfen bir personel seçin!' })
        return
      }

      try {
        const monday = this.getMonday(this.currentDate)
        const sunday = new Date(monday)
        sunday.setDate(monday.getDate() + 6)

        await axios.post(
          'http://localhost:3000/api/schedules/copy-to-next-week',
          {
            personnelId: this.selectedPersonnel.value,
            startDate: monday.toISOString().split('T')[0],
            endDate: sunday.toISOString().split('T')[0]
          }
        )

        this.$q.notify({ type: 'positive', message: 'Planlar başarıyla kopyalandı!' })
        this.loadNextWeek()
      } catch (error) {
        console.error('Plan kopyalama hatası:', error)
        this.$q.notify({ type: 'negative', message: 'Plan kopyalanırken bir hata oluştu.' })
      }
    },
    // Planları backend'den çekme
    async fetchSchedules () {
      if (!this.selectedPersonnel) {
        console.error('Personel seçilmedi!')
        return
      }

      const monday = this.getMonday(this.currentDate)
      const sunday = new Date(monday)
      sunday.setDate(monday.getDate() + 6)

      try {
        const response = await axios.get(
      `http://localhost:3000/api/schedules/personnel/${this.selectedPersonnel.value}`,
      {
        params: {
          startDate: monday.toISOString().split('T')[0],
          endDate: sunday.toISOString().split('T')[0]
        }
      }
        )

        const schedules = response.data || []
        console.log('Gelen Planlar:', schedules)

        // Tabloyu güncelle
        this.rows.forEach((row) => {
          this.columns.slice(1).forEach((col) => {
            const schedule = schedules.find(
              (s) =>
                new Date(s.date).toISOString().split('T')[0] === col.label.split(' ')[0] &&
            s.time === row.time
            )

            row[col.name] = schedule
              ? {
                  _id: schedule._id,
                  personnelId: schedule.personnelId,
                  personnelName: schedule.personnelName,
                  studentName: schedule.studentName,
                  note: schedule.note || ''
                }
              : 'Boş'
          })
        })
      } catch (error) {
        console.error('Planları çekme hatası:', error)
      }
    },
    // Modal açma
    openCellModal (row, col) {
      this.activeCell = { row, col }

      if (row[col.name] && typeof row[col.name] === 'object') {
        this.selectedPersonnel = {
          label: row[col.name].personnelName || 'Seçim Yok',
          value: row[col.name].personnelId
        }
        this.selectedStudent = this.studentOptions.find(
          (student) => student.label === row[col.name].studentName
        )
        this.note = row[col.name].note || ''
      } else {
        this.selectedStudent = null
        this.note = ''
      }

      this.isCellModalOpen = true
    },
    // Silme işlemi öncesinde onay al
    confirmDeleteCell () {
      this.isDeleteDialogOpen = true
    },
    // Veriyi backend'den silme
    async deleteCellData () {
      if (this.activeCell) {
        const { row, col } = this.activeCell

        if (!row[col.name] || typeof row[col.name] !== 'object' || !row[col.name]._id) {
          console.error('Silme işlemi için uygun bir veri bulunamadı:', row[col.name])
          return
        }

        try {
          await axios.delete(`http://localhost:3000/api/schedules/${row[col.name]._id}`)
          this.fetchSchedules()
          this.closeCellModal()
        } catch (error) {
          console.error('Silme hatası:', error)
        } finally {
          this.isDeleteDialogOpen = false
        }
      }
    },
    // Modal kapama
    closeCellModal () {
      this.isCellModalOpen = false
      this.selectedStudent = null
      this.note = ''
    },

    // Veriyi backend'e kaydetme
    async saveCellData () {
      if (this.activeCell) {
        const { row, col } = this.activeCell
        const scheduleId = row[col.name]?._id

        const data = {
          personnelId: this.selectedPersonnel.value,
          studentId: this.selectedStudent.value,
          date: col.label.split(' ')[0],
          time: row.time,
          note: this.note
        }

        try {
          if (scheduleId) {
            await axios.put(`http://localhost:3000/api/schedules/${scheduleId}`, data)
            row[col.name] = { ...data, _id: scheduleId, studentName: this.selectedStudent.label }
          } else {
            const response = await axios.post('http://localhost:3000/api/schedules', data)
            row[col.name] = { ...data, _id: response.data._id, studentName: this.selectedStudent.label }
          }
          this.fetchSchedules()
          this.closeCellModal()
        } catch (error) {
          console.error('Kaydetme hatası:', error)
        }
      }
    },

    // Haftayı değiştir
    loadPreviousWeek () {
      if (!this.currentDate) {
        console.error('currentDate undefined!')
        return
      }
      this.currentDate.setDate(this.currentDate.getDate() - 7)
      this.columns = this.generateColumns()
      this.fetchSchedules()
    },

    loadNextWeek () {
      if (!this.currentDate) {
        console.error('currentDate undefined!')
        return
      }
      this.currentDate.setDate(this.currentDate.getDate() + 7)
      this.columns = this.generateColumns()
      this.fetchSchedules()
    },
    // Personel ve öğrenci verilerini çekme
    async fetchPersonnelAndStudents () {
      try {
        const personnelResponse = await axios.get('http://localhost:3000/api/personnel')
        this.personnelOptions = personnelResponse.data.map((personnel) => ({
          label: `${personnel.name} ${personnel.surname}`,
          value: personnel._id
        }))

        const studentResponse = await axios.get('http://localhost:3000/api/students/active-students')
        this.studentOptions = studentResponse.data.map((student) => ({
          label: `${student.name} ${student.surname}`,
          value: student._id
        }))
      } catch (error) {
        console.error('Personel veya öğrenci API hatası:', error)
      }
    }
  },
  async mounted () {
    if (!this.currentDate) {
      this.currentDate = new Date() // Eğer currentDate yoksa bugünü ata
    }
    this.columns = this.generateColumns() // Sütunları oluştur
    this.rows = this.generateTimeRows() // Satırları oluştur
    await this.fetchPersonnelAndStudents()
  }
}
</script>

<style scoped>
.q-page {
  padding: 20px;
}
.bg-green {
  background-color: #c8e6c9; /* Açık yeşil */
  color: #2e7d32; /* Daha koyu yeşil yazı */
  font-weight: bold;
}
</style>
