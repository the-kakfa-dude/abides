module.exports = {
  globals: {
    "ts-jest": {
      skipBabel: true,
    },
  },
  preset: 'ts-jest',
  testEnvironment: 'node',
  testPathIgnorePatterns: ['/node_modules/', 
                           '/build/',
                           '/coverage/',
                           '.scannerwork',
                           '.vscode'],
  moduleFileExtensions: ["js", "ts"],
  testResultsProcessor: "jest-sonar-reporter",
  transform: {
    "^.+\\.ts$": "<rootDir>/node_modules/ts-jest/preprocessor.js",
  },
  testMatch: ["<rootDir>/test/**/*.spec.ts"],
  verbose: true,
};
