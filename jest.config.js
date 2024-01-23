module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageProvider: 'v8',
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/app.ts',
    '!src/interfaces/**/*.ts',
    '!src/__test__/**/*.ts',
  ],
  coverageReporters: ['json', 'lcov', 'text', 'clover'],
};
