import { expect, test } from '@playwright/test'

test('workspace routes fit the viewport and navigation works', async ({
  page,
  isMobile,
}) => {
  const errors: string[] = []
  page.on('pageerror', (error) => errors.push(error.message))
  await page.goto('/')
  await expect(
    page.getByRole('heading', { name: 'Website redesign', exact: true }),
  ).toBeVisible()
  if (!isMobile) {
    await expect(
      page.getByRole('complementary', { name: 'Workspace navigation' }),
    ).toBeVisible()
    await expect(
      page.getByRole('complementary', { name: 'Project details' }),
    ).toBeVisible()
  }
  for (const label of ['Tasks', 'Files', 'Activity', 'Overview']) {
    await page
      .getByRole('tablist', { name: 'Project tabs' })
      .getByRole('tab', { name: label, exact: true })
      .click()
    await expect(page.locator('main h1')).toBeVisible()
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    ).toBe(true)
  }
  if (isMobile) {
    await page
      .getByRole('button', { name: 'Open navigation', exact: true })
      .click()
    await page
      .getByRole('dialog')
      .getByRole('button', { name: 'Brand refresh', exact: true })
      .click()
    await expect(
      page.getByRole('heading', { name: 'Brand refresh', exact: true }),
    ).toBeVisible()
  }
  await page
    .getByRole('button', { name: 'Search workspace', exact: true })
    .click()
  await page.getByRole('dialog').getByRole('combobox').fill('Settings')
  await page.keyboard.press('Enter')
  await expect(page).toHaveURL(/\/settings$/)
  expect(errors).toEqual([])
})

test('tasks persist, affect progress, and stay within their project', async ({
  page,
  isMobile,
}) => {
  await page.goto('/tasks')
  await page.getByRole('button', { name: 'New task', exact: true }).click()
  await page
    .getByRole('textbox', { name: 'Task name', exact: true })
    .fill('Review accessibility')
  await page.getByRole('combobox', { name: 'Priority', exact: true }).click()
  await page.getByRole('option', { name: 'High', exact: true }).click()
  await page.getByRole('button', { name: 'Create task', exact: true }).click()
  await expect(
    page.getByRole('button', { name: 'Review accessibility', exact: true }),
  ).toBeVisible()
  await page
    .getByRole('checkbox', {
      name: 'Complete Review accessibility',
      exact: true,
    })
    .check()
  await page.reload()
  await expect(
    page.getByRole('checkbox', {
      name: 'Complete Review accessibility',
      exact: true,
    }),
  ).toBeChecked()
  const filter = page.getByRole('combobox', {
    name: 'Filter tasks by status',
    exact: true,
  })
  await filter.click()
  await page.getByRole('option', { name: 'To do', exact: true }).click()
  await expect(
    page.getByRole('button', { name: 'Review accessibility', exact: true }),
  ).toHaveCount(0)
  await filter.click()
  await page.getByRole('option', { name: 'Done', exact: true }).click()
  await page
    .getByRole('button', { name: 'Review accessibility', exact: true })
    .click()
  const taskInspector = isMobile
    ? page.getByRole('dialog')
    : page.getByRole('complementary', { name: 'Project details' })
  await expect(
    taskInspector.getByRole('heading', {
      name: 'Review accessibility',
      exact: true,
    }),
  ).toBeVisible()
  await expect(taskInspector.getByText('High', { exact: true })).toBeVisible()
  await taskInspector
    .getByRole('combobox', { name: 'Status', exact: true })
    .click()
  await page.getByRole('option', { name: 'In progress', exact: true }).click()
  await page.keyboard.press('Escape')
  await filter.click()
  await page.getByRole('option', { name: 'In progress', exact: true }).click()
  await expect(
    page.getByRole('checkbox', {
      name: 'Complete Review accessibility',
      exact: true,
    }),
  ).not.toBeChecked()
  if (isMobile)
    await page
      .getByRole('button', { name: 'Open navigation', exact: true })
      .click()
  const sidebar = isMobile
    ? page.getByRole('dialog')
    : page.getByRole('complementary', { name: 'Workspace navigation' })
  await sidebar
    .getByRole('button', { name: 'Brand refresh', exact: true })
    .click()
  await expect(
    page.getByRole('button', { name: 'Review accessibility', exact: true }),
  ).toHaveCount(0)
})

