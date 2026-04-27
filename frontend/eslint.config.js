import js from '@eslint/js';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';

export default [
  js.configs.recommended,
  {
    ignores: ['dist/', 'node_modules/'],
  },
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: {
        document: 'readonly',
        navigator: 'readonly',
        window: 'readonly',
        localStorage: 'readonly',
        fetch: 'readonly',
        console: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
        URL: 'readonly',
        Request: 'readonly',
        Response: 'readonly',
        Headers: 'readonly',
        caches: 'readonly',
        location: 'readonly',
        performance: 'readonly',
        queueMicrotask: 'readonly',
        MessageChannel: 'readonly',
        MutationObserver: 'readonly',
        DOMException: 'readonly',
        self: 'readonly',
        importScripts: 'readonly',
        registration: 'readonly',
        FetchEvent: 'readonly',
        reportError: 'readonly',
        define: 'readonly',
        __REACT_DEVTOOLS_GLOBAL_HOOK__: 'readonly',
      },
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
    },
  },
];
