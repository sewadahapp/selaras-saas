<script setup lang="ts">
import type { SDashboardSidebar } from '#components'
import { projectTabs } from '~/data/navigation'
const { project, inspectorOpen } = useWorkspace()
const route = useRoute()
const tabs = projectTabs.map((tab) => ({
  label: tab.label,
  icon: tab.icon,
  value: tab.to,
}))
const activeTab = computed({
  get: () => route.path.replace(/\/+$/, '') || '/',
  set: (value: string) => {
    if (tabs.some((tab) => tab.value === value) && value !== activeTab.value)
      void navigateTo(value)
  },
})
const palette = useCommandPalette()
const sidebarOpen = ref(false)
const sidebar =
  useTemplateRef<InstanceType<typeof SDashboardSidebar>>('sidebar')
const inspector =
  useTemplateRef<InstanceType<typeof SDashboardSidebar>>('inspector')
// Read the component state so restored cookie layouts also update the controls.
const sidebarCollapsed = computed(() => sidebar.value?.isCollapsed ?? false)
const inspectorCollapsed = computed(() => inspector.value?.isCollapsed ?? false)
function openInspector() {
  if (window.matchMedia('(min-width: 1200px)').matches) {
    inspector.value?.expand()
    inspectorOpen.value = false
  }
}
watch(inspectorOpen, (open) => {
  if (open) openInspector()
})
watch(
  () => route.path,
  () => {
    sidebarOpen.value = false
    inspectorOpen.value = false
    palette.close()
  },
)
let desktopNavigation: MediaQueryList | undefined
let desktopInspector: MediaQueryList | undefined
function syncOverlays() {
  if (desktopNavigation?.matches) sidebarOpen.value = false
  if (desktopInspector?.matches && inspectorOpen.value) openInspector()
}
onMounted(() => {
  desktopNavigation = window.matchMedia('(min-width: 768px)')
  desktopInspector = window.matchMedia('(min-width: 1200px)')
  desktopNavigation.addEventListener('change', syncOverlays)
  desktopInspector.addEventListener('change', syncOverlays)
})
onBeforeUnmount(() => {
  palette.close()
  desktopNavigation?.removeEventListener('change', syncOverlays)
  desktopInspector?.removeEventListener('change', syncOverlays)
})
</script>

<template>
  <AppShell>
    <!-- Retain split-panel state across breakpoints; slideovers below own the mobile edges. -->
    <SDashboardGroup
      class="workspace-body"
      auto-save-id="selaras-sass-navigation-v1"
      :mobile-breakpoint="0"
    >
      <SDashboardSidebar
        ref="sidebar"
        class="workspace-sidebar"
        role="complementary"
        aria-label="Workspace navigation"
        :default-size="240"
        :min-size="200"
        :max-size="360"
        :collapsed-size="0"
        :ui="{ header: 'p-3', body: 'p-0', footer: 'border-t-0 p-3' }"
        :inert="sidebarCollapsed || undefined"
      >
        <template #header><WorkspaceSidebarHeader /></template>
        <WorkspaceSidebar />
        <template #footer><WorkspaceSidebarFooter /></template>
      </SDashboardSidebar>
      <SDashboardResizeHandle
        class="navigation-resize-handle"
        aria-label="Resize workspace sidebar"
      />
      <SDashboardPanel class="workspace-content-panel" :min-size="10">
        <!-- A separate group gives the right sidebar its own toggle and layout cookie. -->
        <SDashboardGroup
          auto-save-id="selaras-sass-inspector-v1"
          :mobile-breakpoint="0"
        >
          <SDashboardPanel class="workspace-center" :min-size="10">
            <SDashboardNavbar :ui="{ left: 'flex-1' }">
              <template #leading>
                <SButton
                  color="neutral"
                  variant="ghost"
                  size="sm"
                  class="desktop-toggle"
                  :aria-expanded="!sidebarCollapsed"
                  aria-label="Toggle workspace sidebar"
                  icon="hugeicons:sidebar-left-01"
                  @click="sidebar?.toggle()"
                />
                <SButton
                  color="neutral"
                  variant="ghost"
                  size="sm"
                  class="mobile-toggle"
                  aria-label="Open navigation"
                  icon="hugeicons:menu-01"
                  @click="sidebarOpen = true"
                />
                <SBreadcrumb
                  :items="[
                    { label: 'Projects', to: '/' },
                    {
                      label:
                        route.path === '/settings' ? 'Settings' : project.name,
                    },
                  ]"
                  color="neutral"
                  truncate
                  class="workspace-breadcrumb min-w-0"
                />
              </template>
              <SBadge
                color="neutral"
                variant="soft"
                size="sm"
                class="demo-badge"
              >
                Demo workspace
              </SBadge>
              <SButton
                color="neutral"
                variant="ghost"
                size="sm"
                aria-label="Search"
                icon="hugeicons:search-01"
                @click="palette.open()"
              />
              <SButton
                color="neutral"
                variant="ghost"
                size="sm"
                class="desktop-details-toggle"
                :aria-expanded="!inspectorCollapsed"
                aria-label="Toggle project details"
                icon="hugeicons:sidebar-right-01"
                @click="inspector?.toggle()"
              />
              <SButton
                color="neutral"
                variant="ghost"
                size="sm"
                class="mobile-details-toggle"
                aria-label="Open project details"
                icon="hugeicons:sidebar-right-01"
                @click="inspectorOpen = true"
              />
            </SDashboardNavbar>
            <STabs
              v-if="tabs.some((tab) => tab.value === activeTab)"
              v-model="activeTab"
              :items="tabs"
              scrollable
              :ui="{
                root: 'flex min-h-0 flex-1 flex-col',
                scrollRoot: 'shrink-0 px-6 pt-2',
                list: { 'aria-label': 'Project tabs' },
                content:
                  'min-h-0 flex-1 p-0 data-[state=active]:flex data-[state=active]:flex-col',
              }"
            >
              <template v-for="tab in tabs" :key="tab.value" #[tab.value]>
                <WorkspacePageContent v-if="activeTab === tab.value">
                  <slot />
                </WorkspacePageContent>
              </template>
            </STabs>
            <WorkspacePageContent v-else><slot /></WorkspacePageContent>
          </SDashboardPanel>
          <SDashboardResizeHandle
            class="inspector-resize-handle"
            aria-label="Resize project inspector"
          />
          <SDashboardSidebar
            ref="inspector"
            class="workspace-inspector"
            role="complementary"
            aria-label="Project details"
            :default-size="280"
            :min-size="220"
            :max-size="400"
            :collapsed-size="0"
            :ui="{ body: 'p-0' }"
            :inert="inspectorCollapsed || undefined"
          >
            <WorkspaceInspector />
          </SDashboardSidebar>
        </SDashboardGroup>
      </SDashboardPanel>
    </SDashboardGroup>
    <SSlideover
      v-model:open="sidebarOpen"
      side="left"
      title="Your workspace"
      :ui="{
        body: 'min-h-0 flex-1 overflow-y-auto p-0',
        footer: 'block shrink-0 p-3',
      }"
    >
      <template #body>
        <WorkspaceSidebarHeader />
        <WorkspaceSidebar @navigate="sidebarOpen = false" />
      </template>
      <template #footer>
        <WorkspaceSidebarFooter />
      </template>
    </SSlideover>
    <SSlideover v-model:open="inspectorOpen" title="Project inspector">
      <template #body><WorkspaceInspector /></template>
    </SSlideover>
    <WorkspaceDialogs />
  </AppShell>
</template>
