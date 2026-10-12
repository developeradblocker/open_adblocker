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
import { helloAndGoodbyeSetup } from '@/modules/hello-and-goodbye/internal/hello-and-goodbye.setup'

const setUninstallURLMock = jest.fn()
const addListenerMock = jest.fn()

const INSTALL_URL = 'http://localhost:8080/thank-you/'
const UNINSTALL_URL = 'http://localhost:8080/uninstall/'

global.chrome = {
  runtime: {
    setUninstallURL: setUninstallURLMock,
    onInstalled: {
      addListener: addListenerMock
    },
    OnInstalledReason: {
      INSTALL: 'install'
    }
  }
} as any

describe('helloAndGoodbyeSetup', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should set the uninstall URL and register an install handler', () => {
    helloAndGoodbyeSetup(INSTALL_URL, UNINSTALL_URL)
    expect(setUninstallURLMock).toHaveBeenCalledWith(UNINSTALL_URL)
    expect(addListenerMock).toHaveBeenCalledTimes(1)
    expect(typeof addListenerMock.mock.calls[0][0]).toBe('function')
  })
})
