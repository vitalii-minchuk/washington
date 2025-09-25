import antfu from '@antfu/eslint-config';
// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs';

export default withNuxt(antfu({
  type: 'app',
  typescript: true,
  formatters: true,
  vue: true,
  stylistic: {
    indent: 2,
    semi: true,
    quotes: 'single',
  },
}, { rules: {
  'no-console': 'warn',
} }));
