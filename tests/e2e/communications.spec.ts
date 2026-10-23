import { expect, test } from '@playwright/test'

const homepage = 'A new direction for the homepage'
test('rail switches between distinct contextual sections', async ({
  page,
  isMobile,
}) => {
  const errors: string[] = []
  page.on('pageerror', (error) => errors.push(error.message))
  await page.goto('/')
  const rail = page.getByRole('navigation', {
    name: 'Application',
    exact: true,
  })
  await expect(
    rail.getByRole('navigation', { name: 'Application sections', exact: true }),
  ).toBeVisible()
  await expect(
    rail.getByRole('navigation', { name: 'Account navigation', exact: true }),
  ).toBeVisible()
  if (!isMobile) {
    await rail.getByRole('link', { name: 'Inbox', exact: true }).focus()
    await expect(
      page.getByRole('tooltip', { name: 'Inbox', exact: true }),
    ).toBeVisible()
  }
  await rail.getByRole('link', { name: 'Inbox', exact: true }).click()
  await expect(page).toHaveURL(/\/inbox$/)
  await expect(
    page.getByRole('heading', { name: 'Inbox', exact: true }),
  ).toBeVisible()
  await expect(page.getByRole('tablist', { name: 'Project tabs' })).toHaveCount(
    0,
  )
  await expect(
    page.getByRole('navigation', { name: 'Workspace screens' }),
  ).toHaveCount(0)
  await rail.getByRole('link', { name: 'Chats', exact: true }).click()
  await expect(
    page.getByRole('heading', { name: 'Chats', exact: true }),
  ).toBeVisible()
  await expect(
    page.getByRole('navigation', { name: 'Conversations', exact: true }),
  ).toBeVisible()
  await rail.getByRole('link', { name: 'Workspace', exact: true }).click()
  await expect(
    page.getByRole('heading', { name: 'Website redesign', exact: true }),
  ).toBeVisible()
  if (!isMobile)
    await expect(
      page.getByRole('complementary', { name: 'Workspace navigation' }),
    ).toBeVisible()
  await rail.getByRole('link', { name: 'Inbox', exact: true }).click()
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true)
  expect(errors).toEqual([])
})

test('inbox drafts, replies, unread state, and archive persist', async ({
  page,
  isMobile,
}) => {
  await page.goto('/inbox')
  await page
    .getByRole('button', { name: `Open message: ${homepage}`, exact: true })
    .click()
  await expect(
    page.locator('main').getByRole('heading', { name: homepage, exact: true }),
  ).toBeVisible()
  await page
    .getByRole('textbox', { name: 'Reply', exact: true })
    .fill('The first direction feels right. Let’s review it tomorrow.')
  await page.reload()
  await expect(
    page.getByRole('textbox', { name: 'Reply', exact: true }),
  ).toHaveValue('The first direction feels right. Let’s review it tomorrow.')
  await page.getByRole('button', { name: 'Send reply', exact: true }).click()
  await expect(
    page
      .locator('main')
      .getByText('The first direction feels right. Let’s review it tomorrow.', {
        exact: true,
      }),
  ).toBeVisible()
  await expect(
    page.getByRole('textbox', { name: 'Reply', exact: true }),
  ).toHaveValue('')
  await page
    .getByRole('button', { name: 'Mark as unread', exact: true })
    .click()
  expect(
    await page.evaluate(
      () =>
        JSON.parse(
          localStorage.getItem('selaras-sass:communications:v1')!,
        ).mails.find((mail: { id: string }) => mail.id === 'homepage').unread,
    ),
  ).toBe(true)
  await page
    .getByRole('button', { name: 'Unstar message', exact: true })
    .click()
  await expect(
    page.getByRole('button', { name: 'Star message', exact: true }),
  ).toBeVisible()
  await page
    .getByRole('button', { name: 'Archive message', exact: true })
    .click()
  await page.reload()
  await expect(
    page.getByRole('button', { name: 'Restore to inbox', exact: true }),
  ).toBeVisible()
  await page
    .getByRole('button', { name: 'Restore to inbox', exact: true })
    .click()
  if (isMobile)
    await page.getByRole('link', { name: 'Back to inbox', exact: true }).click()
  await page
    .getByRole('textbox', { name: 'Search messages', exact: true })
    .fill('component')
  await expect(
    page.getByRole('button', {
      name: 'Open message: Ready for a quick component review?',
      exact: true,
    }),
  ).toBeVisible()
  await expect(
    page.getByRole('button', {
      name: `Open message: ${homepage}`,
      exact: true,
    }),
  ).toHaveCount(0)
})

