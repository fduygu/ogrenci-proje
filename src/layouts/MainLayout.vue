<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn flat dense round @click="toggleLeftDrawer" icon="menu" />
        <q-avatar>
          <img src="/unilogo.png" alt="Uni Logo" style="width: 40px; height: 40px;" />
        </q-avatar>
        <q-toolbar-title>
          Engelsiz Yaşam Merkezi
        </q-toolbar-title>
        <q-space />
        <q-btn flat dense round icon="logout" label="Çıkış" class="logout-btn" @click="logout" />
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above side="left" bordered>
      <q-list class="menu-list">
        <q-item-section avatar>
          <q-img src="/elogo.png" alt="E Logo" class="logo-img" />
        </q-item-section>
        <q-item class="menu-item turquoise" clickable v-ripple to="/">
          <q-item-section avatar>
            <q-icon name="home" />
          </q-item-section>
          <q-item-section>
            Ana Sayfa
          </q-item-section>
        </q-item>
        <q-expansion-item class="menu-item orange" icon="school" label="Öğrenciler" expand-separator default-open>
          <q-item clickable v-ripple to="/register">
            <q-item-section avatar>
              <q-icon name="person_add" />
            </q-item-section>
            <q-item-section>
              Öğrenci Kaydı
            </q-item-section>
          </q-item>
          <q-item clickable v-ripple to="/student-list">
            <q-item-section avatar>
              <q-icon name="people" />
            </q-item-section>
            <q-item-section>
              Öğrenci Listesi
            </q-item-section>
          </q-item>
          <q-item clickable v-ripple to="/understudy-list">
            <q-item-section avatar>
              <q-icon name="people" />
            </q-item-section>
            <q-item-section>
              Yedek Öğrenci Listesi
            </q-item-section>
          </q-item>
        </q-expansion-item>
        <q-expansion-item class="menu-item pink" icon="people" label="Personeller" expand-separator default-open>
          <q-item clickable v-ripple to="/personel">
            <q-item-section avatar>
              <q-icon name="person_add" />
            </q-item-section>
            <q-item-section>
              Personel Kaydı
            </q-item-section>
          </q-item>
          <q-item clickable v-ripple to="/personnel-list">
            <q-item-section avatar>
              <q-icon name="group" />
            </q-item-section>
            <q-item-section>
              Personel Listesi
            </q-item-section>
          </q-item>
        </q-expansion-item>

        <q-expansion-item class="menu-item purple" icon="school" label="Sınıflar" expand-separator default-open>
          <q-item clickable v-ripple to="/classes">
            <q-item-section avatar>
              <q-icon name="person_add" />
            </q-item-section>
            <q-item-section>
              Sınıf Kaydı
            </q-item-section>
          </q-item>
          <q-item clickable v-ripple to="/classes-list">
            <q-item-section avatar>
              <q-icon name="group" />
            </q-item-section>
            <q-item-section>
              Sınıf Listesi
            </q-item-section>
          </q-item>
        </q-expansion-item>

        <q-item class="menu-item turquoise" clickable v-ripple to="/planlama">
          <q-item-section avatar>
            <q-icon name="assignment" />
          </q-item-section>
          <q-item-section>
            Planlama
          </q-item-section>
        </q-item>
        <q-item class="menu-item orange" clickable v-ripple to="/degerlendirme">
          <q-item-section avatar>
            <q-icon name="assessment" />
          </q-item-section>
          <q-item-section>
            Değerlendirme
          </q-item-section>
        </q-item>
        <q-item class="menu-item pink" clickable v-ripple to="/service-list">
          <q-item-section avatar>
            <q-icon name="commute" />
          </q-item-section>
          <q-item-section>
            Servis Listesi
          </q-item-section>
        </q-item>

        <q-item class="menu-item purple" clickable v-ripple to="/kazanımlar">
          <q-item-section avatar>
            <q-icon name="star" />
          </q-item-section>
          <q-item-section>
            Kazanımlar
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'MainLayout',
  setup () {
    const leftDrawerOpen = ref(false)

    const toggleLeftDrawer = () => {
      leftDrawerOpen.value = !leftDrawerOpen.value
    }

    const logout = () => {
      console.log('Çıkış yapıldı')
    }

    return {
      leftDrawerOpen,
      toggleLeftDrawer,
      logout
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
  background: linear-gradient(45deg, #1abc9c, #16a085);
}
.orange {
  background: linear-gradient(45deg, #e67e22, #d35400);
}
.pink {
  background: linear-gradient(45deg, #e84393, #ff6b81);
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
