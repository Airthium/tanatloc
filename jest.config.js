module.exports = {
  setupFiles: [
    '<rootDir>/config/jest/mock.js',
    '<rootDir>/config/jest/enzyme.js'
  ],
  collectCoverageFrom: [
    '**/*.{js,jsx,ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**'
  ],
  testPathIgnorePatterns: [
    '/node_modules/',
    '/renderer/.next/',
    'renderer/out/',
    'renderer/next.config.js',
    '/main/',
    '/app/',
    '/dist/',
    '/dist-server/',
    '/doc/',
    '/coverage/',
    '/jest.config.js',
    '/config/jest/'
  ],
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': '<rootDir>/node_modules/babel-jest',
    '^.+\\.css$': '<rootDir>/config/jest/cssTransform.js'
  },
  transformIgnorePatterns: [
    '/node_modules/',
    '^.+\\.module\\.(css|sass|scss)$'
  ],
  moduleNameMapper: {
    '^.+\\.module\\.(css|sass|scss)$': 'identity-obj-proxy'
  },
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/renderer/.next/',
    'renderer/out/',
    'renderer/next.config.js',
    '/main/',
    '/app/',
    '/dist/',
    '/dist-server/',
    '/doc/',
    '/coverage/',
    '/doc/',
    '/jest.config.js',
    '/config/jest/'
  ]
}
