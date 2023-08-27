/** @type {import('ts-jest').JestConfigWithTsJest} */
export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  coveragePathIgnorePatterns: [
    './dist',
    'src/application/app.ts',
    'src/infra/database/datasource.ts',
    'src/infra/database/data/seed.json',
    'src/domain/errors',
  ],
};
