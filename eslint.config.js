// eslint.config.js
import path from 'node:path';
import eslintPluginPrettier from 'eslint-config-prettier';
import eslintPluginRecommended from '@eslint/js';
import vercelNext from '@vercel/style-guide/eslint/next';
import onlyWarn from 'eslint-plugin-only-warn';
import tsParser from '@typescript-eslint/parser';

const project = path.resolve(process.cwd(), 'tsconfig.json');

/** @type {import('eslint').Linter.FlatConfig[]} */
export default [
  {
    ignores: ['.*.js', 'node_modules/'],
  },
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: true,
        tsconfigRootDir: process.cwd(),
      },
      globals: {
        React: true,
        JSX: true,
      },
      ecmaVersion: 'latest',
    },
    plugins: {
      'only-warn': onlyWarn,
    },
    rules: {
      'turbo/no-undeclared-env-vars': 'off',
    },
    settings: {
      'import/resolver': {
        typescript: {
          project,
        },
      },
    },
  },
  // eslintPluginRecommended.configs.recommended,
  // eslintPluginPrettier,
  vercelNext,
];
