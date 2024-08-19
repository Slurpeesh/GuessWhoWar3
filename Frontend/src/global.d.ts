declare module '*.mp3'
declare module '*.jpg'
declare module '*.jpeg'
declare module '*.png'

export interface IRoomConfig {
  id: string
  rounds: number
  maxPlayers: number
}

export interface IPlayer {
  id: string
  name: string
  role: 'host' | 'player'
}

export interface IRound {
  currentRound: number
  chosenUnit: string
  timeLeft: number
  started: boolean
  soundUrl: string
}

export type IStage = 'init' | 'lobby' | 'game'
