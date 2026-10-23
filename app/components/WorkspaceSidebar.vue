<script setup lang="ts">
const emit = defineEmits<{ navigate: [] }>()
const { workspace, project, tasks, selectProject, projectDialog } =
  useWorkspace()
const route = useRoute()
const navigation = computed(() => [
  {
    label: 'Overview',
    to: '/',
    icon: 'hugeicons:dashboard-square-01',
    active: route.path === '/',
    onSelect: () => emit('navigate'),
  },
  {
    label: 'Tasks',
    to: '/tasks',
    icon: 'hugeicons:checkmark-square-02',
    active: route.path === '/tasks',
    slot: 'tasks',
    onSelect: () => emit('navigate'),
  },
  {
    label: 'Activity',
    to: '/activity',
    icon: 'hugeicons:notification-02',
    active: route.path === '/activity',
    onSelect: () => emit('navigate'),
  },
])
const projects = computed(() =>
  workspace.value.projects.map((item) => ({
    label: item.name,
    icon: 'hugeicons:folder-01',
    active: project.value.id === item.id,
    onSelect: () => {
      selectProject(item.id)
      emit('navigate')
    },
  })),
)
</script>

<template>
  <div class="sidebar-content">
    <div class="sidebar-section">
      <p class="section-label">WORKSPACE</p>
      <SNavigationMenu
        :items="navigation"
        orientation="vertical"
        color="neutral"
        aria-label="Workspace screens"
      >
        <template #tasks-trailing>
          <SBadge color="neutral" variant="soft" size="sm">
            {{ tasks.filter((t) => t.status !== 'Done').length }}
          </SBadge>
        </template>
      </SNavigationMenu>
    </div>
    <div class="sidebar-section">
      <div class="section-heading">
        <p class="section-label">PROJECTS</p>
        <SButton
          color="neutral"
          variant="ghost"
          size="sm"
          icon="hugeicons:add-01"
          aria-label="New project"
          @click="projectDialog = true"
        />
      </div>
      <SNavigationMenu
        :items="projects"
        orientation="vertical"
        color="neutral"
        aria-label="Projects"
      />
      <SButton
        color="neutral"
        variant="ghost"
        icon="hugeicons:add-01"
        block
        class="justify-start"
        @click="projectDialog = true"
      >
        Create a project
      </SButton>
    </div>
  </div>
</template>
