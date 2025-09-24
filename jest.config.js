/**
 * @file
 * This file is part of Open Ad Blocker Browser Extension (https://github.com/developeradblocker/open_adblocker).
 *
 * Open Ad Blocker Browser Extension is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Open Ad Blocker Browser Extension is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
 * See the GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Open Ad Blocker Browser Extension. If not, see <http://www.gnu.org/licenses/>.
 */
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
