<script setup lang="ts">
import { teammates } from '~~/shared/utils/communications'
const {
  composeOpen,
  newChatOpen,
  resetOpen,
  mailFilter,
  mailSearch,
  compose,
  startChat,
  reset,
} = useCommunications()
const route = useRoute()
const recipient = ref('')
const subject = ref('')
const body = ref('')
const teammate = ref<string | undefined>(teammates[0])
watch(composeOpen, (open) => {
  if (open) {
    recipient.value = ''
    subject.value = ''
    body.value = ''
  }
})
function submitMail() {
  const id = compose(recipient.value, subject.value, body.value)
  if (id) {
    mailFilter.value = 'sent'
    mailSearch.value = ''
    return navigateTo({ path: '/inbox', query: { mail: id } })
  }
}
function submitChat() {
  const id = teammate.value && startChat(teammate.value)
  if (id) {
    newChatOpen.value = false
    return navigateTo({ path: '/chats', query: { chat: id } })
  }
}
function resetDemo() {
  reset()
  mailFilter.value = 'all'
  mailSearch.value = ''
  resetOpen.value = false
  return navigateTo(route.path)
}
</script>

<template>
  <SModal
    v-model:open="composeOpen"
    title="New message"
    description="Local demo · messages are saved to Sent in this browser."
  >
    <template #body>
      <form id="compose-mail" class="form-stack" @submit.prevent="submitMail">
        <SFormField
          label="To"
          required
          :ui="{ required: { 'aria-hidden': true } }"
        >
          <SInput
            v-model="recipient"
            type="email"
            required
            maxlength="254"
            placeholder="name@example.com"
            class="w-full"
          />
        </SFormField>
        <SFormField
          label="Subject"
          required
          :ui="{ required: { 'aria-hidden': true } }"
        >
          <SInput
            v-model="subject"
            required
            maxlength="160"
            placeholder="A little context…"
            class="w-full"
          />
        </SFormField>
        <SFormField
          label="Message"
          required
          :ui="{ required: { 'aria-hidden': true } }"
        >
          <STextarea
            v-model="body"
            required
            maxlength="10000"
            :rows="6"
            placeholder="What would you like to share?"
            class="w-full"
          />
        </SFormField>
      </form>
    </template>
    <template #footer>
      <SButton color="neutral" variant="ghost" @click="composeOpen = false">
        Cancel
      </SButton>
      <SButton
        type="submit"
        form="compose-mail"
        icon="hugeicons:sent"
        :disabled="!recipient.trim() || !subject.trim() || !body.trim()"
      >
        Save to Sent
      </SButton>
    </template>
  </SModal>
  <SModal
    v-model:open="newChatOpen"
    title="Start a conversation"
    description="Choose a teammate from the demo workspace."
  >
    <template #body>
      <form id="new-chat" @submit.prevent="submitChat">
        <SFormField
          label="Teammate"
          required
          :ui="{ required: { 'aria-hidden': true } }"
        >
          <SSelect
            v-model="teammate"
            :items="teammates"
            required
            class="w-full"
          />
        </SFormField>
      </form>
    </template>
    <template #footer>
      <SButton color="neutral" variant="ghost" @click="newChatOpen = false">
        Cancel
      </SButton>
      <SButton type="submit" form="new-chat" :disabled="!teammate">
        Open conversation
      </SButton>
    </template>
  </SModal>
  <SModal
    v-model:open="resetOpen"
    title="Reset demo messages?"
    description="This replaces your local emails, replies, conversations, messages, and drafts with the original examples. Projects and tasks are kept."
  >
    <template #footer>
      <SButton color="neutral" variant="ghost" @click="resetOpen = false">
        Cancel
      </SButton>
      <SButton color="danger" @click="resetDemo">Reset messages</SButton>
    </template>
  </SModal>
</template>
