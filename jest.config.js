export default {
  testEnvironment: 'jsdom',
  moduleFileExtensions: ['js', 'jsx'],
  transform: {
    "^.+\\.[jt]sx?$": "babel-jest"
  },
  collectCoverage: true,
  collectCoverageFrom: [
    "src/**/*.{js,jsx}",
    "!src/main.jsx"
  ],
  coverageDirectory: "coverage",
  testMatch: [
    "**/__tests__/**/*.[jt]s?(x)",
    "**/?(*.)+(test).[jt]s?(x)"
  ],
  testPathIgnorePatterns: [
    "/node_modules/",
    "/e2e/"
  ],
};