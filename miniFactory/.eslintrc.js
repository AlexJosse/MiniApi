module.exports = {
    parser: '@typescript-eslint/parser',
    plugins: ['import'],
    extends: [
      'airbnb-typescript/base',
    ],
    parserOptions: {
      project: './miniFactory/tsconfig.json',
    },
    rules: {
      'no-redeclare': 'off',
      '@typescript-eslint/no-redeclare': 'error',
    },
  };
    