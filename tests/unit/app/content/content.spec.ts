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
import { setupContentManualBlocking } from '@/modules/features/manual-blocking/content/manual-blocking.setup'
import { setupContentBroadcast } from '@/modules/broadcast/content/broadcast.setup'
import { dispatcher, setupWorker } from '@/utils/setup-worker'
import { flushPromises } from '../../../helpers/flushPromises'
import { DispatcherInterface } from '@/utils/dispatcher/dispatcher.types'
import { setupContentRateUs } from '@/modules/rate-us/content/rate-us.setup'
const dispatcherWorkMock = jest.fn()

jest.mock('@/modules/features/manual-blocking/content/manual-blocking.setup', () => ({
  setupContentManualBlocking: jest.fn()
}))

jest.mock('@/modules/broadcast/content/broadcast.setup', () => ({
  setupContentBroadcast: jest.fn()
}))

jest.mock('@/modules/rate-us/content/rate-us.setup', () => ({
  setupContentRateUs: jest.fn()
}))

jest.mock('@/utils/setup-worker', () => ({
  setupWorker: jest.fn(),
  dispatcher: jest.fn(() => ({
    work: jest.fn()
  }))
}))

describe('content entrypoint', () => {
  it('bootstraps the content worker and manual blocking iframe', async () => {
    await jest.isolateModulesAsync(async () => {
      jest.mocked(dispatcher).mockReturnValue({ work: dispatcherWorkMock } as unknown as DispatcherInterface)
      require('../../../../app/content/content')
      await flushPromises()
      expect(setupWorker).toHaveBeenCalledWith('CSW')
      expect(setupContentBroadcast).toHaveBeenCalledTimes(1)
      expect(setupContentManualBlocking).toHaveBeenCalledWith(expect.objectContaining({
        iframe: expect.objectContaining({
          url: '/content/manual-blocking/index.html',
          style: expect.objectContaining({
            position: 'fixed',
            width: '280px',
            height: '420px',
            borderRadius: '4px',
            backgroundColor: '#fff'
          })
        })
      }))
      expect(setupContentRateUs).toHaveBeenCalledWith(expect.objectContaining({
        iframe: expect.objectContaining({
          url: '/content/rate-us/index.html',
          style: expect.objectContaining({
            display: 'block',
            width: '264px',
            height: '380px',
            border: 'none',
            top: '10px',
            right: '10px',
            borderRadius: '4px',
            boxShadow: '0px 3px 12px 0px rgba(0, 0, 0, 0.10)',
            backgroundColor: '#fff'
          })
        })
      }))
      expect(dispatcherWorkMock).toHaveBeenCalledTimes(1)
    })
  })
})
