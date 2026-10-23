<script setup lang="ts">
import {
  initials,
  messageDate,
  messageTime,
} from '~~/shared/utils/communications'
definePageMeta({ layout: 'communications' })
const {
  ready,
  selectedChat: chat,
  newChatOpen,
  membersOpen,
  readChat,
  draftChat,
  sendChat,
} = useCommunications()
const end = useTemplateRef('end')
useHead({
  title: computed(() =>
    chat.value ? `${chat.value.name} · Chats · Selaras` : 'Chats · Selaras',
  ),
})
watch(
  [ready, () => chat.value?.id],
  () => {
    if (ready.value && chat.value) readChat(chat.value.id)
  },
  { immediate: true },
)
watch(
  () => [chat.value?.id, chat.value?.messages.length],
  async () => {
    await nextTick()
    end.value?.scrollIntoView({ block: 'nearest' })
  },
)
const draft = computed({
  get: () => chat.value?.draft ?? '',
  set: (value) => {
    if (chat.value) draftChat(chat.value.id, value)
  },
})
function send() {
  if (chat.value) sendChat(chat.value.id)
}
</script>

<template>
  <div v-if="chat" class="chat-reader">
    <SDashboardNavbar :ui="{ root: 'h-auto py-5', left: 'flex-1' }">
      <template #leading>
        <SAvatar
          :icon="chat.kind === 'channel' ? 'hugeicons:hashtag' : undefined"
          :text="chat.kind === 'direct' ? initials(chat.name) : undefined"
          :alt="chat.name"
          color="primary"
          :shape="chat.kind === 'channel' ? 'rounded' : 'circle'"
        />
      </template>
      <template #title>
        <div>
          <h1>{{ chat.name }}</h1>
          <p>
            {{
              chat.kind === 'channel'
                ? 'A shared space for the work and everything around it.'
                : 'Direct conversation'
            }}
          </p>
        </div>
      </template>
      <SButton
        color="neutral"
        :variant="membersOpen ? 'soft' : 'ghost'"
        size="sm"
        icon="hugeicons:user-group"
        aria-label="View conversation members"
        :aria-expanded="membersOpen"
        class="shrink-0"
        @click="membersOpen = !membersOpen"
      />
    </SDashboardNavbar>
    <section
      class="chat-history"
      aria-label="Conversation history"
      role="log"
      aria-live="polite"
      aria-relevant="additions text"
    >
      <p class="chat-history-intro">
        {{
          chat.kind === 'channel'
            ? `This is the beginning of #${chat.name.toLowerCase().replace(/\s+/g, '-')}.`
            : `Your conversation with ${chat.name}.`
        }}
      </p>
      <article
        v-for="message in chat.messages"
        :key="message.id"
        class="chat-message"
        :class="{ 'own-message': message.author === 'You' }"
      >
        <SAvatar
          :text="initials(message.author)"
          :alt="message.author"
          size="sm"
          :color="message.author === 'You' ? 'warning' : 'primary'"
        />
        <div class="chat-message-content">
          <div class="chat-message-meta">
            <strong>{{ message.author }}</strong>
            <time :datetime="message.date">
              {{ messageDate(message.date) }} ·
              {{ messageTime(message.date) }} UTC
            </time>
          </div>
          <SCard
            :variant="message.author === 'You' ? 'soft' : 'outline'"
            :ui="{ body: 'px-4 py-3' }"
          >
            <p>{{ message.body }}</p>
          </SCard>
        </div>
      </article>
      <SEmptyState
        v-if="!chat.messages.length"
        icon="hugeicons:bubble-chat"
        title="Say a little hello."
        description="This conversation is ready for its first message."
      />
      <div ref="end" aria-hidden="true" />
    </section>
    <form
      class="chat-composer"
      @submit.prevent="send"
      @keydown.ctrl.enter.prevent="send"
      @keydown.meta.enter.prevent="send"
    >
      <SFormField label="Message" :ui="{ label: 'sr-only' }">
        <STextarea
          v-model="draft"
          :placeholder="`Message ${chat.name}…`"
          :rows="3"
          maxlength="5000"
          class="w-full"
          :disabled="!ready"
          required
        />
      </SFormField>
      <div class="composer-actions">
        <small>Saved in this browser · ⌘ / Ctrl Enter to send</small>
        <SButton
          type="submit"
          size="sm"
          icon="hugeicons:sent"
          :disabled="!ready || !draft.trim()"
        >
          Send message
        </SButton>
      </div>
    </form>
  </div>
  <div v-else class="communication-empty">
    <SEmptyState
      icon="hugeicons:bubble-chat"
      title="Good work starts with a conversation."
      description="Pick a channel or teammate from the sidebar to get started."
    >
      <template #actions>
        <SButton icon="hugeicons:bubble-chat-add" @click="newChatOpen = true">
          New conversation
        </SButton>
      </template>
    </SEmptyState>
  </div>
</template>
