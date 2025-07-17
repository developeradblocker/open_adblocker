(function (source, args) {
  const flag = 'done'
  const uniqueIdentifier = source.uniqueId + source.name + '_' + (Array.isArray(args) ? args.join('_') : '')
  if (source.uniqueId) {
    if (Window.prototype.toString[uniqueIdentifier] === flag) {
      return
    }
  }
  function GoogleAnalyticsGa (source) {
    function Gaq () {}
    Gaq.prototype.Na = noopFunc
    Gaq.prototype.O = noopFunc
    Gaq.prototype.Sa = noopFunc
    Gaq.prototype.Ta = noopFunc
    Gaq.prototype.Va = noopFunc
    Gaq.prototype._createAsyncTracker = noopFunc
    Gaq.prototype._getAsyncTracker = noopFunc
    Gaq.prototype._getPlugin = noopFunc
    Gaq.prototype.push = function (data) {
      if (typeof data === 'function') {
        data()
        return
      }
      if (Array.isArray(data) === false) {
        return
      }
      if (typeof data[0] === 'string' && /(^|\.)_link$/.test(data[0]) && typeof data[1] === 'string') {
        window.location.assign(data[1])
      }
      if (data[0] === '_set' && data[1] === 'hitCallback' && typeof data[2] === 'function') {
        data[2]()
      }
    }
    const gaq = new Gaq()
    const asyncTrackers = window._gaq || []
    if (Array.isArray(asyncTrackers)) {
      while (asyncTrackers[0]) {
        gaq.push(asyncTrackers.shift())
      }
    }
    window._gaq = gaq.qf = gaq
    function Gat () {}
    const api = ['_addIgnoredOrganic', '_addIgnoredRef', '_addItem', '_addOrganic', '_addTrans', '_clearIgnoredOrganic', '_clearIgnoredRef', '_clearOrganic', '_cookiePathCopy', '_deleteCustomVar', '_getName', '_setAccount', '_getAccount', '_getClientInfo', '_getDetectFlash', '_getDetectTitle', '_getLinkerUrl', '_getLocalGifPath', '_getServiceMode', '_getVersion', '_getVisitorCustomVar', '_initData', '_link', '_linkByPost', '_setAllowAnchor', '_setAllowHash', '_setAllowLinker', '_setCampContentKey', '_setCampMediumKey', '_setCampNameKey', '_setCampNOKey', '_setCampSourceKey', '_setCampTermKey', '_setCampaignCookieTimeout', '_setCampaignTrack', '_setClientInfo', '_setCookiePath', '_setCookiePersistence', '_setCookieTimeout', '_setCustomVar', '_setDetectFlash', '_setDetectTitle', '_setDomainName', '_setLocalGifPath', '_setLocalRemoteServerMode', '_setLocalServerMode', '_setReferrerOverride', '_setRemoteServerMode', '_setSampleRate', '_setSessionTimeout', '_setSiteSpeedSampleRate', '_setSessionCookieTimeout', '_setVar', '_setVisitorCookieTimeout', '_trackEvent', '_trackPageLoadTime', '_trackPageview', '_trackSocial', '_trackTiming', '_trackTrans', '_visitCode']
    const tracker = api.reduce((res, funcName) => {
      res[funcName] = noopFunc
      return res
    }, {})
    tracker._getLinkerUrl = function (a) {
      return a
    }
    tracker._link = function (url) {
      if (typeof url !== 'string') {
        return
      }
      try {
        window.location.assign(url)
      } catch (e) {
        logMessage(source, e)
      }
    }
    Gat.prototype._anonymizeIP = noopFunc
    Gat.prototype._createTracker = noopFunc
    Gat.prototype._forceSSL = noopFunc
    Gat.prototype._getPlugin = noopFunc
    Gat.prototype._getTracker = function () {
      return tracker
    }
    Gat.prototype._getTrackerByName = function () {
      return tracker
    }
    Gat.prototype._getTrackers = noopFunc
    Gat.prototype.aa = noopFunc
    Gat.prototype.ab = noopFunc
    Gat.prototype.hb = noopFunc
    Gat.prototype.la = noopFunc
    Gat.prototype.oa = noopFunc
    Gat.prototype.pa = noopFunc
    Gat.prototype.u = noopFunc
    const gat = new Gat()
    window._gat = gat
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
  function logMessage (e, o) {
    const n = arguments.length > 2 && void 0 !== arguments[2] && arguments[2]; const g = !(arguments.length > 3 && void 0 !== arguments[3]) || arguments[3]; const { name: l, verbose: v } = e
    if (n || v) {
      const a = console.log
      g ? a(`${l}: ${o}`) : a(`${l}:`, o)
    }
  }
  const updatedArgs = args ? [].concat(source).concat(args) : [source]
  try {
    GoogleAnalyticsGa.apply(this, updatedArgs)
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
  name: 'google-analytics-ga',
  args: []
}, [])
