(function (source, args) {
  const flag = 'done'
  const uniqueIdentifier = source.uniqueId + source.name + '_' + (Array.isArray(args) ? args.join('_') : '')
  if (source.uniqueId) {
    if (Window.prototype.toString[uniqueIdentifier] === flag) {
      return
    }
  }
  function DidomiLoader (source) {
    function UserConsentStatusForVendorSubscribe () {}
    UserConsentStatusForVendorSubscribe.prototype.filter = function () {
      return new UserConsentStatusForVendorSubscribe()
    }
    UserConsentStatusForVendorSubscribe.prototype.subscribe = noopFunc
    function UserConsentStatusForVendor () {}
    UserConsentStatusForVendor.prototype.first = function () {
      return new UserConsentStatusForVendorSubscribe()
    }
    UserConsentStatusForVendor.prototype.filter = function () {
      return new UserConsentStatusForVendorSubscribe()
    }
    UserConsentStatusForVendor.prototype.subscribe = noopFunc
    const DidomiWrapper = {
      isConsentRequired: falseFunc,
      getUserConsentStatusForPurpose: trueFunc,
      getUserConsentStatus: trueFunc,
      getUserStatus: noopFunc,
      getRequiredPurposes: noopArray,
      getUserConsentStatusForVendor: trueFunc,
      Purposes: {
        Cookies: 'cookies'
      },
      notice: {
        configure: noopFunc,
        hide: noopFunc,
        isVisible: falseFunc,
        show: noopFunc,
        showDataProcessing: trueFunc
      },
      isUserConsentStatusPartial: falseFunc,
      on () {
        return {
          actions: {},
          emitter: {},
          services: {},
          store: {}
        }
      },
      shouldConsentBeCollected: falseFunc,
      getUserConsentStatusForAll: noopFunc,
      getObservableOnUserConsentStatusForVendor () {
        return new UserConsentStatusForVendor()
      }
    }
    window.Didomi = DidomiWrapper
    const didomiStateWrapper = {
      didomiExperimentId: '',
      didomiExperimentUserGroup: '',
      didomiGDPRApplies: 1,
      didomiIABConsent: '',
      didomiPurposesConsent: '',
      didomiPurposesConsentDenied: '',
      didomiPurposesConsentUnknown: '',
      didomiVendorsConsent: '',
      didomiVendorsConsentDenied: '',
      didomiVendorsConsentUnknown: '',
      didomiVendorsRawConsent: '',
      didomiVendorsRawConsentDenied: '',
      didomiVendorsRawConsentUnknown: ''
    }
    window.didomiState = didomiStateWrapper
    const tcData = {
      eventStatus: 'tcloaded',
      gdprApplies: false,
      listenerId: noopFunc,
      vendor: {
        consents: []
      },
      purpose: {
        consents: []
      }
    }
    const __tcfapiWrapper = function __tcfapiWrapper (command, version, callback) {
      if (typeof callback !== 'function' || command === 'removeEventListener') {
        return
      }
      callback(tcData, true)
    }
    window.__tcfapi = __tcfapiWrapper
    const didomiEventListenersWrapper = {
      stub: true,
      push: noopFunc
    }
    window.didomiEventListeners = didomiEventListenersWrapper
    const didomiOnReadyWrapper = {
      stub: true,
      push (arg) {
        if (typeof arg !== 'function') {
          return
        }
        if (document.readyState !== 'complete') {
          window.addEventListener('load', () => {
            setTimeout(arg(window.Didomi))
          })
        } else {
          setTimeout(arg(window.Didomi))
        }
      }
    }
    window.didomiOnReady = window.didomiOnReady || didomiOnReadyWrapper
    if (Array.isArray(window.didomiOnReady)) {
      window.didomiOnReady.forEach((arg) => {
        if (typeof arg === 'function') {
          try {
            setTimeout(arg(window.Didomi))
          } catch (e) {}
        }
      })
    }
    hit(source)
  }
  function hit (e) {
    if (e.verbose) {
      try {
        const n = console.trace.bind(console); let i = '[AdGuard] '
        e.engine === 'corelibs'
          ? i += e.ruleText
          : (e.domainName && (i += `${e.domainName}`),
            e.args ? i += `#%#//scriptlet('${e.name}', '${e.args.join("', '")}')` : i += `#%#//scriptlet('${e.name}')`),
        n && n(i)
      } catch (e) {}
      typeof window.__debug === 'function' && window.__debug(e)
    }
  }
  function noopFunc () {}
  function noopArray () {
    return []
  }
  function trueFunc () {
    return !0
  }
  function falseFunc () {
    return !1
  }
  const updatedArgs = args ? [].concat(source).concat(args) : [source]
  try {
    DidomiLoader.apply(this, updatedArgs)
    if (source.uniqueId) {
      Object.defineProperty(Window.prototype.toString, uniqueIdentifier, {
        value: flag,
        enumerable: false,
        writable: false,
        configurable: false
      })
    }
  } catch (e) {
    console.log(e)
  }
})({
  name: 'didomi-loader',
  args: []
}, [])
