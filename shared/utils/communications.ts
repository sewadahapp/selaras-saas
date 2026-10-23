export interface MessageReply {
  id: string
  body: string
  date: string
}
export type MailFolder = 'inbox' | 'archived' | 'sent' | 'trash'
export type MailFilter =
  'all' | 'unread' | 'starred' | 'archived' | 'sent' | 'trash'
export interface Mail {
  id: string
  name: string
  email: string
  to: string
  subject: string
  body: string
  date: string
  unread: boolean
  starred: boolean
  folder: MailFolder
  replies: MessageReply[]
  draft: string
}
export interface ChatMessage {
  id: string
  author: string
  body: string
  date: string
}
export interface Conversation {
  id: string
  name: string
  kind: 'channel' | 'direct'
  members: string[]
  messages: ChatMessage[]
  unread: number
  draft: string
}
export interface Communications {
  mails: Mail[]
  conversations: Conversation[]
}
export const teammates = ['Maya Chen', 'Alex Morgan', 'Sam Rivera']
export const mailFilters: { label: string; value: MailFilter }[] = [
  { label: 'All', value: 'all' },
  { label: 'Unread', value: 'unread' },
  { label: 'Starred', value: 'starred' },
  { label: 'Archive', value: 'archived' },
  { label: 'Sent', value: 'sent' },
  { label: 'Trash', value: 'trash' },
]
export function createCommunications(): Communications {
  const samples = [
    {
      id: 'homepage',
      name: 'Maya Chen',
      email: 'maya@example.com',
      subject: 'A new direction for the homepage',
      body: 'Hey team,\n\nI’ve pulled together two directions for the new homepage. Both start with a quieter layout and a stronger sense of what we do.\n\nThe first keeps the work front and center. The second leaves a little more room for our story. I’d love your thoughts before we start building.\n\nCould we take a look together tomorrow?\n\nThanks,\nMaya',
      unread: true,
      starred: true,
    },
    {
      id: 'review',
      name: 'Alex Morgan',
      email: 'alex@example.com',
      subject: 'Ready for a quick component review?',
      body: 'Hi there,\n\nThe first set of shared components is ready for a review. Buttons, forms, and navigation are all using Selaras now.\n\nI’ve checked keyboard navigation and the smaller screen layouts. A second pair of eyes on the empty states would be really helpful.\n\nLet me know what you think.\n\nAlex',
      unread: true,
      starred: false,
    },
    {
      id: 'kickoff',
      name: 'Sam Rivera',
      email: 'sam@example.com',
      subject: 'A few notes from our project kickoff',
      body: 'Hello everyone,\n\nThanks for such a useful kickoff. Here’s the direction we agreed on:\n\n• Keep the experience clear and welcoming.\n• Start with the homepage and core navigation.\n• Make accessibility part of each review.\n\nI’ve added the next steps to the project. Looking forward to making this together.\n\nSam',
      unread: true,
      starred: false,
    },
    {
      id: 'brand',
      name: 'Maya Chen',
      email: 'maya@example.com',
      subject: 'The small details that make it feel like us',
      body: 'Hey,\n\nA few thoughts on the brand refresh: warmer neutrals, simple type, and a little personality in the illustrations. Nothing too loud.\n\nI’ve added some notes to the design direction document. Let’s see how the palette feels alongside the actual content.\n\nMaya',
      unread: false,
      starred: true,
    },
    {
      id: 'welcome',
      name: 'The Selaras team',
      email: 'hello@example.com',
      subject: 'Welcome to your new workspace',
      body: 'A little space to do great work.\n\nYour workspace is ready. Start a project, make a plan, and keep your conversations close to the work.\n\nThis inbox is a local starter demonstration. Replies and drafts stay in your browser. When you’re ready, connect your own email or messaging service.\n\nMake yourself at home.\nThe Selaras team',
      unread: false,
      starred: false,
    },
  ]
  return {
    mails: samples.map((mail, i) => ({
      ...mail,
      to: 'you@example.com',
      date: `2026-10-${23 - i}T09:30:00Z`,
      folder: 'inbox',
      replies: [],
      draft: '',
    })),
    conversations: [
      {
        id: 'studio',
        name: 'Studio',
        kind: 'channel',
        members: ['You', ...teammates],
        unread: 2,
        draft: '',
        messages: [
          {
            id: 's1',
            author: 'Sam Rivera',
            body: 'A shared space for the small updates, good ideas, and things worth celebrating. Welcome in 👋',
            date: '2026-10-23T08:00:00Z',
          },
          {
            id: 's2',
            author: 'Maya Chen',
            body: 'The first homepage explorations are ready. I’ve sent a little context to your inbox.',
            date: '2026-10-23T08:10:00Z',
          },
          {
            id: 's3',
            author: 'Alex Morgan',
            body: 'Looking good! I’ll take a look after the component review.',
            date: '2026-10-23T08:12:00Z',
          },
        ],
      },
      {
        id: 'website',
        name: 'Website redesign',
        kind: 'channel',
        members: ['You', 'Maya Chen', 'Alex Morgan'],
        unread: 0,
        draft: '',
        messages: [
          {
            id: 'w1',
            author: 'You',
            body: 'Let’s keep the navigation simple and make the work easy to find.',
            date: '2026-10-22T10:00:00Z',
          },
          {
            id: 'w2',
            author: 'Maya Chen',
            body: 'Agreed. I’m testing the layout with real content first.',
            date: '2026-10-22T10:05:00Z',
          },
        ],
      },
      {
        id: 'maya',
        name: 'Maya Chen',
        kind: 'direct',
        members: ['You', 'Maya Chen'],
        unread: 1,
        draft: '',
        messages: [
          {
            id: 'm1',
            author: 'Maya Chen',
            body: 'Hey! Do you have a moment to talk through the homepage directions?',
            date: '2026-10-23T09:00:00Z',
          },
        ],
      },
    ],
  }
}
export function filterMails(
  mails: Mail[],
  filter: MailFilter,
  search: string,
): Mail[] {
  const query = search.trim().toLowerCase()
  return mails
    .filter((mail) => {
      const matches =
        filter === 'all'
          ? mail.folder === 'inbox'
          : filter === 'unread'
            ? mail.folder === 'inbox' && mail.unread
            : filter === 'starred'
              ? mail.folder !== 'trash' && mail.starred
              : mail.folder === filter
      return (
        matches &&
        (!query ||
          [mail.name, mail.email, mail.to, mail.subject, mail.body].some(
            (text) => text.toLowerCase().includes(query),
          ))
      )
    })
    .sort((a, b) => Date.parse(b.date) - Date.parse(a.date))
}
const string = (value: unknown): value is string => typeof value === 'string'
const date = (value: unknown) =>
  string(value) && Number.isFinite(Date.parse(value))
