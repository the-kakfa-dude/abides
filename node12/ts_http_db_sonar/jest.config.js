module.exports = {
  globals: {
    'ts-jest': {
      babelConfig: false,
    },
  },
  preset: 'ts-jest',
  testEnvironment: 'node',
  testPathIgnorePatterns: [
    '/src/entity/',
    '/src/migration/',
    '/node_modules/',
    '/build/',
    '/coverage/',
    '.scannerwork',
    '.vscode',
  ],
  moduleFileExtensions: [
    'js',
    'ts',
  ],
  testResultsProcessor: 'jest-sonar-reporter',
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  testMatch: [
    '<rootDir>/func/**/*.spec.ts',
    '<rootDir>/test/**/*.spec.ts',
  ],
  verbose: true,
};