test('compose creates a local sent message', async ({ page }) => {
  await page.goto('/inbox')
  await page
    .getByRole('button', { name: 'Compose message', exact: true })
    .click()
  const dialog = page.getByRole('dialog', { name: 'New message', exact: true })
  await dialog
    .getByRole('textbox', { name: 'To', exact: true })
    .fill('maya@example.com')
  await dialog
    .getByRole('textbox', { name: 'Subject', exact: true })
    .fill('A quick follow-up')
  await dialog
    .getByRole('textbox', { name: 'Message', exact: true })
    .fill('The review is ready for tomorrow.')
  await dialog
    .getByRole('button', { name: 'Save to Sent', exact: true })
    .click()
  await expect(
    page
      .locator('main')
      .getByRole('heading', { name: 'A quick follow-up', exact: true }),
  ).toBeVisible()
  await page.reload()
  await expect(
    page
      .locator('main')
      .getByText('The review is ready for tomorrow.', { exact: true }),
  ).toBeVisible()
})

test('chat history and drafts persist without leaking between conversations', async ({
  page,
  isMobile,
}) => {
  await page.goto('/chats')
  await page
    .getByRole('button', { name: 'Open conversation: Studio', exact: true })
    .click()
  await page
    .getByRole('textbox', { name: 'Message', exact: true })
    .fill('A draft for the studio.')
  await page.reload()
  await expect(
    page.getByRole('textbox', { name: 'Message', exact: true }),
  ).toHaveValue('A draft for the studio.')
  if (isMobile)
    await page.getByRole('link', { name: 'Back to chats', exact: true }).click()
  await page
    .getByRole('button', { name: 'Open conversation: Maya Chen', exact: true })
    .click()
  await expect(
    page.getByRole('textbox', { name: 'Message', exact: true }),
  ).toHaveValue('')
  await page
    .getByRole('textbox', { name: 'Message', exact: true })
    .fill('I have a moment for the homepage review.')
  await page.getByRole('button', { name: 'Send message', exact: true }).click()
  await expect(
    page
      .getByRole('log')
      .getByText('I have a moment for the homepage review.', { exact: true }),
  ).toBeVisible()
  await page.reload()
  await expect(
    page
      .getByRole('log')
      .getByText('I have a moment for the homepage review.', { exact: true }),
  ).toBeVisible()
  if (isMobile)
    await page.getByRole('link', { name: 'Back to chats', exact: true }).click()
  await page
    .getByRole('button', { name: 'Open conversation: Studio', exact: true })
    .click()
  await expect(
    page.getByRole('textbox', { name: 'Message', exact: true }),
  ).toHaveValue('A draft for the studio.')
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true)
})

test('new conversations reuse existing direct chats', async ({
  page,
  isMobile,
}) => {
  await page.goto('/chats')
  await page
    .getByRole('complementary', { name: 'Chat conversations', exact: true })
    .getByRole('button', { name: 'New conversation', exact: true })
    .click()
  await page
    .getByRole('button', { name: 'Open conversation', exact: true })
    .click()
  await expect(
    page
      .locator('main')
      .getByRole('heading', { name: 'Maya Chen', exact: true }),
  ).toBeVisible()
  if (isMobile)
    await page.getByRole('link', { name: 'Back to chats', exact: true }).click()
  await expect(
    page.getByRole('button', {
      name: 'Open conversation: Maya Chen',
      exact: true,
    }),
  ).toHaveCount(1)
  await page
    .getByRole('complementary', { name: 'Chat conversations', exact: true })
    .getByRole('button', { name: 'New conversation', exact: true })
    .click()
  await page.getByRole('combobox', { name: 'Teammate', exact: true }).click()
  await page.getByRole('option', { name: 'Alex Morgan', exact: true }).click()
  await page
    .getByRole('button', { name: 'Open conversation', exact: true })
    .click()
  await expect(
    page
      .locator('main')
      .getByRole('heading', { name: 'Alex Morgan', exact: true }),
  ).toBeVisible()
  await page
    .getByRole('textbox', { name: 'Message', exact: true })
    .fill('Hello Alex, welcome to the conversation.')
  await page.getByRole('button', { name: 'Send message', exact: true }).click()
  await expect(
    page
      .getByRole('log')
      .getByText('Hello Alex, welcome to the conversation.', { exact: true }),
  ).toBeVisible()
})

