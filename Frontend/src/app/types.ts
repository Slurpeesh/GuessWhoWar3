import { IPlayer, IRoomConfig, IStage } from '@/global'

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
