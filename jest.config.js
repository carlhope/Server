module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  transform: {
    '^.+\\.ts$': ['ts-jest', {
      useESM: false
    }]
  },
  moduleFileExtensions: ['ts', 'js', 'json'],
  testMatch: ['**/Tests/*.test.ts']
};

