import { IRoomConfig } from '@/global'

export interface ServerToClientEvents {
  message: (msg: string) => void
}

export interface ClientToServerEvents {
  createMessage: (msg: string) => void
  hostGame: (name: string, roomConfig: IRoomConfig) => void
  joinGame: (name: string, roomId: string) => void
}