test('sample documents open and download', async ({ page }) => {
  await page.goto('/files?file=brief')
  await expect(
    page
      .getByRole('dialog')
      .getByRole('heading', { name: 'Project brief', exact: true }),
  ).toBeVisible()
  const download = page.waitForEvent('download')
  await page
    .getByRole('button', { name: 'Download Markdown', exact: true })
    .click()
  expect((await download).suggestedFilename()).toBe('brief.md')
})

test('corrupt storage is preserved until explicit reset', async ({ page }) => {
  await page.addInitScript(() =>
    localStorage.setItem('selaras-sass:v1', 'unreadable'),
  )
  await page.goto('/settings')
  await expect(
    page.getByText('Saved data could not be read.', { exact: false }),
  ).toBeVisible()
  await page
    .getByRole('textbox', { name: 'Workspace name', exact: true })
    .fill('Changed workspace')
  await page.getByRole('button', { name: 'Save changes', exact: true }).click()
  expect(
    await page.evaluate(() => localStorage.getItem('selaras-sass:v1')),
  ).toBe('unreadable')
  await page
    .getByRole('button', { name: 'Reset demo workspace', exact: true })
    .click()
  await page
    .getByRole('button', { name: 'Reset workspace', exact: true })
    .click()
  expect(
    await page.evaluate(
      () => JSON.parse(localStorage.getItem('selaras-sass:v1')!).name,
    ),
  ).toBe('Studio workspace')
})

