import { describe, expect, test } from 'bun:test'
import {
  createCommunications,
  filterMails,
  parseCommunications,
} from '../../shared/utils/communications'

describe('communications data', () => {
  test('round trips messages, replies, conversations, and drafts', () => {
    const data = createCommunications()
    data.mails[0]!.draft = 'A reply to finish later'
    data.mails[0]!.replies.push({
      id: 'reply',
      body: 'Thanks for the context.',
      date: '2026-10-23T10:00:00Z',
    })
    data.conversations[0]!.draft = 'A thought for the team'
    const saved = parseCommunications(JSON.parse(JSON.stringify(data)))
    expect(saved.mails[0]!.draft).toBe('A reply to finish later')
    expect(saved.mails[0]!.replies[0]!.body).toBe('Thanks for the context.')
    expect(saved.conversations[0]!.draft).toBe('A thought for the team')
    expect(createCommunications().mails[0]!.draft).toBe('')
  })
  test('folder and unread filters remain distinct and searchable', () => {
    const { mails } = createCommunications()
    expect(filterMails(mails, 'unread', '')).toHaveLength(3)
    expect(filterMails(mails, 'starred', '')).toHaveLength(2)
    expect(filterMails(mails, 'all', ' MAYA ')).toHaveLength(2)
    mails[0]!.folder = 'archived'
    expect(filterMails(mails, 'all', 'A new direction')).toHaveLength(0)
    expect(filterMails(mails, 'unread', '')).toHaveLength(2)
    expect(filterMails(mails, 'archived', 'A new direction')).toHaveLength(1)
    mails[0]!.folder = 'trash'
    expect(filterMails(mails, 'starred', '')).toHaveLength(1)
    expect(filterMails(mails, 'trash', 'A new direction')).toHaveLength(1)
    mails[0]!.folder = 'sent'
    mails[0]!.to = 'recipient@example.net'
    expect(filterMails(mails, 'sent', 'recipient@example.net')).toHaveLength(1)
  })
  test('rejects corrupt or inconsistent storage before it replaces session data', () => {
    for (const value of [null, {}, { mails: [], conversations: null }])
      expect(() => parseCommunications(value)).toThrow()
    const duplicate = createCommunications()
    duplicate.mails.push(duplicate.mails[0]!)
    expect(() => parseCommunications(duplicate)).toThrow()
    const orphan = createCommunications()
    orphan.conversations[0]!.messages[0]!.author = 'Unknown member'
    expect(() => parseCommunications(orphan)).toThrow()
    const unread = createCommunications()
    unread.conversations[0]!.unread = -1
    expect(() => parseCommunications(unread)).toThrow()
    const date = createCommunications()
    date.mails[0]!.date = 'yesterday'
    expect(() => parseCommunications(date)).toThrow()
    const replies = createCommunications()
    replies.mails[0]!.replies = [
      { id: 'r', body: 'One', date: '2026-10-23T10:00:00Z' },
      { id: 'r', body: 'Two', date: '2026-10-23T10:00:00Z' },
    ]
    expect(() => parseCommunications(replies)).toThrow()
  })
})
