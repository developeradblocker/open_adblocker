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
import { InternalWhitelistService } from '@/modules/whitelist/internal/whitelist.service'
import { Domain } from '@/common/types'

describe('InternalWhitelistService', () => {
  let service: InternalWhitelistService
  // Create a fake storage that mimics the behavior of the data accessor
  let fakeStorage: {
    read: jest.Mock<Promise<Domain[]>, []>
    write: jest.Mock<Promise<void>, [Domain[]]>
  }

  beforeEach(() => {
    fakeStorage = {
      read: jest.fn().mockResolvedValue([]),
      write: jest.fn().mockResolvedValue(undefined)
    }
    service = new InternalWhitelistService()
    // Override the storage property with a fake one
    // @ts-ignore
    service.storage = fakeStorage
  })

  describe('getDomains', () => {
    it('should return list from storage', async () => {
      const domains: Domain[] = ['example.com']
      fakeStorage.read.mockResolvedValueOnce(domains)
      const result = await service.getDomains()
      expect(result).toEqual(domains)
      expect(fakeStorage.read).toHaveBeenCalled()
    })
  })

  describe('addDomain', () => {
    it('should add a new domain when not already present', async () => {
      const initialDomains: Domain[] = ['example.com']
      fakeStorage.read.mockResolvedValueOnce(initialDomains)
      const newDomain: Domain = 'test.com'
      // First call to hasDomain, then getDomains inside addDomain
      fakeStorage.read.mockResolvedValueOnce([...initialDomains])
      const updated = await service.addDomain(newDomain)
      expect(updated).toEqual([...initialDomains, newDomain])
      expect(fakeStorage.write).toHaveBeenCalledWith([...initialDomains, newDomain])
    })

    it('should not add domain if already present', async () => {
      const domains: Domain[] = ['example.com']
      fakeStorage.read.mockResolvedValue(domains)
      const result = await service.addDomain('example.com')
      expect(result).toBeUndefined()
      expect(fakeStorage.write).not.toHaveBeenCalled()
    })
  })

  describe('removeDomain', () => {
    it('should remove an existing domain', async () => {
      const domains: Domain[] = ['example.com', 'test.com']
      fakeStorage.read.mockResolvedValueOnce(domains)
      const updated = await service.removeDomain('test.com')
      expect(updated).toEqual(['example.com'])
      expect(fakeStorage.write).toHaveBeenCalledWith(['example.com'])
    })

    it('should return empty array if domain is not present', async () => {
      const domains: Domain[] = ['example.com']
      fakeStorage.read.mockResolvedValueOnce(domains)
      const updated = await service.removeDomain('notfound.com')
      expect(updated).toEqual(domains)
      expect(fakeStorage.write).toHaveBeenCalledWith(domains)
    })
  })

  describe('hasDomain', () => {
    it('should return true if domain is present', async () => {
      const domains: Domain[] = ['example.com']
      fakeStorage.read.mockResolvedValueOnce(domains)
      const result = await service.hasDomain('example.com')
      expect(result).toBe(true)
    })

    it('should return false if domain is not present', async () => {
      fakeStorage.read.mockResolvedValueOnce(['example.com'])
      const result = await service.hasDomain('test.com')
      expect(result).toBe(false)
    })
  })
})
