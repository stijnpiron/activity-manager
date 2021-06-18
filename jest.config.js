module.exports = {
  collectCoverage: true,
  collectCoverageFrom: [
    '<rootDir>/src/**/*.ts',
    '<rootDir>/src/**/*.tsx',
    '!<rootDir>/src/**/*.spec.ts',
    '!<rootDir>/src/main.dev.ts',
    '!<rootDir>/src/main.prod.js',
    '!<rootDir>/src/**/*.spec.tsx',
    '!<rootDir>/src/**/*.test.ts',
    '!<rootDir>/src/**/*.test.tsx',
    '!**/node_modules/**',
    '!**/__tests__/**',
  ],
  coverageDirectory: 'coverage',
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    },
  },
  displayName: {
    color: 'blue',
    name: 'Azure Functions',
  },
  errorOnDeprecated: true,
  preset: './node_modules/ts-jest/jest-preset.js',
  reporters: ['default'],
  roots: ['<rootDir>/src'],
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.[jt]s', '**/?(*.)+(spec|test).[jt]s[x]'],
  testPathIgnorePatterns: ['/node_modules/', '/dist/', '/build/'],
  transform: {
    '^.+\\.(ts)$': 'ts-jest',
  },
};
