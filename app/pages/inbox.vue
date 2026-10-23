<script setup lang="ts">
import {
  initials,
  messageDate,
  messageTime,
} from '~~/shared/utils/communications'
definePageMeta({ layout: 'communications' })
const {
  ready,
  selectedMail: mail,
  composeOpen,
  readMail,
  starMail,
  moveMail,
  draftReply,
  reply,
} = useCommunications()
useHead({
  title: computed(() =>
    mail.value ? `${mail.value.subject} · Inbox · Selaras` : 'Inbox · Selaras',
  ),
})
watch(
  [ready, () => mail.value?.id],
  () => {
    if (ready.value && mail.value) readMail(mail.value.id)
  },
  { immediate: true },
)
const draft = computed({
  get: () => mail.value?.draft ?? '',
  set: (value) => {
    if (mail.value) draftReply(mail.value.id, value)
  },
})
</script>

<template>
  <div v-if="mail" class="mail-reader">
    <SToolbar color="neutral" aria-label="Message actions" class="mail-toolbar">
      <SBadge color="neutral" variant="soft" size="sm">
        {{ mail.folder === 'inbox' ? 'Message' : mail.folder }}
      </SBadge>
      <div class="flex flex-wrap items-center gap-1 ml-auto">
        <SToolbarButton
          color="neutral"
          :variant="mail.starred ? 'soft' : 'ghost'"
          size="sm"
          icon="hugeicons:star"
          :aria-label="mail.starred ? 'Unstar message' : 'Star message'"
          :pressed="mail.starred"
          @click="starMail(mail.id)"
        />
        <SToolbarButton
          v-if="mail.folder === 'inbox'"
          color="neutral"
          variant="ghost"
          size="sm"
          icon="hugeicons:archive-01"
          aria-label="Archive message"
          title="Archive"
          @click="moveMail(mail.id, 'archived')"
        />
        <SToolbarButton
          v-if="mail.folder === 'archived' || mail.folder === 'trash'"
          color="neutral"
          variant="ghost"
          size="sm"
          icon="hugeicons:archive-restore"
          aria-label="Restore to inbox"
          @click="moveMail(mail.id, 'inbox')"
        />
        <SToolbarButton
          v-if="mail.folder === 'inbox'"
          color="neutral"
          variant="ghost"
          size="sm"
          icon="hugeicons:mail-01"
          :aria-label="mail.unread ? 'Mark as read' : 'Mark as unread'"
          :title="mail.unread ? 'Mark as read' : 'Mark as unread'"
          @click="readMail(mail.id, !mail.unread)"
        />
        <SToolbarButton
          v-if="mail.folder !== 'trash'"
          color="neutral"
          variant="ghost"
          size="sm"
          icon="hugeicons:delete-02"
          aria-label="Move to trash"
          title="Move to trash"
          @click="moveMail(mail.id, 'trash')"
        />
      </div>
    </SToolbar>
    <div class="mail-content">
      <SPageHeader :title="mail.subject" class="mb-6" />
      <div class="mail-sender">
        <SAvatar :text="initials(mail.name)" :alt="mail.name" color="primary" />
        <div>
          <strong>{{ mail.name }}</strong>
          <small>
            {{ mail.email }}
            <span class="mx-1">→</span>
            {{ mail.to }}
          </small>
        </div>
        <time :datetime="mail.date">
          {{ messageDate(mail.date) }} · {{ messageTime(mail.date) }} UTC
        </time>
      </div>
      <div class="mail-body">{{ mail.body }}</div>
      <SCard
        v-for="item in mail.replies"
        :key="item.id"
        variant="soft"
        class="mail-reply"
      >
        <div class="flex items-center gap-2 mb-4">
          <SAvatar text="YO" alt="You" size="sm" color="warning" />
          <strong>You</strong>
          <time :datetime="item.date" class="ml-auto muted text-xs">
            {{ messageDate(item.date) }} · {{ messageTime(item.date) }} UTC
          </time>
        </div>
        <p class="whitespace-pre-wrap break-words">{{ item.body }}</p>
      </SCard>
      <SCard
        v-if="mail.folder !== 'trash'"
        class="reply-composer"
        :ui="{ header: 'flex items-center gap-2' }"
      >
        <template #header>
          <SIcon name="hugeicons:arrow-turn-backward" class="size-4" />
          <span>
            Reply to {{ mail.folder === 'sent' ? mail.to : mail.name }}
          </span>
        </template>
        <form class="form-stack" @submit.prevent="reply(mail.id)">
          <SFormField label="Reply" :ui="{ label: 'sr-only' }">
            <STextarea
              v-model="draft"
              placeholder="Write a thoughtful reply…"
              :rows="4"
              maxlength="10000"
              required
              class="w-full"
              :disabled="!ready"
            />
          </SFormField>
          <div class="composer-actions">
            <small>Draft saved locally · no email is sent</small>
            <SButton
              type="submit"
              size="sm"
              icon="hugeicons:sent"
              :disabled="!ready || !draft.trim()"
            >
              Send reply
            </SButton>
          </div>
        </form>
      </SCard>
    </div>
  </div>
  <div v-else class="communication-empty">
    <SEmptyState
      icon="hugeicons:inbox"
      title="A little space to catch up."
      description="Choose a message from your inbox, or start a new conversation by email."
    >
      <template #actions>
        <SButton icon="hugeicons:mail-add-01" @click="composeOpen = true">
          New message
        </SButton>
      </template>
    </SEmptyState>
  </div>
</template>
