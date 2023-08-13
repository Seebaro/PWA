export enum MAppType {
  Game = 'game',
  Application = 'app',
}

export interface MScreenshot {
  image: string
  width: number
  height: number
}

export interface MApp {
  id: number
  type: MAppType
  title: string
  subtitle: string
  description: string
  screenshots: MScreenshot[]
  icon: string
  version: string
  ipa_size: string
  created_at: string
  updated_at: string
}

export interface MAppManifest {
  manifest: string
}

export interface MToken {
  access: string
  refresh: string
}