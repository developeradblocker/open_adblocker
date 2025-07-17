(function (source, args) {
  const flag = 'done'
  const uniqueIdentifier = source.uniqueId + source.name + '_' + (Array.isArray(args) ? args.join('_') : '')
  if (source.uniqueId) {
    if (Window.prototype.toString[uniqueIdentifier] === flag) {
      return
    }
  }
  function Matomo (source) {
    const Tracker = function Tracker () {}
    Tracker.prototype.setDoNotTrack = noopFunc
    Tracker.prototype.setDomains = noopFunc
    Tracker.prototype.setCustomDimension = noopFunc
    Tracker.prototype.trackPageView = noopFunc
    const AsyncTracker = function AsyncTracker () {}
    AsyncTracker.prototype.addListener = noopFunc
    const matomoWrapper = {
      getTracker: Tracker,
      getAsyncTracker: AsyncTracker
    }
    window.Piwik = matomoWrapper
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
  const updatedArgs = args ? [].concat(source).concat(args) : [source]
  try {
    Matomo.apply(this, updatedArgs)
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
  name: 'matomo',
  args: []
}, [])
