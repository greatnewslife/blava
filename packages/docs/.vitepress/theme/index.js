import DefaultTheme from 'vitepress/theme';
import Blava from '../../components/Blava.vue';
import './custom.css';

export default {
  ...DefaultTheme,
  enhanceApp({ app }) {
    app.component('Blava', Blava);
  },
};
