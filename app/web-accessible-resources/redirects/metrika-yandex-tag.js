(function (source, args) {
  const flag = 'done'
  const uniqueIdentifier = source.uniqueId + source.name + '_' + (Array.isArray(args) ? args.join('_') : '')
  if (source.uniqueId) {
    if (Window.prototype.toString[uniqueIdentifier] === flag) {
      return
    }
  }
  function metrikaYandexTag (source) {
    const asyncCallbackFromOptions = function asyncCallbackFromOptions (id, param) {
      const options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {}
      let { callback } = options
      const { ctx } = options
      if (typeof callback === 'function') {
        callback = ctx !== undefined ? callback.bind(ctx) : callback
        setTimeout(() => {
          return callback()
        })
      }
    }
    const addFileExtension = noopFunc
    const extLink = asyncCallbackFromOptions
    const file = asyncCallbackFromOptions
    const getClientID = function getClientID (id, cb) {
      if (!cb) {
        return
      }
      setTimeout(cb(null))
    }
    const hitFunc = asyncCallbackFromOptions
    const notBounce = asyncCallbackFromOptions
    const params = noopFunc
    const reachGoal = function reachGoal (id, target, params, callback, ctx) {
      asyncCallbackFromOptions(null, null, {
        callback,
        ctx
      })
    }
    const setUserID = noopFunc
    const userParams = noopFunc
    const destruct = noopFunc
    const api = {
      addFileExtension,
      extLink,
      file,
      getClientID,
      hit: hitFunc,
      notBounce,
      params,
      reachGoal,
      setUserID,
      userParams,
      destruct
    }
    function init (id) {
      window[`yaCounter${id}`] = api
      document.dispatchEvent(new Event(`yacounter${id}inited`))
    }
    function ym (id, funcName) {
      if (funcName === 'init') {
        return init(id)
      }
      for (var _len = arguments.length, args = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
        args[_key - 2] = arguments[_key]
      }
      return api[funcName] && api[funcName](id, ...args)
    }
    if (typeof window.ym === 'undefined') {
      window.ym = ym
      ym.a = []
    } else if (window.ym && window.ym.a) {
      ym.a = window.ym.a
      window.ym = ym
      window.ym.a.forEach((params) => {
        const id = params[0]
        init(id)
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
  const updatedArgs = args ? [].concat(source).concat(args) : [source]
  try {
    metrikaYandexTag.apply(this, updatedArgs)
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
  name: 'metrika-yandex-tag',
  args: []
}, [])
