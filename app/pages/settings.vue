<script setup lang="ts">
const { workspace, ready, renameWorkspace, reset } = useWorkspace()
const name = ref(workspace.value.name)
watch(ready, () => {
  name.value = workspace.value.name
})
const resetDialog = ref(false)
useHead({ title: 'Workspace settings · Selaras' })
function resetDemo() {
  reset()
  name.value = workspace.value.name
  resetDialog.value = false
}
</script>

<template>
  <div class="settings-page">
    <SPageHeader
      title="A space that feels like you."
      description="A few small details to make this workspace yours."
      class="mb-7"
    />
    <SCard class="settings-card">
      <h2>Workspace details</h2>
      <p class="muted mb-5">The name your team will see in the sidebar.</p>
      <form class="form-stack" @submit.prevent="renameWorkspace(name)">
        <SFormField label="Workspace name" required>
          <SInput v-model="name" required maxlength="80" class="w-full" />
        </SFormField>
        <div>
          <SButton
            type="submit"
            size="sm"
            :disabled="!name.trim() || name.trim() === workspace.name"
          >
            Save changes
          </SButton>
        </div>
      </form>
    </SCard>
    <SCard class="settings-card">
      <h2>Make yourself comfortable</h2>
      <p class="muted mb-5">Choose the appearance that works for you.</p>
      <SColorModeSwitch label="Dark mode" />
    </SCard>
    <SCard class="settings-card">
      <h2>A fresh start</h2>
      <p class="muted mb-5">
        Restore the sample projects, tasks, and workspace name. This replaces
        your local demo changes.
      </p>
      <SButton
        color="neutral"
        variant="outline"
        size="sm"
        @click="resetDialog = true"
      >
        Reset demo workspace
      </SButton>
    </SCard>
    <SModal
      v-model:open="resetDialog"
      title="Start fresh?"
      description="This replaces your local projects, tasks, activity, and workspace name with the original sample data."
    >
      <template #footer>
        <SButton color="neutral" variant="ghost" @click="resetDialog = false">
          Keep my workspace
        </SButton>
        <SButton color="danger" @click="resetDemo">Reset workspace</SButton>
      </template>
    </SModal>
  </div>
</template>
