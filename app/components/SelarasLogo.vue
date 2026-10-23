<script setup lang="ts">
withDefaults(defineProps<{ mark?: boolean }>(), { mark: false })
const { app } = useRuntimeConfig()
</script>

<template>
  <span class="selaras-logo" :class="{ 'selaras-logo-mark': mark }">
    <img
      v-if="mark"
      :src="`${app.baseURL}favicon.svg`"
      alt="Selaras"
      width="32"
      height="32"
    >
    <template v-else>
      <img
        :src="`${app.baseURL}selaras-logo-light.svg`"
        alt="Selaras"
        width="108"
        height="36"
        class="selaras-logo-light"
      >
      <img
        :src="`${app.baseURL}selaras-logo-dark.svg`"
        alt="Selaras"
        width="108"
        height="36"
        class="selaras-logo-dark"
      >
    </template>
  </span>
</template>
