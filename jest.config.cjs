module.exports = {
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/packages/ui'],
  testMatch: ['**/*.test.ts', '**/*.test.tsx'],
  transform: { '^.+\\.[tj]sx?$': 'babel-jest' },
  setupFilesAfterEnv: ['<rootDir>/packages/ui/test/setup.ts'],
  moduleNameMapper: { '\\.css$': '<rootDir>/packages/ui/test/style-mock.cjs' },
  collectCoverageFrom: [
    'packages/ui/src/**/*.{ts,tsx}',
    '!packages/ui/src/**/*.stories.tsx',
    '!packages/ui/src/**/*.test.{ts,tsx}',
    '!packages/ui/src/index.ts',
  ],
  coverageThreshold: { global: { statements: 80, branches: 70, functions: 80, lines: 80 } },
  coverageReporters: ['text', 'json-summary', 'lcov'],
};
