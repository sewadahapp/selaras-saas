export default defineNuxtConfig({
  compatibilityDate: '2026-10-21',
  devtools: { enabled: true },
  modules: ['@sewadah/selaras', '@nuxt/eslint'],
  css: ['~/assets/css/main.css'],
  nitro: {
    prerender: {
      routes: [
        '/',
        '/tasks',
        '/files',
        '/activity',
        '/settings',
        '/inbox',
        '/chats',
      ],
    },
  },
  icon: {
    serverBundle: { collections: ['hugeicons'] },
    clientBundle: {
      scan: { globInclude: ['app/**/*.{vue,ts}'] },
      icons: [
        'hugeicons:cancel-01',
        'hugeicons:tick-02',
        'hugeicons:arrow-down-01',
        'hugeicons:loading-02',
        'hugeicons:search-01',
        'hugeicons:sun-01',
        'hugeicons:moon',
        'hugeicons:checkmark-circle-01',
        'hugeicons:cancel-circle',
        'hugeicons:alert-circle',
        'hugeicons:information-circle',
        'hugeicons:arrow-right-01',
        'hugeicons:arrow-up-01',
        'hugeicons:more-horizontal',
        'hugeicons:user',
      ],
    },
  },
  app: {
    baseURL: process.env.NUXT_APP_BASE_URL || '/',
    head: {
      title: 'Selaras · Your workspace, in focus',
      meta: [
        {
          name: 'description',
          content:
            'A thoughtfully simple SaaS workspace starter built with Nuxt and Selaras.',
        },
      ],
      link: [
        {
          rel: 'icon',
          type: 'image/svg+xml',
          href: `${process.env.NUXT_APP_BASE_URL || '/'}favicon.svg`,
        },
      ],
      htmlAttrs: { lang: 'en' },
    },
  },
})
