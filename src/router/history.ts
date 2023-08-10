import {
  type RouterHistory,
} from 'vue-router'

import Cookies from 'js-cookie'

type HistoryLocation = string

const START = ''

enum NavigationType {
  pop = 'pop',
  push = 'push',
}

enum NavigationDirection {
  back = 'back',
  forward = 'forward',
  unknown = '',
}

interface NavigationInformation {
  type: NavigationType
  direction: NavigationDirection
  delta: number
}

interface NavigationCallback {
  (
    to: HistoryLocation,
    from: HistoryLocation,
    information: NavigationInformation
  ): void
}

const isBrowser = typeof window !== 'undefined'

function normalizeBase(base?: string): string {
  if (!base) {
    if (isBrowser) {
      // respect <base> tag
      const baseEl = document.querySelector('base')
      base = (baseEl && baseEl.getAttribute('href')) || '/'
      // strip full URL origin
      base = base.replace(/^\w+:\/\/[^\/]+/, '')
    } else {
      base = '/'
    }
  }

  // ensure leading slash when it was removed by the regex above avoid leading
  // slash with hash because the file could be read from the disk like file://
  // and the leading slash would cause problems
  if (base[0] !== '/' && base[0] !== '#') base = '/' + base

  // remove the trailing slash so all other method can just do `base + fullPath`
  // to build an href
  return removeTrailingSlash(base)
}

const TRAILING_SLASH_RE = /\/$/
const removeTrailingSlash = (path: string) => path.replace(TRAILING_SLASH_RE, '')

const BEFORE_HASH_RE = /^[^#]+#/
function createHref(base: string, location: HistoryLocation): string {
  return base.replace(BEFORE_HASH_RE, '#') + location
}


type HistoryStateValue =
  | string
  | number
  | boolean
  | null
  | undefined
  | HistoryState
  | HistoryStateArray

/**
 * Allowed HTML history.state
 */
interface HistoryState {
  [x: number]: HistoryStateValue
  [x: string]: HistoryStateValue
}

/**
 * Allowed arrays for history.state.
 *
 * @internal
 */
interface HistoryStateArray extends Array<HistoryStateValue> {}


function getStateFromCookie(): { queue: string[], position: number } {
  let queue = Cookies.get('routes-queue')?.split('|').map(x => x.trim()).filter(x => x.length > 0) ?? []
  if (queue.length == 0) queue = [START]
  try {
    const position: number = parseInt(Cookies.get('routes-position') ?? (queue.length - 1).toString()) ?? queue.length - 1
    return { queue, position }
  } catch {
    const position: number = queue.length - 1
    return { queue, position }
  }
}

function setStateToCookie(state: { queue?: string[], position?: number }) {
  if(state.queue) {
    Cookies.set('routes-queue', state.queue.join('|'))
  }
  if(state.position) {
    Cookies.set('routes-position', state.position.toString())
  }
}

function updateHref(href: string) {
  window.history.replaceState({}, '', href)
}

/**
 * Creates an in-memory based history. The main purpose of this history is to handle SSR. It starts in a special location that is nowhere.
 * It's up to the user to replace that location with the starter location by either calling `router.push` or `router.replace`.
 *
 * @param base - Base applied to all urls, defaults to '/'
 * @returns a history object that can be passed to the router constructor
 */
export function createEnhancedMemoryHistory(base: string = ''): RouterHistory {
  const initialState = getStateFromCookie()

  let listeners: NavigationCallback[] = []
  let queue: HistoryLocation[] = initialState.queue
  let position: number = initialState.position
  base = normalizeBase(base)

  function setLocation(location: HistoryLocation) {
    position++
    if (position === queue.length) {
      // we are at the end, we can simply append a new entry
      queue.push(location)
    } else {
      // we are in the middle, we remove everything from here in the queue
      queue.splice(position)
      queue.push(location)
    }
  }

  function triggerListeners(
    to: HistoryLocation,
    from: HistoryLocation,
    { direction, delta }: Pick<NavigationInformation, 'direction' | 'delta'>
  ): void {
    const info: NavigationInformation = {
      direction,
      delta,
      type: NavigationType.pop,
    }
    for (const callback of listeners) {
      callback(to, from, info)
    }
  }

  updateHref(queue[position])

  const routerHistory: RouterHistory = {
    // rewritten by Object.defineProperty
    location: START,
    // TODO: should be kept in queue
    state: {},
    base,
    createHref: createHref.bind(null, base),

    replace(to) {
      // remove current entry and decrement position
      queue.splice(position--, 1)
      setLocation(to)
      setStateToCookie({ queue, position })
      updateHref(queue[position])
    },

    push(to, data?: HistoryState) {
      setLocation(to)
      setStateToCookie({ queue, position })
      updateHref(queue[position])
    },

    listen(callback) {
      listeners.push(callback)
      return () => {
        const index = listeners.indexOf(callback)
        if (index > -1) listeners.splice(index, 1)
      }
    },

    destroy() {
      listeners = []
      queue = [START]
      position = 0
      setStateToCookie({ queue, position })
      updateHref(queue[position])
    },

    go(delta, shouldTrigger = true) {
      const from = this.location
      const direction: NavigationDirection =
        // we are considering delta === 0 going forward, but in abstract mode
        // using 0 for the delta doesn't make sense like it does in html5 where
        // it reloads the page
        delta < 0 ? NavigationDirection.back : NavigationDirection.forward
      position = Math.max(0, Math.min(position + delta, queue.length - 1))
      setStateToCookie({ position })
      updateHref(queue[position])
      if (shouldTrigger) {
        triggerListeners(this.location, from, {
          direction,
          delta,
        })
      }
    },
  }

  Object.defineProperty(routerHistory, 'location', {
    enumerable: true,
    get: () => queue[position],
  })

  return routerHistory
}