test('conversation members open in a right panel and follow the selected chat', async ({
  page,
  isMobile,
}) => {
  await page.goto('/chats?chat=studio')
  const toggle = page.getByRole('button', {
    name: 'View conversation members',
    exact: true,
  })
  await expect(toggle).toHaveAttribute('aria-expanded', 'false')
  await toggle.click()
  const members = isMobile
    ? page.getByRole('dialog', { name: 'Conversation members', exact: true })
    : page.getByRole('complementary', {
        name: 'Conversation members',
        exact: true,
      })
  await expect(members).toBeVisible()
  await expect(
    members
      .getByRole('list', { name: 'Conversation members', exact: true })
      .getByRole('listitem'),
  ).toHaveCount(4)
  await expect(members.getByText('Sam Rivera', { exact: true })).toBeVisible()
  // A modal slideover hides the background from the accessibility tree.
  // Include its hidden trigger only for this DOM state assertion.
  await expect(
    page.getByRole('button', {
      name: 'View conversation members',
      exact: true,
      includeHidden: true,
    }),
  ).toHaveAttribute('aria-expanded', 'true')
  if (isMobile) {
    await expect
      .poll(() =>
        members.evaluate((element) =>
          Math.abs(element.getBoundingClientRect().right - innerWidth),
        ),
      )
      .toBeLessThan(2)
    await page.keyboard.press('Escape')
  } else {
    await expect(page.getByRole('dialog')).toHaveCount(0)
    await expect
      .poll(() =>
        members.evaluate((element) => element.getBoundingClientRect().width),
      )
      .toBeGreaterThan(239)
    const handle = page.getByRole('separator', {
      name: 'Resize members sidebar',
      exact: true,
    })
    const bounds = await handle.boundingBox()
    if (!bounds) throw new Error('Missing members resize handle')
    const before = await members.evaluate(
      (element) => element.getBoundingClientRect().width,
    )
    await page.mouse.move(
      bounds.x + bounds.width / 2,
      bounds.y + bounds.height / 2,
    )
    await page.mouse.down()
    await page.mouse.move(
      bounds.x + bounds.width / 2 - 40,
      bounds.y + bounds.height / 2,
      { steps: 8 },
    )
    await page.mouse.up()
    await expect
      .poll(() =>
        members.evaluate((element) => element.getBoundingClientRect().width),
      )
      .toBeGreaterThan(before + 20)
    await members
      .getByRole('button', { name: 'Close members sidebar', exact: true })
      .click()
  }
  await expect(toggle).toHaveAttribute('aria-expanded', 'false')
  if (isMobile)
    await page.getByRole('link', { name: 'Back to chats', exact: true }).click()
  await page
    .getByRole('button', { name: 'Open conversation: Maya Chen', exact: true })
    .click()
  await toggle.click()
  await expect(
    members
      .getByRole('list', { name: 'Conversation members', exact: true })
      .getByRole('listitem'),
  ).toHaveCount(2)
  await expect(members.getByText('Sam Rivera', { exact: true })).toHaveCount(0)
  if (isMobile) await page.keyboard.press('Escape')
  else {
    // The open desktop sidebar becomes a right slideover at the tablet breakpoint.
    await page.setViewportSize({ width: 900, height: 900 })
    const drawer = page.getByRole('dialog', {
      name: 'Conversation members',
      exact: true,
    })
    await expect(drawer).toBeVisible()
    await expect(drawer.getByRole('listitem')).toHaveCount(2)
    await page.keyboard.press('Escape')
    await expect(toggle).toHaveAttribute('aria-expanded', 'false')
  }
  await page
    .getByRole('navigation', { name: 'Application', exact: true })
    .getByRole('link', { name: 'Inbox', exact: true })
    .click()
  await expect(
    page.getByRole('complementary', {
      name: 'Conversation members',
      exact: true,
    }),
  ).toHaveCount(0)
  await expect(
    page.getByRole('dialog', { name: 'Conversation members', exact: true }),
  ).toHaveCount(0)
})
