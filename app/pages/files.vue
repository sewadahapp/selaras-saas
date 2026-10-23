<script setup lang="ts">
import { resources } from '~/data/navigation'
const { project } = useWorkspace()
const route = useRoute()
const openedId = ref<string | null>(null)
const opened = computed(() => resources.find((r) => r.id === openedId.value))
onMounted(() => {
  openedId.value =
    typeof route.query.file === 'string' ? route.query.file : null
})
watch(
  () => route.query.file,
  (value) => {
    openedId.value = typeof value === 'string' ? value : null
  },
)
const toast = useToast()
useHead({ title: 'Files · Selaras' })
function download() {
  if (!opened.value) return
  const url = URL.createObjectURL(
    new Blob(
      [
        `# ${project.value.name}: ${opened.value.title}\n\n${opened.value.body}\n`,
      ],
      { type: 'text/markdown;charset=utf-8' },
    ),
  )
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = `${opened.value.id}.md`
  anchor.click()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
  toast.add({ title: 'Document downloaded.', color: 'success' })
}
</script>

<template>
  <div>
    <SPageHeader
      title="The things we build on."
      :description="`A shared home for the thinking behind ${project.name.toLowerCase()}.`"
      class="mb-7"
    >
      <SBadge color="neutral" variant="soft" class="self-start">
        {{ resources.length }} starter documents
      </SBadge>
    </SPageHeader>
    <div class="file-grid">
      <SCard v-for="file in resources" :key="file.id" class="file-card">
        <span class="file-icon"><SIcon :name="file.icon" /></span>
        <SBadge color="neutral" variant="soft" size="sm">
          {{ file.type }}
        </SBadge>
        <h2>{{ file.title }}</h2>
        <p>{{ file.description }}</p>
        <SButton
          color="neutral"
          variant="link"
          trailing-icon="hugeicons:arrow-up-right-01"
          @click="openedId = file.id"
        >
          Open document
        </SButton>
      </SCard>
    </div>
    <SAlert
      color="neutral"
      variant="soft"
      icon="hugeicons:information-circle"
      description="These example documents are included in the starter. Preview them here or download a Markdown copy to make your own."
      class="mt-5"
    />
    <SModal
      :open="!!opened"
      :title="opened?.title"
      description="Starter document · Markdown preview"
      @update:open="
        (value) => {
          if (!value) openedId = null
        }
      "
    >
      <template #body>
        <pre class="document-preview">{{ opened?.body }}</pre>
      </template>
      <template #footer>
        <SButton color="neutral" variant="ghost" @click="openedId = null">
          Close
        </SButton>
        <SButton icon="hugeicons:download-01" @click="download">
          Download Markdown
        </SButton>
      </template>
    </SModal>
  </div>
</template>
