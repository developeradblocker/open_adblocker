(function (source, args) {
  const flag = 'done'
  const uniqueIdentifier = source.uniqueId + source.name + '_' + (Array.isArray(args) ? args.join('_') : '')
  if (source.uniqueId) {
    if (Window.prototype.toString[uniqueIdentifier] === flag) {
      return
    }
  }
  function GoogleSyndicationAdsByGoogle (source) {
    window.adsbygoogle = {
      loaded: true,
      push (arg) {
        if (typeof this.length === 'undefined') {
          this.length = 0
          this.length += 1
        }
        if (arg !== null && arg instanceof Object && arg.constructor.name === 'Object') {
          for (let _i = 0, _Object$keys = Object.keys(arg); _i < _Object$keys.length; _i++) {
            const key = _Object$keys[_i]
            if (typeof arg[key] === 'function') {
              try {
                arg[key].call(this, {})
              } catch (_unused) {}
            }
          }
        }
      }
    }
    const adElems = document.querySelectorAll('.adsbygoogle')
    const css = 'height:1px!important;max-height:1px!important;max-width:1px!important;width:1px!important;'
    const statusAttrName = 'data-adsbygoogle-status'
    const ASWIFT_IFRAME_MARKER = 'aswift_'
    const GOOGLE_ADS_IFRAME_MARKER = 'google_ads_iframe_'
    let executed = false
    for (let i = 0; i < adElems.length; i += 1) {
      const adElemChildNodes = adElems[i].childNodes
      const childNodesQuantity = adElemChildNodes.length
      let areIframesDefined = false
      if (childNodesQuantity > 0) {
        areIframesDefined = childNodesQuantity === 2 && adElemChildNodes[0].nodeName.toLowerCase() === 'iframe' && adElemChildNodes[0].id.includes(ASWIFT_IFRAME_MARKER) && adElemChildNodes[1].nodeName.toLowerCase() === 'iframe' && adElemChildNodes[1].id.includes(GOOGLE_ADS_IFRAME_MARKER)
      }
      if (!areIframesDefined) {
        adElems[i].setAttribute(statusAttrName, 'done')
        const aswiftIframe = document.createElement('iframe')
        aswiftIframe.id = `${ASWIFT_IFRAME_MARKER}${i}`
        aswiftIframe.style = css
        adElems[i].appendChild(aswiftIframe)
        const innerAswiftIframe = document.createElement('iframe')
        aswiftIframe.contentWindow.document.body.appendChild(innerAswiftIframe)
        const googleadsIframe = document.createElement('iframe')
        googleadsIframe.id = `${GOOGLE_ADS_IFRAME_MARKER}${i}`
        googleadsIframe.style = css
        adElems[i].appendChild(googleadsIframe)
        const innerGoogleadsIframe = document.createElement('iframe')
        googleadsIframe.contentWindow.document.body.appendChild(innerGoogleadsIframe)
        executed = true
      }
    }
    if (executed) {
      hit(source)
    }
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
    GoogleSyndicationAdsByGoogle.apply(this, updatedArgs)
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
  name: 'googlesyndication-adsbygoogle',
  args: []
}, [])
