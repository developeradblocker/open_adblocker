import { helloAndGoodbyeSetup, handleOnInstall } from '@/modules/hello-and-goodbye/internal/hello-and-goodbye.setup'

const setUninstallURLMock = jest.fn().mockResolvedValue(undefined)
const addListenerMock = jest.fn()
const createTabMock = jest.fn().mockResolvedValue(undefined)

global.chrome = {
  runtime: {
    setUninstallURL: setUninstallURLMock,
    onInstalled: {
      addListener: addListenerMock
    },
    OnInstalledReason: {
      INSTALL: 'install'
    }
  },
  tabs: {
    create: createTabMock
  }
} as any

describe('helloAndGoodbyeSetup', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should set the uninstall URL and register an install handler', () => {
    helloAndGoodbyeSetup()
    expect(setUninstallURLMock).toHaveBeenCalledWith('https://openadblocker.com/uninstall/')
    expect(addListenerMock).toHaveBeenCalledWith(handleOnInstall)
  })
})

describe('handleOnInstall', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should open a new tab when installed', () => {
    const details = { reason: chrome.runtime.OnInstalledReason.INSTALL } as any
    handleOnInstall(details)
    expect(createTabMock).toHaveBeenCalledWith({
      url: 'https://openadblocker.com/thank-you/'
    })
  })

  it('should do nothing if not installed', () => {
    const details = { reason: 'update' } as any
    handleOnInstall(details)
    expect(createTabMock).not.toHaveBeenCalled()
  })
})
