import {
	defineConfig,
	presetWind3,
	presetAttributify,
	transformerDirectives,
	transformerVariantGroup,
} from 'unocss';

export default defineConfig({
	presets: [presetAttributify(), presetWind3()],
	transformers: [transformerDirectives(), transformerVariantGroup()],
});
