/** @type {import('jest').Config} */

const jestConfig = {
  rootDir: '../..',
  setupFiles: [
    '<rootDir>/config/jest/setup.js',
    '<rootDir>/config/jest/mock.js',
    '<rootDir>/config/jest/mockMatchMedia.js',
    '<rootDir>/config/jest/mockResizeObserver.js'
  ],
  extensionsToTreatAsEsm: ['.ts', '.tsx'],
  collectCoverageFrom: [
    '**/*.{js,jsx,ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**'
  ],
  testEnvironment: 'jsdom',
  testMatch: [
    '<rootDir>/**/*.test.js',
    '<rootDir>/**/*.test.ts',
    '<rootDir>/**/*.test.tsx'
  ],
  testPathIgnorePatterns: ['<rootDir>/dist/', '<rootDir>/dist-install/'],
  modulePathIgnorePatterns: ['<rootDir>/.yarn', '<rootDir>/tests'],
  transform: {
    '^.+\\.(t|j)sx?$': [
      'babel-jest',
      {
        presets: ['next/babel']
      }
    ],
    '^.+\\.(css)$': '<rootDir>/config/jest/cssTransform.js'
  },
  transformIgnorePatterns: [
    '/node_modules/',
    '^.+\\.module\\.(css|sass|scss)$'
  ],
  moduleNameMapper: {
    '^.+\\.module\\.(css|sass|scss)$': 'identity-obj-proxy',
    '^@/config(.*)$': '<rootDir>/config$1',
    '^@/models(.*)$': '<rootDir>/models$1',
    '^@/templates(.*)$': '<rootDir>/templates$1',
    '^@/plugins(.*)$': '<rootDir>/plugins$1',
    '^@/postprocessing(.*)$': '<rootDir>/postprocessing$1',
    '^@/api(.*)$': '<rootDir>/src/api$1',
    '^@/auth(.*)$': '<rootDir>/src/auth$1',
    '^@/components(.*)$': '<rootDir>/src/components$1',
    '^@/context(.*)$': '<rootDir>/src/context$1',
    '^@/database(.*)$': '<rootDir>/src/database$1',
    '^@/lib(.*)$': '<rootDir>/src/lib$1',
    '^@/pages(.*)$': '<rootDir>/src/pages$1',
    '^@/route(.*)$': '<rootDir>/src/route$1',
    '^@/server(.*)$': '<rootDir>/src/server$1',
    '^@/services(.*)$': '<rootDir>/src/services$1',
    '^@/styles(.*)$': '<rootDir>/src/styles$1'
  },
  coveragePathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/.next/',
    '<rootDir>/out/',
    '<rootDir>/next.config.js',
    '<rootDir>/app/',
    '<rootDir>/dist/',
    '<rootDir>/dist-server/',
    '<rootDir>/dist-install/',
    '<rootDir>/doc/',
    '<rootDir>/coverage/',
    '<rootDir>/config/depcheck/',
    '<rootDir>/config/jest/',
    '<rootDir>/config/typedoc/',
    '<rootDir>/public/',
    '<rootDir>/src/components/editor/code/freefem/mode/',
    '<rootDir>/tests/'
  ]
}

export default jestConfig
