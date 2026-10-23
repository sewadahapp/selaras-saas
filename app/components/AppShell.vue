<script setup lang="ts">
import { applicationSections, projectTabs } from '~/data/navigation'
const workspace = useWorkspace()
const communications = useCommunications()
const config = useAppConfig()
const palette = useCommandPalette()
const route = useRoute()
const groups = computed(() => [
  {
    label: 'Application',
    items: [
      ...applicationSections,
      { label: 'Settings', to: '/settings', icon: 'hugeicons:settings-01' },
    ].map((item) => ({ ...item, onSelect: () => navigateTo(item.to) })),
  },
  {
    label: 'Current project',
    items: projectTabs.map((item) => ({
      ...item,
      onSelect: () => navigateTo(item.to),
    })),
  },
  {
    label: 'Projects',
    items: workspace.workspace.value.projects.map((item) => ({
      label: item.name,
      icon: 'hugeicons:folder-01',
      onSelect: () => {
        workspace.selectProject(item.id)
        return navigateTo('/')
      },
    })),
  },
])
const ready = computed(
  () => workspace.ready.value && communications.ready.value,
)
const saved = computed(
  () =>
    workspace.storage.value === 'saved' &&
    communications.storage.value === 'saved',
)
watch(() => route.fullPath, palette.close)
onMounted(() => {
  workspace.initialize()
  communications.initialize()
})
onBeforeUnmount(palette.close)
</script>

<template>
  <div class="workspace-shell">
    <a href="#main" class="skip-link">Skip to content</a>
    <ApplicationRail />
    <slot />
    <footer class="status-bar">
      <SBadge
        :color="!ready ? 'neutral' : saved ? 'success' : 'warning'"
        variant="soft"
        size="sm"
        dot
      >
        {{
          !ready
            ? 'Opening workspace…'
            : saved
              ? 'All changes saved locally'
              : 'Session only'
        }}
      </SBadge>
      <span class="status-shortcut">
        <SButton
          color="neutral"
          variant="link"
          size="sm"
          class="h-auto px-0 text-[10px]"
          @click="palette.open()"
        >
          <SKbd size="sm">⌘ / Ctrl K</SKbd>
          <span>Quick search</span>
        </SButton>
      </span>
      <span>
        {{ config.workspace.product }}
        <span class="version">v1.0</span>
        <a href="https://selarasui.my.id/" target="_blank" rel="noreferrer">
          Help & feedback ↗
        </a>
      </span>
    </footer>
    <SCommandPalette :groups="groups" />
    <CommunicationDialogs />
  </div>
</template>
