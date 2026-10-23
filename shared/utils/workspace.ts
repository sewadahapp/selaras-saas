export type TaskStatus = 'To do' | 'In progress' | 'Done'
export interface Project {
  id: string
  name: string
  description: string
  color: string
}
export interface Task {
  id: string
  projectId: string
  title: string
  status: TaskStatus
  priority: 'Low' | 'Medium' | 'High'
  assignee: string
}
export interface Activity {
  id: string
  projectId: string
  text: string
  date: string
}
export interface Workspace {
  name: string
  activeProjectId: string
  projects: Project[]
  tasks: Task[]
  activity: Activity[]
}
export const statuses: TaskStatus[] = ['To do', 'In progress', 'Done']
export function createWorkspace(): Workspace {
  return {
    name: 'Studio workspace',
    activeProjectId: 'website',
    projects: [
      {
        id: 'website',
        name: 'Website redesign',
        description:
          'A fresh home for our next chapter. Bringing clarity, personality, and a little more delight to every page.',
        color: 'violet',
      },
      {
        id: 'brand',
        name: 'Brand refresh',
        description:
          'An identity that feels like us. Explore a new visual language for the studio.',
        color: 'orange',
      },
      {
        id: 'mobile',
        name: 'Mobile experience',
        description:
          'Make the everyday experience feel effortless, wherever our customers are.',
        color: 'blue',
      },
    ],
    tasks: [
      {
        id: 'WEB-01',
        projectId: 'website',
        title: 'Map out the new site structure',
        status: 'Done',
        priority: 'High',
        assignee: 'Alex',
      },
      {
        id: 'WEB-02',
        projectId: 'website',
        title: 'Explore homepage directions',
        status: 'In progress',
        priority: 'High',
        assignee: 'Maya',
      },
      {
        id: 'WEB-03',
        projectId: 'website',
        title: 'Build the component library',
        status: 'In progress',
        priority: 'Medium',
        assignee: 'You',
      },
      {
        id: 'WEB-04',
        projectId: 'website',
        title: 'Write a little more human copy',
        status: 'To do',
        priority: 'Medium',
        assignee: 'Alex',
      },
      {
        id: 'WEB-05',
        projectId: 'website',
        title: 'Review the mobile layouts',
        status: 'To do',
        priority: 'Low',
        assignee: 'You',
      },
      {
        id: 'WEB-06',
        projectId: 'website',
        title: 'Collect inspiration and references',
        status: 'Done',
        priority: 'Low',
        assignee: 'Maya',
      },
      {
        id: 'BR-01',
        projectId: 'brand',
        title: 'Explore a new color palette',
        status: 'In progress',
        priority: 'Medium',
        assignee: 'Maya',
      },
      {
        id: 'MOB-01',
        projectId: 'mobile',
        title: 'Sketch the onboarding flow',
        status: 'To do',
        priority: 'High',
        assignee: 'You',
      },
    ],
    activity: [
      {
        id: 'a1',
        projectId: 'website',
        text: 'Maya started exploring homepage directions',
        date: '2026-10-23T08:30:00Z',
      },
      {
        id: 'a2',
        projectId: 'website',
        text: 'Alex completed the new site structure',
        date: '2026-10-23T07:00:00Z',
      },
      {
        id: 'a3',
        projectId: 'website',
        text: 'You created this project. A good place to start.',
        date: '2026-10-22T09:00:00Z',
      },
    ],
  }
}
export function parseWorkspace(value: unknown): Workspace {
  if (!value || typeof value !== 'object') throw new Error('Invalid workspace')
  const data = value as Workspace
  if (
    typeof data.name !== 'string' ||
    !data.name.trim() ||
    typeof data.activeProjectId !== 'string' ||
    !Array.isArray(data.projects) ||
    !data.projects.length ||
    !data.projects.every(
      (p) =>
        p &&
        typeof p.id === 'string' &&
        typeof p.name === 'string' &&
        typeof p.description === 'string' &&
        typeof p.color === 'string',
    ) ||
    new Set(data.projects.map((p) => p.id)).size !== data.projects.length ||
    !data.projects.some((p) => p.id === data.activeProjectId) ||
    !Array.isArray(data.tasks) ||
    !data.tasks.every(
      (t) =>
        t &&
        typeof t.id === 'string' &&
        typeof t.title === 'string' &&
        statuses.includes(t.status) &&
        ['Low', 'Medium', 'High'].includes(t.priority) &&
        typeof t.assignee === 'string' &&
        data.projects.some((p) => p.id === t.projectId),
    ) ||
    new Set(data.tasks.map((t) => t.id)).size !== data.tasks.length ||
    !Array.isArray(data.activity) ||
    !data.activity.every(
      (a) =>
        a &&
        typeof a.id === 'string' &&
        typeof a.text === 'string' &&
        typeof a.date === 'string' &&
        Number.isFinite(Date.parse(a.date)) &&
        data.projects.some((p) => p.id === a.projectId),
    )
  ) {
    throw new Error('Invalid saved workspace')
  }
  return data
}
export function projectProgress(tasks: Task[]) {
  return tasks.length
    ? Math.round(
        (tasks.filter((t) => t.status === 'Done').length / tasks.length) * 100,
      )
    : 0
}
