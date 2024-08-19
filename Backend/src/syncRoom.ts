import { IPlayer } from './types'

export function setClientsUnsynced(clients: Array<IPlayer>) {
  for (const client of clients) {
    client.isSynced = false
  }
}

export function setClientSynced(client: IPlayer) {
  client.isSynced = true
}

export function areClientsSynced(clients: Array<IPlayer>) {
  for (const client of clients) {
    if (!client.isSynced) {
      return false
    }
  }
  return true
}
