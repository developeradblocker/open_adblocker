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
import { createOnInstallHandler } from '@/modules/hello-and-goodbye/internal/handlers/on-install.handler'

const setUninstallURLMock = jest.fn()
const createTabMock = jest.fn().mockResolvedValue(undefined)

const INSTALL_URL = 'https://example.com/thank-you/'
const UNINSTALL_URL = 'https://example.com/uninstall/'

global.chrome = {
  runtime: {
    setUninstallURL: setUninstallURLMock,
    OnInstalledReason: {
      INSTALL: 'install'
    }
  },
  tabs: {
    create: createTabMock
  }
} as any

describe('createOnInstallHandler', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should set the uninstall URL on creation and return the install handler', () => {
    const handler = createOnInstallHandler(INSTALL_URL, UNINSTALL_URL)
    expect(setUninstallURLMock).toHaveBeenCalledWith(UNINSTALL_URL)
    expect(typeof handler).toBe('function')
  })

  it('should open a new tab with the install URL when installed', () => {
    const handler = createOnInstallHandler(INSTALL_URL, UNINSTALL_URL)
    handler({ reason: 'install' } as any)
    expect(createTabMock).toHaveBeenCalledWith({ url: INSTALL_URL })
  })

  it('should do nothing if the reason is not install', () => {
    const handler = createOnInstallHandler(INSTALL_URL, UNINSTALL_URL)
    handler({ reason: 'update' } as any)
    expect(createTabMock).not.toHaveBeenCalled()
  })
})
