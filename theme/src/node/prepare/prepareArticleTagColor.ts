import { toArray } from '@pengzhanbo/utils'
import type { App } from 'vuepress'
import { nanoid } from '../utils.js'

export type TagsColorsItem = readonly [
  string, // normal color
  string, // hover color
  string, // background color
]

export const PRESET: TagsColorsItem[] = [
  ['#6aa1b7', '#5086a1', 'rgba(131, 208, 218, 0.314)'],
  ['#299764', '#18794e', 'rgba(16, 185, 129, 0.14)'],
  ['#946300', '#915930', 'rgba(234, 179, 8, 0.14)'],
  ['#d5393e', '#b8272c', 'rgba(244, 63, 94, 0.14)'],
  ['#7e4cc9', '#6f42c1', 'rgba(159, 122, 234, 0.14)'],
  ['#3a5ccc', '#3451b2', 'rgba(100, 108, 255, 0.14)'],
  ['#fab10f', '#f39c12', 'rgba(255, 213, 0, 0.14)'],
  ['#cc6699', '#c75191', 'rgba(255, 153, 204, 0.14)'],
  ['#55AAEE', '#0088CC', 'rgba(0, 136, 204, 0.14)'],
  ['#AA66CC', '#9933CC', 'rgba(153, 121, 204, 0.14)'],
  ['#9933CC', '#993399', 'rgba(153, 151, 204, 0.14)'],
  ['#CC9999', '#CC8888', 'rgba(204, 153, 153, 0.14)'],
  ['#9999CC', '#9999FF', 'rgba(153, 153, 204, 0.14)'],
  ['#66CCCC', '#66CCAA', 'rgba(102, 204, 204, 0.14)'],
  ['#CCBC99', '#CCAA99', 'rgba(204, 204, 153, 0.14)'],
]

const HMR_CODE = `
if (import.meta.webpackHot) {
  import.meta.webpackHot.accept()
  if (__VUE_HMR_RUNTIME__.updateArticleTagColors) {
    __VUE_HMR_RUNTIME__.updateArticleTagColor(articleTagColors)
  }
}

if (import.meta.hot) {
  import.meta.hot.accept(({ articleTagColors }) => {
    __VUE_HMR_RUNTIME__.updateArticleTagColor(articleTagColors)
  })
}
`

// { index: className }
const cache: Record<number, string> = {}

export async function prepareArticleTagColors(app: App): Promise<void> {
  const articleTagColors: Record<string, string> = {}
  const tagList = new Set<string>()

  app.pages.forEach((page) => {
    const { frontmatter: { tags } } = page
    if (tags) {
      toArray(tags).forEach((tag) => {
        tag && tagList.add(tag as string)
      })
    }
  })

  tagList.forEach((tag) => {
    const code = getTagCode(tag)
    if (!cache[code]) {
      cache[code] = nanoid(4)
    }
    if (!articleTagColors[tag]) {
      articleTagColors[tag] = cache[code]
    }
  })

  let code = `\
import './articleTagColors.css'
export const articleTagColors = ${JSON.stringify(articleTagColors)}
`
  if (app.env.isDev) {
    code += HMR_CODE
  }

  await app.writeTemp('internal/articleTagColors.css', genTagColorsStyle())
  await app.writeTemp('internal/articleTagColors.ts', code)
}

function getTagCode(tag: string): number {
  tag = tag.toLowerCase()
  let code = 0
  for (let i = 0; i < tag.length; i++) {
    code += tag.charCodeAt(i)
  }
  return code % PRESET.length
}

function genTagColorsStyle(): string {
  let css = ''

  for (const [code, className] of Object.entries(cache)) {
    const index = Number(code)
    const [color, hoverColor, backgroundColor] = PRESET[index]

    css += `\
.vp-tag-${className} {
  --vp-tag-color: ${color};
  --vp-tag-hover-color: ${hoverColor};
  --vp-tag-bg: ${backgroundColor};
}
`
  }

  return css
}
