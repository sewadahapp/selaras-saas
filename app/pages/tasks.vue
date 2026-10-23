<script setup lang="ts">
import { statuses, type TaskStatus } from '~~/shared/utils/workspace'
const { project, tasks, taskDialog } = useWorkspace()
const query = ref('')
const status = ref<TaskStatus | 'All tasks'>('All tasks')
const filtered = computed(() =>
  tasks.value.filter(
    (t) =>
      (status.value === 'All tasks' || t.status === status.value) &&
      t.title.toLowerCase().includes(query.value.toLowerCase()),
  ),
)
useHead({ title: computed(() => `Tasks · ${project.value.name} · Selaras`) })
</script>

<template>
  <div>
    <SPageHeader
      title="Let's move things forward."
      description="The small steps that make the big picture happen."
      class="mb-7"
    >
      <SButton
        icon="hugeicons:add-01"
        size="sm"
        class="self-start"
        @click="taskDialog = true"
      >
        New task
      </SButton>
    </SPageHeader>
    <div class="filter-bar">
      <SInput
        v-model="query"
        icon="hugeicons:search-01"
        placeholder="Find a task…"
        aria-label="Search tasks"
        clearable
      />
      <SSelect
        :model-value="status"
        :items="['All tasks', ...statuses]"
        aria-label="Filter tasks by status"
        class="w-40"
        @update:model-value="status = $event ?? 'All tasks'"
      />
      <span class="muted text-xs">{{ filtered.length }} tasks</span>
    </div>
    <div class="section-heading mb-4">
      <h2>{{ status }}</h2>
      <span class="muted text-xs">Select a task to see its details</span>
    </div>
    <TaskList :items="filtered" />
  </div>
</template>
