module.exports = {
  root: true,
  env: {
    browser: true,
    es2022: true,
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint', 'import'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
  ],
  settings: {
    'import/resolver': {
      typescript: true,
    },
  },
  ignorePatterns: ['dist', 'node_modules'],
  rules: {
    'no-console': 'warn',
    'no-var': 'error',
    'prefer-const': 'error',
    'no-void': 'error',
    'no-implicit-coercion': 'error',
    curly: ['error', 'all'],
    'eol-last': ['error', 'always'],
    '@typescript-eslint/no-explicit-any': 'error',
    '@typescript-eslint/no-non-null-assertion': 'error',
    '@typescript-eslint/ban-ts-comment': 'error',
    '@typescript-eslint/consistent-type-imports': [
      'error',
      { fixStyle: 'inline-type-imports' },
    ],
    '@typescript-eslint/naming-convention': [
      'error',
      {
        selector: 'variable',
        format: ['camelCase', 'PascalCase', 'UPPER_CASE'],
      },
      { selector: 'interface', format: ['PascalCase'], prefix: ['I'] },
      { selector: 'typeAlias', format: ['PascalCase'], prefix: ['T'] },
    ],
    'import/order': [
      'error',
      {
        groups: ['builtin', 'external', 'internal', 'sibling'],
        pathGroups: [
          { pattern: '{core,core/**}', group: 'internal', position: 'before' },
          { pattern: 'router/**', group: 'internal', position: 'before' },
          { pattern: 'services/**', group: 'internal', position: 'before' },
          {
            pattern: 'controllers/**',
            group: 'internal',
            position: 'before',
          },
          {
            pattern: '{utils,types,constants}/**',
            group: 'internal',
            position: 'before',
          },
          { pattern: 'styles/**', group: 'internal', position: 'before' },
          { pattern: 'components/**', group: 'internal', position: 'before' },
          { pattern: 'pages/**', group: 'internal', position: 'before' },
        ],
        pathGroupsExcludedImportTypes: ['builtin'],
        'newlines-between': 'always',
      },
    ],
  },
  overrides: [
    {
      files: ['**/*.ts'],
      rules: {
        'max-lines': ['warn', { max: 300 }],
      },
    },
  ],
};
