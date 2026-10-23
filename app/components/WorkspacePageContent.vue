<script setup lang="ts">
const { storage } = useWorkspace()
const config = useAppConfig()
</script>

<template>
  <main id="main" tabindex="-1">
    <SAlert
      v-if="storage !== 'saved'"
      color="warning"
      variant="soft"
      :title="
        storage === 'invalid'
          ? 'Saved data could not be read. Your original data is preserved; edits are session only. Reset in Settings to start fresh.'
          : 'Browser storage is unavailable. Changes will last for this session.'
      "
      class="mb-5"
    />
    <slot />
    <footer class="content-footer">
      <span>{{ config.workspace.tagline }}</span>
      <a href="https://selarasui.my.id/" target="_blank" rel="noreferrer">
        Built with Selaras ↗
      </a>
    </footer>
  </main>
</template>
