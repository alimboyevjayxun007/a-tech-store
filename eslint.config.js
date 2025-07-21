import eslintPluginTs from '@typescript-eslint/eslint-plugin';
import parserTypeScript from '@typescript-eslint/parser';

export default [
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: parserTypeScript,
      parserOptions: {
        sourceType: 'module',
        ecmaVersion: 'latest',
        project: './tsconfig.json',
      },
    },
    plugins: {
      '@typescript-eslint': eslintPluginTs,
    },
    rules: {
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
    },
  },
];