test('sidebars resize, collapse independently, and restore their layouts', async ({
  page,
  isMobile,
}) => {
  test.skip(
    isMobile,
    'Desktop split panels are replaced with slideovers on mobile.',
  )
  await page.goto('/')
  const sidebar = page.locator('.workspace-sidebar')
  const inspector = page.locator('.workspace-inspector')
  const width = (panel: typeof sidebar) =>
    panel.evaluate((element) => element.getBoundingClientRect().width)
  const leftToggle = page.getByRole('button', {
    name: 'Toggle workspace sidebar',
    exact: true,
  })
  const rightToggle = page.getByRole('button', {
    name: 'Toggle project details',
    exact: true,
  })
  await expect.poll(() => width(sidebar)).toBeGreaterThan(199)
  await expect.poll(() => width(inspector)).toBeGreaterThan(219)
  await expect
    .poll(() =>
      sidebar.evaluate(
        (element) => getComputedStyle(element).transitionProperty,
      ),
    )
    .toContain('flex-grow')

  const drag = async (name: string, delta: number) => {
    const handle = page.getByRole('separator', { name, exact: true })
    const bounds = await handle.boundingBox()
    if (!bounds) throw new Error(`Missing resize handle: ${name}`)
    await page.mouse.move(
      bounds.x + bounds.width / 2,
      bounds.y + bounds.height / 2,
    )
    await page.mouse.down()
    await page.mouse.move(
      bounds.x + bounds.width / 2 + delta,
      bounds.y + bounds.height / 2,
      { steps: 8 },
    )
    await page.mouse.up()
  }
  const leftBefore = await width(sidebar)
  await drag('Resize workspace sidebar', 40)
  await expect.poll(() => width(sidebar)).toBeGreaterThan(leftBefore + 20)
  const leftResized = await width(sidebar)
  const rightBefore = await width(inspector)
  await drag('Resize project inspector', -40)
  await expect.poll(() => width(inspector)).toBeGreaterThan(rightBefore + 20)
  const rightResized = await width(inspector)

  await leftToggle.click()
  await expect(sidebar).toHaveAttribute('data-state', 'collapsed')
  await expect(leftToggle).toHaveAttribute('aria-expanded', 'false')
  await expect.poll(() => width(sidebar)).toBeLessThan(1)
  await expect(sidebar).toHaveCount(1)
  await expect(inspector).toHaveAttribute('data-state', 'expanded')
  await expect
    .poll(async () => Math.abs((await width(inspector)) - rightResized))
    .toBeLessThan(3)
  await leftToggle.click()
  await expect
    .poll(async () => Math.abs((await width(sidebar)) - leftResized))
    .toBeLessThan(3)

  await rightToggle.click()
  await expect(inspector).toHaveAttribute('data-state', 'collapsed')
  await expect.poll(() => width(inspector)).toBeLessThan(1)
  await expect(sidebar).toHaveAttribute('data-state', 'expanded')
  // Wait for the library's debounced layout cookies before reloading.
  await expect
    .poll(async () =>
      (await page.context().cookies()).some(
        (cookie) =>
          cookie.name === 'selaras-sass-inspector-v1' &&
          decodeURIComponent(cookie.value).includes('100,0'),
      ),
    )
    .toBe(true)
  await page.reload()
  await expect(rightToggle).toHaveAttribute('aria-expanded', 'false')
  await expect.poll(() => width(inspector)).toBeLessThan(1)
  await expect
    .poll(async () => Math.abs((await width(sidebar)) - leftResized))
    .toBeLessThan(3)
  await rightToggle.click()
  await expect
    .poll(async () => Math.abs((await width(inspector)) - rightResized))
    .toBeLessThan(3)

  // Selecting a task reveals the inline inspector, including when it was hidden.
  await rightToggle.click()
  await page
    .getByRole('button', { name: 'Explore homepage directions', exact: true })
    .click()
  await expect(rightToggle).toHaveAttribute('aria-expanded', 'true')
  await expect(
    inspector.getByRole('heading', {
      name: 'Explore homepage directions',
      exact: true,
    }),
  ).toBeVisible()
  await expect(page.getByRole('dialog')).toHaveCount(0)

  // Keyboard resizing is supplied by the same Selaras resize handles.
  const handle = page.getByRole('separator', {
    name: 'Resize workspace sidebar',
    exact: true,
  })
  const beforeKeyboard = await width(sidebar)
  await handle.focus()
  await page.keyboard.press('ArrowRight')
  await expect.poll(() => width(sidebar)).toBeGreaterThan(beforeKeyboard + 1)
})

test('responsive slideovers open on the correct side and close on navigation', async ({
  page,
}) => {
  await page.setViewportSize({ width: 900, height: 900 })
  await page.goto('/')
  await expect(page.locator('.workspace-inspector')).toBeHidden()
  await expect(
    page.getByRole('separator', {
      name: 'Resize project inspector',
      exact: true,
    }),
  ).toBeHidden()
  await page
    .getByRole('button', { name: 'Open project details', exact: true })
    .click()
  const inspector = page.getByRole('dialog', {
    name: 'Project inspector',
    exact: true,
  })
  await expect(inspector).toBeVisible()
  await expect
    .poll(() =>
      inspector.evaluate((element) =>
        Math.abs(element.getBoundingClientRect().right - window.innerWidth),
      ),
    )
    .toBeLessThan(2)
  await page.keyboard.press('Escape')

  await page.setViewportSize({ width: 390, height: 844 })
  await expect(page.locator('.workspace-sidebar')).toBeHidden()
  await page
    .getByRole('button', { name: 'Open navigation', exact: true })
    .click()
  const navigation = page.getByRole('dialog', {
    name: 'Your workspace',
    exact: true,
  })
  await expect(navigation).toBeVisible()
  await expect
    .poll(() =>
      navigation.evaluate((element) =>
        Math.abs(element.getBoundingClientRect().left),
      ),
    )
    .toBeLessThan(2)
  await navigation.getByRole('link', { name: 'Tasks', exact: false }).click()
  await expect(page).toHaveURL(/\/tasks$/)
  await expect(navigation).toBeHidden()
  await page
    .getByRole('button', { name: 'Open project details', exact: true })
    .click()
  await expect(inspector).toBeVisible()
  await page.setViewportSize({ width: 1440, height: 1000 })
  await expect(inspector).toBeHidden()
  await expect(
    page.getByRole('complementary', { name: 'Project details' }),
  ).toBeVisible()
})

