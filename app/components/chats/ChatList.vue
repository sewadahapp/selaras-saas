<script setup lang="ts">
import { initials } from '~~/shared/utils/communications'
const { data, selectedChat, chatSearch, newChatOpen, resetOpen, readChat } =
  useCommunications()
const conversations = computed(() =>
  [...data.value.conversations].filter((chat) =>
    chat.name.toLowerCase().includes(chatSearch.value.trim().toLowerCase()),
  ),
)
function openChat(id: string) {
  readChat(id)
  return navigateTo({ path: '/chats', query: { chat: id } })
}
</script>

<template>
  <div class="communication-list">
    <header class="communication-list-header">
      <div class="section-heading">
        <h1>Chats</h1>
        <SButton
          color="neutral"
          variant="ghost"
          size="sm"
          icon="hugeicons:bubble-chat-add"
          aria-label="New conversation"
          @click="newChatOpen = true"
        />
      </div>
      <p>Keep the conversation close to the work.</p>
      <SInput
        v-model="chatSearch"
        placeholder="Find a conversation…"
        aria-label="Search conversations"
        icon="hugeicons:search-01"
        clearable
        class="mt-4 w-full"
      />
    </header>
    <nav aria-label="Conversations" class="conversation-list">
      <section v-for="kind in ['channel', 'direct']" :key="kind">
        <p class="section-label px-5 pt-4 pb-2">
          {{ kind === 'channel' ? 'CHANNELS' : 'DIRECT MESSAGES' }}
        </p>
        <SButton
          v-for="chat in conversations.filter((item) => item.kind === kind)"
          :key="chat.id"
          color="neutral"
          :variant="selectedChat?.id === chat.id ? 'soft' : 'ghost'"
          block
          class="h-auto justify-start rounded-none px-5 py-4 text-left whitespace-normal"
          :aria-label="`Open conversation: ${chat.name}`"
          :aria-current="selectedChat?.id === chat.id ? 'true' : undefined"
          @click="openChat(chat.id)"
        >
          <SAvatar
            :icon="chat.kind === 'channel' ? 'hugeicons:hashtag' : undefined"
            :text="chat.kind === 'direct' ? initials(chat.name) : undefined"
            :alt="chat.name"
            :shape="chat.kind === 'channel' ? 'rounded' : 'circle'"
            size="sm"
            :color="chat.kind === 'channel' ? 'primary' : 'neutral'"
          />
          <span class="message-summary-copy">
            <span class="message-summary-top">
              <strong>{{ chat.name }}</strong>
              <SBadge v-if="chat.unread" color="primary" size="sm">
                {{ chat.unread }}
              </SBadge>
            </span>
            <span class="message-summary-preview">
              {{
                chat.draft
                  ? `Draft: ${chat.draft}`
                  : chat.messages.at(-1)?.body || 'Start the conversation.'
              }}
            </span>
          </span>
        </SButton>
      </section>
      <SEmptyState
        v-if="!conversations.length"
        icon="hugeicons:bubble-chat"
        title="No conversations found."
        description="Try a different name or start a conversation."
      />
    </nav>
    <div class="communication-list-footer">
      <span>Demo chats · saved locally</span>
      <SButton
        color="neutral"
        variant="link"
        size="sm"
        class="h-auto px-0 text-xs"
        @click="resetOpen = true"
      >
        Reset demo
      </SButton>
    </div>
  </div>
</template>
