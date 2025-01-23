<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn flat dense round @click="toggleLeftDrawer" icon="menu" />
        <q-toolbar-title>
          ENGELSİZ YASAM ALANI
        </q-toolbar-title>
        <q-space />
        <q-btn flat dense round icon="logout" label="Çıkış" class="logout-btn" @click="logout" />
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above side="left" bordered>
      <q-list class="menu-list">
        <q-item-section avatar>
          <q-img src="/elogo.png" alt="E Logo" class="logo-img" style="cursor: pointer" @click="goToHome" />
        </q-item-section>
        <!-- Öğrenciler Menüsü -->
        <q-item class="menu-item turquoise" clickable v-ripple to="/student-list">
          <q-item-section avatar>
            <q-icon name="school" />
          </q-item-section>
          <q-item-section>
            Öğrenciler
          </q-item-section>
        </q-item>
        <!-- Personeller Menüsü -->
        <q-item class="menu-item pink" clickable v-ripple to="/personnel-list">
          <q-item-section avatar>
            <q-icon name="people" />
          </q-item-section>
          <q-item-section>
            Personeller
          </q-item-section>
        </q-item>
        <q-item class="menu-item orange" clickable v-ripple to="/classes-list">
          <q-item-section avatar>
            <q-icon name="class" />
          </q-item-section>
          <q-item-section>
            Sınıflar
          </q-item-section>
        </q-item>
        <q-item class="menu-item purple" clickable v-ripple to="/planlama">
          <q-item-section avatar>
            <q-icon name="calendar_today" />
          </q-item-section>
          <q-item-section>
            Planlama
          </q-item-section>
        </q-item>
        <!--
        <q-item class="menu-item orange" clickable v-ripple to="/degerlendirme">
          <q-item-section avatar>
            <q-icon name="grading" />
          </q-item-section>
          <q-item-section>
            Değerlendirme
          </q-item-section>
        </q-item>
        <q-item class="menu-item pink" clickable v-ripple to="/kazanımlar">
          <q-item-section avatar>
            <q-icon name="military_tech" />
          </q-item-section>
          <q-item-section>
            Kazanımlar
          </q-item-section>
        </q-item>
         -->
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useRouter } from 'vue-router'

export default defineComponent({
  name: 'MainLayout',
  setup () {
    const router = useRouter()
    const leftDrawerOpen = ref(false)

    const toggleLeftDrawer = () => {
      leftDrawerOpen.value = !leftDrawerOpen.value
    }

    const logout = () => {
      console.log('Çıkış yapıldı')
    }
    const goToHome = () => {
      router.push('/') // Ana sayfaya yönlendirme
    }

    return {
      leftDrawerOpen,
      toggleLeftDrawer,
      logout,
      goToHome
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
  background: linear-gradient(45deg, #e67e22, #f39c12 );
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
.q-expansion-item .q-item {
  border: none;
  background-color: transparent;
}
</style>
