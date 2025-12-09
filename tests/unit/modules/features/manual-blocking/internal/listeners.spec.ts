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
import { AddRuleListener } from '@/modules/features/manual-blocking/internal/listeners/add-rule.listener'
import { ResetRulesListener } from '@/modules/features/manual-blocking/internal/listeners/reset-rules.listener'
import { SaveListener } from '@/modules/features/manual-blocking/internal/listeners/save.listener'
import {
  ManualBlockingMessages
} from '@/modules/features/manual-blocking/common/manual-blocking.messages'
import { Box } from '@/utils/dispatcher/dispatcher.types'

describe('Manual blocking listeners', () => {
  const service = {
    addRule: jest.fn(),
    resetRules: jest.fn(),
    saveRules: jest.fn()
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('AddRuleListener forwards payloads to service', async () => {
    const listener = new AddRuleListener(service as any)

    expect(listener.on()).toBe(ManualBlockingMessages.addRule)
    expect(listener.main()).toBe(false)

    const box = {
      message: {
        payload: {
          ruleText: 'example##.ad'
        }
      }
    } as Box<any>

    await listener.handle(box)
    expect(service.addRule).toHaveBeenCalledWith('example##.ad')
  })

  it('ResetRulesListener forwards payloads to service', async () => {
    const listener = new ResetRulesListener(service as any)

    expect(listener.on()).toBe(ManualBlockingMessages.resetRules)
    expect(listener.main()).toBe(false)

    const payload = ['a', 'b']
    await listener.handle({ message: { payload: { rules: payload } } } as Box<any>)
    expect(service.resetRules).toHaveBeenCalledWith(payload)
  })

  it('ImportListener returns service result', async () => {
    const listener = new SaveListener(service as any)
    service.saveRules.mockResolvedValueOnce(true)

    expect(listener.on()).toBe(ManualBlockingMessages.save)
    expect(listener.main()).toBe(true)

    const result = await listener.handle({
      message: { payload: { userRules: ['a'], override: false } }
    } as Box<any>)

    expect(service.saveRules).toHaveBeenCalledWith(['a'], false, false)
    expect(result).toBe(true)
  })
})
