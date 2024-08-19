interface IGuesses {
  socketId: string
  isCorrect: boolean | null
}

interface IRound {
  sound: string
  answer: string
  guesses: Array<IGuesses>
}
export interface IRoomsMapValue {
  clients: Array<IPlayer>
  rounds: number
  maxPlayers: number
  isGameStarted: boolean
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
  isSynced: boolean
}

export type IStage = 'init' | 'lobby' | 'game'

export interface ServerToClientEvents {
  message: (msg: string) => void
  playerData: (players: Array<IPlayer>) => void
  stageConfirm: (stage: IStage) => void
  roomExists: () => void
  noSuchRoom: () => void
  gameAlreadyStarted: () => void
  roomIsFull: () => void
  roomConfig: (roomConfig: IRoomConfig) => void
  gameStarted: () => void
  soundForRound: (sound: Buffer) => void
  showAnswer: (rightAnswer: string) => void
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
