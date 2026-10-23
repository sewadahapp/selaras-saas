import {
  createCommunications,
  parseCommunications,
  teammates,
  type MailFilter,
  type MailFolder,
} from '~~/shared/utils/communications'

const storageKey = 'selaras-sass:communications:v1'
export function useCommunications() {
  const data = useState('communications', createCommunications)
  const ready = useState('communications-ready', () => false)
  const storage = useState<'saved' | 'session' | 'invalid'>(
    'communications-storage',
    () => 'saved',
  )
  const mailFilter = useState<MailFilter>('mail-filter', () => 'all')
  const mailSearch = useState('mail-search', () => '')
  const chatSearch = useState('chat-search', () => '')
  const resetOpen = useState('reset-communications', () => false)
  const composeOpen = useState('compose-mail', () => false)
  const newChatOpen = useState('new-chat', () => false)
  const membersOpen = useState('chat-members-open', () => false)
  const route = useRoute()
  const toast = useToast()
  const sectionPath = computed(() => route.path.replace(/\/+$/, ''))
  const selectedMail = computed(() =>
    sectionPath.value === '/inbox'
      ? data.value.mails.find((mail) => mail.id === route.query.mail)
      : undefined,
  )
  const selectedChat = computed(() =>
    sectionPath.value === '/chats'
      ? data.value.conversations.find((chat) => chat.id === route.query.chat)
      : undefined,
  )
  const unreadMail = computed(
    () =>
      data.value.mails.filter((mail) => mail.folder === 'inbox' && mail.unread)
        .length,
  )
  const unreadChat = computed(() =>
    data.value.conversations.reduce((sum, chat) => sum + chat.unread, 0),
  )
  function initialize() {
    if (ready.value) return
    try {
      const saved = localStorage.getItem(storageKey)
      if (saved) {
        try {
          data.value = parseCommunications(JSON.parse(saved))
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
      localStorage.setItem(storageKey, JSON.stringify(data.value))
      storage.value = 'saved'
    } catch {
      storage.value = 'session'
    }
  }
  function readMail(id: string, unread = false) {
    const mail = data.value.mails.find((item) => item.id === id)
    if (mail && mail.unread !== unread) {
      mail.unread = unread
      save()
    }
  }
  function starMail(id: string) {
    const mail = data.value.mails.find((item) => item.id === id)
    if (mail) {
      mail.starred = !mail.starred
      save()
    }
  }
  function moveMail(id: string, folder: MailFolder) {
    const mail = data.value.mails.find((item) => item.id === id)
    if (mail) {
      mail.folder = folder
      save()
      toast.add({
        title:
          folder === 'inbox'
            ? 'Message restored to inbox.'
            : `Message moved to ${folder}.`,
        color: 'success',
      })
    }
  }
  function draftReply(id: string, body: string) {
    const mail = data.value.mails.find((item) => item.id === id)
    if (mail) {
      mail.draft = body.slice(0, 10000)
      save()
    }
  }
  function reply(id: string) {
    const mail = data.value.mails.find((item) => item.id === id)
    if (!mail?.draft.trim()) return false
    mail.replies.push({
      id: crypto.randomUUID(),
      body: mail.draft.trim(),
      date: new Date().toISOString(),
    })
    mail.draft = ''
    save()
    toast.add({
      title: 'Reply saved locally.',
      description: 'This starter does not send email.',
      color: 'success',
    })
    return true
  }
  function compose(to: string, subject: string, body: string) {
    if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(to.trim()) ||
      !subject.trim() ||
      !body.trim()
    )
      return undefined
    const id = crypto.randomUUID()
    data.value.mails.unshift({
      id,
      name: 'You',
      email: 'you@example.com',
      to: to.trim(),
      subject: subject.trim().slice(0, 160),
      body: body.trim().slice(0, 10000),
      date: new Date().toISOString(),
      unread: false,
      starred: false,
      folder: 'sent',
      replies: [],
      draft: '',
    })
    save()
    composeOpen.value = false
    toast.add({
      title: 'Message saved to Sent.',
      description: 'This is a local demonstration; no email was sent.',
      color: 'success',
    })
    return id
  }
  function readChat(id: string) {
    const chat = data.value.conversations.find((item) => item.id === id)
    if (chat?.unread) {
      chat.unread = 0
      save()
    }
  }
  function draftChat(id: string, body: string) {
    const chat = data.value.conversations.find((item) => item.id === id)
    if (chat) {
      chat.draft = body.slice(0, 5000)
      save()
    }
  }
  function sendChat(id: string) {
    const chat = data.value.conversations.find((item) => item.id === id)
    if (!chat?.draft.trim()) return false
    chat.messages.push({
      id: crypto.randomUUID(),
      author: 'You',
      body: chat.draft.trim(),
      date: new Date().toISOString(),
    })
    chat.draft = ''
    save()
    return true
  }
  function startChat(name: string) {
    chatSearch.value = ''
    const known = data.value.conversations.find(
      (chat) => chat.kind === 'direct' && chat.name === name,
    )
    if (known) return known.id
    if (!teammates.includes(name)) return undefined
    const id = crypto.randomUUID()
    data.value.conversations.push({
      id,
      name,
      kind: 'direct',
      members: ['You', name],
      messages: [],
      unread: 0,
      draft: '',
    })
    save()
    return id
  }
  function reset() {
    data.value = createCommunications()
    mailFilter.value = 'all'
    mailSearch.value = ''
    chatSearch.value = ''
    storage.value = 'saved'
    save()
  }
  return {
    data,
    ready,
    storage,
    mailFilter,
    mailSearch,
    chatSearch,
    resetOpen,
    composeOpen,
    newChatOpen,
    membersOpen,
    selectedMail,
    selectedChat,
    unreadMail,
    unreadChat,
    initialize,
    readMail,
    starMail,
    moveMail,
    draftReply,
    reply,
    compose,
    readChat,
    draftChat,
    sendChat,
    startChat,
    reset,
  }
}
