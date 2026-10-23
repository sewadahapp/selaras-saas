<script setup lang="ts">
const { activity } = useWorkspace()
const updates = computed(() =>
  activity.value.map((item) => ({
    id: item.id,
    title: item.text,
    datetime: item.date,
    date:
      new Date(item.date).toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        timeZone: 'UTC',
      }) + ' UTC',
  })),
)
useHead({ title: 'Activity · Selaras' })
</script>

<template>
  <div>
    <SPageHeader
      title="A little more momentum."
      description="Keep up with the work, without another meeting."
      class="mb-7"
    >
      <SBadge color="neutral" variant="soft" class="self-start">
        {{ activity.length }} updates
      </SBadge>
    </SPageHeader>
    <div class="mb-7">
      <STimeline v-if="updates.length" :items="updates" size="sm" />
      <SEmptyState
        v-if="!activity.length"
        title="A fresh start."
        description="Create a task to get your project's story going."
      />
    </div>
  </div>
</template>
