<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn flat dense round @click="toggleLeftDrawer" icon="menu" />
        <q-toolbar-title>
          ENGELSİZ YASAM ALANI
        </q-toolbar-title>
        <q-space />
        <q-btn-dropdown flat dense stretch>
  <template v-slot:label>
    <div class="user-info">
      <q-avatar size="32px">
  <img
    v-if="personnel?.imageUrl"
    :src="getImageUrl(personnel.imageUrl)"
    alt="Profil Resmi"
  />
  <q-icon v-else name="person" color="grey" />
</q-avatar>

      <span class="user-name">{{ personnel?.name || 'Bilinmeyen Kullanıcı' }}</span>
    </div>
  </template>
  <q-list>
  <q-item clickable v-close-popup @click="goToProfile">
    <q-item-section avatar>
      <q-icon name="person" />
    </q-item-section>
    <q-item-section>Profilim</q-item-section>
  </q-item>

  <q-item clickable v-close-popup @click="logout">
    <q-item-section avatar>
      <q-icon name="logout" />
    </q-item-section>
    <q-item-section>Çıkış Yap</q-item-section>
  </q-item>
</q-list>
</q-btn-dropdown>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above side="left" bordered>
      <q-list class="menu-list">
        <q-item-section avatar>
          <q-img src="/elogo.png" alt="E Logo" class="logo-img" style="cursor: pointer" @click="goToHome" />
        </q-item-section>
        <q-item class="menu-item turquoise" clickable v-ripple to="/main/student-list">
          <q-item-section avatar>
            <q-icon name="school" />
          </q-item-section>
          <q-item-section> Öğrenciler </q-item-section>
        </q-item>
        <q-item class="menu-item pink" clickable v-ripple to="/main/personnel-list">
          <q-item-section avatar>
            <q-icon name="people" />
          </q-item-section>
          <q-item-section> Personeller </q-item-section>
        </q-item>
        <q-item class="menu-item orange" clickable v-ripple to="/main/classes-list">
          <q-item-section avatar>
            <q-icon name="class" />
          </q-item-section>
          <q-item-section> Sınıflar </q-item-section>
        </q-item>
        <q-item class="menu-item purple" clickable v-ripple to="/main/planlama">
          <q-item-section avatar>
            <q-icon name="calendar_today" />
          </q-item-section>
          <q-item-section> Planlama </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
interface Personnel {
  id: string;
  name: string;
  surname: string;
  email: string;
  password: string;
  tcNumber: string;
  title: string;
  branch: string;
  phone: string;
  address: string;
  createdAt?: string;
  imageUrl?: string;
}

export default defineComponent({
  name: 'MainLayout',
  setup () {
    const router = useRouter()
    const leftDrawerOpen = ref(false)
    const personnelData = ref<Personnel | null>(null)
    const toggleLeftDrawer = () => {
      leftDrawerOpen.value = !leftDrawerOpen.value
    }
    const logout = () => {
      localStorage.removeItem('token')
      localStorage.removeItem('personnel')
      router.push('/auth/login')
    }
    const goToHome = () => {
      router.push('/')
    }
    const goToProfile = () => {
      router.push('/main/profile')
    }
    const getImageUrl = (imageUrl: string | undefined) => {
      if (!imageUrl) return '/default-avatar.png'

      // Eğer imageUrl zaten tam bir URL ise (http veya https ile başlıyorsa), değişiklik yapma
      if (imageUrl.startsWith('http')) {
        return imageUrl
      }

      // Eğer imageUrl "/uploads" ile başlıyorsa, 3000 portunu ekle
      return `http://localhost:3000${imageUrl}`
    }
    onMounted(() => {
      const token = localStorage.getItem('token')
      const personnel = localStorage.getItem('personnel')
      if (!token) {
        console.warn(' Oturum süresi dolmuş veya giriş yapılmamış. Login sayfasına yönlendiriliyor...')
        router.push('/auth/login')
        return
      }

      try {
        if (personnel) {
          personnelData.value = JSON.parse(personnel)
          //  Eğer imageUrl "/uploads" ile başlıyorsa 3000 portunu ekleyelim
          if (personnelData.value && personnelData.value.imageUrl && personnelData.value.imageUrl.startsWith('/uploads')) {
            personnelData.value.imageUrl = `http://localhost:3000${personnelData.value.imageUrl}`
          }
          console.log('Personnel Başarıyla Yüklendi:', personnelData.value) //  Debug
        } else {
          console.warn(' Personnel bilgisi boş!')
        }
      } catch (error) {
        console.error(' Personnel bilgisi okunamadı:', error)
        logout()
      }
    })

    return {
      leftDrawerOpen,
      toggleLeftDrawer,
      logout,
      goToHome,
      personnel: personnelData,
      goToProfile,
      getImageUrl
    }
  }
})
</script>

<style scoped>
.menu-item {
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  margin-bottom: 8px;
  color: white;
  transition: all 0.3s ease-in-out;
}
.turquoise {
  background: linear-gradient(45deg, #1abc9c, #1abc9c);
}
.orange {
  background: linear-gradient(45deg, #e67e22, #f39c12);
}
.pink {
  background: linear-gradient(45deg, #e84393, #e84393);
}
.purple {
  background: linear-gradient(45deg, #6c5ce7, #8e44ad);
}
.menu-item:hover {
  filter: brightness(1.2);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}
.logout-btn {
  color: #fff;
  background-color: #d9534f;
}
.q-avatar img {
  width: 40px;
  height: 40px;
  border-radius: 50%;
}
.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.user-name {
  font-size: 14px;
  font-weight: bold;
  color: white;
}
</style>
