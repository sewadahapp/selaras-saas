<script setup lang="ts">
import type { Task } from '~~/shared/utils/workspace'
defineProps<{ items: Task[] }>()
const { selectTask, selectedTaskId, setStatus } = useWorkspace()
</script>

<template>
  <SCard :ui="{ body: 'p-0' }">
    <div
      v-for="task in items"
      :key="task.id"
      class="task-row"
      :class="{
        'task-completed': task.status === 'Done',
        'task-selected': selectedTaskId === task.id,
      }"
    >
      <SCheckbox
        :model-value="task.status === 'Done'"
        :aria-label="`Complete ${task.title}`"
        @update:model-value="
          setStatus(task.id, $event === true ? 'Done' : 'To do')
        "
      />
      <SButton
        color="neutral"
        variant="link"
        class="task-name h-auto px-0 py-1"
        @click="selectTask(task.id)"
      >
        {{ task.title }}
      </SButton>
      <SBadge
        class="task-priority"
        :color="task.priority === 'High' ? 'warning' : 'neutral'"
        variant="outline"
        size="sm"
        :aria-label="`${task.priority} priority`"
      >
        {{ task.priority }}
      </SBadge>
      <SBadge
        class="task-status-badge"
        variant="soft"
        size="sm"
        :color="
          task.status === 'Done'
            ? 'success'
            : task.status === 'In progress'
              ? 'warning'
              : 'neutral'
        "
        dot
      >
        {{ task.status }}
      </SBadge>
      <SAvatar
        class="task-assignee"
        size="sm"
        :color="
          task.assignee === 'Maya'
            ? 'primary'
            : task.assignee === 'Alex'
              ? 'success'
              : 'warning'
        "
        :alt="task.assignee"
        :text="task.assignee.slice(0, 2).toUpperCase()"
      />
    </div>
    <SEmptyState
      v-if="!items.length"
      icon="hugeicons:checkmark-circle-01"
      title="A little breathing room."
      description="No tasks here. Create one or try another filter."
    />
  </SCard>
</template>
