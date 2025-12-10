import js from '@eslint/js'
import tseslint from 'typescript-eslint'
import reactHooks from 'eslint-plugin-react-hooks'
import importPlugin from 'eslint-plugin-import'
import a11y from 'eslint-plugin-jsx-a11y'
import tailwind from 'eslint-plugin-tailwindcss'

export default [
  { ignores: ['.next/**', 'dist/**'] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    plugins: {
      'react-hooks': reactHooks,
      import: importPlugin,
      'jsx-a11y': a11y,
      tailwindcss: tailwind,
    },
    rules: {
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      '@typescript-eslint/no-explicit-any': 'warn',
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      'import/order': ['warn', { 'newlines-between': 'always', alphabetize: { order: 'asc' } }],
      'jsx-a11y/anchor-is-valid': 'warn',
      'tailwindcss/no-custom-classname': 'off',
    },
  },
]

