import { globalIgnores } from 'eslint/config';
import { defineConfigWithVueTs, vueTsConfigs } from '@vue/eslint-config-typescript';
import pluginVue from 'eslint-plugin-vue';
import skipFormatting from '@vue/eslint-config-prettier/skip-formatting';
import unocss from '@unocss/eslint-config/flat'

export default defineConfigWithVueTs(
    unocss,

	{
		name: 'app/files-to-lint',
		files: ['**/*.{vue,ts,mts,tsx}'],
	},

	globalIgnores(['**/dist/**', '**/dist-ssr/**', '**/coverage/**', '**/docs/.vitepress/**']),

	...pluginVue.configs['flat/essential'],
	vueTsConfigs.recommended,

	skipFormatting,
);
