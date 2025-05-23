---
title: 内容搜索
icon: material-symbols:search
createTime: 2024/03/04 09:58:39
permalink: /guide/features/content-search/
---

主题提供了两种方式支持 内容搜索。

- 本地内容搜索
- Algolia DocSearch

注意，请勿同时配置使用两种方式，同时配置时，只有 本地内容搜索 生效。

## 本地内容搜索

本地内容搜索由
[@vuepress-plume/plugin-search](https://github.com/pengzhanbo/vuepress-theme-plume/tree/main/plugins/plugin-search) 插件提供支持。

该插件使用 [minisearch](https://github.com/lucaong/minisearch) 进行内容搜索。

### 启用

主题默认 启用 本地内容搜索 功能。您也可以对其进行自定义配置。

```ts title=".vuepress/config.ts"
import { defineUserConfig } from 'vuepress'
import { plumeTheme } from 'vuepress-theme-plume'

export default defineUserConfig({
  theme: plumeTheme({
    search: { // [!code ++:4]
      provider: 'local',
      // more options
    }
  })
})
```

该插件会根据你的页面，在本地生成搜索索引，然后在用户访问站点时加载搜索索引文件。
换句话说，这是一个轻量级的内置搜索能力，不会进行任何外部请求。

然而，当你的站点包含大量页面时，搜索索引文件也会变得非常大，它可能会拖慢你的页面加载速度。
在这种情况下，我们建议你使用更成熟的解决方案 - [Algolia DocSearch](#algolia-docsearch) 。

## Algolia DocSearch

使用 [Algolia DocSearch](https://docsearch.algolia.com/) 提供支持的网站内容搜索插件

### 启用

```ts title=".vuepress/config.ts"
import { defineUserConfig } from 'vuepress'
import { plumeTheme } from 'vuepress-theme-plume'

export default defineUserConfig({
  theme: plumeTheme({
    search: { // [!code ++:4]
      provider: 'algolia',
      // more options
    }
  })
})
```

### 获取搜索索引

你需要 [提交你的网站 URL](https://docsearch.algolia.com/apply/) 来加入 DocSearch 项目。
当你的索引成功创建后， DocSearch 团队会将 `apiKey` 和 `indexName`
发送到你的邮箱。接下来，你就可以配置该插件，在 VuePress 中启用 DocSearch 了。

或者，你也可以 [运行你自己的爬虫](https://docsearch.algolia.com/docs/run-your-own/) 来创建索引，
然后使用你自己的 `appId` ， `apiKey` 和 `indexName` 来配置该插件。

以下是本主题使用的 爬虫配置示例, 你可以前往 [Algolia Crawler](https://crawler.algolia.com/admin/crawlers/)
根据你的需求进行修改:

```ts
new Crawler({
  appId: 'YOUR_APP_ID', // [!code highlight]
  apiKey: 'YOUR_API_KEY', // [!code highlight]
  rateLimit: 8,
  startUrls: [
    // 这是 Algolia 开始抓取网站的初始地址
    // 如果你的网站被分为数个独立部分，你可能需要在此设置多个入口链接
    'https://YOUR_WEBSITE_URL/', // [!code highlight]
  ],
  renderJavaScript: false,
  sitemaps: [
    // 主题默认会生成 sitemap，这里需要替换为你的域名链接
    'https://YOUR_WEBSITE_URL/sitemap.xml', // [!code highlight]
  ],
  ignoreCanonicalTo: true,
  discoveryPatterns: [
    // 这是 Algolia 抓取 URL 的范围
    'https://YOUR_WEBSITE_URL/**', // [!code highlight]
  ],
  // 爬虫执行的计划时间，可根据文档更新频率设置
  schedule: 'at 02:00 every 1 day',
  actions: [
    // 你可以拥有多个 action，特别是你在一个域名下部署多个文档时
    {
      // 使用适当的名称为索引命名
      indexName: 'YOUR_INDEX_NAME', // [!code highlight]
      // 索引生效的路径
      pathsToMatch: ['https://YOUR_WEBSITE_URL/**'], // [!code highlight]
      recordExtractor: ({ helpers }) => {
        // vuepress-theme-plume 的选项
        return helpers.docsearch({
          recordProps: { // [!code highlight]
            lvl1: '.plume-content h1', // [!code highlight]
            content: '.plume-content p, .plume-content li', // [!code highlight]
            lvl0: { // [!code highlight]
              selectors: [ // [!code highlight]
                '.sidebar-item.is-active p', // [!code highlight]
                '.content-container .page-title', // [!code highlight]
              ], // [!code highlight]
              defaultValue: 'Documentation', // [!code highlight]
            }, // [!code highlight]
            lvl2: '.plume-content h2', // [!code highlight]
            lvl3: '.plume-content h3', // [!code highlight]
            lvl4: '.plume-content h4', // [!code highlight]
            lvl5: '.plume-content h5', // [!code highlight]
          }, // [!code highlight]
          indexHeadings: true, // [!code highlight]
          aggregateContent: true, // [!code highlight]
          recordVersion: 'v3', // [!code highlight]
        })
      },
    },
  ],
  initialIndexSettings: {
    // 控制索引如何被初始化，这仅当索引尚未生成时有效
    // 你可能需要在修改后手动删除并重新生成新的索引
    YOUR_INDEX_NAME: { // [!code highlight]
      attributesForFaceting: ['type', 'lang'], // [!code highlight]
      attributesToRetrieve: [
        'hierarchy',
        'content',
        'anchor',
        'url',
        'url_without_anchor',
        'type',
      ],
      attributesToHighlight: ['hierarchy', 'hierarchy_camel', 'content'],
      attributesToSnippet: ['content:10'],
      camelCaseAttributes: ['hierarchy', 'hierarchy_radio', 'content'],
      searchableAttributes: [
        'unordered(hierarchy_radio_camel.lvl0)',
        'unordered(hierarchy_radio.lvl0)',
        'unordered(hierarchy_radio_camel.lvl1)',
        'unordered(hierarchy_radio.lvl1)',
        'unordered(hierarchy_radio_camel.lvl2)',
        'unordered(hierarchy_radio.lvl2)',
        'unordered(hierarchy_radio_camel.lvl3)',
        'unordered(hierarchy_radio.lvl3)',
        'unordered(hierarchy_radio_camel.lvl4)',
        'unordered(hierarchy_radio.lvl4)',
        'unordered(hierarchy_radio_camel.lvl5)',
        'unordered(hierarchy_radio.lvl5)',
        'unordered(hierarchy_radio_camel.lvl6)',
        'unordered(hierarchy_radio.lvl6)',
        'unordered(hierarchy_camel.lvl0)',
        'unordered(hierarchy.lvl0)',
        'unordered(hierarchy_camel.lvl1)',
        'unordered(hierarchy.lvl1)',
        'unordered(hierarchy_camel.lvl2)',
        'unordered(hierarchy.lvl2)',
        'unordered(hierarchy_camel.lvl3)',
        'unordered(hierarchy.lvl3)',
        'unordered(hierarchy_camel.lvl4)',
        'unordered(hierarchy.lvl4)',
        'unordered(hierarchy_camel.lvl5)',
        'unordered(hierarchy.lvl5)',
        'unordered(hierarchy_camel.lvl6)',
        'unordered(hierarchy.lvl6)',
        'content',
      ],
      distinct: true,
      attributeForDistinct: 'url',
      customRanking: [
        'desc(weight.pageRank)',
        'desc(weight.level)',
        'asc(weight.position)',
      ],
      ranking: [
        'words',
        'filters',
        'typo',
        'attribute',
        'proximity',
        'exact',
        'custom',
      ],
      highlightPreTag: '<span class="algolia-docsearch-suggestion--highlight">',
      highlightPostTag: '</span>',
      minWordSizefor1Typo: 3,
      minWordSizefor2Typos: 7,
      allowTyposOnNumericTokens: false,
      minProximity: 1,
      ignorePlurals: true,
      advancedSyntax: true,
      attributeCriteriaComputedByMinProximity: true,
      removeWordsIfNoResults: 'allOptional',
    },
  },
})
```

`recordProps` 部分的配置选项用于本主题进行索引的爬取配置。

### 配置项

完整配置请查看 [文档](https://ecosystem.vuejs.press/zh/plugins/search/docsearch.html)

### 配置示例

以下是本主题使用的配置：

```ts title=".vuepress/config.ts"
import { defineUserConfig } from 'vuepress'
import { plumeTheme } from 'vuepress-theme-plume'

export default defineUserConfig({
  theme: plumeTheme({
    search: { // [!code ++:6]
      provider: 'algolia',
      appId: 'YOUR_APP_ID',
      apiKey: 'YOUR_API_KEY',
      indexName: 'YOUR_INDEX_NAME',
    }
  })
})
```
