// eslint-disable-next-line @typescript-eslint/no-require-imports
const nextJest = require("next/jest.js");

const createJestConfig = nextJest({ dir: "./" });

const customJestConfig = {
  testEnvironment: "jsdom",

  // ✅ Only run test files
  testMatch: [
    "**/__tests__/**/*.(test|spec).(ts|tsx)",
    "**/?(*.)+(test|spec).(ts|tsx)",
  ],

  // ❌ Ignore Prisma & scripts
  testPathIgnorePatterns: [
    "<rootDir>/node_modules/",
    "<rootDir>/prisma/",
  ],

  // ❌ Ignore build output
  modulePathIgnorePatterns: ["<rootDir>/.next/"],

  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],

  collectCoverage: true,
  collectCoverageFrom: [
    "src/**/*.{ts,tsx}",
    "!src/**/*.test.{ts,tsx}",
    "!src/app/api/**", // APIs optional for unit tests
  ],

  // ⛔ TEMPORARILY disable threshold (we’ll enable later)
  coverageThreshold: {
    global: {
      branches: 0,
      functions: 0,
      lines: 0,
      statements: 0,
    },
  },
};

module.exports = createJestConfig(customJestConfig);
