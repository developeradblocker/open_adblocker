(function (source, args) {
  const flag = 'done'
  const uniqueIdentifier = source.uniqueId + source.name + '_' + (Array.isArray(args) ? args.join('_') : '')
  if (source.uniqueId) {
    if (Window.prototype.toString[uniqueIdentifier] === flag) {
      return
    }
  }
  function GoogleIma3 (source) {
    let _window$google$ima
    const VERSION = '3.453.0'
    const ima = {}
    const AdDisplayContainer = function AdDisplayContainer (containerElement) {
      const divElement = document.createElement('div')
      divElement.style.setProperty('display', 'none', 'important')
      divElement.style.setProperty('visibility', 'collapse', 'important')
      if (containerElement) {
        containerElement.appendChild(divElement)
      }
    }
    AdDisplayContainer.prototype.destroy = noopFunc
    AdDisplayContainer.prototype.initialize = noopFunc
    const ImaSdkSettings = function ImaSdkSettings () {}
    ImaSdkSettings.CompanionBackfillMode = {
      ALWAYS: 'always',
      ON_MASTER_AD: 'on_master_ad'
    }
    ImaSdkSettings.VpaidMode = {
      DISABLED: 0,
      ENABLED: 1,
      INSECURE: 2
    }
    ImaSdkSettings.prototype = {
      c: true,
      f: {},
      i: false,
      l: '',
      p: '',
      r: 0,
      t: '',
      v: '',
      getCompanionBackfill: noopFunc,
      getDisableCustomPlaybackForIOS10Plus () {
        return this.i
      },
      getDisabledFlashAds: function getDisabledFlashAds () {
        return true
      },
      getFeatureFlags () {
        return this.f
      },
      getLocale () {
        return this.l
      },
      getNumRedirects () {
        return this.r
      },
      getPlayerType () {
        return this.t
      },
      getPlayerVersion () {
        return this.v
      },
      getPpid () {
        return this.p
      },
      getVpaidMode () {
        return this.C
      },
      isCookiesEnabled () {
        return this.c
      },
      isVpaidAdapter () {
        return this.M
      },
      setCompanionBackfill: noopFunc,
      setAutoPlayAdBreaks (a) {
        this.K = a
      },
      setCookiesEnabled (c) {
        this.c = !!c
      },
      setDisableCustomPlaybackForIOS10Plus (i) {
        this.i = !!i
      },
      setDisableFlashAds: noopFunc,
      setFeatureFlags (f) {
        this.f = !!f
      },
      setIsVpaidAdapter (a) {
        this.M = a
      },
      setLocale (l) {
        this.l = !!l
      },
      setNumRedirects (r) {
        this.r = !!r
      },
      setPageCorrelator (a) {
        this.R = a
      },
      setPlayerType (t) {
        this.t = !!t
      },
      setPlayerVersion (v) {
        this.v = !!v
      },
      setPpid (p) {
        this.p = !!p
      },
      setVpaidMode (a) {
        this.C = a
      },
      setSessionId: noopFunc,
      setStreamCorrelator: noopFunc,
      setVpaidAllowed: noopFunc,
      CompanionBackfillMode: {
        ALWAYS: 'always',
        ON_MASTER_AD: 'on_master_ad'
      },
      VpaidMode: {
        DISABLED: 0,
        ENABLED: 1,
        INSECURE: 2
      }
    }
    const EventHandler = function EventHandler () {
      this.listeners = new Map()
      this._dispatch = function (e) {
        let listeners = this.listeners.get(e.type)
        listeners = listeners ? listeners.values() : []
        for (let _i = 0, _Array$from = Array.from(listeners); _i < _Array$from.length; _i++) {
          const listener = _Array$from[_i]
          try {
            listener(e)
          } catch (r) {
            logMessage(source, r)
          }
        }
      }
      this.addEventListener = function (types, callback, options, context) {
        if (!Array.isArray(types)) {
          types = [types]
        }
        for (let i = 0; i < types.length; i += 1) {
          const type = types[i]
          if (!this.listeners.has(type)) {
            this.listeners.set(type, new Map())
          }
          this.listeners.get(type).set(callback, callback.bind(context || this))
        }
      }
      this.removeEventListener = function (types, callback) {
        if (!Array.isArray(types)) {
          types = [types]
        }
        for (let i = 0; i < types.length; i += 1) {
          var _this$listeners$get
          const type = types[i];
          (_this$listeners$get = this.listeners.get(type)) === null || _this$listeners$get === void 0 || _this$listeners$get.delete(callback)
        }
      }
    }
    const AdsManager = new EventHandler()
    AdsManager.volume = 1
    AdsManager.collapse = noopFunc
    AdsManager.configureAdsManager = noopFunc
    AdsManager.destroy = noopFunc
    AdsManager.discardAdBreak = noopFunc
    AdsManager.expand = noopFunc
    AdsManager.focus = noopFunc
    AdsManager.getAdSkippableState = function () {
      return false
    }
    AdsManager.getCuePoints = function () {
      return [0]
    }
    AdsManager.getCurrentAd = function () {
      return currentAd
    }
    AdsManager.getCurrentAdCuePoints = function () {
      return []
    }
    AdsManager.getRemainingTime = function () {
      return 0
    }
    AdsManager.getVolume = function () {
      return this.volume
    }
    AdsManager.init = noopFunc
    AdsManager.isCustomClickTrackingUsed = function () {
      return false
    }
    AdsManager.isCustomPlaybackUsed = function () {
      return false
    }
    AdsManager.pause = noopFunc
    AdsManager.requestNextAdBreak = noopFunc
    AdsManager.resize = noopFunc
    AdsManager.resume = noopFunc
    AdsManager.setVolume = function (v) {
      this.volume = v
    }
    AdsManager.skip = noopFunc
    AdsManager.start = function () {
      for (let _i2 = 0, _arr = [AdEvent.Type.ALL_ADS_COMPLETED, AdEvent.Type.CONTENT_RESUME_REQUESTED]; _i2 < _arr.length; _i2++) {
        const type = _arr[_i2]
        try {
          this._dispatch(new ima.AdEvent(type))
        } catch (e) {
          logMessage(source, e)
        }
      }
    }
    AdsManager.stop = noopFunc
    AdsManager.updateAdsRenderingSettings = noopFunc
    const manager = Object.create(AdsManager)
    const AdsManagerLoadedEvent = function AdsManagerLoadedEvent (type, adsRequest, userRequestContext) {
      this.type = type
      this.adsRequest = adsRequest
      this.userRequestContext = userRequestContext
    }
    AdsManagerLoadedEvent.prototype = {
      getAdsManager: function getAdsManager () {
        return manager
      },
      getUserRequestContext () {
        if (this.userRequestContext) {
          return this.userRequestContext
        }
        return {}
      }
    }
    AdsManagerLoadedEvent.Type = {
      ADS_MANAGER_LOADED: 'adsManagerLoaded'
    }
    const AdsLoader = EventHandler
    AdsLoader.prototype.settings = new ImaSdkSettings()
    AdsLoader.prototype.contentComplete = noopFunc
    AdsLoader.prototype.destroy = noopFunc
    AdsLoader.prototype.getSettings = function () {
      return this.settings
    }
    AdsLoader.prototype.getVersion = function () {
      return VERSION
    }
    AdsLoader.prototype.requestAds = function (adsRequest, userRequestContext) {
      const _this = this
      requestAnimationFrame(() => {
        const { ADS_MANAGER_LOADED } = AdsManagerLoadedEvent.Type
        const event = new ima.AdsManagerLoadedEvent(ADS_MANAGER_LOADED, adsRequest, userRequestContext)
        _this._dispatch(event)
      })
      const e = new ima.AdError('adPlayError', 1205, 1205, 'The browser prevented playback initiated without user interaction.', adsRequest, userRequestContext)
      requestAnimationFrame(() => {
        _this._dispatch(new ima.AdErrorEvent(e))
      })
    }
    const AdsRenderingSettings = noopFunc
    const AdsRequest = function AdsRequest () {}
    AdsRequest.prototype = {
      setAdWillAutoPlay: noopFunc,
      setAdWillPlayMuted: noopFunc,
      setContinuousPlayback: noopFunc
    }
    const AdPodInfo = function AdPodInfo () {}
    AdPodInfo.prototype = {
      getAdPosition: function getAdPosition () {
        return 1
      },
      getIsBumper: function getIsBumper () {
        return false
      },
      getMaxDuration: function getMaxDuration () {
        return -1
      },
      getPodIndex: function getPodIndex () {
        return 1
      },
      getTimeOffset: function getTimeOffset () {
        return 0
      },
      getTotalAds: function getTotalAds () {
        return 1
      }
    }
    const UniversalAdIdInfo = function UniversalAdIdInfo () {}
    UniversalAdIdInfo.prototype.getAdIdRegistry = function () {
      return ''
    }
    UniversalAdIdInfo.prototype.getAdIsValue = function () {
      return ''
    }
    const Ad = function Ad () {}
    Ad.prototype = {
      pi: new AdPodInfo(),
      getAdId: function getAdId () {
        return ''
      },
      getAdPodInfo () {
        return this.pi
      },
      getAdSystem: function getAdSystem () {
        return ''
      },
      getAdvertiserName: function getAdvertiserName () {
        return ''
      },
      getApiFramework: function getApiFramework () {
        return null
      },
      getCompanionAds: function getCompanionAds () {
        return []
      },
      getContentType: function getContentType () {
        return ''
      },
      getCreativeAdId: function getCreativeAdId () {
        return ''
      },
      getDealId: function getDealId () {
        return ''
      },
      getDescription: function getDescription () {
        return ''
      },
      getDuration: function getDuration () {
        return 8.5
      },
      getHeight: function getHeight () {
        return 0
      },
      getMediaUrl: function getMediaUrl () {
        return null
      },
      getMinSuggestedDuration: function getMinSuggestedDuration () {
        return -2
      },
      getSkipTimeOffset: function getSkipTimeOffset () {
        return -1
      },
      getSurveyUrl: function getSurveyUrl () {
        return null
      },
      getTitle: function getTitle () {
        return ''
      },
      getTraffickingParametersString: function getTraffickingParametersString () {
        return ''
      },
      getUiElements: function getUiElements () {
        return ['']
      },
      getUniversalAdIdRegistry: function getUniversalAdIdRegistry () {
        return 'unknown'
      },
      getUniversalAdIds: function getUniversalAdIds () {
        return [new UniversalAdIdInfo()]
      },
      getUniversalAdIdValue: function getUniversalAdIdValue () {
        return 'unknown'
      },
      getVastMediaBitrate: function getVastMediaBitrate () {
        return 0
      },
      getVastMediaHeight: function getVastMediaHeight () {
        return 0
      },
      getVastMediaWidth: function getVastMediaWidth () {
        return 0
      },
      getWidth: function getWidth () {
        return 0
      },
      getWrapperAdIds: function getWrapperAdIds () {
        return ['']
      },
      getWrapperAdSystems: function getWrapperAdSystems () {
        return ['']
      },
      getWrapperCreativeIds: function getWrapperCreativeIds () {
        return ['']
      },
      isLinear: function isLinear () {
        return true
      },
      isSkippable () {
        return true
      }
    }
    const CompanionAd = function CompanionAd () {}
    CompanionAd.prototype = {
      getAdSlotId: function getAdSlotId () {
        return ''
      },
      getContent: function getContent () {
        return ''
      },
      getContentType: function getContentType () {
        return ''
      },
      getHeight: function getHeight () {
        return 1
      },
      getWidth: function getWidth () {
        return 1
      }
    }
    const AdError = function AdError (type, code, vast, message, adsRequest, userRequestContext) {
      this.errorCode = code
      this.message = message
      this.type = type
      this.adsRequest = adsRequest
      this.userRequestContext = userRequestContext
      this.getErrorCode = function () {
        return this.errorCode
      }
      this.getInnerError = function () {
        return null
      }
      this.getMessage = function () {
        return this.message
      }
      this.getType = function () {
        return this.type
      }
      this.getVastErrorCode = function () {
        return this.vastErrorCode
      }
      this.toString = function () {
        return `AdError ${this.errorCode}: ${this.message}`
      }
    }
    AdError.ErrorCode = {}
    AdError.Type = {}
    const isEngadget = function isEngadget () {
      try {
        for (let _i3 = 0, _Object$values = Object.values(window.vidible._getContexts()); _i3 < _Object$values.length; _i3++) {
          var _ctx$getPlayer
          const ctx = _Object$values[_i3]
          if ((_ctx$getPlayer = ctx.getPlayer()) !== null && _ctx$getPlayer !== void 0 && (_ctx$getPlayer = _ctx$getPlayer.div) !== null && _ctx$getPlayer !== void 0 && _ctx$getPlayer.innerHTML.includes('www.engadget.com')) {
            return true
          }
        }
      } catch (e) {}
      return false
    }
    var currentAd = isEngadget() ? undefined : new Ad()
    var AdEvent = function AdEvent (type) {
      this.type = type
    }
    AdEvent.prototype = {
      getAd: function getAd () {
        return currentAd
      },
      getAdData: function getAdData () {}
    }
    AdEvent.Type = {
      AD_BREAK_READY: 'adBreakReady',
      AD_BUFFERING: 'adBuffering',
      AD_CAN_PLAY: 'adCanPlay',
      AD_METADATA: 'adMetadata',
      AD_PROGRESS: 'adProgress',
      ALL_ADS_COMPLETED: 'allAdsCompleted',
      CLICK: 'click',
      COMPLETE: 'complete',
      CONTENT_PAUSE_REQUESTED: 'contentPauseRequested',
      CONTENT_RESUME_REQUESTED: 'contentResumeRequested',
      DURATION_CHANGE: 'durationChange',
      EXPANDED_CHANGED: 'expandedChanged',
      FIRST_QUARTILE: 'firstQuartile',
      IMPRESSION: 'impression',
      INTERACTION: 'interaction',
      LINEAR_CHANGE: 'linearChange',
      LINEAR_CHANGED: 'linearChanged',
      LOADED: 'loaded',
      LOG: 'log',
      MIDPOINT: 'midpoint',
      PAUSED: 'pause',
      RESUMED: 'resume',
      SKIPPABLE_STATE_CHANGED: 'skippableStateChanged',
      SKIPPED: 'skip',
      STARTED: 'start',
      THIRD_QUARTILE: 'thirdQuartile',
      USER_CLOSE: 'userClose',
      VIDEO_CLICKED: 'videoClicked',
      VIDEO_ICON_CLICKED: 'videoIconClicked',
      VIEWABLE_IMPRESSION: 'viewable_impression',
      VOLUME_CHANGED: 'volumeChange',
      VOLUME_MUTED: 'mute'
    }
    const AdErrorEvent = function AdErrorEvent (error) {
      this.error = error
      this.type = 'adError'
      this.getError = function () {
        return this.error
      }
      this.getUserRequestContext = function () {
        let _this$error
        if ((_this$error = this.error) !== null && _this$error !== void 0 && _this$error.userRequestContext) {
          return this.error.userRequestContext
        }
        return {}
      }
    }
    AdErrorEvent.Type = {
      AD_ERROR: 'adError'
    }
    const CustomContentLoadedEvent = function CustomContentLoadedEvent () {}
    CustomContentLoadedEvent.Type = {
      CUSTOM_CONTENT_LOADED: 'deprecated-event'
    }
    const CompanionAdSelectionSettings = function CompanionAdSelectionSettings () {}
    CompanionAdSelectionSettings.CreativeType = {
      ALL: 'All',
      FLASH: 'Flash',
      IMAGE: 'Image'
    }
    CompanionAdSelectionSettings.ResourceType = {
      ALL: 'All',
      HTML: 'Html',
      IFRAME: 'IFrame',
      STATIC: 'Static'
    }
    CompanionAdSelectionSettings.SizeCriteria = {
      IGNORE: 'IgnoreSize',
      SELECT_EXACT_MATCH: 'SelectExactMatch',
      SELECT_NEAR_MATCH: 'SelectNearMatch'
    }
    const AdCuePoints = function AdCuePoints () {}
    AdCuePoints.prototype = {
      getCuePoints: function getCuePoints () {
        return []
      },
      getAdIdRegistry: function getAdIdRegistry () {
        return ''
      },
      getAdIdValue: function getAdIdValue () {
        return ''
      }
    }
    const AdProgressData = noopFunc
    Object.assign(ima, {
      AdCuePoints,
      AdDisplayContainer,
      AdError,
      AdErrorEvent,
      AdEvent,
      AdPodInfo,
      AdProgressData,
      AdsLoader,
      AdsManager: manager,
      AdsManagerLoadedEvent,
      AdsRenderingSettings,
      AdsRequest,
      CompanionAd,
      CompanionAdSelectionSettings,
      CustomContentLoadedEvent,
      gptProxyInstance: {},
      ImaSdkSettings,
      OmidAccessMode: {
        DOMAIN: 'domain',
        FULL: 'full',
        LIMITED: 'limited'
      },
      OmidVerificationVendor: {
        1: 'OTHER',
        2: 'MOAT',
        3: 'DOUBLEVERIFY',
        4: 'INTEGRAL_AD_SCIENCE',
        5: 'PIXELATE',
        6: 'NIELSEN',
        7: 'COMSCORE',
        8: 'MEETRICS',
        9: 'GOOGLE',
        OTHER: 1,
        MOAT: 2,
        DOUBLEVERIFY: 3,
        INTEGRAL_AD_SCIENCE: 4,
        PIXELATE: 5,
        NIELSEN: 6,
        COMSCORE: 7,
        MEETRICS: 8,
        GOOGLE: 9
      },
      settings: new ImaSdkSettings(),
      UiElements: {
        AD_ATTRIBUTION: 'adAttribution',
        COUNTDOWN: 'countdown'
      },
      UniversalAdIdInfo,
      VERSION,
      ViewMode: {
        FULLSCREEN: 'fullscreen',
        NORMAL: 'normal'
      }
    })
    if (!window.google) {
      window.google = {}
    }
    if ((_window$google$ima = window.google.ima) !== null && _window$google$ima !== void 0 && _window$google$ima.dai) {
      ima.dai = window.google.ima.dai
    }
    window.google.ima = ima
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
    GoogleIma3.apply(this, updatedArgs)
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
  name: 'google-ima3',
  args: []
}, [])
