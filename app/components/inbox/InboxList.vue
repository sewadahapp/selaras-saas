<script setup lang="ts">
import {
  filterMails,
  initials,
  mailFilters,
  messageDate,
} from '~~/shared/utils/communications'
const {
  data,
  selectedMail,
  unreadMail,
  mailFilter,
  mailSearch,
  composeOpen,
  resetOpen,
  readMail,
} = useCommunications()
const visible = computed(() =>
  filterMails(data.value.mails, mailFilter.value, mailSearch.value),
)
function openMail(id: string) {
  readMail(id)
  return navigateTo({ path: '/inbox', query: { mail: id } })
}
function changeFilter() {
  return navigateTo('/inbox')
}
</script>

<template>
  <div class="communication-list">
    <header class="communication-list-header">
      <div class="section-heading">
        <h1>Inbox</h1>
        <div class="flex items-center gap-2">
          <SBadge color="neutral" variant="soft" size="sm">
            {{ unreadMail }} unread
          </SBadge>
          <SButton
            icon="hugeicons:mail-add-01"
            color="neutral"
            variant="ghost"
            size="sm"
            aria-label="Compose message"
            @click="composeOpen = true"
          />
        </div>
      </div>
      <p>A little clarity for your conversations.</p>
      <SInput
        v-model="mailSearch"
        placeholder="Search messages…"
        aria-label="Search messages"
        icon="hugeicons:search-01"
        clearable
        class="mt-4 w-full"
      />
    </header>
    <STabs
      v-model="mailFilter"
      :items="mailFilters"
      color="neutral"
      scrollable
      :ui="{ list: { 'aria-label': 'Inbox filters' }, content: 'p-0' }"
      @update:model-value="changeFilter"
    >
      <template
        v-for="filter in mailFilters"
        :key="filter.value"
        #[filter.value]
      >
        <nav
          v-if="mailFilter === filter.value"
          aria-label="Messages"
          class="message-list"
        >
          <SButton
            v-for="mail in visible"
            :key="mail.id"
            color="neutral"
            :variant="selectedMail?.id === mail.id ? 'soft' : 'ghost'"
            block
            class="message-summary h-auto justify-start rounded-none px-5 py-4 text-left whitespace-normal"
            :aria-label="`Open message: ${mail.subject}`"
            :aria-current="selectedMail?.id === mail.id ? 'true' : undefined"
            @click="openMail(mail.id)"
          >
            <SAvatar
              :text="initials(mail.name)"
              :alt="mail.name"
              size="sm"
              :color="mail.unread ? 'primary' : 'neutral'"
            />
            <span class="message-summary-copy">
              <span class="message-summary-top">
                <strong>
                  {{ mail.folder === 'sent' ? mail.to : mail.name }}
                </strong>
                <time :datetime="mail.date">{{ messageDate(mail.date) }}</time>
              </span>
              <span
                class="message-summary-subject"
                :class="{ 'font-semibold': mail.unread }"
              >
                {{ mail.subject }}
              </span>
              <span class="message-summary-preview">{{ mail.body }}</span>
              <span
                v-if="mail.unread || mail.starred"
                class="flex items-center gap-2 mt-1"
              >
                <SBadge
                  v-if="mail.unread"
                  color="primary"
                  variant="soft"
                  size="sm"
                >
                  Unread
                </SBadge>
                <SIcon
                  v-if="mail.starred"
                  name="hugeicons:star"
                  class="size-3 text-[var(--selaras-resolved-color-warning-text)]"
                />
              </span>
            </span>
          </SButton>
          <SEmptyState
            v-if="!visible.length"
            icon="hugeicons:inbox-check"
            title="All clear."
            description="No messages match this view."
          />
        </nav>
      </template>
    </STabs>
    <div class="communication-list-footer">
      <span>Demo inbox · saved locally</span>
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
