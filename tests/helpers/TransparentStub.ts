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

const slotsRenderTemplate = `
  <div :data-original-tag="tagName">
    <div
      v-for="(value, name) in $slots"
      :key="name"
      :data-test-slot="name"
    >
      <slot :name="name" :data-test="name">
        {{ name }}
      </slot>
    </div>
  </div>
`
interface ComponentStubInterface {
  props: any
  options: any
  methods: any
  name: string
}
const TransparentStub = (componentToStub?: ComponentStubInterface, {
  mocks = {}, name = '', template = slotsRenderTemplate, computed = {}
} = {}): any => {
  const { props, methods: originalMethods = {}, name: originalName } = componentToStub || {}

  const stubName = `${name || originalName || 'anonymous'}-stub`

  const originalMockedMethods = Object.entries(originalMethods)
    .reduce((methods, [method]) => ({
      ...methods,
      [method]: jest.fn()
    }), {})

  const methods = { ...originalMockedMethods, ...mocks }

  return {
    name: stubName,
    props: props || componentToStub?.options?.props,
    data: () => ({
      tagName: 'div'
    }),
    methods,
    created (): void {
      this.tagName = stubName
    },
    computed,
    template,
    // Allows wrapper.find(Component) or wrapper.get(Component) to work properly with the stub
    $_vueTestUtils_original: componentToStub
  }
}

export default TransparentStub
