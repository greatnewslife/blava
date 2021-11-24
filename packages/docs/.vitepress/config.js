module.exports = {
  title: '📋 Blava Docs',
  description: 'Documentation & samples for the Blava JS library',
  lang: 'en-US',
  head: [
    [
      'link',
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '64x64',
        href: 'favicon-64.png',
      },
    ],
    [
      'link',
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '32x32',
        href: 'favicon-32.png',
      },
    ],
  ],
  themeConfig: {
    docsDir: '/docs/',
    nav: [
      {
        text: 'Guide',
        link: '/guide/getting_started',
        activeMatch: '^/guide/',
      },
      {
        text: 'GitHub',
        link: 'https://github.com/greatnewslife/blava',
      },
    ],
    sidebar: {
      '/': [
        {
          text: 'Guide',
          children: [
            {
              text: 'Getting Started',
              link: './guide/getting_started',
            },
            {
              text: 'Advanced Configuration',
              link: './guide/advanced_configuration',
            },
            {
              text: 'Use Cases',
              link: './guide/use_cases',
            },
          ],
        },
      ],
    },
  },
};
