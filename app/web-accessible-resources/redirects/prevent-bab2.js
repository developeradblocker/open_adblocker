(function (source, args) {
  const flag = 'done'
  const uniqueIdentifier = source.uniqueId + source.name + '_' + (Array.isArray(args) ? args.join('_') : '')
  if (source.uniqueId) {
    if (Window.prototype.toString[uniqueIdentifier] === flag) {
      return
    }
  }
  function preventBab2 (source) {
    const script = document.currentScript
    if (script === null) {
      return
    }
    const url = script.src
    if (typeof url !== 'string') {
      return
    }
    const domainsStr = ['adclixx\\.net', 'adnetasia\\.com', 'adtrackers\\.net', 'bannertrack\\.net'].join('|')
    const matchStr = `^https?://[\\w-]+\\.(${domainsStr})/.`
    const domainsRegex = new RegExp(matchStr)
    if (domainsRegex.test(url) === false) {
      return
    }
    window.nH7eXzOsG = 858
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
  const updatedArgs = args ? [].concat(source).concat(args) : [source]
  try {
    preventBab2.apply(this, updatedArgs)
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
  name: 'prevent-bab2',
  args: []
}, [])
