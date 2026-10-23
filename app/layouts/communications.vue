<script setup lang="ts">
import type { SDashboardSidebar } from '#components'
import ChatList from '~/components/chats/ChatList.vue'
import ChatMembers from '~/components/chats/ChatMembers.vue'
const route = useRoute()
const { selectedMail, selectedChat, storage, resetOpen, membersOpen } =
  useCommunications()
const isInbox = computed(() => route.path.replace(/\/+$/, '') === '/inbox')
const selected = computed(() =>
  isInbox.value ? selectedMail.value : selectedChat.value,
)
const sidebar = useTemplateRef<InstanceType<typeof SDashboardSidebar>>('list')
const collapsed = computed(() => sidebar.value?.isCollapsed ?? false)
const membersCollapsed = computed({
  get: () => !membersOpen.value,
  set: (value: boolean) => {
    membersOpen.value = !value && !!selectedChat.value
  },
})
const desktopMembers = ref(false)
let desktopQuery: MediaQueryList | undefined
function updateDesktop() {
  desktopMembers.value = desktopQuery?.matches ?? false
}
watch(
  () => selectedChat.value?.id,
  (id) => {
    if (!id) membersOpen.value = false
  },
)
const narrow = ref(false)
let mobileQuery: MediaQueryList | undefined
function updateNarrow() {
  narrow.value = mobileQuery?.matches ?? false
}
onMounted(() => {
  mobileQuery = window.matchMedia('(max-width: 767px)')
  updateNarrow()
  mobileQuery.addEventListener('change', updateNarrow)
  desktopQuery = window.matchMedia('(min-width: 1200px)')
  updateDesktop()
  desktopQuery.addEventListener('change', updateDesktop)
})
onBeforeUnmount(() => {
  mobileQuery?.removeEventListener('change', updateNarrow)
  desktopQuery?.removeEventListener('change', updateDesktop)
  membersOpen.value = false
})
</script>

<template>
  <AppShell>
    <SDashboardGroup
      :key="isInbox ? 'inbox' : 'chats'"
      class="workspace-body communications-body"
      :class="{ 'has-selection': !!selected }"
      :auto-save-id="`selaras-sass-${isInbox ? 'inbox' : 'chats'}-v1`"
      :mobile-breakpoint="0"
    >
      <SDashboardSidebar
        :id="isInbox ? 'inbox-message-list' : 'chat-conversation-list'"
        ref="list"
        class="communications-list-panel"
        role="complementary"
        :aria-label="isInbox ? 'Inbox messages' : 'Chat conversations'"
        :default-size="340"
        :min-size="280"
        :max-size="480"
        :collapsed-size="0"
        :ui="{ body: 'p-0' }"
        :inert="(collapsed && !narrow) || undefined"
      >
        <InboxList v-if="isInbox" />
        <ChatList v-else />
      </SDashboardSidebar>
      <SDashboardResizeHandle
        class="communications-resize-handle"
        :aria-label="
          isInbox ? 'Resize message list' : 'Resize conversation list'
        "
      />
      <SDashboardPanel class="communications-panel" :min-size="10">
        <SDashboardGroup
          :auto-save-id="
            isInbox
              ? 'selaras-sass-inbox-reader-v1'
              : 'selaras-sass-chat-members-v1'
          "
          :mobile-breakpoint="0"
        >
          <SDashboardPanel class="communication-content-panel" :min-size="10">
            <SDashboardNavbar :title="isInbox ? 'Inbox' : 'Chats'">
              <template #leading>
                <SButton
                  color="neutral"
                  variant="ghost"
                  size="sm"
                  icon="hugeicons:sidebar-left-01"
                  class="communications-list-toggle"
                  :aria-label="
                    isInbox ? 'Toggle message list' : 'Toggle conversation list'
                  "
                  :aria-expanded="!collapsed"
                  @click="sidebar?.toggle()"
                />
                <SButton
                  color="neutral"
                  variant="ghost"
                  size="sm"
                  icon="hugeicons:arrow-left-01"
                  class="communications-back"
                  :to="isInbox ? '/inbox' : '/chats'"
                  :aria-label="isInbox ? 'Back to inbox' : 'Back to chats'"
                />
              </template>
              <SBadge color="neutral" variant="soft" size="sm">
                Local demo
              </SBadge>
            </SDashboardNavbar>
            <main id="main" class="communications-main" tabindex="-1">
              <div
                v-if="storage !== 'saved'"
                class="communication-storage-notice"
              >
                <SAlert
                  color="warning"
                  variant="soft"
                  :title="
                    storage === 'invalid'
                      ? 'Saved messages could not be read. The original data is preserved; edits are session only.'
                      : 'Browser storage is unavailable. Messages will last for this session.'
                  "
                />
                <SButton
                  v-if="storage === 'invalid'"
                  color="neutral"
                  variant="link"
                  size="sm"
                  @click="resetOpen = true"
                >
                  Reset demo messages
                </SButton>
              </div>
              <slot />
            </main>
          </SDashboardPanel>
          <SDashboardResizeHandle
            v-if="!isInbox"
            class="chat-members-resize-handle"
            aria-label="Resize members sidebar"
          />
          <SDashboardSidebar
            v-if="!isInbox"
            id="chat-members-sidebar"
            v-model:collapsed="membersCollapsed"
            class="chat-members-sidebar"
            role="complementary"
            aria-label="Conversation members"
            :default-size="0"
            :min-size="240"
            :max-size="400"
            :collapsed-size="0"
            :ui="{ body: 'p-0' }"
            :inert="!membersOpen || undefined"
          >
            <ChatMembers show-close />
          </SDashboardSidebar>
        </SDashboardGroup>
      </SDashboardPanel>
    </SDashboardGroup>
    <SSlideover
      :open="membersOpen && !desktopMembers && !!selectedChat"
      side="right"
      title="Conversation members"
      @update:open="membersOpen = $event"
    >
      <template #body><ChatMembers /></template>
    </SSlideover>
  </AppShell>
</template>
