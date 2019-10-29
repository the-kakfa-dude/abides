module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testPathIgnorePatterns: ['/node_modules/', 
                           '/build/',
                           '/coverage/',
                           '.vscode'],
  verbose: true,
};
