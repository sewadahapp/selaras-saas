<script setup lang="ts">
import { applicationSections } from '~/data/navigation'
const route = useRoute()
const config = useAppConfig()
const palette = useCommandPalette()
const { unreadMail, unreadChat } = useCommunications()
const sectionPath = computed(() => route.path.replace(/\/+$/, ''))
const activeSection = computed(() =>
  sectionPath.value === '/inbox'
    ? '/inbox'
    : sectionPath.value === '/chats'
      ? '/chats'
      : sectionPath.value === '/settings'
        ? '/settings'
        : '/',
)
const navigation = computed(() => [
  ...applicationSections.map((item) => ({
    ...item,
    ariaLabel: item.label,
    active: activeSection.value === item.to,
    slot:
      item.to === '/inbox'
        ? 'inbox'
        : item.to === '/chats'
          ? 'chats'
          : undefined,
  })),
  {
    label: 'Search workspace',
    ariaLabel: 'Search workspace',
    icon: 'hugeicons:search-01',
    active: false,
    tooltip: { text: 'Search (Ctrl/⌘ K)' },
    onSelect: () => palette.open(),
  },
])
const accountNavigation = computed(() => [
  {
    label: 'Settings',
    ariaLabel: 'Settings',
    to: '/settings',
    icon: 'hugeicons:settings-01',
    active: activeSection.value === '/settings',
  },
  {
    label: 'Your account',
    ariaLabel: 'Your account',
    to: '/settings',
    slot: 'account',
    active: false,
  },
])
</script>

<template>
  <nav class="icon-rail" aria-label="Application">
    <NuxtLink to="/" class="rail-logo" :aria-label="config.workspace.product">
      <SelarasLogo mark />
    </NuxtLink>
    <SNavigationMenu
      :items="navigation"
      orientation="vertical"
      color="neutral"
      collapsed
      tooltip
      :ui="{ link: 'size-8', list: 'gap-2' }"
      aria-label="Application sections"
    >
      <template #inbox-trailing>
        <SBadge
          v-if="unreadMail"
          size="sm"
          color="primary"
          class="rail-unread"
          aria-hidden="true"
        >
          {{ unreadMail }}
        </SBadge>
      </template>
      <template #chats-trailing>
        <SBadge
          v-if="unreadChat"
          size="sm"
          color="primary"
          class="rail-unread"
          aria-hidden="true"
        >
          {{ unreadChat }}
        </SBadge>
      </template>
    </SNavigationMenu>
    <div class="rail-spacer" />
    <SColorModeToggle
      color="neutral"
      variant="ghost"
      aria-label="Toggle color mode"
    />
    <SNavigationMenu
      :items="accountNavigation"
      orientation="vertical"
      color="neutral"
      collapsed
      tooltip
      :ui="{ link: 'size-8', list: 'gap-2' }"
      aria-label="Account navigation"
    >
      <template #account-leading>
        <SAvatar text="YO" alt="You" color="warning" size="sm" />
      </template>
    </SNavigationMenu>
  </nav>
</template>
