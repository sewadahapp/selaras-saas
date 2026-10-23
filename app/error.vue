<script setup lang="ts">
defineProps<{ error: { statusCode?: number } }>()
</script>

<template>
  <SApp>
    <div class="error-page">
      <span class="eyebrow">{{ error.statusCode || 500 }}</span>
      <h1>A small detour.</h1>
      <p>We couldn't open that page. Let's get you back to your workspace.</p>
      <SButton @click="clearError({ redirect: '/' })">
        Back to workspace
      </SButton>
    </div>
  </SApp>
</template>
