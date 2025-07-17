import { aliases } from './webpack/alias.js'

const moduleNameMapper = Object.entries(aliases).reduce((map, [key, value]) =>
  ({
    ...map,
    [`^${key}/(.*)$`]: `${process.platform === 'win32' ? '' : '/'}${value}/$1`
  }), {})

export default {
  bail: false,
  preset: 'ts-jest',
  roots: [
    './tests',
    './app'
  ],
  moduleFileExtensions: ['ts', 'js', 'vue'],
  collectCoverageFrom: [
    '!**/node_modules/**',
    '!**/vendor/**',
    '!**/build/**',
    '!**/dist/**',
    '!**/tests/**',
    '!**/config/**',
    '**/app/**/*.{ts,vue}'
  ],
  modulePathIgnorePatterns: [
    '<rootDir>/config/',
    '<rootDir>/node_modules/',
    '<rootDir>/build/',
    '<rootDir>/tests/helpers/',
    '<rootDir>/app/declarations',
    '<rootDir>/app/ui/shared/'
  ],
  testEnvironmentOptions: {
    customExportConditions: ['node']
  },
  transformIgnorePatterns: [
    '/node_modules/(?!reflect-metadata)'
  ],
  coverageReporters: [
    'json-summary',
    'text',
    'lcov'
  ],
  testEnvironment: 'jsdom',
  moduleNameMapper,
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
    '^.+\\.vue$': '@vue/vue3-jest',
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga|css|less)$':
      '<rootDir>/tests/helpers/fileTransformer.js'
  },
  clearMocks: true,
  resetMocks: true,
  fakeTimers: { enableGlobally: true }
}
