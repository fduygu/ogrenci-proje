<template>
    <q-layout view="lHh Lpr lFf">
      <q-page-container>
        <router-view />
      </q-page-container>
    </q-layout>
  </template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'AuthLayout'
})
</script>

  <style scoped>
  /* Gerekirse stil ekleyebilirsin */
  </style>
