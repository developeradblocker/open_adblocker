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
import { shallowMount, type VueWrapper } from '@vue/test-utils'
import GeneralAbout from '@/ui/settings/components/general/general-about.vue'
import TransparentStub from '../../../../helpers/TransparentStub'
import { GITHUB_LINK, PRIVACY_POLICY_LINK, TERMS_LINK, WEB_PAGE_LINK } from '@/ui/shared/constants'
import { useUserActivity } from '@/modules/user-activity/external/utils'
import { ElementsUI } from '@/modules/user-activity/common/user-activity.types'
import { SETTINGS_ROUTE } from '@/ui/settings/router/route-names'

jest.mock('@/modules/user-activity/external/utils')

describe('GeneralAbout.vue', () => {
  let wrapper: VueWrapper<any>

  const createTabMock = jest.fn()
  const clickActivityMock = jest.fn()
  const elements = {
    policy: '[data-test="policy"]',
    terms: '[data-test="terms"]',
    github: '[data-test="github"]',
    website: '[data-test="website"]'
  }

  const doMount = (): void => {
    if (wrapper?.exists()) {
      wrapper.unmount()
    }

    wrapper = shallowMount(GeneralAbout, {
      global: {
        stubs: {
          BaseBox: TransparentStub(),
          BaseSvg: true
        }
      }
    })
  }

  beforeEach(() => {
    createTabMock.mockClear()
    global.chrome = {
      tabs: {
        create: createTabMock
      }
    } as any
    void (useUserActivity as jest.Mock).mockReturnValue({
      click: clickActivityMock
    })
    doMount()
  })

  it('should render', () => {
    expect(wrapper.exists())
      .toBeTruthy()
  })

  it('should create new tab on terms clicked', async () => {
    await wrapper.get(elements.terms).trigger('click')
    expect(createTabMock).toHaveBeenCalledTimes(1)
    expect(createTabMock).toHaveBeenCalledWith({
      url: TERMS_LINK
    })
    expect(clickActivityMock).toHaveBeenCalledTimes(1)
    expect(clickActivityMock).toHaveBeenCalledWith(ElementsUI.terms, {
      page: SETTINGS_ROUTE.GENERAL,
      to: TERMS_LINK
    })
  })

  it('should create new tab on policy clicked', async () => {
    await wrapper.get(elements.policy).trigger('click')
    expect(createTabMock).toHaveBeenCalledTimes(1)
    expect(createTabMock).toHaveBeenCalledWith({
      url: PRIVACY_POLICY_LINK
    })

    expect(clickActivityMock).toHaveBeenCalledTimes(1)
    expect(clickActivityMock).toHaveBeenCalledWith(ElementsUI.privacy, {
      page: SETTINGS_ROUTE.GENERAL,
      to: PRIVACY_POLICY_LINK
    })
  })

  it('should create new tab on github clicked', async () => {
    await wrapper.get(elements.github).trigger('click')
    expect(createTabMock).toHaveBeenCalledTimes(1)
    expect(createTabMock).toHaveBeenCalledWith({
      url: GITHUB_LINK
    })

    expect(clickActivityMock).toHaveBeenCalledTimes(1)
    expect(clickActivityMock).toHaveBeenCalledWith(ElementsUI.githubButton, {
      page: SETTINGS_ROUTE.GENERAL,
      to: GITHUB_LINK
    })
  })

  it('should create new tab on website clicked', async () => {
    await wrapper.get(elements.website).trigger('click')
    expect(createTabMock).toHaveBeenCalledTimes(1)
    expect(createTabMock).toHaveBeenCalledWith({
      url: WEB_PAGE_LINK
    })

    expect(clickActivityMock).toHaveBeenCalledTimes(1)
    expect(clickActivityMock).toHaveBeenCalledWith(ElementsUI.websiteButton, {
      page: SETTINGS_ROUTE.GENERAL,
      to: WEB_PAGE_LINK
    })
  })
})
