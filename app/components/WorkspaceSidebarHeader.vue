<script setup lang="ts">
const { workspace } = useWorkspace()
</script>

<template>
  <div class="sidebar-header-content">
    <div class="workspace-identity">
      <strong>{{ workspace.name }}</strong>
      <SBadge color="neutral" variant="soft" size="sm">Pro</SBadge>
    </div>
  </div>
</template>
