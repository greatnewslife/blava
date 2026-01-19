import DefaultTheme from 'vitepress/theme';
import BlavaHomeLayout from './BlavaHomeLayout.vue';
import 'virtual:uno.css';
import './style/custom.css';

export default {
	extends: DefaultTheme,

	// Override the layout with a wrapper component that injects the slots
	Layout: BlavaHomeLayout,
};
