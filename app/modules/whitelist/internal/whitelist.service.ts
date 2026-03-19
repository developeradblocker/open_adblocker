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

import { makeDataAccessor } from '@/utils/storage/make-data-accessor'
import { WhitelistInterface } from '@/modules/whitelist/common/whetelist.types'
import { injectable } from 'inversify'
import { Domain } from '@/common/types'

@injectable()
export class InternalWhitelistService implements WhitelistInterface {
  private storage = makeDataAccessor<Domain[]>('local', 'WHITELIST_DOMAINS', {
    useCache: false,
    default: []
  })

  async setup (domains: Domain[]): Promise<void> {
    await this.storage.write(domains)
  }

  async addDomain (domain: Domain): Promise<Domain[]> {
    if (await this.hasDomain(domain)) {
      return
    }
    const list = await this.getDomains()
    const newList = [...list, domain]
    await this.storage.write(newList)
    return newList
  }

  async removeDomain (domain: Domain): Promise<Domain[]> {
    const list = await this.getDomains()
    const updated = list.filter(d => d !== domain)
    await this.storage.write(updated)
    return updated
  }

  async getDomains (): Promise<Domain[]> {
    return await this.storage.read()
  }

  async hasDomain (domain: Domain): Promise<boolean> {
    const list = await this.getDomains()
    return Boolean(list.find(item => {
      const regexIncludingSubdomains = new RegExp(`^(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)?)*${item}$`)
      return regexIncludingSubdomains.test(domain)
    }))
  }

  async save (rawDomains: string, override?: boolean): Promise<Domain[]> {
    let result: Domain[]
    const domainList = rawDomains.split('\n').filter(domain => domain)
    if (override) {
      result = domainList
    } else {
      result = await this.storage.read()
      domainList.forEach(domain => !result.includes(domain) && result.push(domain))
    }

    await this.storage.write(result)
    return result
  }
}
