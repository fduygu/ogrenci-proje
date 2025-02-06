<template>
  <q-layout>
    <router-view />
  </q-layout>
</template>

<script lang="ts">
import { onMounted } from 'vue'

export default {
  name: 'App',
  setup () {
    onMounted(() => {
      // Uygulama açıldığında başlık belirleme
      document.title = 'Engelsiz Yaşam Alanı'
    })
  }
}
</script>
