export interface IRoomConfig {
  id: string
  rounds: number
  maxPlayers: number
}

export interface ServerToClientEvents {
  message: (msg: string) => void
}

export interface ClientToServerEvents {
  createMessage: (msg: string) => void
  hostGame: (name: string, roomConfig: IRoomConfig) => void
  joinGame: (name: string, roomId: string) => void
}

export interface InterServerEvents {}

export interface SocketData {
  room: string
}
