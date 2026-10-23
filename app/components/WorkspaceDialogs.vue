<script setup lang="ts">
import type { Task } from '~~/shared/utils/workspace'
const { taskDialog, projectDialog, project, addTask, addProject } =
  useWorkspace()
const title = ref('')
const priority = ref<Task['priority']>('Medium')
const projectName = ref('')
const description = ref('')
watch(taskDialog, (open) => {
  if (open) {
    title.value = ''
    priority.value = 'Medium'
  }
})
watch(projectDialog, (open) => {
  if (open) {
    projectName.value = ''
    description.value = ''
  }
})
function submitTask() {
  if (addTask(title.value, priority.value)) taskDialog.value = false
}
function submitProject() {
  if (addProject(projectName.value, description.value))
    projectDialog.value = false
}
</script>

<template>
  <SModal
    v-model:open="taskDialog"
    title="A new thing to do"
    :description="`Add a task to ${project.name}.`"
  >
    <template #body>
      <form id="task-form" class="form-stack" @submit.prevent="submitTask">
        <SFormField
          label="Task name"
          required
          :ui="{ required: { 'aria-hidden': true } }"
        >
          <SInput
            v-model="title"
            placeholder="What needs to happen?"
            maxlength="160"
            required
            class="w-full"
          />
        </SFormField>
        <SFormField label="Priority">
          <SSelect
            v-model="priority"
            :items="['Low', 'Medium', 'High']"
            class="w-full"
          />
        </SFormField>
      </form>
    </template>
    <template #footer>
      <SButton color="neutral" variant="ghost" @click="taskDialog = false">
        Cancel
      </SButton>
      <SButton type="submit" form="task-form" :disabled="!title.trim()">
        Create task
      </SButton>
    </template>
  </SModal>
  <SModal
    v-model:open="projectDialog"
    title="Room for a new idea"
    description="Every great project starts somewhere."
  >
    <template #body>
      <form
        id="project-form"
        class="form-stack"
        @submit.prevent="submitProject"
      >
        <SFormField
          label="Project name"
          required
          :ui="{ required: { 'aria-hidden': true } }"
        >
          <SInput
            v-model="projectName"
            placeholder="Your next big thing"
            maxlength="80"
            required
            class="w-full"
          />
        </SFormField>
        <SFormField label="Description">
          <STextarea
            v-model="description"
            placeholder="A little context for your team…"
            maxlength="400"
            class="w-full"
          />
        </SFormField>
      </form>
    </template>
    <template #footer>
      <SButton color="neutral" variant="ghost" @click="projectDialog = false">
        Cancel
      </SButton>
      <SButton
        type="submit"
        form="project-form"
        :disabled="!projectName.trim()"
      >
        Create project
      </SButton>
    </template>
  </SModal>
</template>
