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
export interface Filter {
  filterId: number
  name: string
  description: string
}

const FILTER_MAP: Record<number, Filter> = {
  2: {
    filterId: 2,
    name: 'Default filter',
    description: 'This filter is required for effective ad blocking.'
  },
  3: {
    filterId: 3,
    name: 'Tracking Protection filter',
    description: 'The most comprehensive list of various online counters and web analytics tools. Use this filter if you do not want your actions on the Internet to be tracked.'
  },
  4: {
    filterId: 4,
    name: 'Social Media filter',
    description: "Filter for social media widgets such as 'Like' and 'Share' buttons and more."
  },
  5: {
    filterId: 5,
    name: 'Experimental filter',
    description: 'Filter designed to test certain hazardous filtering rules before they are added to the basic filters.'
  },
  6: {
    filterId: 6,
    name: 'German filter',
    description: 'Filter list that specifically removes ads on websites in German language.'
  },
  7: {
    filterId: 7,
    name: 'Japanese filter',
    description: 'Filter that enables ad blocking on websites in Japanese language.'
  },
  8: {
    filterId: 8,
    name: 'Dutch filter',
    description: 'Filter list that specifically removes ads on websites in Dutch language.'
  },
  9: {
    filterId: 9,
    name: 'Spanish/Portuguese filter',
    description: 'Filter list that specifically removes ads on websites in Spanish, Portuguese, and Brazilian Portuguese languages.'
  },
  10: {
    filterId: 10,
    name: 'Filter unblocking search ads and self-promotion',
    description: 'Filter that unblocks search ads in Google, DuckDuckGo, Bing, or Yahoo and self-promotion on websites.'
  },
  11: {
    filterId: 11,
    name: 'Mobile Ads filter',
    description: 'Filter for all known mobile ad networks. Useful for mobile devices.'
  },
  13: {
    filterId: 13,
    name: 'Turkish filter',
    description: 'Filter list that specifically removes ads on websites in Turkish language.'
  },
  16: {
    filterId: 16,
    name: 'French filter',
    description: 'Filter list that specifically removes ads on websites in French language.'
  },
  17: {
    filterId: 17,
    name: 'URL Tracking filter',
    description: 'Filter that enhances privacy by removing tracking parameters from URLs.'
  },
  18: {
    filterId: 18,
    name: 'Hide cookie alerts',
    description: 'Hide cookie consent dialogs on websites'
  },
  19: {
    filterId: 19,
    name: 'Popups filter',
    description: "Blocks all kinds of pop-ups that are not necessary for websites' operation according to our Filter policy."
  },
  20: {
    filterId: 20,
    name: 'Mobile App Banners filter',
    description: 'Blocks irritating banners that promote mobile apps of websites.'
  },
  21: {
    filterId: 21,
    name: 'Other pop-ups filter',
    description: 'Blocks irritating elements on web pages that do not fall under the popular categories of annoyances.'
  },
  22: {
    filterId: 22,
    name: 'Widgets filter',
    description: 'Blocks annoying third-party widgets: online assistants, live support chats, etc.'
  },
  23: {
    filterId: 23,
    name: 'Ukrainian filter',
    description: 'Filter that enables ad blocking on websites in Ukrainian language.'
  },
  103: {
    filterId: 103,
    name: 'Bulgarian filter',
    description: 'Additional filter list for websites in Bulgarian.'
  },
  105: {
    filterId: 105,
    name: 'Czech and Slovak filter',
    description: 'Filter list for websites in Czech and Slovak.'
  },
  108: {
    filterId: 108,
    name: 'Hebrew filter',
    description: 'Filter list for websites in Hebrew.'
  },
  109: {
    filterId: 109,
    name: 'Italian filter',
    description: 'Filter list for websites in Italian.'
  },
  110: {
    filterId: 110,
    name: 'Lithuanian filter',
    description: 'Filter list for websites in Lithuanian.'
  },
  111: {
    filterId: 111,
    name: 'Latvian filter',
    description: 'Filter list for websites in Latvian.'
  },
  112: {
    filterId: 112,
    name: 'Arabic filter',
    description: 'Filter list for websites in Arabic.'
  },
  120: {
    filterId: 120,
    name: 'Indonesian filter',
    description: 'Filter list for websites in Indonesian.'
  },
  202: {
    filterId: 202,
    name: 'Thai filter',
    description: 'Filter that blocks ads on Thai sites.'
  },
  203: {
    filterId: 203,
    name: 'Hungarian filter',
    description: 'Filter list that specifically removes ads on websites in the Hungarian language.'
  },
  208: {
    filterId: 208,
    name: 'Malicious URL Blocklist',
    description: 'Blocks domains that are known to be used to propagate malware and spyware.'
  },
  214: {
    filterId: 214,
    name: 'Vietnamese filter',
    description: 'Vietnamese adblock filter list.'
  },
  216: {
    filterId: 216,
    name: 'Polish filter',
    description: 'Additional filter list for websites in Polish.'
  },
  217: {
    filterId: 217,
    name: 'Polish GDPR-Cookies Filters',
    description: 'Polish filter list for cookies blocking.'
  },
  218: {
    filterId: 218,
    name: 'Estonian filter',
    description: 'Filter for ad blocking on Estonian sites.'
  },
  224: {
    filterId: 224,
    name: 'Chinese filter',
    description: 'Filter list that specifically removes ads on websites in Chinese language.'
  },
  227: {
    filterId: 227,
    name: 'Korean filter',
    description: 'Filter list that specifically removes ads on websites in Korean language.'
  },
  233: {
    filterId: 233,
    name: 'Finnish filter',
    description: 'Finnish ad blocking filter list.'
  },
  235: {
    filterId: 235,
    name: 'Persian filter',
    description: 'Filter list for blocking ads and trackers on websites in Persian.'
  },
  238: {
    filterId: 238,
    name: 'Polish Anti Adblock Filters',
    description: 'Official Polish filters against Adblock alerts.'
  },
  243: {
    filterId: 243,
    name: 'Swedish filter',
    description: 'Filter that aims to remove regional Swedish ads, tracking, social media, annoyances, sponsored articles etc.'
  },
  249: {
    filterId: 249,
    name: 'Nordic filters',
    description: 'This list covers websites for Norway, Denmark, Iceland, Danish territories, and the Sami indigenous population.'
  },
  252: {
    filterId: 252,
    name: 'Serbo-Croatian List',
    description: 'A filter list for websites in Serbian, Montenegrin, Croatian, and Bosnian.'
  },
  253: {
    filterId: 253,
    name: 'Indian filter',
    description: 'Additional filter list for websites in Hindi, Tamil and other Dravidian and Indic languages.'
  },
  254: {
    filterId: 254,
    name: 'Macedonian filters',
    description: 'Blocks ads and trackers on various Macedonian websites.'
  },
  255: {
    filterId: 255,
    name: 'Phishing URL Blocklist',
    description: 'Phishing URL blocklist for uBlock Origin (uBO), AdGuard, Vivaldi, Pi-hole, Hosts file, Dnsmasq, BIND, Unbound, Snort and Suricata.'
  },
  256: {
    filterId: 256,
    name: 'Scam Blocklist',
    description: 'List for blocking untrustworthy websites.'
  },
  257: {
    filterId: 257,
    name: 'Badware risks',
    description: 'Filter for risky sites, warning users of potential threats.'
  },
  259: {
    filterId: 259,
    name: 'Anti-Malware List',
    description: 'Blocks more malware than most other major anti-malware lists - domains and URL patterns used in malware redirection chains, IP addresses that are solely used by malware, PUP nags, and a few scammers.'
  }
}
export const filtersMapper = (filters: Filter[]): Filter[] => {
  return filters.map(({ filterId, ...filter }) => {
    const mapped = FILTER_MAP[filterId]
    if (!mapped) {
      return null
    }
    return ({
      ...filter,
      filterId,
      name: mapped.name,
      description: mapped.description
    })
  }).filter(Boolean)
}
