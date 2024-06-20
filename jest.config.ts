import { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest/presets/default-esm',
  testTimeout: 60000,
  maxConcurrency: 1,
  verbose: true,
  silent: false,
  globals: {
    'ts-jest': {
      useESM: true,
      isolatedModules: false,
      tsconfig: './tsconfig.jest.json',
    },
  },
  // globalSetup: "./test/database/setup.ts",
  setupFiles: ['ts-node/register', 'dotenv/config'],
  clearMocks: true,
  forceExit: true,
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '.',
  testEnvironment: 'node',
  testRegex: '(.*)(\\.spec\\.ts)$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  collectCoverageFrom: ['./src'],
  reporters: ['default'],
};

export default config;