test('application controls are unique and the sidebar footer stays at the bottom', async ({
  page,
  isMobile,
}) => {
  await page.goto('/')
  const rail = page.getByRole('navigation', {
    name: 'Application',
    exact: true,
  })
  await expect(
    rail.getByRole('link', { name: 'Settings', exact: true }),
  ).toHaveCount(1)
  await expect(
    rail.getByRole('link', { name: 'Your account', exact: true }),
  ).toHaveCount(1)
  const logo = page.getByRole('img', { name: 'Selaras', exact: true })
  await expect(logo).toHaveCount(1)
  await expect(logo).toBeVisible()
  await expect
    .poll(() =>
      logo.evaluate((image) => (image as HTMLImageElement).naturalWidth),
    )
    .toBeGreaterThan(0)
  if (isMobile)
    await page
      .getByRole('button', { name: 'Open navigation', exact: true })
      .click()
  const panel = isMobile
    ? page.getByRole('dialog', { name: 'Your workspace', exact: true })
    : page.getByRole('complementary', {
        name: 'Workspace navigation',
        exact: true,
      })
  const footer = panel.getByTestId('workspace-sidebar-footer')
  await expect(
    footer.getByText('A place for your next big thing.', { exact: true }),
  ).toBeVisible()
  await expect(
    panel.getByRole('img', { name: 'Selaras', exact: true }),
  ).toHaveCount(0)
  await expect(panel.locator('a[href$="/settings"]')).toHaveCount(0)
  await expect(
    panel.getByText('Personal account', { exact: true }),
  ).toHaveCount(0)
  const gap = () =>
    panel.evaluate((element) => {
      const footerElement = element.querySelector(
        '[data-testid="workspace-sidebar-footer"]',
      )!
      return (
        element.getBoundingClientRect().bottom -
        footerElement.getBoundingClientRect().bottom
      )
    })
  await expect.poll(gap).toBeLessThan(20)
  if (!isMobile) {
    await page.setViewportSize({ width: 1440, height: 540 })
    await expect(
      footer.getByText('A place for your next big thing.', { exact: true }),
    ).toBeHidden()
    await panel
      .getByRole('button', { name: 'Brand refresh', exact: true })
      .click()
    await expect(
      page.getByRole('heading', { name: 'Brand refresh', exact: true }),
    ).toBeVisible()
  }
  const favicon = await page
    .locator('head link[rel="icon"]')
    .getAttribute('href')
  expect(favicon).toMatch(/favicon\.svg$/)
  const response = await page.request.get(
    new URL(favicon!, page.url()).toString(),
  )
  expect(response.ok()).toBe(true)
  expect(await response.text()).toContain('<title>Selaras</title>')
})

test('project tabs support keyboard navigation, deep links, and browser history', async ({
  page,
}) => {
  await page.goto('/tasks')
  const tabs = page.getByRole('tablist', { name: 'Project tabs', exact: true })
  const tasks = tabs.getByRole('tab', { name: 'Tasks', exact: true })
  const files = tabs.getByRole('tab', { name: 'Files', exact: true })
  await expect(tasks).toHaveAttribute('aria-selected', 'true')
  await expect(page.getByRole('tabpanel').locator('main')).toBeVisible()
  await tasks.focus()
  await page.keyboard.press('ArrowRight')
  await expect(page).toHaveURL(/\/files$/)
  await expect(files).toHaveAttribute('aria-selected', 'true')
  await expect(
    page
      .getByRole('tabpanel')
      .getByRole('heading', { name: 'The things we build on.', exact: true }),
  ).toBeVisible()
  await page.goBack()
  await expect(tasks).toHaveAttribute('aria-selected', 'true')
  await page.reload()
  await expect(tasks).toHaveAttribute('aria-selected', 'true')
  await expect(page.locator('main')).toHaveCount(1)
})
