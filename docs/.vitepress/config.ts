import { defineConfig } from 'vitepress';
import { fileURLToPath } from 'node:url';

// https://vitepress.dev/reference/site-config
export default defineConfig({
	title: 'Blava',

	description: 'Performant, artful blob generator 🎨',

	head: [
		['link', { rel: 'icon', href: '/favicon.ico' }],
		['link', { rel: 'icon', type: 'iamge/svg+xml', href: '/blava-logo.svg' }],
	],

	themeConfig: {
		logo: '/blava-logo.svg',
		siteTitle: false,

		search: {
			provider: 'local',
		},

		sidebar: [
			{
				text: 'Guide',
				items: [
					{ text: 'Getting Started', link: '/guide/getting-started' },
					{ text: 'Advanced Configuration', link: '/guide/advanced-configuration' },
					{ text: 'Tips', link: '/guide/tips' },
				],
			},

			{
				items: [{ text: 'About & Contributing', link: '/about' }],
			},

			{
				items: [{ text: 'Experiments', link: 'https://blava-experiments.grayvold.me' }],
			},
		],

		socialLinks: [{ icon: 'github', link: 'https://github.com/greatnewslife/blava' }],
	},

	vite: {
		publicDir: '../public',

		resolve: {
			alias: {
				'~': fileURLToPath(new URL('../../lib', import.meta.url)),
			},
		},
	},

	cleanUrls: true,
});
