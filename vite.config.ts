import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueDevTools from 'vite-plugin-vue-devtools';
import UnoCSS from 'unocss/vite';
import dts from 'vite-plugin-dts';

// https://vite.dev/config/
export default defineConfig({
	plugins: [
		vue(),
		vueDevTools(),
		UnoCSS(),
		dts({
			rollupTypes: true,
			tsconfigPath: fileURLToPath(new URL('./tsconfig.lib.json', import.meta.url)),
		}),
	],

	resolve: {
		alias: {
			'@': fileURLToPath(new URL('./src', import.meta.url)),
			'~': fileURLToPath(new URL('./lib', import.meta.url)),
		},
	},

	build: {
		lib: {
			fileName: 'blava',
			entry: fileURLToPath(new URL('./lib/main.ts', import.meta.url)),
			formats: ['es'],
		},

		rollupOptions: {
			output: {
				globals: {},
			},
		},

		minify: true,

		copyPublicDir: false,

		sourcemap: true,
	},
});
