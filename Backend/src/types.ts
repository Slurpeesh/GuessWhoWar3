interface IGuesses {
  socketId: string
  isCorrect: boolean | null
}

interface IRound {
  value: number
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
  points: number
}

export type IStage = 'init' | 'lobby' | 'game'

export interface ServerToClientEvents {
  message: (value: string, senderId: string, senderName: string) => void
  playerData: (players: Array<IPlayer>) => void
  stageConfirm: (stage: IStage) => void
  roomExists: () => void
  noSuchRoom: () => void
  gameAlreadyStarted: () => void
  roomIsFull: () => void
  roomConfig: (roomConfig: IRoomConfig) => void
  gameStarted: (clients: Array<IPlayer>) => void
  soundForRound: (sound: Buffer) => void
  roundEnd: (
    rightAnswer: string,
    isGameEnded: boolean,
    resultsForClients: Array<IGuesses>,
    clients: Array<IPlayer>
  ) => void
  transferToLobby: () => void
  playerLeft: (name: string, reason: 'left' | 'disconnected') => void
  playerJoined: (name: string) => void
}

export interface ClientToServerEvents {
  createMessage: (value: string, name: string) => void
  hostGame: (name: string, roomConfig: IRoomConfig) => void
  joinGame: (name: string, roomId: string) => void
  leaveLobby: (userId: string, role: 'host' | 'player') => void
  startGame: () => void
  getSoundForRound: () => void
  roundAnswer: (answer: string) => void
  toLobby: () => void
}

export interface InterServerEvents {}

export interface SocketData {
  room: string
}