const unique = (items: { id: string }[]) =>
  new Set(items.map((item) => item.id)).size === items.length
export function parseCommunications(value: unknown): Communications {
  if (!value || typeof value !== 'object')
    throw new Error('Invalid communications')
  const data = value as Communications
  if (
    !Array.isArray(data.mails) ||
    !Array.isArray(data.conversations) ||
    !data.mails.every(
      (mail) =>
        mail &&
        [
          mail.id,
          mail.name,
          mail.email,
          mail.to,
          mail.subject,
          mail.body,
          mail.draft,
        ].every(string) &&
        date(mail.date) &&
        typeof mail.unread === 'boolean' &&
        typeof mail.starred === 'boolean' &&
        ['inbox', 'archived', 'sent', 'trash'].includes(mail.folder) &&
        Array.isArray(mail.replies) &&
        mail.replies.every(
          (reply) =>
            reply && string(reply.id) && string(reply.body) && date(reply.date),
        ) &&
        unique(mail.replies),
    ) ||
    !data.conversations.every(
      (chat) =>
        chat &&
        string(chat.id) &&
        string(chat.name) &&
        ['channel', 'direct'].includes(chat.kind) &&
        Array.isArray(chat.members) &&
        chat.members.length > 0 &&
        chat.members.every(string) &&
        chat.members.includes('You') &&
        Number.isSafeInteger(chat.unread) &&
        chat.unread >= 0 &&
        string(chat.draft) &&
        Array.isArray(chat.messages) &&
        chat.messages.every(
          (message) =>
            message &&
            string(message.id) &&
            chat.members.includes(message.author) &&
            string(message.body) &&
            date(message.date),
        ) &&
        unique(chat.messages),
    ) ||
    !unique(data.mails) ||
    !unique(data.conversations)
  )
    throw new Error('Invalid saved communications')
  return data
}
export function initials(name: string) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase()
}
export function messageDate(value: string) {
  return new Date(value).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  })
}
export function messageTime(value: string) {
  return new Date(value).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    timeZone: 'UTC',
  })
}
