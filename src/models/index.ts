export enum MAppType {
  Game = 'game',
  Application = 'app',
}

export interface MApp {
  pk: number
  type: MAppType
  title: string
  subtitle: string
  description: string
  screenshots: string[]
  icon: string
  manifest: string
}