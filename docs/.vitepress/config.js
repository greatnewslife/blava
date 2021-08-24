module.exports = {
  title: '📋 Blava Docs',
  description: 'Documentation & samples for the Blava JS library',
  lang: 'en-US',
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
