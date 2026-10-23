import {
  createWorkspace,
  parseWorkspace,
  projectProgress,
  type Task,
  type TaskStatus,
} from '~~/shared/utils/workspace'

const storageKey = 'selaras-sass:v1'
export function useWorkspace() {
  const workspace = useState('workspace', createWorkspace)
  const ready = useState('workspace-ready', () => false)
  const storage = useState<'saved' | 'session' | 'invalid'>(
    'workspace-storage',
    () => 'saved',
  )
  const selectedTaskId = useState<string | null>('selected-task', () => null)
  const taskDialog = useState('task-dialog', () => false)
  const projectDialog = useState('project-dialog', () => false)
  const inspectorOpen = useState('inspector-open', () => false)
  const toast = useToast()
  const project = computed(() =>
    workspace.value.projects.find(
      (p) => p.id === workspace.value.activeProjectId,
    )!,
  )
  const tasks = computed(() =>
    workspace.value.tasks.filter((t) => t.projectId === project.value.id),
  )
  const activity = computed(() =>
    workspace.value.activity.filter((a) => a.projectId === project.value.id),
  )
  const progress = computed(() => projectProgress(tasks.value))
  const selectedTask = computed(() =>
    tasks.value.find((t) => t.id === selectedTaskId.value),
  )
  function initialize() {
    if (ready.value) return
    try {
      const saved = localStorage.getItem(storageKey)
      if (saved) {
        try {
          workspace.value = parseWorkspace(JSON.parse(saved))
        } catch {
          storage.value = 'invalid'
        }
      }
    } catch {
      storage.value = 'session'
    }
    ready.value = true
  }
  function save() {
    if (!ready.value || storage.value === 'invalid') return
    try {
      localStorage.setItem(storageKey, JSON.stringify(workspace.value))
      storage.value = 'saved'
    } catch {
      storage.value = 'session'
    }
  }
  function log(text: string) {
    workspace.value.activity.unshift({
      id: crypto.randomUUID(),
      projectId: project.value.id,
      text,
      date: new Date().toISOString(),
    })
  }
  function selectProject(id: string) {
    if (!workspace.value.projects.some((p) => p.id === id)) return
    workspace.value.activeProjectId = id
    selectedTaskId.value = null
    save()
  }
  function selectTask(id: string) {
    selectedTaskId.value = id
    inspectorOpen.value = true
  }
  function setStatus(id: string, status: TaskStatus) {
    const task = tasks.value.find((t) => t.id === id)
    if (!task || task.status === status) return
    task.status = status
    log(`You moved “${task.title}” to ${status.toLowerCase()}`)
    save()
  }
  function addTask(title: string, priority: Task['priority']) {
    if (!title.trim()) return false
    workspace.value.tasks.push({
      id: `TASK-${crypto.randomUUID().slice(0, 8)}`,
      projectId: project.value.id,
      title: title.trim().slice(0, 160),
      status: 'To do',
      priority,
      assignee: 'You',
    })
    log(`You added “${title.trim()}”`)
    save()
    toast.add({
      title: 'Task added. A little closer to done.',
      color: 'success',
    })
    return true
  }
  function addProject(name: string, description: string) {
    if (!name.trim()) return false
    const id = crypto.randomUUID()
    workspace.value.projects.push({
      id,
      name: name.trim().slice(0, 80),
      description: description.trim().slice(0, 400),
      color: 'violet',
    })
    selectProject(id)
    log('You created this project. A good place to start.')
    save()
    toast.add({ title: 'Your new project is ready.', color: 'success' })
    return true
  }
  function renameWorkspace(name: string) {
    if (!name.trim()) return false
    workspace.value.name = name.trim().slice(0, 80)
    save()
    toast.add({ title: 'Workspace settings saved.', color: 'success' })
    return true
  }
  function reset() {
    workspace.value = createWorkspace()
    selectedTaskId.value = null
    storage.value = 'saved'
    save()
    toast.add({ title: 'Demo workspace restored.', color: 'success' })
  }
  return {
    workspace,
    ready,
    storage,
    project,
    tasks,
    activity,
    progress,
    selectedTask,
    selectedTaskId,
    taskDialog,
    projectDialog,
    inspectorOpen,
    initialize,
    selectProject,
    selectTask,
    setStatus,
    addTask,
    addProject,
    renameWorkspace,
    reset,
  }
}
