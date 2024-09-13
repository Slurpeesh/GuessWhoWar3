import { IGuesses, IPlayer, IRoomConfig, IStage } from '@/global'

export interface ServerToClientEvents {
  message: (value: string, senderId: string, senderName: string) => void
  playerData: (players: Array<IPlayer>) => void
  stageConfirm: (stage: IStage) => void
  roomExists: () => void
  noSuchRoom: () => void
  gameAlreadyStarted: () => void
  roomIsFull: () => void
  roomConfig: (roomConfig: IRoomConfig) => void
  gameStarted: () => void
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
