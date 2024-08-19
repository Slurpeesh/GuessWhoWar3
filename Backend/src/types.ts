interface IRound {
  sound: string
  answer: string
}
export interface IRoomsMapValue {
  clients: Array<IPlayer>
  rounds: number
  maxPlayers: number
  currentRound: IRound
}

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

export type IStage = 'init' | 'lobby' | 'game'

export interface ServerToClientEvents {
  message: (msg: string) => void
  playerData: (players: Array<IPlayer>) => void
  stageConfirm: (stage: IStage) => void
  roomExists: () => void
  noSuchRoom: () => void
  roomIsFull: () => void
  roomConfig: (roomConfig: IRoomConfig) => void
  gameStarted: () => void
  soundForRound: (sound: Buffer) => void
}

export interface ClientToServerEvents {
  createMessage: (msg: string) => void
  hostGame: (name: string, roomConfig: IRoomConfig) => void
  joinGame: (name: string, roomId: string) => void
  leaveLobby: (userId: string, role: 'host' | 'player') => void
  startGame: () => void
  getSoundForRound: () => void
  roundAnswer: (answer: string) => void
}

export interface InterServerEvents {}

export interface SocketData {
  room: string
}
