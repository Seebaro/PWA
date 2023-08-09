const userAgent = {
  get android(): boolean {
    return navigator.userAgent.match(/Android/i) !== null
  },
  get blackBerry(): boolean {
    return navigator.userAgent.match(/BlackBerry/i) !== null
  },
  get iOS(): boolean {
    return navigator.userAgent.match(/iPhone|iPad|iPod/i) !== null
  },
  get opera(): boolean {
    return navigator.userAgent.match(/Opera Mini/i) !== null
  },
  get samsung(): boolean {
    return (
      navigator.userAgent.match(
        /SAMSUNG|Samsung|SGH-[I|N|T]|GT-[I|N]|SM-[A|N|P|T|Z]|SHV-E|SCH-[I|J|R|S]|SPH-L/i
      ) !== null
    )
  },
  get windows(): boolean {
    return (
      navigator.userAgent.match(/IEMobile/i) !== null ||
      navigator.userAgent.match(/WPDesktop/i) !== null
    )
  },
  get any(): boolean {
    return (
      userAgent.android ||
      userAgent.blackBerry ||
      userAgent.iOS ||
      userAgent.opera ||
      userAgent.windows
    )
  },
  get standalone(): boolean {
    if (this.iOS) {
      return (window.navigator as any).standalone
    }
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches
    if (document.referrer.startsWith('android-app://')) {
      return true // Trusted web app
    } else if ('standalone' in navigator || isStandalone) {
      return true
    }
    return false
  }
}

export default userAgent
