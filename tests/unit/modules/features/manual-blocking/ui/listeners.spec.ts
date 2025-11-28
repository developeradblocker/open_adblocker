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
import { AddRuleListener } from '@/modules/features/manual-blocking/ui/listeners/add-rule.listener'
import { ElementSelectedListener } from '@/modules/features/manual-blocking/ui/listeners/element-selected.listener'
import { ManualBlockingMessages } from '@/modules/features/manual-blocking/common/manual-blocking.messages'
import { useBlockElementStore } from '@/ui/manual-blocking/store/block-element.store'
import router from '@/ui/manual-blocking/router'
import { Route } from '@/ui/manual-blocking/router/route-names'
import { Box } from '@/utils/dispatcher/dispatcher.types'

jest.mock('@/ui/manual-blocking/store/block-element.store', () => ({
  useBlockElementStore: jest.fn()
}))

jest.mock('@/ui/manual-blocking/router', () => ({
  push: jest.fn()
}))

describe('UI manual blocking listeners', () => {
  const addRuleMock = jest.fn()
  const pushMock = jest.mocked(router.push)

  beforeEach(() => {
    jest.clearAllMocks()
    pushMock.mockResolvedValue(undefined as any)
    jest.mocked(useBlockElementStore).mockReturnValue({
      addRule: addRuleMock
    } as any)
  })

  it('AddRuleListener updates the block element store', async () => {
    const listener = new AddRuleListener()

    expect(listener.on()).toBe(ManualBlockingMessages.addRule)
    expect(listener.main()).toBe(false)

    await listener.handle({
      message: { payload: { ruleText: 'example##.ad' } }
    } as Box<any>)

    expect(addRuleMock).toHaveBeenCalledWith('example##.ad')
  })

  it('ElementSelectedListener routes to selection page with query params', async () => {
    const listener = new ElementSelectedListener()

    expect(listener.on()).toBe(ManualBlockingMessages.elementSelected)
    expect(listener.main()).toBe(false)

    await listener.handle({
      message: {
        payload: {
          elementIndex: 2,
          elementsInTraversedTree: 5
        }
      }
    } as Box<any>)

    expect(pushMock).toHaveBeenCalledWith({
      name: Route.selection,
      query: {
        elementIndex: 2,
        elementsInTraversedTree: 5
      }
    })
  })
})
