import themePlume from 'vuepress-theme-plume'
import type { Theme } from 'vuepress'
import { enNotes, zhNotes } from './notes.js'
import { enNavbar, zhNavbar } from './navbar.js'

export const theme: Theme = themePlume({
  logo: 'https://pengzhanbo.cn/g.gif',
  hostname: 'https://pengzhanbo.cn',
  repo: 'https://github.com/pengzhanbo/vuepress-theme-plume',
  docsDir: 'docs',

  avatar: {
    url: '/images/blogger.jpg',
    name: 'Plume Theme',
    description: 'The Theme for Vuepress 2.0',
  },

  social: [{ icon: 'github', link: 'https://github.com/pengzhanbo' }],

  footer: { copyright: 'Copyright © 2022-present pengzhanbo' },

  locales: {
    '/': {
      notes: zhNotes,
      navbar: zhNavbar,
    },
    '/en/': {
      notes: enNotes,
      navbar: enNavbar,
    },
  },
  plugins: {
    shiki: { twoslash: true },
  },
})
