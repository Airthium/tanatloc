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
    '<rootDir>/node_modules/',
    '<rootDir>/renderer/.next/',
    '<rootDir>/renderer/out/',
    '<rootDir>/renderer/next.config.js',
    '<rootDir>/main/',
    '<rootDir>/app/',
    '<rootDir>/dist/',
    '<rootDir>/dist-server/',
    '<rootDir>/dist-install/',
    '<rootDir>/doc/',
    '<rootDir>/coverage/',
    '<rootDir>/jest.config.js',
    '<rootDir>/config/jest/'
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
    '<rootDir>/node_modules/',
    '<rootDir>/renderer/.next/',
    '<rootDir>/renderer/out/',
    '<rootDir>/renderer/next.config.js',
    '<rootDir>/main/',
    '<rootDir>/app/',
    '<rootDir>/dist/',
    '<rootDir>/dist-server/',
    '<rootDir>/dist-install/',
    '<rootDir>/doc/',
    '<rootDir>/coverage/',
    '<rootDir>/jest.config.js',
    '<rootDir>/config/jest/',
    '<rootDir>/src/lib/three/controls/'
  ]
}
