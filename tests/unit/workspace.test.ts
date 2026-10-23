import { describe, expect, test } from 'bun:test'
import {
  createWorkspace,
  parseWorkspace,
  projectProgress,
} from '../../shared/utils/workspace'

describe('saved workspaces', () => {
  test('round trips the demo and keeps projects isolated', () => {
    const workspace = parseWorkspace(
      JSON.parse(JSON.stringify(createWorkspace())),
    )
    expect(workspace.projects).toHaveLength(3)
    expect(
      projectProgress(workspace.tasks.filter((t) => t.projectId === 'website')),
    ).toBe(33)
    expect(projectProgress([])).toBe(0)
    expect(
      projectProgress(workspace.tasks.filter((t) => t.projectId === 'brand')),
    ).toBe(0)
  })
  test('each fresh workspace has independent state', () => {
    const first = createWorkspace()
    first.projects[0]!.name = 'Changed'
    first.tasks.length = 0
    expect(createWorkspace().projects[0]!.name).toBe('Website redesign')
    expect(createWorkspace().tasks.length).toBeGreaterThan(0)
  })
  test('rejects invalid saves before replacing usable session data', () => {
    for (const value of [
      null,
      {},
      { ...createWorkspace(), activeProjectId: 'missing' },
      { ...createWorkspace(), projects: [] },
      {
        ...createWorkspace(),
        tasks: [{ ...createWorkspace().tasks[0], status: 'unknown' }],
      },
      {
        ...createWorkspace(),
        activity: [{ ...createWorkspace().activity[0], date: 'invalid' }],
      },
    ]) {
      expect(() => parseWorkspace(value)).toThrow()
    }
    const orphan = createWorkspace()
    orphan.tasks[0]!.projectId = 'deleted'
    expect(() => parseWorkspace(orphan)).toThrow()
    const duplicate = createWorkspace()
    duplicate.tasks.push(duplicate.tasks[0]!)
    expect(() => parseWorkspace(duplicate)).toThrow()
  })
})
