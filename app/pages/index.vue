<script setup lang="ts">
import { resources } from '~/data/navigation'
const { project, tasks, activity, progress, taskDialog } = useWorkspace()
useHead({ title: computed(() => `${project.value.name} · Selaras`) })
</script>

<template>
  <div class="page-overview">
    <SPageHeader
      :title="project.name"
      description="Good work starts with a shared space. Here's where we're at."
      class="mb-7"
    >
      <SButton
        icon="hugeicons:add-01"
        size="sm"
        class="self-start"
        @click="taskDialog = true"
      >
        New task
      </SButton>
    </SPageHeader>
    <SCard class="mb-7" :ui="{ body: 'project-summary' }">
      <SAvatar
        icon="hugeicons:folder-01"
        alt="Project"
        shape="rounded"
        color="primary"
        size="lg"
      />
      <div>
        <strong>One team. One shared direction.</strong>
        <p>{{ project.description }}</p>
      </div>
      <SAvatarGroup
        size="sm"
        class="project-team"
        aria-label="Project team: You, Maya, Alex"
      >
        <SAvatar text="YO" alt="You" color="warning" />
        <SAvatar text="MC" alt="Maya Chen" color="primary" />
        <SAvatar text="AM" alt="Alex Morgan" color="success" />
      </SAvatarGroup>
    </SCard>
    <section class="overview-section">
      <div class="section-heading">
        <h2>Everything in its place</h2>
        <NuxtLink to="/files" class="text-link">
          All files
          <span>↗</span>
        </NuxtLink>
      </div>
      <div class="resource-grid">
        <SCard
          v-for="resource in resources"
          :key="resource.id"
          class="resource-card"
          :ui="{ body: 'p-0' }"
        >
          <NuxtLink
            :to="{ path: '/files', query: { file: resource.id } }"
            class="block"
          >
            <div class="resource-preview" :class="resource.id">
              <template v-if="resource.id === 'brief'">
                <div class="paper-preview">
                  <span />
                  <span />
                  <span />
                  <span />
                  <span />
                </div>
              </template>
              <template v-else-if="resource.id === 'design'">
                <div class="design-preview">
                  <i />
                  <i />
                  <i />
                  <i />
                </div>
              </template>
              <template v-else>
                <div class="checklist-preview">
                  <span>
                    ✓
                    <i />
                  </span>
                  <span>
                    ✓
                    <i />
                  </span>
                  <span>
                    ○
                    <i />
                  </span>
                </div>
              </template>
              <span class="resource-preview-label">{{ resource.type }}</span>
            </div>
            <div class="resource-copy">
              <h3>
                {{ resource.title }}
                <SIcon name="hugeicons:arrow-up-right-01" />
              </h3>
              <p>{{ resource.description }}</p>
            </div>
          </NuxtLink>
        </SCard>
      </div>
    </section>
    <section class="overview-section">
      <div class="section-heading">
        <h2>Small steps, real progress</h2>
        <span class="muted text-xs">{{ progress }}% complete</span>
      </div>
      <SCard :ui="{ body: 'progress-card' }">
        <div>
          <span class="stat-number">
            {{ tasks.filter((t) => t.status !== 'Done').length }}
            <span>tasks to go</span>
          </span>
          <span class="progress-caption">A little closer, every day.</span>
        </div>
        <SProgress
          :model-value="progress"
          size="sm"
          aria-label="Project completion"
        />
        <div class="flex flex-wrap gap-2 mt-3">
          <SBadge color="success" variant="soft" size="sm" dot>
            {{ tasks.filter((t) => t.status === 'Done').length }} completed
          </SBadge>
          <SBadge color="warning" variant="soft" size="sm" dot>
            {{ tasks.filter((t) => t.status === 'In progress').length }} in
            progress
          </SBadge>
          <SBadge color="neutral" variant="soft" size="sm" dot>
            {{ tasks.filter((t) => t.status === 'To do').length }} to do
          </SBadge>
        </div>
      </SCard>
    </section>
    <section class="overview-section">
      <div class="section-heading">
        <h2>
          On the radar
          <SBadge color="neutral" variant="soft" size="sm">
            {{ tasks.filter((t) => t.status !== 'Done').length }}
          </SBadge>
        </h2>
        <NuxtLink to="/tasks" class="text-link">
          All tasks
          <span>↗</span>
        </NuxtLink>
      </div>
      <TaskList :items="tasks.filter((t) => t.status !== 'Done').slice(0, 4)" />
      <SButton
        color="neutral"
        variant="ghost"
        size="sm"
        class="add-task-row"
        @click="taskDialog = true"
      >
        <SIcon name="hugeicons:add-01" />
        Add a task
        <span>Make a little progress.</span>
      </SButton>
    </section>
    <SCard class="overview-section mb-7" :ui="{ body: 'recent-note' }">
      <SAvatar text="MC" alt="Maya Chen" color="primary" size="sm" />
      <div>
        <h3>A little momentum goes a long way.</h3>
        <p>{{ activity[0]?.text || 'Your next great idea belongs here.' }}</p>
        <NuxtLink to="/activity">
          Catch up on the project
          <span>→</span>
        </NuxtLink>
      </div>
      <span class="note-sparkle" aria-hidden="true">✳</span>
    </SCard>
  </div>
</template>
