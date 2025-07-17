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
import { InternalAdBlockerService } from '@/modules/ad-blocker/internal/services/ad-blocker.service'
import { BlockedAdsCounter } from '@/common/types'
import { getActiveTabHelper } from '@/helpers/get-active-tab.helper'
import { getDomainHelper } from '@/helpers/get-domain.helper'
import Tab = chrome.tabs.Tab

jest.mock('@/helpers/get-active-tab.helper')
jest.mock('@/helpers/get-domain.helper')

describe('InternalAdBlockerService', () => {
  let service: InternalAdBlockerService

  const mockAdGuard = {
    isPaused: jest.fn(),
    addToAllowlist: jest.fn(),
    removeFromAllowlist: jest.fn()
  }

  const mockCounterByTab = {
    get: jest.fn()
  }

  const mockTotalCounter = {
    get: jest.fn()
  }

  beforeEach(() => {
    jest.clearAllMocks()
    service = new InternalAdBlockerService(
      mockAdGuard as any,
      mockCounterByTab as any,
      mockTotalCounter as any
    )
  })

  describe('isPaused', () => {
    it('should return the result from adGuard.isPaused', async () => {
      const domain = 'example.com'
      mockAdGuard.isPaused.mockResolvedValue(true)
      const result = await service.isPaused(domain)
      expect(result).toBe(true)
      expect(mockAdGuard.isPaused).toHaveBeenCalledWith(domain)
    })
  })

  describe('toggle', () => {
    it('should do nothing if no active tab is returned', async () => {
      jest.mocked(getActiveTabHelper).mockResolvedValue(null)
      await service.toggle(true)
      expect(mockAdGuard.addToAllowlist).not.toHaveBeenCalled()
      expect(mockAdGuard.removeFromAllowlist).not.toHaveBeenCalled()
    })

    it('should do nothing if active tab has no url', async () => {
      jest.mocked(getActiveTabHelper as jest.Mock).mockResolvedValue({ id: 1, url: '' })
      await service.toggle(false)
      expect(mockAdGuard.addToAllowlist).not.toHaveBeenCalled()
      expect(mockAdGuard.removeFromAllowlist).not.toHaveBeenCalled()
    })

    it('should call adGuard.addToAllowlist when state is true', async () => {
      const fakeTab = {
        id: 1,
        url: 'https://example.com/page'
      } as Tab
      const fakeDomain = 'example.com'
      jest.mocked(getActiveTabHelper).mockResolvedValue(fakeTab)
      jest.mocked(getDomainHelper).mockReturnValue(fakeDomain)
      await service.toggle(true)
      expect(getActiveTabHelper).toHaveBeenCalled()
      expect(getDomainHelper).toHaveBeenCalledWith(fakeTab.url)
      expect(mockAdGuard.addToAllowlist).toHaveBeenCalledWith(fakeDomain)
    })

    it('should call adGuard.removeFromAllowlist when state is false', async () => {
      const fakeTab = {
        id: 2,
        url: 'https://example.com/page'
      }
      const fakeDomain = 'example.com'
      ;(getActiveTabHelper as jest.Mock).mockResolvedValue(fakeTab)
      ;(getDomainHelper as jest.Mock).mockReturnValue(fakeDomain)
      await service.toggle(false)
      expect(getActiveTabHelper).toHaveBeenCalled()
      expect(getDomainHelper).toHaveBeenCalledWith(fakeTab.url)
      expect(mockAdGuard.removeFromAllowlist).toHaveBeenCalledWith(fakeDomain)
    })
  })

  describe('getAdCounterByTabId', () => {
    it('should return the blocked ads counter from counterByTab', async () => {
      const tabId = 10
      const fakeCounter: BlockedAdsCounter = 5
      mockCounterByTab.get.mockResolvedValue(fakeCounter)
      const result = await service.getAdCounterByTabId(tabId)
      expect(mockCounterByTab.get).toHaveBeenCalledWith(tabId)
      expect(result).toEqual(fakeCounter)
    })
  })

  describe('getTotalAdCounter', () => {
    it('should return the total blocked ads counter from totalCounter', async () => {
      const fakeCounter: BlockedAdsCounter = 42
      mockTotalCounter.get.mockResolvedValue(fakeCounter)
      const result = await service.getTotalAdCounter()
      expect(mockTotalCounter.get).toHaveBeenCalled()
      expect(result).toEqual(fakeCounter)
    })
  })
})
