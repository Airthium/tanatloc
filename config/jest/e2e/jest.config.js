module.exports = {
  rootDir: '../../..',
  setupFiles: [
    '<rootDir>/config/jest/e2e/index.js',
    '<rootDir>/config/jest/mockMatchMedia.js'
  ],
  collectCoverageFrom: [
    '**/*.{js,jsx,ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
    '!**/*.test.js'
  ],
  testEnvironment: 'jsdom',
  testEnvironmentOptions: {
    DATABASE: 'tanatloc_test',
    STORAGE_PATH: '/tmp/tanatloc_test'
  },
  testMatch: ['<rootDir>/tests/**/*.test.js'],
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': '<rootDir>/node_modules/babel-jest',
    '^.+\\.css$': '<rootDir>/config/jest/cssTransform.js'
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
    '^@/api(.*)$': '<rootDir>/src/api$1',
    '^@/auth(.*)$': '<rootDir>/src/auth$1',
    '^@/components(.*)$': '<rootDir>/src/components$1',
    '^@/database(.*)$': '<rootDir>/src/database$1',
    '^@/lib(.*)$': '<rootDir>/src/lib$1',
    '^@/pages(.*)$': '<rootDir>/src/pages$1',
    '^@/route(.*)$': '<rootDir>/src/route$1',
    '^@/services(.*)$': '<rootDir>/src/services$1',
    '^@/store(.*)$': '<rootDir>/src/store$1',
    '^@/styles(.*)$': '<rootDir>/src/styles$1',
    '^@/updaters(.*)$': '<rootDir>/src/updaters$1'
  },
  coveragePathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/.next/',
    '<rootDir>/out/',
    '<rootDir>/next.config.js',
    '<rootDir>/nextron.config.js',
    '<rootDir>/electron/',
    '<rootDir>/app/',
    '<rootDir>/dist/',
    '<rootDir>/dist-server/',
    '<rootDir>/dist-install/',
    '<rootDir>/doc/',
    '<rootDir>/coverage/',
    '<rootDir>/jest.config.js',
    '<rootDir>/jest.e2e.config.js',
    '<rootDir>/config/jest/',
    '<rootDir>/public/',
    '<rootDir>/tests/',
    '<rootDir>/updaters'
  ]
}