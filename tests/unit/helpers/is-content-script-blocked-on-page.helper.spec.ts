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
import { isContentScriptBlockedOnPage } from '@/helpers/is-content-script-blocked-on-page.helper'

describe('isContentScriptBlockedOnPage', () => {
  it('should return true when no URL is provided', () => {
    expect(isContentScriptBlockedOnPage('')).toBe(true)
    expect(isContentScriptBlockedOnPage('')).toBe(true)
  })

  it('should return true for URLs which are blocking content script injections', () => {
    expect(isContentScriptBlockedOnPage('chrome://extensions')).toBe(true)
    expect(isContentScriptBlockedOnPage('edge://settings')).toBe(true)
    expect(isContentScriptBlockedOnPage('about:blank')).toBe(true)
    expect(isContentScriptBlockedOnPage('devtools://some-tool')).toBe(true)
    expect(isContentScriptBlockedOnPage('https://chromewebstore.google.com/')).toBe(true)
  })

  it('should return false for non-service URLs', () => {
    expect(isContentScriptBlockedOnPage('https://example.com')).toBe(false)
    expect(isContentScriptBlockedOnPage('http://localhost')).toBe(false)
  })
})
