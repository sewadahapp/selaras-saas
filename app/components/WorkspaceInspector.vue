<script setup lang="ts">
import { statuses } from '~~/shared/utils/workspace'
const {
  project,
  tasks,
  progress,
  activity,
  selectedTask,
  selectedTaskId,
  setStatus,
} = useWorkspace()
</script>

<template>
  <div class="inspector-content">
    <div class="inspector-heading">
      <h2>{{ selectedTask ? 'Task details' : 'Project details' }}</h2>
      <SButton
        v-if="selectedTask"
        color="neutral"
        variant="ghost"
        size="sm"
        icon="hugeicons:cancel-01"
        aria-label="Back to project details"
        @click="selectedTaskId = null"
      />
      <SIcon v-else name="hugeicons:information-circle" class="muted" />
    </div>
    <template v-if="selectedTask">
      <div class="inspector-section">
        <small>{{ selectedTask.id }}</small>
        <h3 class="selected-task-title">{{ selectedTask.title }}</h3>
        <SFormField label="Status">
          <SSelect
            :model-value="selectedTask.status"
            :items="statuses"
            class="w-full"
            @update:model-value="$event && setStatus(selectedTask.id, $event)"
          />
        </SFormField>
      </div>
      <dl class="property-list inspector-section">
        <div>
          <dt>Assignee</dt>
          <dd>
            <SAvatar
              :text="selectedTask.assignee.slice(0, 2).toUpperCase()"
              :alt="selectedTask.assignee"
              size="sm"
            />
            {{ selectedTask.assignee }}
          </dd>
        </div>
        <div>
          <dt>Priority</dt>
          <dd>{{ selectedTask.priority }}</dd>
        </div>
        <div>
          <dt>Project</dt>
          <dd>{{ project.name }}</dd>
        </div>
      </dl>
    </template>
    <template v-else>
      <div class="inspector-section">
        <p class="section-label">ABOUT THIS PROJECT</p>
        <p class="inspector-description">{{ project.description }}</p>
        <dl class="property-list">
          <div>
            <dt>Status</dt>
            <dd>
              <SBadge color="warning" variant="soft" size="sm" dot>
                In progress
              </SBadge>
            </dd>
          </div>
          <div>
            <dt>Lead</dt>
            <dd>
              <SAvatar text="YO" alt="You" size="sm" color="warning" />
              You
            </dd>
          </div>
          <div>
            <dt>Team</dt>
            <dd>Design & development</dd>
          </div>
        </dl>
      </div>
      <div class="inspector-section">
        <div class="section-heading">
          <h3>Project progress</h3>
          <span class="muted text-xs">{{ progress }}%</span>
        </div>
        <SProgress
          :model-value="progress"
          size="sm"
          aria-label="Project completion"
          class="mt-3"
        />
        <small class="mt-2">
          {{ tasks.filter((t) => t.status === 'Done').length }} of
          {{ tasks.length }} tasks completed
        </small>
      </div>
      <div class="inspector-section">
        <div class="section-heading">
          <h3>The team</h3>
          <span class="muted text-xs">3 people</span>
        </div>
        <div
          v-for="member in [
            {
              name: 'You',
              role: 'Project lead',
              initials: 'YO',
              color: 'warning',
            },
            {
              name: 'Maya Chen',
              role: 'Product designer',
              initials: 'MC',
              color: 'primary',
            },
            {
              name: 'Alex Morgan',
              role: 'Developer',
              initials: 'AM',
              color: 'success',
            },
          ]"
          :key="member.name"
          class="team-member"
        >
          <SAvatar
            :text="member.initials"
            :alt="member.name"
            :color="member.color"
            size="sm"
            status
            status-color="success"
          />
          <span>
            <strong>{{ member.name }}</strong>
            <small>{{ member.role }}</small>
          </span>
        </div>
      </div>
    </template>
    <div class="inspector-section">
      <div class="section-heading">
        <h3>Latest updates</h3>
        <NuxtLink to="/activity" class="muted text-xs">View all ↗</NuxtLink>
      </div>
      <STimeline
        v-if="activity.length"
        :items="
          activity
            .slice(0, 3)
            .map((item) => ({
              id: item.id,
              title: item.text,
              datetime: item.date,
              date: new Date(item.date).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                timeZone: 'UTC',
              }),
            }))
        "
        size="sm"
        color="neutral"
        class="mt-4"
      />
      <p v-if="!activity.length" class="muted text-xs mt-4">
        Your project's story starts here.
      </p>
    </div>
    <div class="inspector-tip">
      <SIcon name="hugeicons:bulb" />
      <p>
        Great things happen
        <br >
        one small task at a time.
      </p>
    </div>
  </div>
</template>
