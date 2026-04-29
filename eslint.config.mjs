import { defineConfig, globalIgnores } from 'eslint/config'
import nextVitals from 'eslint-config-next/core-web-vitals'
import nextTs from 'eslint-config-next/typescript'

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores([
    '.next/**',
    '.vscode/**',
    '.yarn/**',
    'config/jest/**',
    'dist/**',
    'dist-install/**',
    'doc/**',
    'node_modules/**',
    'public/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
    '**/__tests__/**'
  ]),
  {
    settings: {
      react: { version: '19' }
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unsafe-function-type': 'off',
      '@typescript-eslint/no-empty-object-type': 'off',
      '@typescript-eslint/no-require-imports': 'off',
      '@typescript-eslint/ban-ts-comment': 'off',
      'react-hooks/set-state-in-effect': 'off',
      'react-hooks/immutability': 'off',
      'react-hooks/refs': 'off',
      'react-hooks/static-components': 'off',
      '@typescript-eslint/no-non-null-asserted-optional-chain': 'off',
      'react-hooks/preserve-manual-memoization': 'off'
    }
  }
])

export default eslintConfig
