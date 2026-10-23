<script setup lang="ts">
import { initials } from '~~/shared/utils/communications'
const { selectedChat: chat, membersOpen } = useCommunications()
defineProps<{ showClose?: boolean }>()
</script>

<template>
  <section v-if="chat" class="chat-members-content">
    <div class="section-heading mb-6">
      <h2>Members</h2>
      <div class="flex items-center gap-2">
        <SBadge color="neutral" variant="soft" size="sm">
          {{ chat.members.length }}
        </SBadge>
        <SButton
          v-if="showClose"
          color="neutral"
          variant="ghost"
          size="sm"
          icon="hugeicons:cancel-01"
          aria-label="Close members sidebar"
          @click="membersOpen = false"
        />
      </div>
    </div>
    <p class="font-medium break-words">{{ chat.name }}</p>
    <p class="muted text-xs mt-1 mb-6">
      {{ chat.members.length }} people in this conversation
    </p>
    <ul class="grid gap-5" aria-label="Conversation members">
      <li
        v-for="member in chat.members"
        :key="member"
        class="flex items-center gap-3 min-w-0"
      >
        <SAvatar :text="initials(member)" :alt="member" size="sm" />
        <span class="break-words min-w-0">{{ member }}</span>
      </li>
    </ul>
  </section>
</template>
